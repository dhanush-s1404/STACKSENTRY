from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    """Schema for notification data."""
    id: UUID
    user_id: UUID
    title: str
    message: str
    type: str
    is_read: bool
    link: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationMarkRead(BaseModel):
    """Schema for marking notification as read."""
    is_read: bool = True


class NotificationListResponse(BaseModel):
    """Schema for paginated notification list."""
    items: List[NotificationResponse]
    total: int
    page: int
    per_page: int
    pages: int
