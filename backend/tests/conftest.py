import asyncio
import uuid
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.database import Base, get_db
from app.main import app
from app.models.user import User, UserRole
from app.utils.auth import hash_password

TEST_DATABASE_URL = settings.DATABASE_URL.replace(
    settings.DATABASE_URL.split("/")[-1],
    f"stacksentry_test_{uuid.uuid4().hex[:8]}",
)

engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

TestSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_candidate(db_session: AsyncSession) -> User:
    user = User(
        id=uuid.uuid4(),
        email="candidate@test.com",
        hashed_password=hash_password("TestPass123!"),
        full_name="Test Candidate",
        phone="+1234567890",
        role=UserRole.candidate,
        is_active=True,
        is_email_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_hr(db_session: AsyncSession) -> User:
    user = User(
        id=uuid.uuid4(),
        email="hr@test.com",
        hashed_password=hash_password("TestPass123!"),
        full_name="Test HR Manager",
        phone="+1234567890",
        role=UserRole.hr,
        is_active=True,
        is_email_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def test_admin(db_session: AsyncSession) -> User:
    user = User(
        id=uuid.uuid4(),
        email="admin@test.com",
        hashed_password=hash_password("TestPass123!"),
        full_name="Test Administrator",
        phone="+1234567890",
        role=UserRole.admin,
        is_active=True,
        is_email_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def candidate_token(client: AsyncClient, test_candidate: User) -> str:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "candidate@test.com", "password": "TestPass123!"},
    )
    data = response.json()
    return data["access_token"]


@pytest_asyncio.fixture
async def hr_token(client: AsyncClient, test_hr: User) -> str:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "hr@test.com", "password": "TestPass123!"},
    )
    data = response.json()
    return data["access_token"]


@pytest_asyncio.fixture
async def admin_token(client: AsyncClient, test_admin: User) -> str:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.com", "password": "TestPass123!"},
    )
    data = response.json()
    return data["access_token"]


@pytest_asyncio.fixture
def candidate_headers(candidate_token: str) -> dict:
    return {"Authorization": f"Bearer {candidate_token}"}


@pytest_asyncio.fixture
def hr_headers(hr_token: str) -> dict:
    return {"Authorization": f"Bearer {hr_token}"}


@pytest_asyncio.fixture
def admin_headers(admin_token: str) -> dict:
    return {"Authorization": f"Bearer {admin_token}"}


@pytest_asyncio.fixture
def sample_job_data() -> dict:
    return {
        "title": "Senior Software Engineer",
        "description": "We are looking for a senior software engineer to join our team.",
        "department": "Engineering",
        "location": "Bangalore, India",
        "job_type": "full_time",
        "experience_level": "senior",
        "salary_min": 1500000,
        "salary_max": 3000000,
        "currency": "INR",
        "is_active": True,
    }


@pytest_asyncio.fixture
def sample_application_data() -> dict:
    return {
        "cover_letter": "I am excited to apply for this position.",
        "resume_text": "5 years of experience in software development...",
    }


@pytest_asyncio.fixture
def sample_register_data() -> dict:
    return {
        "email": f"newuser_{uuid.uuid4().hex[:8]}@test.com",
        "password": "StrongPass123!",
        "full_name": "New Test User",
        "phone": "+1234567890",
    }
