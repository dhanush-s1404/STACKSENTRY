import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  Bell,
  User,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { getApplications } from "@/lib/services/applicationsService";
import { getInterviews } from "@/lib/services/interviewsService";
import { getNotifications } from "@/lib/services/notificationsService";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} glass hover={false} className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="space-y-2">
                <div className="h-7 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card glass hover={false}>
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse mb-3" />
          ))}
        </Card>
        <Card glass hover={false}>
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse mb-3" />
          ))}
        </Card>
      </div>
    </div>
  );
}

export default function CandidateDashboard() {
  const { user } = useAuth();

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: () => getApplications({ per_page: 100 }),
  });

  const { data: interviewsData, isLoading: interviewsLoading } = useQuery({
    queryKey: ["interviews", "scheduled"],
    queryFn: () => getInterviews({ status: "scheduled", per_page: 50 }),
  });

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ per_page: 100 }),
  });

  const isLoading = appsLoading || interviewsLoading || notificationsLoading;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const totalApplications = applicationsData?.total ?? 0;
  const upcomingInterviews = interviewsData?.items ?? [];
  const notifications = notificationsData?.items ?? [];
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  const recentApplications = (applicationsData?.items ?? []).slice(0, 5);

  const stats = [
    { label: "Applications", value: totalApplications, icon: FileText, color: "bg-blue-500" },
    { label: "Interviews", value: upcomingInterviews.length, icon: Calendar, color: "bg-purple-500" },
    { label: "Notifications", value: unreadNotifications, icon: Bell, color: "bg-amber-500" },
    { label: "Profile", value: "85%", icon: User, color: "bg-success-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.fullName?.split(" ")[0] || "Candidate"}!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your applications
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: i * 0.1 }}>
            <Card glass hover={false} className="!p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card glass hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Recent Applications</h3>
              <Link to="/candidate/applications" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No applications yet. Browse jobs to get started!</p>
              ) : (
                recentApplications.map((app) => (
                  <Link key={app.id} to={`/candidate/applications/${app.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{app.jobTitle || "Untitled Position"}</p>
                      <p className="text-xs text-slate-500">{app.trackingNumber}</p>
                    </div>
                    <Badge status={app.status} />
                  </Link>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card glass hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Interviews</h3>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-3">
              {upcomingInterviews.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No upcoming interviews scheduled.</p>
              ) : (
                upcomingInterviews.map((interview) => {
                  const interviewDate = new Date(interview.scheduledAt);
                  const dateStr = interviewDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  const timeStr = interviewDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                  return (
                    <div key={interview.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{interview.jobTitle || "Untitled Position"}</p>
                          <p className="text-xs text-slate-500">{interview.interviewType} - {interview.applicantName || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary-500">{dateStr}</p>
                          <p className="text-xs text-slate-500">{timeStr}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
        <Card glass hover={false}>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Browse Jobs", href: "/careers", icon: TrendingUp },
              { label: "Update Profile", href: "/candidate/profile", icon: User },
              { label: "My Applications", href: "/candidate/applications", icon: FileText },
              { label: "Notifications", href: "/candidate/notifications", icon: Bell },
            ].map((action, i) => (
              <Link key={i} to={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all text-center">
                <action.icon className="h-6 w-6 text-primary-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
