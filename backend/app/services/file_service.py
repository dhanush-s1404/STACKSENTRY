import os
import uuid
from typing import Optional

import aiofiles
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.file import File, FileType
from app.utils.security import calculate_file_hash, validate_file_size, validate_file_type


class FileService:
    """Service for file upload, validation and management."""

    @staticmethod
    async def upload_file(
        db: AsyncSession,
        file_content: bytes,
        filename: str,
        original_filename: str,
        mime_type: str,
        user_id: uuid.UUID,
        upload_type: str = "document",
    ) -> File:
        """Upload and store a file with validation."""
        if not validate_file_type(mime_type):
            raise ValueError(f"File type '{mime_type}' is not allowed.")

        if not validate_file_size(len(file_content)):
            raise ValueError(
                f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE} bytes."
            )

        file_hash = calculate_file_hash(file_content)

        existing = await db.execute(
            select(File).where(File.file_hash == file_hash)
        )
        if existing.scalar_one_or_none():
            upload_dir = os.path.join(settings.UPLOAD_DIR, str(user_id))
        else:
            upload_dir = os.path.join(settings.UPLOAD_DIR, str(user_id))

        os.makedirs(upload_dir, exist_ok=True)

        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(upload_dir, unique_filename)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)

        file_record = File(
            user_id=user_id,
            filename=unique_filename,
            original_filename=original_filename,
            file_path=file_path,
            file_size=len(file_content),
            mime_type=mime_type,
            file_hash=file_hash,
            upload_type=FileType(upload_type) if upload_type in FileType.__members__.values() else FileType.document,
        )
        db.add(file_record)
        await db.flush()

        FileService.scan_for_viruses(file_path)

        return file_record

    @staticmethod
    async def get_file(db: AsyncSession, file_id: uuid.UUID) -> Optional[File]:
        """Get file by ID."""
        return await db.get(File, file_id)

    @staticmethod
    async def delete_file(db: AsyncSession, file_id: uuid.UUID) -> bool:
        """Delete a file."""
        file_record = await db.get(File, file_id)
        if not file_record:
            return False

        if os.path.exists(file_record.file_path):
            os.remove(file_record.file_path)

        await db.delete(file_record)
        await db.flush()
        return True

    @staticmethod
    async def list_user_files(
        db: AsyncSession,
        user_id: uuid.UUID,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[File], int]:
        """List files for a user with pagination."""
        query = select(File).where(File.user_id == user_id)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar() or 0

        query = query.order_by(File.created_at.desc())
        query = query.offset((page - 1) * per_page).limit(per_page)

        result = await db.execute(query)
        files = list(result.scalars().all())

        return files, total

    @staticmethod
    def scan_for_viruses(file_path: str) -> bool:
        """Basic virus scan placeholder. In production, integrate ClamAV or similar."""
        try:
            with open(file_path, "rb") as f:
                content = f.read(8192)
                if b"MZ" in content[:2]:
                    return False
            return True
        except Exception:
            return False

    @staticmethod
    def calculate_hash(content: bytes) -> str:
        """Calculate SHA-256 hash of content."""
        return calculate_file_hash(content)

    @staticmethod
    async def detect_duplicates(
        db: AsyncSession, file_hash: str
    ) -> Optional[File]:
        """Check for duplicate files by hash."""
        result = await db.execute(
            select(File).where(File.file_hash == file_hash)
        )
        return result.scalar_one_or_none()
