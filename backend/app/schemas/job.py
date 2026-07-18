from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    """Schema for creating a job posting."""
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    responsibilities: str = Field(..., min_length=10)
    requirements: str = Field(..., min_length=10)
    benefits: str = Field(..., min_length=10)
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    salary_currency: str = "INR"
    job_type: str = Field("full_time", pattern=r"^(full_time|part_time|contract|internship)$")
    experience_level: str = Field("entry", pattern=r"^(entry|mid|senior|lead)$")
    location: Optional[str] = None
    is_remote: bool = False
    department: Optional[str] = None
    application_deadline: Optional[datetime] = None
    positions_available: int = Field(1, ge=1)


class JobUpdate(BaseModel):
    """Schema for updating a job posting."""
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    responsibilities: Optional[str] = Field(None, min_length=10)
    requirements: Optional[str] = Field(None, min_length=10)
    benefits: Optional[str] = Field(None, min_length=10)
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    salary_currency: Optional[str] = None
    job_type: Optional[str] = Field(None, pattern=r"^(full_time|part_time|contract|internship)$")
    experience_level: Optional[str] = Field(None, pattern=r"^(entry|mid|senior|lead)$")
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None
    application_deadline: Optional[datetime] = None
    positions_available: Optional[int] = Field(None, ge=1)


class JobResponse(BaseModel):
    """Schema for job data in API responses."""
    id: UUID
    title: str
    description: str
    responsibilities: str
    requirements: str
    benefits: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str
    job_type: str
    experience_level: str
    location: Optional[str] = None
    is_remote: bool
    department: Optional[str] = None
    is_active: bool
    application_deadline: Optional[datetime] = None
    positions_available: int
    positions_filled: int
    created_at: datetime
    updated_at: datetime
    application_count: int = 0

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    """Schema for paginated job list."""
    items: List[JobResponse]
    total: int
    page: int
    per_page: int
    pages: int
