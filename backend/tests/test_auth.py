import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestRegister:
    async def test_register_success(self, client: AsyncClient, sample_register_data: dict):
        response = await client.post("/api/v1/auth/register", json=sample_register_data)
        assert response.status_code in (200, 201)
        data = response.json()
        assert "id" in data
        assert data["email"] == sample_register_data["email"]
        assert data["full_name"] == sample_register_data["full_name"]
        assert data["role"] == "candidate"
        assert "hashed_password" not in data

    async def test_register_duplicate_email(
        self, client: AsyncClient, test_candidate, sample_register_data
    ):
        sample_register_data["email"] = test_candidate.email
        response = await client.post("/api/v1/auth/register", json=sample_register_data)
        assert response.status_code in (400, 409)

    async def test_register_invalid_email(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "not-an-email",
                "password": "StrongPass123!",
                "full_name": "Test User",
            },
        )
        assert response.status_code == 422

    async def test_register_weak_password(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@test.com",
                "password": "123",
                "full_name": "Test User",
            },
        )
        assert response.status_code == 422

    async def test_register_missing_fields(self, client: AsyncClient):
        response = await client.post("/api/v1/auth/register", json={})
        assert response.status_code == 422


@pytest.mark.asyncio
class TestLogin:
    async def test_login_success(self, client: AsyncClient, test_candidate):
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "candidate@test.com", "password": "TestPass123!"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_wrong_password(self, client: AsyncClient, test_candidate):
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "candidate@test.com", "password": "WrongPassword123!"},
        )
        assert response.status_code == 401

    async def test_login_nonexistent_user(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "nonexistent@test.com", "password": "SomePass123!"},
        )
        assert response.status_code in (401, 404)

    async def test_login_inactive_user(self, client: AsyncClient, db_session, test_candidate):
        test_candidate.is_active = False
        db_session.add(test_candidate)
        await db_session.commit()

        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "candidate@test.com", "password": "TestPass123!"},
        )
        assert response.status_code == 403


@pytest.mark.asyncio
class TestTokenRefresh:
    async def test_refresh_token_success(self, client: AsyncClient, test_candidate):
        login_response = await client.post(
            "/api/v1/auth/login",
            json={"email": "candidate@test.com", "password": "TestPass123!"},
        )
        refresh_token = login_response.json()["refresh_token"]

        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

    async def test_refresh_token_invalid(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid.token.here"},
        )
        assert response.status_code == 401

    async def test_refresh_token_empty(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": ""},
        )
        assert response.status_code in (400, 401, 422)


@pytest.mark.asyncio
class TestEmailVerification:
    async def test_verify_email_success(self, client: AsyncClient, db_session):
        from app.models.user import User, UserRole
        import uuid

        user = User(
            id=uuid.uuid4(),
            email=f"verify_{uuid.uuid4().hex[:8]}@test.com",
            hashed_password="hashed_password",
            full_name="Verify Test",
            role=UserRole.candidate,
            is_active=True,
            is_email_verified=False,
            email_verification_token="valid-token-123",
        )
        db_session.add(user)
        await db_session.commit()

        response = await client.get(
            f"/api/v1/auth/verify-email?token=valid-token-123"
        )
        assert response.status_code in (200, 204)

    async def test_verify_email_invalid_token(self, client: AsyncClient):
        response = await client.get(
            "/api/v1/auth/verify-email?token=invalid-token"
        )
        assert response.status_code in (400, 404)


@pytest.mark.asyncio
class TestPasswordReset:
    async def test_request_password_reset(self, client: AsyncClient, test_candidate):
        response = await client.post(
            "/api/v1/auth/forgot-password",
            json={"email": "candidate@test.com"},
        )
        assert response.status_code in (200, 204)

    async def test_request_password_reset_nonexistent_email(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/forgot-password",
            json={"email": "nonexistent@test.com"},
        )
        assert response.status_code in (200, 204)

    async def test_reset_password_invalid_token(self, client: AsyncClient):
        response = await client.post(
            "/api/v1/auth/reset-password",
            json={"token": "invalid-token", "password": "NewPass123!"},
        )
        assert response.status_code in (400, 404)

    async def test_reset_password_success(self, client: AsyncClient, db_session):
        from app.models.user import User, UserRole
        import uuid
        from datetime import datetime, timedelta, timezone

        user = User(
            id=uuid.uuid4(),
            email=f"reset_{uuid.uuid4().hex[:8]}@test.com",
            hashed_password="hashed_password",
            full_name="Reset Test",
            role=UserRole.candidate,
            is_active=True,
            is_email_verified=True,
            password_reset_token="valid-reset-token",
            password_reset_expires=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        db_session.add(user)
        await db_session.commit()

        response = await client.post(
            "/api/v1/auth/reset-password",
            json={"token": "valid-reset-token", "password": "NewStrongPass123!"},
        )
        assert response.status_code in (200, 204)
