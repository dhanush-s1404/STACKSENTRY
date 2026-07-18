from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class EducationCreate(BaseModel):
    """Schema for creating education entry."""
    institution: str = Field(..., min_length=1, max_length=255)
    degree: str = Field(..., min_length=1, max_length=255)
    field_of_study: str = Field(..., min_length=1, max_length=255)
    start_date: date
    end_date: Optional[date] = None
    cgpa: Optional[float] = Field(None, ge=0, le=10)
    is_current: bool = False
    description: Optional[str] = None


class EducationUpdate(BaseModel):
    """Schema for updating education entry."""
    institution: Optional[str] = Field(None, min_length=1, max_length=255)
    degree: Optional[str] = Field(None, min_length=1, max_length=255)
    field_of_study: Optional[str] = Field(None, min_length=1, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    cgpa: Optional[float] = Field(None, ge=0, le=10)
    is_current: Optional[bool] = None
    description: Optional[str] = None


class EducationResponse(BaseModel):
    """Schema for education data in API responses."""
    id: UUID
    applicant_id: UUID
    institution: str
    degree: str
    field_of_study: str
    start_date: date
    end_date: Optional[date] = None
    cgpa: Optional[float] = None
    is_current: bool
    description: Optional[str] = None

    model_config = {"from_attributes": True}
