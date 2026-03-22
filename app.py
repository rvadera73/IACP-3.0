from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///filings.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Filing(Base):
    __tablename__ = "filings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)

# Endpoints
@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/v1/filings")
async def create_filing(filing: Filing):
    db = SessionLocal()
    db.add(filing)
    db.commit()
    db.refresh(filing)
    return filing

@app.get("/api/v1/filings")
async def read_filings():
    db = SessionLocal()
    filings = db.query(Filing).all()
    return filings
