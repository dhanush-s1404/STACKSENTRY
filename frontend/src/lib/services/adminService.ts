import api from "@/lib/api";

export interface AdminDashboardResponse {
  users: {
    total: number;
    candidates: number;
    hr: number;
    admins: number;
    active: number;
  };
  applications: {
    total_applications: number;
    status_counts: Record<string, number>;
    active_jobs: number;
    recent_applications: number;
  };
  jobs: {
    total_jobs: number;
    active_jobs: number;
    inactive_jobs: number;
    job_type_counts: Record<string, number>;
  };
  interviews: {
    total: number;
  };
}

export interface AdminAnalyticsResponse {
  total_applications: number;
  total_jobs: number;
  total_users: number;
  status_breakdown: Record<string, number>;
  conversion_rate: number;
}

export async function getHRDashboardStats() {
  const res = await api.get<AdminDashboardResponse>("/admin/dashboard");
  return res.data;
}

export async function getAnalytics(params?: { date_range?: string }) {
  const res = await api.get<AdminAnalyticsResponse>("/admin/analytics", { params });
  return res.data;
}
