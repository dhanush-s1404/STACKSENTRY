import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"


class WorkMode(str, enum.Enum):
    remote = "remote"
    hybrid = "hybrid"
    onsite = "onsite"


class ApplicantProfile(Base):
    """Applicant profile with resume and personal details."""

    __tablename__ = "applicant_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        unique=True, nullable=False
    )
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[Gender | None] = mapped_column(
        Enum(Gender, name="gender_enum"), nullable=True
    )
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    college: Mapped[str | None] = mapped_column(String(255), nullable=True)
    degree: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cgpa: Mapped[float | None] = mapped_column(Float, nullable=True)
    graduation_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    experience_years: Mapped[float | None] = mapped_column(Float, nullable=True)
    expected_salary: Mapped[str | None] = mapped_column(String(50), nullable=True)
    preferred_work_mode: Mapped[WorkMode | None] = mapped_column(
        Enum(WorkMode, name="work_mode_enum"), nullable=True
    )
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    portfolio_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    resume_file_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("files.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="applicant_profile")
    applications: Mapped[list["Application"]] = relationship(
        "Application", back_populates="applicant", lazy="dynamic"
    )
    education: Mapped[list["Education"]] = relationship(
        "Education", back_populates="applicant", lazy="selectin",
        cascade="all, delete-orphan"
    )
    experience: Mapped[list["Experience"]] = relationship(
        "Experience", back_populates="applicant", lazy="selectin",
        cascade="all, delete-orphan"
    )
    projects: Mapped[list["Project"]] = relationship(
        "Project", back_populates="applicant", lazy="selectin",
        cascade="all, delete-orphan"
    )
    skills: Mapped[list["ApplicationSkill"]] = relationship(
        "ApplicationSkill", back_populates="applicant", lazy="selectin",
        cascade="all, delete-orphan"
    )
    resume_file: Mapped["File | None"] = relationship(
        "File", foreign_keys=[resume_file_id], lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<ApplicantProfile(id={self.id}, user_id={self.user_id})>"
