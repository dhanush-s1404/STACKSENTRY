import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, async_session_factory, Base
from app.api.v1.router import api_router
from app.middleware.rate_limiter import limiter, rate_limit_exceeded_handler
from app.middleware.audit import AuditMiddleware
from app.seeds.admin import seed_admin_user
from app.seeds.jobs import seed_jobs


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        await seed_admin_user(session)
        await seed_jobs(session)
        await session.commit()

    yield

    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="StackSentry Technologies - Recruitment Management System",
    description=(
        "Enterprise Recruitment Management System API. "
        "Manage job postings, applications, interviews, and candidate tracking "
        "with AI-powered resume scoring and comprehensive analytics."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Audit middleware
app.add_middleware(AuditMiddleware)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(429, rate_limit_exceeded_handler)

# Include API router
app.include_router(api_router)

# Static files for uploads
if os.path.exists(settings.UPLOAD_DIR):
    app.mount(
        "/uploads",
        StaticFiles(directory=settings.UPLOAD_DIR),
        name="uploads",
    )


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "database": "connected",
    }
