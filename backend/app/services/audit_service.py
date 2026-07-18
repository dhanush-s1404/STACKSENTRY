import math
import uuid
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.audit_log import AuditLog


class AuditService:
    """Service for audit logging."""

    @staticmethod
    async def log_action(
        db: AsyncSession,
        user_id: Optional[uuid.UUID],
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[dict] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> AuditLog:
        """Log an audit action."""
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(audit_log)
        await db.flush()
        return audit_log

    @staticmethod
    async def get_audit_logs(
        db: AsyncSession,
        page: int = 1,
        per_page: int = 50,
        user_id: Optional[uuid.UUID] = None,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
    ) -> tuple[list[AuditLog], int]:
        """Get paginated audit logs with optional filters."""
        query = select(AuditLog).options(selectinload(AuditLog.user))

        if user_id:
            query = query.where(AuditLog.user_id == user_id)

        if action:
            query = query.where(AuditLog.action == action)

        if resource_type:
            query = query.where(AuditLog.resource_type == resource_type)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar() or 0

        query = query.order_by(AuditLog.created_at.desc())
        query = query.offset((page - 1) * per_page).limit(per_page)

        result = await db.execute(query)
        logs = list(result.scalars().all())

        return logs, total
