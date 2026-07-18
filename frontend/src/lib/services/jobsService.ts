import api from "@/lib/api";
import type { Job } from "@/types";

export interface PaginatedJobs {
  items: Job[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface JobFilters {
  search?: string;
  department?: string;
  job_type?: string;
  experience_level?: string;
  location?: string;
  is_remote?: boolean;
  page?: number;
  per_page?: number;
}

export async function getJobs(params?: JobFilters) {
  const res = await api.get<PaginatedJobs>("/jobs/", {
    params,
  });

  return res.data;
}

export async function getJob(id: string) {
  const res = await api.get<Job>(`/jobs/${id}`);

  return res.data;
}

export async function createJob(data: Partial<Job>) {
  const res = await api.post<Job>("/jobs/", data);

  return res.data;
}

export async function updateJob(id: string, data: Partial<Job>) {
  const res = await api.put<Job>(`/jobs/${id}`, data);

  return res.data;
}

export async function deleteJob(id: string) {
  await api.delete(`/jobs/${id}`);
}