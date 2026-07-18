import enum
import uuid

from sqlalchemy import Enum, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ProficiencyLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"
    expert = "expert"


class Skill(Base):
    """Skill taxonomy."""

    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Relationships
    applicant_skills: Mapped[list["ApplicationSkill"]] = relationship(
        "ApplicationSkill", back_populates="skill", lazy="dynamic"
    )

    def __repr__(self) -> str:
        return f"<Skill(id={self.id}, name={self.name})>"


class ApplicationSkill(Base):
    """Junction table linking applicants to skills with proficiency level."""

    __tablename__ = "application_skills"
    __table_args__ = (
        UniqueConstraint("applicant_id", "skill_id", name="uq_applicant_skill"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    applicant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applicant_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    proficiency: Mapped[ProficiencyLevel] = mapped_column(
        Enum(ProficiencyLevel, name="proficiency_level"),
        default=ProficiencyLevel.intermediate,
        nullable=False,
    )

    # Relationships
    applicant: Mapped["ApplicantProfile"] = relationship(
        "ApplicantProfile", back_populates="skills"
    )
    skill: Mapped["Skill"] = relationship("Skill", back_populates="applicant_skills")

    def __repr__(self) -> str:
        return f"<ApplicationSkill(applicant={self.applicant_id}, skill={self.skill_id})>"
