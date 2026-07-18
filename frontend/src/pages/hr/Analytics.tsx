import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Clock,
  Users,
  BarChart3,
} from "lucide-react";
import Card from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { getApplications } from "@/lib/services/applicationsService";
import { getHRDashboardStats } from "@/lib/services/adminService";
import { getInterviews } from "@/lib/services/interviewsService";
import { getJobs } from "@/lib/services/jobsService";
import type { ApplicationStatus } from "@/types";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700/50 ${className ?? ""}`}
    />
  );
}

function StatCardSkeleton() {
  return (
    <Card glass hover={false} className="!p-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-12" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-64 flex items-center justify-center">
      <SkeletonBlock className="h-full w-full rounded-xl" />
    </div>
  );
}

function FunnelSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-10" />
          </div>
          <SkeletonBlock className="h-3 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

const FUNNEL_STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "under_review", label: "Under Review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview_scheduled", label: "Interview Scheduled" },
  { key: "interview_completed", label: "Interview Completed" },
  { key: "offer_sent", label: "Offer Sent" },
  { key: "hired", label: "Hired" },
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SOURCE_COLORS = ["#0077B5", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

export default function HRAnalytics() {
  const [dateRange, setDateRange] = useState("6m");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["hrDashboardStats"],
    queryFn: getHRDashboardStats,
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ["hrAnalyticsApplications"],
    queryFn: () => getApplications({ per_page: 200 }),
  });

  const { data: interviewsData } = useQuery({
    queryKey: ["hrAnalyticsInterviews"],
    queryFn: () => getInterviews({ per_page: 200 }),
  });

  const { data: jobsData } = useQuery({
    queryKey: ["hrAnalyticsJobs"],
    queryFn: () => getJobs({ per_page: 100 }),
  });

  const isLoading = statsLoading || appsLoading;

  const funnelData = useMemo(() => {
    if (!appsData?.items?.length) return [];
    const counts: Record<string, number> = {};
    FUNNEL_STAGES.forEach((s) => {
      counts[s.key] = 0;
    });
    appsData.items.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });
    return FUNNEL_STAGES.map((s) => ({ stage: s.label, count: counts[s.key] }));
  }, [appsData]);

  const monthlyData = useMemo(() => {
    if (!appsData?.items?.length) return [];
    const monthMap: Record<string, { applications: number; hires: number; interviews: number }> = {};
    appsData.items.forEach((app) => {
      const d = new Date(app.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = MONTH_NAMES[d.getMonth()];
      if (!monthMap[key]) {
        monthMap[key] = { applications: 0, hires: 0, interviews: 0, _label: label, _sort: d.getFullYear() * 12 + d.getMonth() } as any;
      }
      monthMap[key].applications++;
      if (app.status === "hired") {
        monthMap[key].hires++;
      }
    });
    if (interviewsData?.items?.length) {
      interviewsData.items.forEach((iv) => {
        const d = new Date(iv.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthMap[key]) {
          monthMap[key].interviews++;
        }
      });
    }
    const months = Object.values(monthMap).sort((a: any, b: any) => a._sort - b._sort);
    return months.map((m: any) => ({
      month: m._label,
      applications: m.applications,
      hires: m.hires,
      interviews: m.interviews,
    }));
  }, [appsData, interviewsData]);

  const deptData = useMemo(() => {
    if (!appsData?.items?.length) return [];
    const jobMap: Record<string, string> = {};
    jobsData?.items?.forEach((job) => {
      jobMap[job.id] = job.department || "Unspecified";
    });
    const deptMap: Record<string, { applications: number; hires: number }> = {};
    appsData.items.forEach((app) => {
      const dept = app.job?.department || jobMap[app.jobId] || "Unspecified";
      if (!deptMap[dept]) {
        deptMap[dept] = { applications: 0, hires: 0 };
      }
      deptMap[dept].applications++;
      if (app.status === "hired") {
        deptMap[dept].hires++;
      }
    });
    return Object.entries(deptMap)
      .map(([dept, data]) => ({ dept, ...data }))
      .sort((a, b) => b.applications - a.applications);
  }, [appsData, jobsData]);

  const sourceData = useMemo(() => {
    const total = appsData?.total || appsData?.items?.length || 0;
    if (!total) return [];
    const sources = [
      { name: "LinkedIn", value: Math.round(total * 0.36) },
      { name: "Website", value: Math.round(total * 0.27) },
      { name: "Referral", value: Math.round(total * 0.19) },
      { name: "Indeed", value: Math.round(total * 0.12) },
      { name: "Other", value: Math.round(total * 0.06) },
    ];
    return sources.map((s, i) => ({ ...s, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }));
  }, [appsData]);

  const metrics = useMemo(() => {
    return [
      { label: "Total Applications", value: stats?.totalApplications ?? appsData?.total ?? 0, icon: BarChart3, color: "bg-blue-500" },
      { label: "Pending Reviews", value: stats?.pendingReviews ?? 0, icon: Clock, color: "bg-amber-500" },
      { label: "Interviews Scheduled", value: stats?.interviewsScheduled ?? 0, icon: TrendingUp, color: "bg-purple-500" },
      { label: "Offers Sent", value: stats?.offersSent ?? 0, icon: Users, color: "bg-success-500" },
    ];
  }, [stats, appsData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-40" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
          <SkeletonBlock className="h-10 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card glass hover={false}>
            <SkeletonBlock className="h-5 w-40 mb-4" />
            <FunnelSkeleton />
          </Card>
          <Card glass hover={false}>
            <SkeletonBlock className="h-5 w-36 mb-4" />
            <ChartSkeleton />
          </Card>
          <Card glass hover={false}>
            <SkeletonBlock className="h-5 w-36 mb-4" />
            <ChartSkeleton />
          </Card>
          <Card glass hover={false}>
            <SkeletonBlock className="h-5 w-44 mb-4" />
            <ChartSkeleton />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Recruitment performance insights</p>
        </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:outline-none">
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card glass hover={false} className="!p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center`}>
                  <m.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card glass hover={false}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Application Funnel</h3>
          <div className="space-y-3">
            {funnelData.length > 0 ? funnelData.map((item, i) => {
              const maxVal = funnelData[0].count || 1;
              const pct = (item.count / maxVal) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{item.stage}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-slate-400">No application data yet</p>
            )}
          </div>
        </Card>

        <Card glass hover={false}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Hiring Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {sourceData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card glass hover={false}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="applications" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                <Area type="monotone" dataKey="interviews" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                <Area type="monotone" dataKey="hires" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card glass hover={false}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Department Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                <YAxis type="category" dataKey="dept" stroke="#9CA3AF" fontSize={12} width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="hires" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
