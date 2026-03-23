"""
SQLAlchemy Models for IACP 3.0
Based on database/schema.sql
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Float, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4
from database import Base


def generate_uuid() -> str:
    return str(uuid4())

class Person(Base):
    """Person entity - individuals and organizations"""
    __tablename__ = "person"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    person_type = Column(String, nullable=False)  # 'individual' or 'organization'
    first_name = Column(String)
    last_name = Column(String)
    organization_name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    address_line_1 = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    bar_number = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class User(Base):
    """Internal staff users"""
    __tablename__ = "user"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    person_id = Column(String, ForeignKey("person.id"), unique=True)
    role = Column(String, nullable=False)
    office = Column(String)
    google_oauth_id = Column(String, unique=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    person = relationship("Person")

class Case(Base):
    """Case entity - central aggregate"""
    __tablename__ = "case"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    docket_number = Column(String, unique=True, nullable=False)
    case_type = Column(String, nullable=False)  # BLA, LHC, PER, etc.
    title = Column(String, nullable=False)
    current_phase = Column(String, default="intake")
    current_status = Column(String, default="pending_review")
    assigned_judge_id = Column(String, ForeignKey("user.id"))
    docketed_date = Column(Date)
    statutory_deadline = Column(Date)
    sla_status = Column(String, default="green")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    judge = relationship("User", foreign_keys=[assigned_judge_id])

class Filing(Base):
    """Filing entity - submitted filings"""
    __tablename__ = "filing"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    intake_id = Column(String, unique=True, nullable=False)
    case_id = Column(String, ForeignKey("case.id"))
    filing_type = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, accepted, deficient
    submitted_by = Column(String)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    ai_score = Column(Float)
    description = Column(Text)
    
    case = relationship("Case")

class DocketEvent(Base):
    """Event-sourced docket entries (immutable)"""
    __tablename__ = "docket_event"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("case.id"), nullable=False)
    sequence_number = Column(Integer, nullable=False, default=1)
    event_type = Column(String, nullable=False)
    event_data = Column(Text)  # JSON string
    actor_id = Column(String)
    actor_type = Column(String)  # system, internal_user, external_party
    occurred_at = Column(DateTime, default=datetime.utcnow)
    is_public = Column(Boolean, default=True)
    
    case = relationship("Case")
