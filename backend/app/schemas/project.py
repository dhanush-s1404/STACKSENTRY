from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    """Schema for creating project entry."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)
    technologies: str = Field(..., min_length=1, max_length=500)
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectUpdate(BaseModel):
    """Schema for updating project entry."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    url: Optional[str] = Field(None, max_length=500)
    github_url: Optional[str] = Field(None, max_length=500)
    technologies: Optional[str] = Field(None, min_length=1, max_length=500)
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectResponse(BaseModel):
    """Schema for project data in API responses."""
    id: UUID
    applicant_id: UUID
    title: str
    description: str
    url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    model_config = {"from_attributes": True}
