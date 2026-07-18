from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User, UserRole
from app.models.applicant import ApplicantProfile
from app.models.application import Application, ApplicationStatus
from app.api.v1.auth import get_current_user
from app.schemas.application import (
    ApplicationCreate,
    ApplicationFilter,
    ApplicationListResponse,
    ApplicationResponse,
    ApplicationStatusUpdate,
)
from app.schemas.common import MessageResponse, PaginationParams
from app.services.application_service import ApplicationService

router = APIRouter()


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: ApplicationCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a new job application (candidate only)."""
    if current_user.role != UserRole.candidate:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can submit applications",
        )

    result = await db.execute(
        select(ApplicantProfile).where(ApplicantProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your profile first",
        )

    try:
        application = await ApplicationService.create_application(
            db,
            applicant_id=profile.id,
            job_id=application_data.job_id,
            data=application_data.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    full_app = await ApplicationService.get_application(db, application.id)

    from app.services.audit_service import AuditService
    from app.services.notification_service import NotificationService

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "create", "application", str(application.id),
        details={"tracking_number": application.tracking_number},
        ip_address=ip,
    )

    await NotificationService.create_notification(
        db,
        current_user.id,
        "Application Submitted",
        f"Your application for {full_app.job.title} has been submitted successfully. Tracking: {application.tracking_number}",
        "success",
    )

    return _format_application_response(full_app)


@router.get("/", response_model=ApplicationListResponse)
async def list_applications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    job_id: Optional[UUID] = Query(None),
    search: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List applications. Candidates see own, HR/admin see all."""
    filters = {}
    if status_filter:
        filters["status"] = status_filter
    if job_id:
        filters["job_id"] = job_id
    if search:
        filters["search"] = search
    if date_from:
        filters["date_from"] = date_from
    if date_to:
        filters["date_to"] = date_to

    applicant_id = None
    if current_user.role == UserRole.candidate:
        result = await db.execute(
            select(ApplicantProfile).where(ApplicantProfile.user_id == current_user.id)
        )
        profile = result.scalar_one_or_none()
        if profile:
            applicant_id = profile.id

    applications, total = await ApplicationService.list_applications(
        db, filters, page, per_page, applicant_id
    )

    items = [_format_application_response(app) for app in applications]

    return ApplicationListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page if total > 0 else 0,
    )


@router.get("/track/{tracking_number}", response_model=ApplicationResponse)
async def track_application(
    tracking_number: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Track application by tracking number."""
    result = await db.execute(
        select(Application).where(Application.tracking_number == tracking_number)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if current_user.role == UserRole.candidate:
        profile_result = await db.execute(
            select(ApplicantProfile).where(ApplicantProfile.user_id == current_user.id)
        )
        profile = profile_result.scalar_one_or_none()
        if not profile or application.applicant_id != profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )

    full_app = await ApplicationService.get_application(db, application.id)
    return _format_application_response(full_app)


@router.get("/stats/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get dashboard statistics (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    stats = await ApplicationService.get_dashboard_stats(db)
    return stats


@router.get("/export/excel")
async def export_applications_excel(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Export applications to Excel (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    applications, _ = await ApplicationService.list_applications(db, {}, page=1, per_page=10000)
    excel_file = ApplicationService.export_to_excel(applications)

    from datetime import datetime as dt
    filename = f"applications_{dt.now().strftime('%Y%m%d_%H%M%S')}.xlsx"

    return StreamingResponse(
        excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/export/pdf")
async def export_applications_pdf(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Export applications to PDF (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    applications, _ = await ApplicationService.list_applications(db, {}, page=1, per_page=10000)
    pdf_file = ApplicationService.export_to_pdf(applications)

    from datetime import datetime as dt
    filename = f"applications_{dt.now().strftime('%Y%m%d_%H%M%S')}.pdf"

    return StreamingResponse(
        pdf_file,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get application details by ID."""
    application = await ApplicationService.get_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if current_user.role == UserRole.candidate:
        if application.applicant.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )

    return _format_application_response(application)


@router.put("/{application_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    application_id: UUID,
    status_data: ApplicationStatusUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update application status (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or admin can update application status",
        )

    old_app = await ApplicationService.get_application(db, application_id)
    if not old_app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    old_status = old_app.status.value

    try:
        application = await ApplicationService.update_status(
            db,
            application_id,
            status_data.status,
            current_user.id,
            status_data.notes,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    full_app = await ApplicationService.get_application(db, application_id)

    from app.services.audit_service import AuditService
    from app.services.notification_service import NotificationService
    from app.utils.email import EmailService

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "update_status", "application", str(application_id),
        details={"old_status": old_status, "new_status": status_data.status},
        ip_address=ip,
    )

    user_id = full_app.applicant.user.id if full_app.applicant and full_app.applicant.user else None
    if user_id:
        await NotificationService.create_notification(
            db,
            user_id,
            "Application Status Updated",
            f"Your application status for {full_app.job.title} has been updated to {status_data.status.replace('_', ' ').title()}.",
            "info",
        )

        try:
            await EmailService.send_status_update_email(full_app, old_status, status_data.status)
        except Exception:
            pass

    return _format_application_response(full_app)


def _format_application_response(application: Application) -> ApplicationResponse:
    """Format an application model into a response schema."""
    return ApplicationResponse(
        id=application.id,
        tracking_number=application.tracking_number,
        applicant_id=application.applicant_id,
        job_id=application.job_id,
        status=application.status.value,
        cover_letter=application.cover_letter,
        expected_salary=application.expected_salary,
        preferred_work_mode=application.preferred_work_mode.value if application.preferred_work_mode else None,
        resume_score=application.resume_score,
        hr_notes=application.hr_notes,
        rejection_reason=application.rejection_reason,
        created_at=application.created_at,
        updated_at=application.updated_at,
        status_updated_at=application.status_updated_at,
        job_title=application.job.title if application.job else None,
        applicant_name=(
            application.applicant.user.full_name
            if application.applicant and application.applicant.user
            else None
        ),
    )
