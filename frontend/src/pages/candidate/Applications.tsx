import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { getApplications } from "@/lib/services/applicationsService";
import type { ApplicationStatus } from "@/types";

const statusFilters = ["All", "Submitted", "Under Review", "Interview Scheduled", "Hired", "Rejected"];

const filterToStatus: Record<string, string | undefined> = {
  All: undefined,
  Submitted: "submitted",
  "Under Review": "under_review",
  "Interview Scheduled": "interview_scheduled",
  Hired: "hired",
  Rejected: "rejected",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CandidateApplications() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const statusParam = filterToStatus[filter];

  const { data, isLoading } = useQuery({
    queryKey: ["applications", statusParam],
    queryFn: () => getApplications({ page: 1, per_page: 100, status: statusParam }),
  });

  const allItems = data?.items ?? [];

  const filtered = allItems.filter((app) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const title = (app.jobTitle ?? app.job?.title ?? "").toLowerCase();
    const tn = app.trackingNumber.toLowerCase();
    return title.includes(q) || tn.includes(q);
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Applications</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your job applications</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title or tracking number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === s
                  ? "bg-primary-500 text-white"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No applications found" description="Try adjusting your search or filters" />
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/candidate/applications/${app.id}`}>
                <Card glass className="group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                          {app.jobTitle ?? app.job?.title ?? "Untitled Position"}
                        </h3>
                        <Badge status={app.status} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{app.job?.department ?? ""}</span>
                        <span>{app.job?.location ?? ""}</span>
                        <span>{app.trackingNumber}</span>
                        <span>Applied {formatDate(app.createdAt)}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
