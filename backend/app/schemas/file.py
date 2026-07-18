from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel


class FileUploadResponse(BaseModel):
    """Schema for file upload response."""
    id: UUID
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    upload_type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class FileListResponse(BaseModel):
    """Schema for paginated file list."""
    items: List[FileUploadResponse]
    total: int
    page: int
    per_page: int
    pages: int
