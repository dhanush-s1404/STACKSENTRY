from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    """Schema for creating a job application."""
    job_id: UUID
    cover_letter: Optional[str] = Field(None, max_length=5000)
    expected_salary: Optional[str] = Field(None, max_length=50)
    preferred_work_mode: Optional[str] = Field(None, pattern=r"^(remote|hybrid|onsite)$")


class ApplicationResponse(BaseModel):
    """Schema for application data in API responses."""
    id: UUID
    tracking_number: str
    applicant_id: UUID
    job_id: UUID
    status: str
    cover_letter: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    resume_score: Optional[float] = None
    hr_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    status_updated_at: datetime
    job_title: Optional[str] = None
    applicant_name: Optional[str] = None

    model_config = {"from_attributes": True}


class ApplicationStatusUpdate(BaseModel):
    """Schema for updating application status."""
    status: str = Field(..., pattern=r"^(applied|under_review|shortlisted|interview_scheduled|interview_completed|offer_sent|hired|rejected|withdrawn)$")
    notes: Optional[str] = Field(None, max_length=2000)


class ApplicationListResponse(BaseModel):
    """Schema for paginated application list."""
    items: List[ApplicationResponse]
    total: int
    page: int
    per_page: int
    pages: int


class ApplicationFilter(BaseModel):
    """Schema for filtering applications."""
    status: Optional[str] = None
    job_id: Optional[UUID] = None
    search: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
