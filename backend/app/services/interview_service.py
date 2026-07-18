import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.interview import Interview, InterviewStatus, InterviewType
from app.models.application import Application
from app.models.applicant import ApplicantProfile
from app.models.user import User


class InterviewService:
    """Service for managing interviews."""

    @staticmethod
    async def schedule_interview(
        db: AsyncSession, data: dict
    ) -> Interview:
        """Schedule a new interview."""
        application = await db.get(Application, data["application_id"])
        if not application:
            raise ValueError("Application not found.")

        interviewer = await db.get(User, data["interviewer_id"])
        if not interviewer:
            raise ValueError("Interviewer not found.")

        interview = Interview(
            application_id=data["application_id"],
            interviewer_id=data["interviewer_id"],
            interview_type=InterviewType(data.get("interview_type", "technical")),
            scheduled_at=data["scheduled_at"],
            duration_minutes=data.get("duration_minutes", 60),
            location=data.get("location"),
            status=InterviewStatus.scheduled,
        )
        db.add(interview)
        await db.flush()
        return interview

    @staticmethod
    async def update_interview(
        db: AsyncSession, interview_id: uuid.UUID, data: dict
    ) -> Optional[Interview]:
        """Update interview details."""
        interview = await db.get(Interview, interview_id)
        if not interview:
            return None

        for key, value in data.items():
            if value is not None and key != "status":
                if key == "interview_type":
                    interview.interview_type = InterviewType(value)
                else:
                    setattr(interview, key, value)

        await db.flush()
        return interview

    @staticmethod
    async def complete_interview(
        db: AsyncSession,
        interview_id: uuid.UUID,
        notes: Optional[str] = None,
        rating: Optional[int] = None,
        feedback: Optional[str] = None,
    ) -> Optional[Interview]:
        """Complete an interview with notes and rating."""
        interview = await db.get(Interview, interview_id)
        if not interview:
            return None

        interview.status = InterviewStatus.completed
        interview.notes = notes
        interview.rating = rating
        interview.feedback = feedback
        await db.flush()
        return interview

    @staticmethod
    async def cancel_interview(
        db: AsyncSession, interview_id: uuid.UUID
    ) -> Optional[Interview]:
        """Cancel an interview."""
        interview = await db.get(Interview, interview_id)
        if not interview:
            return None

        interview.status = InterviewStatus.cancelled
        await db.flush()
        return interview

    @staticmethod
    async def get_interview(
        db: AsyncSession, interview_id: uuid.UUID
    ) -> Optional[Interview]:
        """Get a single interview by ID with relationships."""
        result = await db.execute(
            select(Interview)
            .options(
                selectinload(Interview.application)
                .selectinload(Application.applicant)
                .selectinload(ApplicantProfile.user),
                selectinload(Interview.interviewer),
            )
            .where(Interview.id == interview_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_interviews(
        db: AsyncSession,
        interviewer_id: Optional[uuid.UUID] = None,
        applicant_id: Optional[uuid.UUID] = None,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[Interview], int]:
        """List interviews with optional filters."""
        query = select(Interview).options(
            selectinload(Interview.application).selectinload(Application.applicant)
            .selectinload(ApplicantProfile.user),
            selectinload(Interview.interviewer),
        )

        if interviewer_id:
            query = query.where(Interview.interviewer_id == interviewer_id)

        if applicant_id:
            query = query.join(Interview.application).where(
                Application.applicant_id == applicant_id
            )

        from sqlalchemy import func

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar() or 0

        query = query.order_by(Interview.scheduled_at.desc())
        query = query.offset((page - 1) * per_page).limit(per_page)

        result = await db.execute(query)
        interviews = list(result.scalars().all())

        return interviews, total

    @staticmethod
    async def get_calendar_data(
        db: AsyncSession,
        start_date: datetime,
        end_date: datetime,
        interviewer_id: Optional[uuid.UUID] = None,
    ) -> list[Interview]:
        """Get interviews for calendar view."""
        query = (
            select(Interview)
            .options(
                selectinload(Interview.application)
                .selectinload(Application.applicant)
                .selectinload(ApplicantProfile.user),
                selectinload(Interview.interviewer),
            )
            .where(
                and_(
                    Interview.scheduled_at >= start_date,
                    Interview.scheduled_at <= end_date,
                    Interview.status != InterviewStatus.cancelled,
                )
            )
        )

        if interviewer_id:
            query = query.where(Interview.interviewer_id == interviewer_id)

        query = query.order_by(Interview.scheduled_at.asc())
        result = await db.execute(query)
        return list(result.scalars().all())
