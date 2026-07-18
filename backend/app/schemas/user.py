from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    """Schema for user data in API responses."""
    id: UUID
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_email_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    avatar_url: Optional[str] = Field(None, max_length=500)


class UserProfileResponse(BaseModel):
    """Schema for full user profile including applicant data."""
    id: UUID
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_email_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime
    applicant_profile: Optional[dict] = None

    model_config = {"from_attributes": True}
