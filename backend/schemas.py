"""
Pydantic schemas for the Phase 1 API surface.
"""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    status: str
    timestamp: str


class FilingCreate(BaseModel):
    intake_id: str | None = None
    filing_type: str = Field(min_length=1)
    submitted_by: str = Field(min_length=1)
    description: str = Field(min_length=1)
    ai_score: float = 0.0
    status: str | None = None


class FilingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    intake_id: str
    case_id: str | None = None
    filing_type: str
    status: str
    submitted_by: str | None = None
    submitted_at: datetime
    ai_score: float | None = None
    description: str


class DocketResult(BaseModel):
    status: str
    filing_id: str
    docket_number: str


class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    docket_number: str
    case_type: str
    title: str
    current_phase: str
    current_status: str
    assigned_judge_id: str | None = None
    docketed_date: date | None = None
    statutory_deadline: date | None = None
    sla_status: str
    created_at: datetime
    updated_at: datetime


class JudgeSuggestion(BaseModel):
    judge_id: str
    name: str
    office: str | None = None
    score: int


class JudgeSuggestionsResponse(BaseModel):
    suggestions: list[JudgeSuggestion]
