import uuid

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestJobCRUD:
    async def test_create_job_hr(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        assert response.status_code in (200, 201)
        data = response.json()
        assert data["title"] == sample_job_data["title"]
        assert data["department"] == sample_job_data["department"]
        assert "id" in data

    async def test_create_job_candidate_forbidden(
        self, client: AsyncClient, candidate_headers: dict, sample_job_data: dict
    ):
        response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=candidate_headers,
        )
        assert response.status_code in (403, 401)

    async def test_create_job_unauthenticated(
        self, client: AsyncClient, sample_job_data: dict
    ):
        response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
        )
        assert response.status_code in (401, 403)

    async def test_list_jobs(self, client: AsyncClient):
        response = await client.get("/api/v1/jobs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))

    async def test_get_job_by_id(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.get(f"/api/v1/jobs/{job_id}")
                assert response.status_code == 200
                data = response.json()
                assert data["title"] == sample_job_data["title"]

    async def test_get_nonexistent_job(self, client: AsyncClient):
        fake_id = str(uuid.uuid4())
        response = await client.get(f"/api/v1/jobs/{fake_id}")
        assert response.status_code == 404

    async def test_update_job(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                updated_data = {**sample_job_data, "title": "Updated Job Title"}
                response = await client.put(
                    f"/api/v1/jobs/{job_id}",
                    json=updated_data,
                    headers=hr_headers,
                )
                assert response.status_code == 200
                assert response.json()["title"] == "Updated Job Title"

    async def test_delete_job(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.delete(
                    f"/api/v1/jobs/{job_id}",
                    headers=hr_headers,
                )
                assert response.status_code in (200, 204)

                get_response = await client.get(f"/api/v1/jobs/{job_id}")
                assert get_response.status_code == 404

    async def test_update_job_candidate_forbidden(
        self, client: AsyncClient, hr_headers: dict, candidate_headers: dict, sample_job_data: dict
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                updated_data = {**sample_job_data, "title": "Hacked Title"}
                response = await client.put(
                    f"/api/v1/jobs/{job_id}",
                    json=updated_data,
                    headers=candidate_headers,
                )
                assert response.status_code in (403, 401)


@pytest.mark.asyncio
class TestJobSearch:
    async def test_search_jobs_by_title(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )

        response = await client.get("/api/v1/jobs", params={"search": "Senior"})
        assert response.status_code == 200

    async def test_filter_jobs_by_department(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )

        response = await client.get(
            "/api/v1/jobs", params={"department": "Engineering"}
        )
        assert response.status_code == 200

    async def test_filter_jobs_by_location(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )

        response = await client.get(
            "/api/v1/jobs", params={"location": "Bangalore"}
        )
        assert response.status_code == 200

    async def test_filter_jobs_by_type(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )

        response = await client.get(
            "/api/v1/jobs", params={"job_type": "full_time"}
        )
        assert response.status_code == 200

    async def test_filter_jobs_by_experience(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )

        response = await client.get(
            "/api/v1/jobs", params={"experience_level": "senior"}
        )
        assert response.status_code == 200

    async def test_combined_filters(self, client: AsyncClient, hr_headers: dict, sample_job_data: dict):
        await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )

        response = await client.get(
            "/api/v1/jobs",
            params={
                "search": "Engineer",
                "department": "Engineering",
                "location": "Bangalore",
                "job_type": "full_time",
            },
        )
        assert response.status_code == 200


@pytest.mark.asyncio
class TestJobPermissions:
    async def test_admin_can_manage_all_jobs(
        self, client: AsyncClient, admin_headers: dict, sample_job_data: dict
    ):
        response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=admin_headers,
        )
        assert response.status_code in (200, 201)

    async def test_candidate_cannot_delete_job(
        self, client: AsyncClient, hr_headers: dict, candidate_headers: dict, sample_job_data: dict
    ):
        create_response = await client.post(
            "/api/v1/jobs",
            json=sample_job_data,
            headers=hr_headers,
        )
        if create_response.status_code in (200, 201):
            job_id = create_response.json().get("id")
            if job_id:
                response = await client.delete(
                    f"/api/v1/jobs/{job_id}",
                    headers=candidate_headers,
                )
                assert response.status_code in (403, 401)
