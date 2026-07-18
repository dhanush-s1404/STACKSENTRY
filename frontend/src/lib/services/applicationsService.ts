import api from "@/lib/api";
import type { Application } from "@/types";

export interface PaginatedApplications {
  items: Application[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export async function getApplications(params?: { status?: string; search?: string; page?: number; per_page?: number }) {
  const res = await api.get<PaginatedApplications>("/applications", { params });
  return res.data;
}

export async function getApplication(id: string) {
  const res = await api.get<Application>(`/applications/${id}`);
  return res.data;
}

export async function createApplication(data: {
  job_id: string;
  cover_letter?: string;
  expected_salary?: string;
  preferred_work_mode?: string;
}) {
  const res = await api.post<Application>("/applications", data);
  return res.data;
}

export async function uploadApplicationResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<{ id: string; filename: string }>("/files/upload?upload_type=resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateApplicationStatus(id: string, data: { status: string; notes?: string }) {
  const res = await api.put<Application>(`/applications/${id}/status`, data);
  return res.data;
}
