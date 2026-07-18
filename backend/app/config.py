from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    APP_NAME: str = "StackSentry Technologies"
    APP_URL: str = "http://localhost:8000"
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/stacksentry"

    # Security
    SECRET_KEY: str
    REFRESH_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@stacksentry.com"
    SMTP_FROM_NAME: str = "StackSentry Technologies"

    # AWS S3
    AWS_S3_BUCKET: str = ""
    AWS_S3_REGION: str = "ap-south-1"
    AWS_S3_ACCESS_KEY: str = ""
    AWS_S3_SECRET_KEY: str = ""

    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5242880
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    # Rate Limiting
    RATE_LIMIT: str = "100/minute"

    # Captcha
    CAPTCHA_SECRET: str = ""


settings = Settings()
