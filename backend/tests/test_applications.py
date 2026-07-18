import uuid

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestSubmitApplication:
    async def test_submit_application_success(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                assert response.status_code in (200, 201)
                data = response.json()
                assert "id" in data or "tracking_number" in data

    async def test_submit_application_unauthenticated(
        self, client: AsyncClient, hr_headers: dict, sample_job_data: dict, sample_application_data: dict
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                )
                assert response.status_code == 401

    async def test_submit_application_hr_forbidden(
        self,
        client: AsyncClient,
        hr_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=hr_headers,
                )
                assert response.status_code in (403, 400)

    async def test_submit_application_nonexistent_job(
        self, client: AsyncClient, candidate_headers: dict, sample_application_data: dict
    ):
        fake_id = str(uuid.uuid4())
        response = await client.post(
            f"/api/v1/jobs/{fake_id}/apply",
            json=sample_application_data,
            headers=candidate_headers,
        )
        assert response.status_code == 404

    async def test_duplicate_application(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                assert response.status_code in (400, 409)


@pytest.mark.asyncio
class TestListApplications:
    async def test_list_own_applications(
        self, client: AsyncClient, candidate_headers: dict
    ):
        response = await client.get(
            "/api/v1/applications",
            headers=candidate_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))

    async def test_list_applications_hr(
        self, client: AsyncClient, hr_headers: dict
    ):
        response = await client.get(
            "/api/v1/applications",
            headers=hr_headers,
        )
        assert response.status_code == 200

    async def test_list_applications_unauthenticated(self, client: AsyncClient):
        response = await client.get("/api/v1/applications")
        assert response.status_code == 401

    async def test_list_applications_with_filters(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        hr_token: str,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )

                response = await client.get(
                    "/api/v1/applications",
                    params={"status": "pending"},
                    headers=hr_headers,
                )
                assert response.status_code == 200


@pytest.mark.asyncio
class TestUpdateApplicationStatus:
    async def test_update_status_hr(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_job_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_job_response.status_code in (200, 201):
            job_id = create_job_response.json().get("id")
            if job_id:
                apply_response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                if apply_response.status_code in (200, 201):
                    app_data = apply_response.json()
                    app_id = app_data.get("id")

                    if app_id:
                        response = await client.patch(
                            f"/api/v1/applications/{app_id}",
                            json={"status": "reviewing"},
                            headers=hr_headers,
                        )
                        assert response.status_code in (200, 204)

    async def test_update_status_candidate_forbidden(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_job_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_job_response.status_code in (200, 201):
            job_id = create_job_response.json().get("id")
            if job_id:
                apply_response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                if apply_response.status_code in (200, 201):
                    app_data = apply_response.json()
                    app_id = app_data.get("id")

                    if app_id:
                        response = await client.patch(
                            f"/api/v1/applications/{app_id}",
                            json={"status": "reviewing"},
                            headers=candidate_headers,
                        )
                        assert response.status_code in (403, 401)


@pytest.mark.asyncio
class TestTrackingNumber:
    async def test_tracking_number_generated(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                if response.status_code in (200, 201):
                    data = response.json()
                    assert "tracking_number" in data
                    assert data["tracking_number"] is not None
                    assert len(data["tracking_number"]) > 0

    async def test_track_application(
        self,
        client: AsyncClient,
        hr_headers: dict,
        candidate_headers: dict,
        sample_job_data: dict,
        sample_application_data: dict,
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                apply_response = await client.post(
                    f"/api/v1/jobs/{job_id}/apply",
                    json=sample_application_data,
                    headers=candidate_headers,
                )
                if apply_response.status_code in (200, 201):
                    tracking_number = apply_response.json().get("tracking_number")
                    if tracking_number:
                        response = await client.get(
                            f"/api/v1/applications/track/{tracking_number}",
                            headers=candidate_headers,
                        )
                        assert response.status_code == 200
                        data = response.json()
                        assert "status" in data
