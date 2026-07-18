from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ExperienceCreate(BaseModel):
    """Schema for creating experience entry."""
    company: str = Field(..., min_length=1, max_length=255)
    position: str = Field(..., min_length=1, max_length=255)
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    technologies: Optional[str] = None


class ExperienceUpdate(BaseModel):
    """Schema for updating experience entry."""
    company: Optional[str] = Field(None, min_length=1, max_length=255)
    position: Optional[str] = Field(None, min_length=1, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    technologies: Optional[str] = None


class ExperienceResponse(BaseModel):
    """Schema for experience data in API responses."""
    id: UUID
    applicant_id: UUID
    company: str
    position: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool
    description: Optional[str] = None
    technologies: Optional[str] = None

    model_config = {"from_attributes": True}
