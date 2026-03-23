"""
FastAPI Backend for IACP 3.0
Main entry point
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="IACP 3.0 API",
    description="Intelligent Adjudicatory Case Portal API",
    version="3.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

# Filings endpoints
@app.get("/api/v1/filings")
async def get_filings(db: Session = Depends(database.get_db)):
    """Get all filings"""
    filings = db.query(models.Filing).all()
    return filings

@app.post("/api/v1/filings")
async def create_filing(filing: dict, db: Session = Depends(database.get_db)):
    """Create new filing"""
    db_filing = models.Filing(
        intake_id=filing.get("intake_id", f"INT-{datetime.utcnow().strftime('%Y-%m-%d')}"),
        filing_type=filing.get("filing_type"),
        status="pending",
        submitted_by=filing.get("submitted_by"),
        description=filing.get("description"),
        ai_score=filing.get("ai_score", 0.0)
    )
    db.add(db_filing)
    db.commit()
    db.refresh(db_filing)
    return db_filing

@app.get("/api/v1/filings/{filing_id}")
async def get_filing(filing_id: str, db: Session = Depends(database.get_db)):
    """Get filing by ID"""
    filing = db.query(models.Filing).filter(models.Filing.id == filing_id).first()
    if not filing:
        raise HTTPException(status_code=404, detail="Filing not found")
    return filing

# Intake queue endpoint
@app.get("/api/v1/intake/queue")
async def get_intake_queue(db: Session = Depends(database.get_db)):
    """Get intake queue for docket clerk"""
    filings = db.query(models.Filing).filter(
        models.Filing.status == "pending"
    ).order_by(models.Filing.submitted_at.desc()).all()
    return filings

# Auto-docket endpoint
@app.post("/api/v1/intake/{filing_id}/docket")
async def auto_docket(filing_id: str, db: Session = Depends(database.get_db)):
    """Auto-docket a filing"""
    filing = db.query(models.Filing).filter(models.Filing.id == filing_id).first()
    if not filing:
        raise HTTPException(status_code=404, detail="Filing not found")
    
    # Update filing status
    filing.status = "accepted"
    
    # Create docket event
    docket_event = models.DocketEvent(
        case_id=filing.case_id,
        event_type="CASE_DOCKETED",
        event_data=f'{{"filing_id": "{filing_id}", "method": "auto"}}',
        actor_type="system"
    )
    
    db.add(docket_event)
    db.commit()
    
    return {
        "status": "docketed",
        "filing_id": filing_id,
        "docket_number": filing.intake_id.replace("INT", "2026")
    }

# Cases endpoints
@app.get("/api/v1/cases")
async def get_cases(db: Session = Depends(database.get_db)):
    """Get all cases"""
    cases = db.query(models.Case).all()
    return cases

@app.get("/api/v1/cases/{case_number}")
async def get_case(case_number: str, db: Session = Depends(database.get_db)):
    """Get case by docket number"""
    case = db.query(models.Case).filter(models.Case.docket_number == case_number).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

# Judges endpoint
@app.get("/api/v1/judges/suggest")
async def suggest_judges(case_type: str = None, db: Session = Depends(database.get_db)):
    """Get judge suggestions for case assignment"""
    judges = db.query(models.User).filter(
        models.User.role == "alj",
        models.User.is_active == True
    ).all()
    
    # Simple suggestion (would use smart assignment algorithm in production)
    suggestions = []
    for judge in judges:
        suggestions.append({
            "judge_id": judge.id,
            "name": judge.person.first_name + " " + judge.person.last_name if judge.person else judge.id,
            "office": judge.office,
            "score": 85  # Would calculate based on workload, expertise, etc.
        })
    
    return {"suggestions": suggestions[:3]}  # Return top 3

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
