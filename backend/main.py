"""
FastAPI Backend for IACP 3.0
Main entry point
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

import models
import database
import schemas

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
@app.get("/health", response_model=schemas.HealthResponse)
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

def generate_intake_id() -> str:
    return f"INT-{datetime.utcnow().strftime('%Y%m%d-%H%M%S-%f')}"


def current_fiscal_year(now: datetime | None = None) -> int:
    reference = now or datetime.utcnow()
    return reference.year + 1 if reference.month >= 10 else reference.year


def generate_docket_number(db: Session, case_type: str, now: datetime | None = None) -> str:
    reference = now or datetime.utcnow()
    fiscal_year = current_fiscal_year(reference)
    prefix = f"{fiscal_year}{case_type}"

    latest_case = (
        db.query(models.Case)
        .filter(models.Case.docket_number.like(f"{prefix}%"))
        .order_by(models.Case.docket_number.desc())
        .first()
    )

    next_sequence = 1
    if latest_case:
        suffix = latest_case.docket_number[len(prefix):]
        if suffix.isdigit():
            next_sequence = int(suffix) + 1

    return f"{prefix}{next_sequence:06d}"


def infer_case_type(filing_type: str, description: str) -> str:
    source = f"{filing_type} {description}".upper()
    if "LHC" in source or "LONGSHORE" in source:
        return "LHC"
    if "PER" in source or "BALCA" in source:
        return "PER"
    return "BLA"


def infer_case_title(description: str) -> str:
    claimant = "Unknown Claimant"
    employer = "Unknown Employer"

    for segment in description.split("."):
        normalized = segment.strip()
        if normalized.lower().startswith("claimant:"):
            claimant = normalized.split(":", 1)[1].strip() or claimant
        if normalized.lower().startswith("employer:"):
            employer = normalized.split(":", 1)[1].strip() or employer

    return f"{claimant} v. {employer}"


def calculate_statutory_deadline(case_type: str, docketed_at: datetime) -> datetime | None:
    if case_type == "BLA":
        return docketed_at + timedelta(days=270)
    return None


def next_docket_event_sequence(db: Session, case_id: str) -> int:
    latest_event = (
        db.query(models.DocketEvent)
        .filter(models.DocketEvent.case_id == case_id)
        .order_by(models.DocketEvent.sequence_number.desc())
        .first()
    )
    return 1 if latest_event is None else latest_event.sequence_number + 1


# Filings endpoints
@app.get("/api/v1/filings", response_model=list[schemas.FilingResponse])
async def get_filings(db: Session = Depends(database.get_db)):
    """Get all filings"""
    filings = db.query(models.Filing).all()
    return filings

@app.post(
    "/api/v1/filings",
    response_model=schemas.FilingResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_filing(filing: schemas.FilingCreate, db: Session = Depends(database.get_db)):
    """Create new filing"""
    db_filing = models.Filing(
        intake_id=filing.intake_id or generate_intake_id(),
        filing_type=filing.filing_type,
        status=filing.status or "pending",
        submitted_by=filing.submitted_by,
        description=filing.description,
        ai_score=filing.ai_score,
    )
    db.add(db_filing)
    db.commit()
    db.refresh(db_filing)
    return db_filing

@app.get("/api/v1/filings/{filing_id}", response_model=schemas.FilingResponse)
async def get_filing(filing_id: str, db: Session = Depends(database.get_db)):
    """Get filing by ID"""
    filing = db.query(models.Filing).filter(models.Filing.id == filing_id).first()
    if not filing:
        raise HTTPException(status_code=404, detail="Filing not found")
    return filing

# Intake queue endpoint
@app.get("/api/v1/intake/queue", response_model=list[schemas.FilingResponse])
async def get_intake_queue(db: Session = Depends(database.get_db)):
    """Get intake queue for docket clerk"""
    filings = db.query(models.Filing).filter(
        models.Filing.status == "pending"
    ).order_by(models.Filing.submitted_at.desc()).all()
    return filings

# Auto-docket endpoint
@app.post("/api/v1/intake/{filing_id}/docket", response_model=schemas.DocketResult)
async def auto_docket(filing_id: str, db: Session = Depends(database.get_db)):
    """Auto-docket a filing"""
    filing = db.query(models.Filing).filter(models.Filing.id == filing_id).first()
    if not filing:
        raise HTTPException(status_code=404, detail="Filing not found")

    docketed_at = datetime.utcnow()
    case_type = infer_case_type(filing.filing_type, filing.description)
    docket_number = generate_docket_number(db, case_type, docketed_at)
    statutory_deadline = calculate_statutory_deadline(case_type, docketed_at)

    if not filing.case_id:
        case_record = models.Case(
            docket_number=docket_number,
            case_type=case_type,
            title=infer_case_title(filing.description),
            current_phase="docketed",
            current_status="awaiting_assignment",
            docketed_date=docketed_at.date(),
            statutory_deadline=statutory_deadline.date() if statutory_deadline else None,
            sla_status="green",
        )
        db.add(case_record)
        db.flush()
        filing.case_id = case_record.id
    else:
        case_record = db.query(models.Case).filter(models.Case.id == filing.case_id).first()
        if case_record:
            case_record.current_phase = "docketed"
            case_record.current_status = "awaiting_assignment"
            case_record.docketed_date = docketed_at.date()
            case_record.statutory_deadline = statutory_deadline.date() if statutory_deadline else None

    # Update filing status
    filing.status = "accepted"

    # Create docket event
    docket_event = models.DocketEvent(
        case_id=filing.case_id,
        sequence_number=next_docket_event_sequence(db, filing.case_id),
        event_type="CASE_DOCKETED",
        event_data=f'{{"filing_id": "{filing_id}", "method": "auto"}}',
        actor_type="system"
    )

    db.add(docket_event)
    db.commit()

    return {
        "status": "docketed",
        "filing_id": filing_id,
        "docket_number": docket_number,
    }

# Cases endpoints
@app.get("/api/v1/cases", response_model=list[schemas.CaseResponse])
async def get_cases(db: Session = Depends(database.get_db)):
    """Get all cases"""
    cases = db.query(models.Case).all()
    return cases

@app.get("/api/v1/cases/{case_number}", response_model=schemas.CaseResponse)
async def get_case(case_number: str, db: Session = Depends(database.get_db)):
    """Get case by docket number"""
    case = db.query(models.Case).filter(models.Case.docket_number == case_number).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

# Judges endpoint
@app.get("/api/v1/judges/suggest", response_model=schemas.JudgeSuggestionsResponse)
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
