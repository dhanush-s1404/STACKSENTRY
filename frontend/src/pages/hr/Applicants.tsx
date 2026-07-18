import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { getApplications } from "@/lib/services/applicationsService";

const statusFilters = [
  { label: "All", value: "" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under_review" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interview Scheduled", value: "interview_scheduled" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

export default function HRApplicants() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["applications", { page, status: filter, search }],
    queryFn: () =>
      getApplications({ page, per_page: 20, status: filter || undefined, search: search || undefined }),
    placeholderData: (prev) => prev,
  });

  const applicants = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const displayName = (app: (typeof applicants)[0]) =>
    app.applicantName || app.user?.fullName || "Unknown";

  const displayEmail = (app: (typeof applicants)[0]) =>
    app.user?.email || "";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Applicants
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isLoading ? "Loading..." : `${total} applicant${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
          >
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
          >
            Export PDF
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setFilter(s.value);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === s.value
                  ? "bg-primary-500 text-white"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Job
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Tracking
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-2.5 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-white/5">
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Job
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Tracking
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/hr/applicants/${app.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                        {displayName(app)[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white hover:text-primary-500">
                          {displayName(app)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {displayEmail(app)}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {app.jobTitle || app.job?.title || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                    {app.trackingNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {formatDate(app.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500 px-3">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
