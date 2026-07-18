import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.models.application import Application
from app.models.job import Job
from app.models.interview import Interview
from app.api.v1.auth import get_current_user
from app.schemas.common import MessageResponse
from app.schemas.user import UserResponse
from app.services.audit_service import AuditService
from app.services.application_service import ApplicationService
from app.services.job_service import JobService
from app.utils.email import EmailService

router = APIRouter()


async def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency requiring admin role."""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def require_hr_or_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency requiring HR or admin role."""
    if current_user.role not in [UserRole.admin, UserRole.hr]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="HR or Admin access required",
        )
    return current_user


@router.get("/dashboard")
async def admin_dashboard(
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get admin dashboard statistics."""
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_candidates = (
        await db.execute(
            select(func.count(User.id)).where(User.role == UserRole.candidate)
        )
    ).scalar() or 0
    total_hr = (
        await db.execute(
            select(func.count(User.id)).where(User.role == UserRole.hr)
        )
    ).scalar() or 0
    total_admins = (
        await db.execute(
            select(func.count(User.id)).where(User.role == UserRole.admin)
        )
    ).scalar() or 0
    active_users = (
        await db.execute(
            select(func.count(User.id)).where(User.is_active == True)
        )
    ).scalar() or 0

    total_applications = (await db.execute(select(func.count(Application.id)))).scalar() or 0
    total_jobs = (await db.execute(select(func.count(Job.id)))).scalar() or 0
    active_jobs = (
        await db.execute(select(func.count(Job.id)).where(Job.is_active == True))
    ).scalar() or 0
    total_interviews = (
        await db.execute(select(func.count(Interview.id)))
    ).scalar() or 0

    app_stats = await ApplicationService.get_dashboard_stats(db)
    job_stats = await JobService.get_job_stats(db)

    return {
        "users": {
            "total": total_users,
            "candidates": total_candidates,
            "hr": total_hr,
            "admins": total_admins,
            "active": active_users,
        },
        "applications": app_stats,
        "jobs": job_stats,
        "interviews": {
            "total": total_interviews,
        },
    }


@router.get("/audit-logs")
async def get_audit_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    user_id: Optional[uuid.UUID] = Query(None),
    action: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """View audit logs."""
    logs, total = await AuditService.get_audit_logs(
        db, page, per_page, user_id, action, resource_type
    )

    items = []
    for log in logs:
        items.append({
            "id": str(log.id),
            "user_id": str(log.user_id) if log.user_id else None,
            "user_name": log.user.full_name if log.user else None,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "details": log.details,
            "ip_address": log.ip_address,
            "created_at": log.created_at.isoformat(),
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if total > 0 else 0,
    }


@router.get("/users", response_model=list[UserResponse])
async def list_all_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all users."""
    query = select(User)

    if role:
        query = query.where(User.role == role)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            User.full_name.ilike(search_pattern) | User.email.ilike(search_pattern)
        )

    query = query.order_by(User.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(query)
    users = list(result.scalars().all())

    return [UserResponse.model_validate(u) for u in users]


@router.put("/users/{user_id}/role", response_model=UserResponse)
async def change_user_role(
    user_id: uuid.UUID,
    role: str,
    request: Request,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Change a user's role (admin only)."""
    if role not in ["candidate", "hr", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    old_role = user.role.value
    user.role = UserRole(role)
    await db.flush()

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "change_role", "user", str(user_id),
        details={"old_role": old_role, "new_role": role},
        ip_address=ip,
    )

    return UserResponse.model_validate(user)


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
async def deactivate_user(
    user_id: uuid.UUID,
    request: Request,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate a user (admin only)."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account",
        )

    user.is_active = False
    await db.flush()

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "deactivate", "user", str(user_id),
        ip_address=ip,
    )

    return {"message": "User deactivated successfully", "success": True}


@router.get("/analytics")
async def recruitment_analytics(
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get recruitment analytics."""
    from app.models.application import ApplicationStatus

    total_applications = (await db.execute(select(func.count(Application.id)))).scalar() or 0
    total_jobs = (await db.execute(select(func.count(Job.id)))).scalar() or 0
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0

    status_breakdown = {}
    for status in ApplicationStatus:
        count = (
            await db.execute(
                select(func.count(Application.id)).where(Application.status == status)
            )
        ).scalar() or 0
        status_breakdown[status.value] = count

    conversion_rate = 0.0
    if total_applications > 0:
        joined = status_breakdown.get("joined", 0)
        conversion_rate = round((joined / total_applications) * 100, 2)

    return {
        "total_applications": total_applications,
        "total_jobs": total_jobs,
        "total_users": total_users,
        "status_breakdown": status_breakdown,
        "conversion_rate": conversion_rate,
    }


@router.post("/send-email", status_code=status.HTTP_200_OK)
async def send_custom_email(
    email_to: str,
    subject: str,
    body: str,
    request: Request,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Send a custom email to a candidate."""
    from app.utils.templates import EMAIL_VERIFICATION_TEMPLATE

    html_body = f"""
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563EB; padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">StackSentry Technologies</h1>
        </div>
        <div style="padding: 40px; background: white;">
            <p style="color: #475569; line-height: 1.7;">{body}</p>
        </div>
    </div>
    """

    success = await EmailService.send_email(email_to, subject, html_body)

    ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    await AuditService.log_action(
        db, current_user.id, "send_email", "email", None,
        details={"to": email_to, "subject": subject},
        ip_address=ip,
    )

    if success:
        return {"message": "Email sent successfully", "success": True}
    else:
        return {"message": "Failed to send email", "success": False}


@router.get("/reports/generate")
async def generate_report(
    report_type: str = Query("applications"),
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Generate recruitment reports."""
    if report_type == "applications":
        applications, total = await ApplicationService.list_applications(db, {}, page=1, per_page=10000)
        excel_file = ApplicationService.export_to_excel(applications)

        from fastapi.responses import StreamingResponse
        from datetime import datetime as dt
        filename = f"application_report_{dt.now().strftime('%Y%m%d_%H%M%S')}.xlsx"

        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    elif report_type == "applications_pdf":
        applications, total = await ApplicationService.list_applications(db, {}, page=1, per_page=10000)
        pdf_file = ApplicationService.export_to_pdf(applications)

        from fastapi.responses import StreamingResponse
        from datetime import datetime as dt
        filename = f"application_report_{dt.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        return StreamingResponse(
            pdf_file,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report type. Use 'applications' or 'applications_pdf'.",
        )
