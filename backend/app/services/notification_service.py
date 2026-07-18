import math
import uuid
from typing import Optional

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification, NotificationType


class NotificationService:
    """Service for managing user notifications."""

    @staticmethod
    async def create_notification(
        db: AsyncSession,
        user_id: uuid.UUID,
        title: str,
        message: str,
        notification_type: str = "info",
        link: Optional[str] = None,
    ) -> Notification:
        """Create a new notification."""
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=NotificationType(notification_type)
            if notification_type in [t.value for t in NotificationType]
            else NotificationType.info,
            link=link,
        )
        db.add(notification)
        await db.flush()
        return notification

    @staticmethod
    async def get_notifications(
        db: AsyncSession,
        user_id: uuid.UUID,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[Notification], int]:
        """Get paginated notifications for a user."""
        query = select(Notification).where(Notification.user_id == user_id)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar() or 0

        query = query.order_by(Notification.created_at.desc())
        query = query.offset((page - 1) * per_page).limit(per_page)

        result = await db.execute(query)
        notifications = list(result.scalars().all())

        return notifications, total

    @staticmethod
    async def mark_as_read(
        db: AsyncSession, notification_id: uuid.UUID
    ) -> Optional[Notification]:
        """Mark a single notification as read."""
        notification = await db.get(Notification, notification_id)
        if not notification:
            return None
        notification.is_read = True
        await db.flush()
        return notification

    @staticmethod
    async def mark_all_as_read(db: AsyncSession, user_id: uuid.UUID) -> int:
        """Mark all notifications for a user as read."""
        result = await db.execute(
            update(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
            .values(is_read=True)
        )
        await db.flush()
        return result.rowcount

    @staticmethod
    async def get_unread_count(db: AsyncSession, user_id: uuid.UUID) -> int:
        """Get count of unread notifications."""
        result = await db.execute(
            select(func.count(Notification.id)).where(
                Notification.user_id == user_id,
                Notification.is_read == False,
            )
        )
        return result.scalar() or 0

    @staticmethod
    async def delete_notification(
        db: AsyncSession, notification_id: uuid.UUID
    ) -> bool:
        """Delete a notification."""
        notification = await db.get(Notification, notification_id)
        if not notification:
            return False
        await db.delete(notification)
        await db.flush()
        return True
