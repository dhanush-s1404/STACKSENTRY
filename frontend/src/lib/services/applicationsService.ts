import api from "@/lib/api";
import type { Application } from "@/types";

export interface PaginatedApplications {
  items: Application[];
  total: number;
  page: number;
  per_page: number;
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

export async function createApplication(data: FormData) {
  const res = await api.post<Application>("/applications", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateApplicationStatus(id: string, data: { status: string; notes?: string }) {
  const res = await api.put<Application>(`/applications/${id}/status`, data);
  return res.data;
}
