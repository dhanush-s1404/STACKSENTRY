import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Enum,
    Float,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ApplicationStatus(str, enum.Enum):
    applied = "applied"
    under_review = "under_review"
    shortlisted = "shortlisted"
    interview_scheduled = "interview_scheduled"
    interview_completed = "interview_completed"
    offer_sent = "offer_sent"
    hired = "hired"
    rejected = "rejected"
    withdrawn = "withdrawn"


class PreferredWorkMode(str, enum.Enum):
    remote = "remote"
    hybrid = "hybrid"
    onsite = "onsite"


class Application(Base):
    """Job application model tracking candidate submissions."""

    __tablename__ = "applications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tracking_number: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False
    )
    applicant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applicant_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
    )
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"),
        default=ApplicationStatus.applied,
        nullable=False,
    )
    cover_letter: Mapped[str | None] = mapped_column(Text, nullable=True)
    expected_salary: Mapped[str | None] = mapped_column(String(50), nullable=True)
    preferred_work_mode: Mapped[PreferredWorkMode | None] = mapped_column(
        Enum(PreferredWorkMode, name="preferred_work_mode_enum"), nullable=True
    )
    resume_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_parsed_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    hr_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    status_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    applicant: Mapped["ApplicantProfile"] = relationship(
        "ApplicantProfile", back_populates="applications"
    )
    job: Mapped["Job"] = relationship("Job", back_populates="applications")
    status_history: Mapped[list["ApplicationStatusHistory"]] = relationship(
        "ApplicationStatusHistory",
        back_populates="application",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    interviews: Mapped[list["Interview"]] = relationship(
        "Interview",
        back_populates="application",
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Application(id={self.id}, tracking={self.tracking_number}, status={self.status})>"
