from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class InterviewCreate(BaseModel):
    """Schema for scheduling an interview."""
    application_id: UUID
    interviewer_id: UUID
    interview_type: str = "technical"
    scheduled_at: datetime
    duration_minutes: int = Field(60, ge=15, le=480)
    location: Optional[str] = Field(None, max_length=500)


class InterviewUpdate(BaseModel):
    """Schema for updating an interview."""
    interviewer_id: Optional[UUID] = None
    interview_type: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=15, le=480)
    location: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = None
    notes: Optional[str] = None


class InterviewResponse(BaseModel):
    """Schema for interview data in API responses."""
    id: UUID
    application_id: UUID
    interviewer_id: UUID
    interview_type: str
    scheduled_at: datetime
    duration_minutes: int
    location: Optional[str] = None
    status: str
    notes: Optional[str] = None
    rating: Optional[int] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    interviewer_name: Optional[str] = None
    applicant_name: Optional[str] = None
    job_title: Optional[str] = None

    model_config = {"from_attributes": True}


class InterviewComplete(BaseModel):
    """Schema for completing an interview with feedback."""
    notes: Optional[str] = Field(None, max_length=5000)
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = Field(None, max_length=5000)


class InterviewListResponse(BaseModel):
    """Schema for paginated interview list."""
    items: List[InterviewResponse]
    total: int
    page: int
    per_page: int
    pages: int
