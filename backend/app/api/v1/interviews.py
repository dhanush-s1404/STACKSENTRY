from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.models.applicant import ApplicantProfile
from app.models.application import Application
from app.api.v1.auth import get_current_user
from app.schemas.common import MessageResponse
from app.schemas.interview import (
    InterviewComplete,
    InterviewCreate,
    InterviewListResponse,
    InterviewResponse,
    InterviewUpdate,
)
from app.services.interview_service import InterviewService
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService
from app.utils.email import EmailService

router = APIRouter()


@router.post("/", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
async def schedule_interview(
    interview_data: InterviewCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Schedule a new interview (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or admin can schedule interviews",
        )

    try:
        interview = await InterviewService.schedule_interview(
            db, interview_data.model_dump()
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    result = await db.execute(
        select(Application).where(Application.id == interview.application_id)
    )
    application = result.scalar_one_or_none()

    if application and application.applicant:
        profile_result = await db.execute(
            select(ApplicantProfile).where(ApplicantProfile.id == application.applicant_id)
        )
        profile = profile_result.scalar_one_or_none()
        if profile and profile.user:
            await NotificationService.create_notification(
                db,
                profile.user.id,
                "Interview Scheduled",
                f"Your interview for {application.job.title if application.job else 'the position'} has been scheduled.",
                "success",
            )
            try:
                await EmailService.send_interview_invite(interview, application)
            except Exception:
                pass

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "schedule", "interview", str(interview.id),
        ip_address=ip,
    )

    return _format_interview_response(interview)


@router.get("/", response_model=InterviewListResponse)
async def list_interviews(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List interviews. HR sees all, candidates see their own."""
    interviewer_id = None
    applicant_id = None

    if current_user.role == UserRole.candidate:
        profile_result = await db.execute(
            select(ApplicantProfile).where(ApplicantProfile.user_id == current_user.id)
        )
        profile = profile_result.scalar_one_or_none()
        if profile:
            applicant_id = profile.id
    elif current_user.role in [UserRole.hr, UserRole.admin]:
        pass

    interviews, total = await InterviewService.get_interviews(
        db,
        interviewer_id=interviewer_id,
        applicant_id=applicant_id,
        page=page,
        per_page=per_page,
    )

    items = [_format_interview_response(iv) for iv in interviews]

    return InterviewListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page if total > 0 else 0,
    )


@router.get("/calendar")
async def get_calendar(
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get interview calendar data."""
    interviewer_id = None
    if current_user.role == UserRole.candidate:
        profile_result = await db.execute(
            select(ApplicantProfile).where(ApplicantProfile.user_id == current_user.id)
        )
        profile = profile_result.scalar_one_or_none()
        if profile:
            app_result = await db.execute(
                select(Application).where(Application.applicant_id == profile.id)
            )
            apps = app_result.scalars().all()
            return [_format_interview_response(iv) for iv in await InterviewService.get_calendar_data(
                db, start_date, end_date
            )]

    interviews = await InterviewService.get_calendar_data(
        db, start_date, end_date, interviewer_id
    )
    return [_format_interview_response(iv) for iv in interviews]


@router.get("/{interview_id}", response_model=InterviewResponse)
async def get_interview(
    interview_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get interview details by ID."""
    interview = await InterviewService.get_interview(db, interview_id)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    return _format_interview_response(interview)


@router.put("/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: UUID,
    interview_data: InterviewUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an interview."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or admin can update interviews",
        )

    update_dict = interview_data.model_dump(exclude_unset=True)
    interview = await InterviewService.update_interview(db, interview_id, update_dict)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "update", "interview", str(interview_id),
        details={"updated_fields": list(update_dict.keys())},
        ip_address=ip,
    )

    return _format_interview_response(interview)


@router.put("/{interview_id}/complete", response_model=InterviewResponse)
async def complete_interview(
    interview_id: UUID,
    data: InterviewComplete,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Complete an interview with feedback (hr/admin only)."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or admin can complete interviews",
        )

    interview = await InterviewService.complete_interview(
        db, interview_id, data.notes, data.rating, data.feedback
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "complete", "interview", str(interview_id),
        details={"rating": data.rating},
        ip_address=ip,
    )

    return _format_interview_response(interview)


@router.delete("/{interview_id}", status_code=status.HTTP_200_OK)
async def cancel_interview(
    interview_id: UUID,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cancel an interview."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR or admin can cancel interviews",
        )

    interview = await InterviewService.cancel_interview(db, interview_id)
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "cancel", "interview", str(interview_id),
        ip_address=ip,
    )

    return {"message": "Interview cancelled", "success": True}


def _format_interview_response(interview) -> InterviewResponse:
    """Format interview model to response schema."""
    interviewer_name = None
    if hasattr(interview, "interviewer") and interview.interviewer:
        interviewer_name = interview.interviewer.full_name

    applicant_name = None
    job_title = None
    if hasattr(interview, "application") and interview.application:
        app = interview.application
        if hasattr(app, "applicant") and app.applicant:
            if hasattr(app.applicant, "user") and app.applicant.user:
                applicant_name = app.applicant.user.full_name
        if hasattr(app, "job") and app.job:
            job_title = app.job.title

    return InterviewResponse(
        id=interview.id,
        application_id=interview.application_id,
        interviewer_id=interview.interviewer_id,
        interview_type=interview.interview_type.value
        if hasattr(interview.interview_type, "value")
        else interview.interview_type,
        scheduled_at=interview.scheduled_at,
        duration_minutes=interview.duration_minutes,
        location=interview.location,
        status=interview.status.value
        if hasattr(interview.status, "value")
        else interview.status,
        notes=interview.notes,
        rating=interview.rating,
        feedback=interview.feedback,
        created_at=interview.created_at,
        updated_at=interview.updated_at,
        interviewer_name=interviewer_name,
        applicant_name=applicant_name,
        job_title=job_title,
    )
