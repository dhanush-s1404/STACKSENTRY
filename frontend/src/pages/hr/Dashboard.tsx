import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Clock,
  Calendar,
  Send,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getHRDashboardStats } from "@/lib/services/adminService";
import { getApplications } from "@/lib/services/applicationsService";
import { getInterviews } from "@/lib/services/interviewsService";
import type { Application } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  applied: "#3B82F6",
  under_review: "#F59E0B",
  shortlisted: "#8B5CF6",
  interview_scheduled: "#06B6D4",
  interview_completed: "#14B8A6",
  offer_sent: "#F97316",
  hired: "#10B981",
  rejected: "#EF4444",
  withdrawn: "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  applied: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview",
  interview_completed: "Interview Done",
  offer_sent: "Offer Sent",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

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

function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-8 w-8 rounded-full" />
        <div className="space-y-1.5">
          <SkeletonBlock className="h-3.5 w-28" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
      <SkeletonBlock className="h-5 w-16 rounded-full" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-64 flex items-center justify-center">
      <SkeletonBlock className="h-full w-full rounded-xl" />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HRDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["hrDashboardStats"],
    queryFn: getHRDashboardStats,
  });

  const { data: recentAppsData, isLoading: appsLoading } = useQuery({
    queryKey: ["hrRecentApplications"],
    queryFn: () => getApplications({ per_page: 5 }),
  });

  const { data: scheduledInterviews, isLoading: interviewsLoading } = useQuery({
    queryKey: ["hrScheduledInterviews"],
    queryFn: () => getInterviews({ status: "scheduled", per_page: 5 }),
  });

  const { data: allAppsData } = useQuery({
    queryKey: ["hrAllApplications"],
    queryFn: () => getApplications({ per_page: 200 }),
  });

  const pieData = useMemo(() => {
    if (!allAppsData?.items?.length) return [];
    const counts: Record<string, number> = {};
    for (const app of allAppsData.items) {
      counts[app.status] = (counts[app.status] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([status, value]) => ({
        name: STATUS_LABELS[status] || status.replace(/_/g, " "),
        value,
        color: STATUS_COLORS[status] || "#6B7280",
      }))
      .filter((d) => d.value > 0);
  }, [allAppsData]);

  const barData = useMemo(() => {
    if (!allAppsData?.items?.length) return [];
    const monthly: Record<string, { applications: number; hires: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (const app of allAppsData.items) {
      const d = new Date(app.createdAt);
      const key = monthNames[d.getMonth()] + " " + d.getFullYear();
      if (!monthly[key]) monthly[key] = { applications: 0, hires: 0 };
      monthly[key].applications++;
      if (app.status === "hired") monthly[key].hires++;
    }
    const entries = Object.entries(monthly)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => {
        const ai = monthNames.findIndex((m) => a.month.startsWith(m));
        const bi = monthNames.findIndex((m) => b.month.startsWith(m));
        return ai - bi;
      });
    return entries.slice(-6);
  }, [allAppsData]);

  const statCards = [
    { label: "Total Applications", value: stats?.totalApplications ?? 0, icon: Users, color: "bg-blue-500" },
    { label: "Pending Reviews", value: stats?.pendingReviews ?? 0, icon: Clock, color: "bg-amber-500" },
    { label: "Interviews Scheduled", value: stats?.interviewsScheduled ?? 0, icon: Calendar, color: "bg-purple-500" },
    { label: "Offers Sent", value: stats?.offersSent ?? 0, icon: Send, color: "bg-success-500" },
    { label: "Positions Filled", value: stats?.positionsFilled ?? 0, icon: CheckCircle, color: "bg-emerald-500" },
  ];

  const recentApplicants = recentAppsData?.items ?? [];
  const upcomingInterviews = scheduledInterviews?.items ?? [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">HR Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of recruitment pipeline</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statsLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: i * 0.05 }}>
                <StatCardSkeleton />
              </motion.div>
            ))
          : statCards.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: i * 0.05 }}>
                <Card glass hover={false} className="!p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Application Status Distribution</h3>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartSkeleton />
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Monthly Trends</h3>
            {barData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hires" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ChartSkeleton />
            )}
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
          <Card glass hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Recent Applicants</h3>
              <Link to="/hr/applicants" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {appsLoading
                ? Array.from({ length: 5 }).map((_, i) => <ListItemSkeleton key={i} />)
                : recentApplicants.map((app: Application) => {
                    const displayName = app.applicantName ?? app.user?.fullName ?? "Unknown";
                    return (
                      <Link key={app.id} to={`/hr/applicants/${app.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">{displayName[0]}</div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{displayName}</p>
                            <p className="text-xs text-slate-500">{app.jobTitle ?? "Unknown Position"}</p>
                          </div>
                        </div>
                        <Badge status={app.status} />
                      </Link>
                    );
                  })}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
          <Card glass hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Interviews</h3>
              <Link to="/hr/interviews" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {interviewsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-32" />
                        <SkeletonBlock className="h-3 w-48" />
                      </div>
                    </div>
                  ))
                : upcomingInterviews.length === 0
                  ? (
                    <p className="text-sm text-slate-400 text-center py-6">No upcoming interviews</p>
                  )
                  : upcomingInterviews.map((int) => {
                      const date = new Date(int.scheduledAt);
                      const formatted = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }) + ", " + date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      return (
                        <div key={int.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{int.applicantName ?? "Unknown"}</p>
                              <p className="text-xs text-slate-500">{int.jobTitle ?? "Unknown Position"} · {int.interviewType}</p>
                            </div>
                            <span className="text-xs font-medium text-primary-500">{formatted}</span>
                          </div>
                        </div>
                      );
                    })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
