import os
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
from app.utils.security import hash_password


ADMIN_EMAIL = "admin@stacksentry.com"
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "StackSentry@Admin2025!")
ADMIN_FULL_NAME = "StackSentry Admin"


async def seed_admin_user(db: AsyncSession) -> None:
    """Create the default admin user if it doesn't exist."""
    result = await db.execute(
        select(User).where(User.email == ADMIN_EMAIL)
    )
    existing_admin = result.scalar_one_or_none()

    if existing_admin:
        return

    admin_user = User(
        email=ADMIN_EMAIL,
        hashed_password=hash_password(ADMIN_PASSWORD),
        full_name=ADMIN_FULL_NAME,
        role=UserRole.admin,
        is_active=True,
        is_email_verified=True,
    )
    db.add(admin_user)
    await db.flush()
