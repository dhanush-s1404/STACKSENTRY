from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.api.v1.auth import get_current_user
from app.schemas.common import PaginatedResponse, PaginationParams
from app.schemas.job import JobCreate, JobListResponse, JobResponse, JobUpdate
from app.services.job_service import JobService

router = APIRouter()


@router.get("/", response_model=JobListResponse)
async def list_jobs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),
    department: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List all active jobs (public endpoint)."""
    jobs, total = await JobService.list_jobs(
        db,
        page=page,
        per_page=per_page,
        search=search,
        job_type=job_type,
        experience_level=experience_level,
        location=location,
        is_remote=is_remote,
        department=department,
        is_active=True,
    )

    job_responses = []
    for job in jobs:
        app_count = 0
        if hasattr(job, "applications") and job.applications:
            app_count = len(job.applications)
        jr = JobResponse.model_validate(job)
        jr.application_count = app_count
        job_responses.append(jr)

    return JobListResponse(
        items=job_responses,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page if total > 0 else 0,
    )


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get job details by ID (public endpoint)."""
    job = await JobService.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    app_count = 0
    if hasattr(job, "applications") and job.applications:
        app_count = len(job.applications)

    jr = JobResponse.model_validate(job)
    jr.application_count = app_count
    return jr


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new job posting (admin/hr only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or HR can create jobs",
        )

    job = await JobService.create_job(db, job_data.model_dump())

    from app.services.audit_service import AuditService
    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "create", "job", str(job.id),
        details={"title": job.title},
        ip_address=ip,
    )

    jr = JobResponse.model_validate(job)
    jr.application_count = 0
    return jr


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: UUID,
    job_data: JobUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a job posting (admin/hr only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or HR can update jobs",
        )

    update_dict = job_data.model_dump(exclude_unset=True)
    job = await JobService.update_job(db, job_id, update_dict)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    from app.services.audit_service import AuditService
    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "update", "job", str(job.id),
        details={"updated_fields": list(update_dict.keys())},
        ip_address=ip,
    )

    app_count = 0
    if hasattr(job, "applications") and job.applications:
        app_count = len(job.applications)

    jr = JobResponse.model_validate(job)
    jr.application_count = app_count
    return jr


@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
async def delete_job(
    job_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete (deactivate) a job posting (admin only)."""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete jobs",
        )

    deleted = await JobService.delete_job(db, job_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    from app.services.audit_service import AuditService
    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "delete", "job", str(job_id),
        ip_address=ip,
    )

    return {"message": "Job deleted successfully", "success": True}
