from datetime import datetime
from typing import TYPE_CHECKING

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings
from app.utils.templates import (
    APPLICATION_RECEIVED_TEMPLATE,
    EMAIL_VERIFICATION_TEMPLATE,
    INTERVIEW_INVITE_TEMPLATE,
    OFFER_LETTER_TEMPLATE,
    PASSWORD_RESET_TEMPLATE,
    REJECTION_TEMPLATE,
    STATUS_UPDATE_TEMPLATE,
)

if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.interview import Interview
    from app.models.job import Job
    from app.models.user import User


class EmailService:
    """Service for sending emails asynchronously."""

    @staticmethod
    async def send_email(
        to: str,
        subject: str,
        html_body: str,
        from_name: str = settings.SMTP_FROM_NAME,
    ) -> bool:
        """Send an HTML email."""
        try:
            message = MIMEMultipart("alternative")
            message["From"] = f"{from_name} <{settings.SMTP_FROM_EMAIL}>"
            message["To"] = to
            message["Subject"] = subject

            text_part = MIMEText(html_body, "html", "utf-8")
            message.attach(text_part)

            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USERNAME,
                password=settings.SMTP_PASSWORD,
                start_tls=True,
            )
            return True
        except Exception:
            return False

    @classmethod
    async def send_verification_email(cls, user: "User", token: str) -> bool:
        """Send email verification link."""
        verification_url = f"{settings.APP_URL}/verify-email?token={token}"
        html_body = EMAIL_VERIFICATION_TEMPLATE.format(
            full_name=user.full_name,
            verification_url=verification_url,
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Verify your email - {settings.APP_NAME}",
            html_body=html_body,
        )

    @classmethod
    async def send_password_reset_email(cls, user: "User", token: str) -> bool:
        """Send password reset link."""
        reset_url = f"{settings.APP_URL}/reset-password?token={token}"
        html_body = PASSWORD_RESET_TEMPLATE.format(
            full_name=user.full_name,
            reset_url=reset_url,
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Reset your password - {settings.APP_NAME}",
            html_body=html_body,
        )

    @classmethod
    async def send_application_received(cls, application: "Application") -> bool:
        """Send application received confirmation."""
        user = application.applicant.user
        job = application.job
        html_body = APPLICATION_RECEIVED_TEMPLATE.format(
            full_name=user.full_name,
            tracking_number=application.tracking_number,
            job_title=job.title,
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Application Received - {job.title} | {settings.APP_NAME}",
            html_body=html_body,
        )

    @classmethod
    async def send_status_update_email(
        cls, application: "Application", old_status: str, new_status: str
    ) -> bool:
        """Send application status update notification."""
        user = application.applicant.user
        job = application.job
        status_display = new_status.replace("_", " ").title()
        html_body = STATUS_UPDATE_TEMPLATE.format(
            full_name=user.full_name,
            job_title=job.title,
            tracking_number=application.tracking_number,
            old_status=old_status.replace("_", " ").title(),
            new_status=status_display,
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Application Update - {job.title} | {settings.APP_NAME}",
            html_body=html_body,
        )

    @classmethod
    async def send_interview_invite(
        cls, interview: "Interview", application: "Application"
    ) -> bool:
        """Send interview invitation email."""
        user = application.applicant.user
        job = application.job
        interview_date = interview.scheduled_at.strftime("%B %d, %Y at %I:%M %p")
        interview_type_display = interview.interview_type.replace("_", " ").title()
        html_body = INTERVIEW_INVITE_TEMPLATE.format(
            full_name=user.full_name,
            job_title=job.title,
            interview_type=interview_type_display,
            interview_date=interview_date,
            duration=interview.duration_minutes,
            location=interview.location or "To be announced",
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Interview Invitation - {job.title} | {settings.APP_NAME}",
            html_body=html_body,
        )

    @classmethod
    async def send_offer_letter(
        cls, application: "Application", job: "Job"
    ) -> bool:
        """Send offer letter email."""
        user = application.applicant.user
        salary_range = ""
        if job.salary_min and job.salary_max:
            salary_range = f"{job.salary_currency} {job.salary_min:,} - {job.salary_max:,}"
        html_body = OFFER_LETTER_TEMPLATE.format(
            full_name=user.full_name,
            job_title=job.title,
            salary_range=salary_range or "Competitive",
            department=job.department or "Engineering",
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Offer Letter - {job.title} | {settings.APP_NAME}",
            html_body=html_body,
        )

    @classmethod
    async def send_rejection_email(
        cls, application: "Application", reason: str
    ) -> bool:
        """Send rejection email."""
        user = application.applicant.user
        job = application.job
        html_body = REJECTION_TEMPLATE.format(
            full_name=user.full_name,
            job_title=job.title,
            tracking_number=application.tracking_number,
            reason=reason or "We have decided to move forward with other candidates.",
            app_name=settings.APP_NAME,
        )
        return await cls.send_email(
            to=user.email,
            subject=f"Application Update - {job.title} | {settings.APP_NAME}",
            html_body=html_body,
        )
