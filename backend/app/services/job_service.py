import uuid
from typing import Optional

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job


class JobService:
    """Service for managing job postings."""

    @staticmethod
    async def create_job(db: AsyncSession, data: dict) -> Job:
        """Create a new job posting."""

        job = Job(
            title=data["title"],
            description=data["description"],
            responsibilities=data["responsibilities"],
            requirements=data["requirements"],
            benefits=data["benefits"],
            salary_min=data.get("salary_min"),
            salary_max=data.get("salary_max"),
            salary_currency=data.get("salary_currency", "INR"),
            job_type=data.get("job_type", "full_time"),
            experience_level=data.get("experience_level", "entry"),
            location=data.get("location"),
            is_remote=data.get("is_remote", False),
            department=data.get("department"),
            application_deadline=data.get("application_deadline"),
            positions_available=data.get("positions_available", 1),
        )

        db.add(job)
        await db.flush()

        return job


    @staticmethod
    async def get_job(
        db: AsyncSession,
        job_id: uuid.UUID
    ) -> Optional[Job]:
        """Get job by ID."""

        result = await db.execute(
            select(Job)
            .where(Job.id == job_id)
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def list_jobs(
        db: AsyncSession,
        page: int = 1,
        per_page: int = 20,
        search: Optional[str] = None,
        job_type: Optional[str] = None,
        experience_level: Optional[str] = None,
        location: Optional[str] = None,
        is_remote: Optional[bool] = None,
        is_active: Optional[bool] = True,
        department: Optional[str] = None,
    ) -> tuple[list[Job], int]:
        """List jobs with filters and pagination."""

        query = select(Job)

        if is_active is not None:
            query = query.where(
                Job.is_active == is_active
            )


        if search:
            search_pattern = f"%{search}%"

            query = query.where(
                or_(
                    Job.title.ilike(search_pattern),
                    Job.description.ilike(search_pattern),
                    Job.department.ilike(search_pattern),
                    Job.location.ilike(search_pattern),
                )
            )


        if job_type:
            query = query.where(
                Job.job_type == job_type
            )


        if experience_level:
            query = query.where(
                Job.experience_level == experience_level
            )


        if location:
            query = query.where(
                Job.location.ilike(f"%{location}%")
            )


        if is_remote is not None:
            query = query.where(
                Job.is_remote == is_remote
            )


        if department:
            query = query.where(
                Job.department.ilike(f"%{department}%")
            )


        # Total count
        count_query = select(
            func.count()
        ).select_from(
            query.subquery()
        )

        total = (
            await db.execute(count_query)
        ).scalar() or 0


        # Pagination
        query = (
            query
            .order_by(Job.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )


        result = await db.execute(query)

        jobs = list(
            result.scalars().all()
        )


        return jobs, total



    @staticmethod
    async def update_job(
        db: AsyncSession,
        job_id: uuid.UUID,
        data: dict
    ) -> Optional[Job]:
        """Update a job posting."""


        job = await db.get(
            Job,
            job_id
        )


        if not job:
            return None


        for key, value in data.items():

            if value is not None and hasattr(job, key):
                setattr(
                    job,
                    key,
                    value
                )


        await db.flush()

        return job



    @staticmethod
    async def delete_job(
        db: AsyncSession,
        job_id: uuid.UUID
    ) -> bool:
        """Soft delete a job posting."""


        job = await db.get(
            Job,
            job_id
        )


        if not job:
            return False


        job.is_active = False

        await db.flush()

        return True



    @staticmethod
    async def get_job_stats(
        db: AsyncSession
    ) -> dict:
        """Get job statistics."""


        total_jobs = (
            await db.execute(
                select(func.count(Job.id))
            )
        ).scalar() or 0



        active_jobs = (
            await db.execute(
                select(func.count(Job.id))
                .where(Job.is_active == True)
            )
        ).scalar() or 0



        job_type_counts = {}


        for jtype in [
            "full_time",
            "part_time",
            "contract",
            "internship"
        ]:

            count = (
                await db.execute(
                    select(func.count(Job.id))
                    .where(Job.job_type == jtype)
                )
            ).scalar() or 0


            job_type_counts[jtype] = count



        return {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "inactive_jobs": total_jobs - active_jobs,
            "job_type_counts": job_type_counts,
        }