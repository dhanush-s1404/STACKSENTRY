import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class FileType(str, enum.Enum):
    resume = "resume"
    avatar = "avatar"
    document = "document"


class File(Base):
    """File upload tracking model."""

    __tablename__ = "files"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    is_virus_scanned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_clean: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    file_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    upload_type: Mapped[FileType] = mapped_column(
        Enum(FileType, name="file_type_enum"), default=FileType.document, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="files")

    def __repr__(self) -> str:
        return f"<File(id={self.id}, filename={self.filename})>"
