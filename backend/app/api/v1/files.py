import os
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, Request, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.config import settings
from app.models.user import User, UserRole
from app.models.file import File as FileModel, FileType
from app.models.applicant import ApplicantProfile
from app.models.application import Application
from app.api.v1.auth import get_current_user
from app.schemas.file import FileListResponse, FileUploadResponse
from app.schemas.common import MessageResponse
from app.services.file_service import FileService
from app.services.audit_service import AuditService

router = APIRouter()


@router.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    upload_type: str = Query("document"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a file with validation."""
    file_content = await file.read()

    if not file.content_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to determine file type",
        )

    try:
        file_record = await FileService.upload_file(
            db,
            file_content=file_content,
            filename=file.filename or "unknown",
            original_filename=file.filename or "unknown",
            mime_type=file.content_type,
            user_id=current_user.id,
            upload_type=upload_type,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "upload", "file", str(file_record.id),
        details={"filename": file_record.original_filename, "type": upload_type},
        ip_address=ip,
    )

    return FileUploadResponse.model_validate(file_record)


@router.get("/", response_model=FileListResponse)
async def list_files(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's uploaded files."""
    files, total = await FileService.list_user_files(db, current_user.id, page, per_page)
    items = [FileUploadResponse.model_validate(f) for f in files]

    return FileListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page if total > 0 else 0,
    )


@router.get("/resume/{application_id}")
async def get_resume_for_application(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get resume file for an application (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or admin can access application resumes",
        )

    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    profile_result = await db.execute(
        select(ApplicantProfile).where(ApplicantProfile.id == application.applicant_id)
    )
    profile = profile_result.scalar_one_or_none()

    if not profile or not profile.resume_file_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found for this application",
        )

    file_record = await FileService.get_file(db, profile.resume_file_id)
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found",
        )

    if not os.path.exists(file_record.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found on disk",
        )

    return FileResponse(
        path=file_record.file_path,
        filename=file_record.original_filename,
        media_type=file_record.mime_type,
    )


@router.get("/{file_id}", response_class=FileResponse)
async def download_file(
    file_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Download a file by ID."""
    file_record = await FileService.get_file(db, file_id)
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    if file_record.user_id != current_user.id and current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    if not os.path.exists(file_record.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk",
        )

    return FileResponse(
        path=file_record.file_path,
        filename=file_record.original_filename,
        media_type=file_record.mime_type,
    )


@router.delete("/{file_id}", status_code=status.HTTP_200_OK)
async def delete_file(
    file_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a file."""
    file_record = await FileService.get_file(db, file_id)
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    if file_record.user_id != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    deleted = await FileService.delete_file(db, file_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete file",
        )

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "delete", "file", str(file_id),
        ip_address=ip,
    )

    return {"message": "File deleted successfully", "success": True}
