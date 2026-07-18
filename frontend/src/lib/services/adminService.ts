import api from "@/lib/api";

export interface DashboardStats {
  totalApplications: number;
  pendingReviews: number;
  interviewsScheduled: number;
  offersSent: number;
  positionsFilled: number;
  totalJobs: number;
  totalUsers: number;
}

export interface AnalyticsData {
  funnel: { stage: string; count: number }[];
  monthlyTrends: { month: string; applications: number; hires: number; interviews: number }[];
  sourceDistribution: { name: string; value: number }[];
  departmentBreakdown: { dept: string; applications: number; hires: number }[];
}

export async function getHRDashboardStats() {
  const res = await api.get<DashboardStats>("/admin/dashboard");
  return res.data;
}

export async function getAnalytics(params?: { date_range?: string }) {
  const res = await api.get<AnalyticsData>("/admin/analytics", { params });
  return res.data;
}
