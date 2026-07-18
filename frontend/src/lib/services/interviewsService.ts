import api from "@/lib/api";
import type { Interview } from "@/types";

export interface PaginatedInterviews {
  items: Interview[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export async function getInterviews(params?: { status?: string; page?: number; per_page?: number }) {
  const res = await api.get<PaginatedInterviews>("/interviews", { params });
  return res.data;
}

export async function getInterview(id: string) {
  const res = await api.get<Interview>(`/interviews/${id}`);
  return res.data;
}

export async function createInterview(data: {
  application_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  interview_type?: string;
  location?: string;
  notes?: string;
}) {
  const res = await api.post<Interview>("/interviews", data);
  return res.data;
}

export async function updateInterview(id: string, data: Partial<Interview>) {
  const res = await api.put<Interview>(`/interviews/${id}`, data);
  return res.data;
}

export async function completeInterview(id: string, data: { notes?: string; rating?: number; feedback?: string }) {
  const res = await api.put<Interview>(`/interviews/${id}/complete`, data);
  return res.data;
}

export async function cancelInterview(id: string) {
  await api.delete(`/interviews/${id}`);
}
