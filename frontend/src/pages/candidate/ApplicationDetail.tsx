import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  FileText,
  Calendar,
  MessageSquare,
  Copy,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate, formatDateTime, getStatusLabel } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { getApplication } from "@/lib/services/applicationsService";
import { getInterviews } from "@/lib/services/interviewsService";
import type { ApplicationStatus } from "@/types";

const timelineSteps: { status: ApplicationStatus; label: string }[] = [
  { status: "applied", label: "Application Submitted" },
  { status: "under_review", label: "Under Review" },
  { status: "shortlisted", label: "Shortlisted" },
  { status: "interview_scheduled", label: "Interview Scheduled" },
  { status: "interview_completed", label: "Interview Completed" },
  { status: "offer_sent", label: "Offer Sent" },
  { status: "hired", label: "Hired" },
];

function DetailSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-4">
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
            <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card glass hover={false}>
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 mb-4">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </Card>
          <Card glass hover={false}>
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse mb-3" />
            ))}
          </Card>
        </div>
        <div className="space-y-6">
          <Card glass hover={false}>
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/candidate/applications" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </Link>
        <Card glass hover={false} className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Application Not Found</h3>
          <p className="text-sm text-slate-500">This application may have been removed or you don't have access.</p>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CandidateApplicationDetail() {
  const { id } = useParams();

  const { data: app, isLoading, isError } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id!),
    enabled: !!id,
  });

  const { data: interviewsData } = useQuery({
    queryKey: ["interviews", "application", id],
    queryFn: () => getInterviews({ per_page: 50 }),
    enabled: !!id,
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError || !app) return <NotFoundState />;

  const applicationInterviews = (interviewsData?.items ?? []).filter(
    (iv) => iv.applicationId === id
  );
  const interview = applicationInterviews.length > 0 ? applicationInterviews[0] : null;

  const currentIdx = timelineSteps.findIndex((s) => s.status === app.status);
  const hasReachedRejected = app.status === "rejected";
  const hasReachedWithdrawn = app.status === "withdrawn";

  const department = app.job?.department ?? "";
  const location = app.job?.location ?? "";

  const notes: { date: string; text: string; by: string }[] = [];
  if (app.hrNotes) {
    notes.push({ date: app.updatedAt, text: app.hrNotes, by: "HR Team" });
  }
  notes.push({ date: app.createdAt, text: "Application received. We'll review it shortly.", by: "System" });

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/candidate/applications" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {app.jobTitle ?? app.job?.title ?? "Untitled Position"}
            </h2>
            <p className="text-slate-500">
              {department && `${department} · `}{location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge status={app.status} size="md" />
            <button
              onClick={() => { navigator.clipboard.writeText(app.trackingNumber); showToast.success("Tracking number copied!"); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <Copy className="h-3 w-3" /> {app.trackingNumber}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Application Timeline</h3>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => {
                const isCompleted = currentIdx >= 0 && i < currentIdx;
                const isCurrent = i === currentIdx;
                const isRejectedPath = hasReachedRejected && !isCompleted && !isCurrent;
                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-success-500" />
                      ) : isCurrent ? (
                        <Clock className="h-5 w-5 text-primary-500 animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 dark:text-slate-700" />
                      )}
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${isCompleted ? "bg-success-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${isCurrent ? "text-primary-500" : isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(hasReachedRejected || hasReachedWithdrawn) && (
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <Circle className="h-5 w-5 text-danger-500" />
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-danger-500">
                      {getStatusLabel(app.status)}
                    </p>
                    {app.rejectionReason && (
                      <p className="text-xs text-slate-500 mt-1">{app.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Cover Letter */}
          {app.coverLetter && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Cover Letter
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {app.coverLetter}
              </p>
            </Card>
          )}

          {/* Notes */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Notes from HR
            </h3>
            <div className="space-y-4">
              {notes.map((note, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{note.text}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span>{note.by}</span>
                    <span>·</span>
                    <span>{formatDateTime(note.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Details */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Applied</span><span className="text-slate-900 dark:text-white">{formatDate(app.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Updated</span><span className="text-slate-900 dark:text-white">{formatDate(app.updatedAt)}</span></div>
              {app.resumeScore != null && (
                <div className="flex justify-between"><span className="text-slate-500">Resume Score</span><span className="text-primary-500 font-medium">{app.resumeScore}%</span></div>
              )}
              {app.expectedSalary && (
                <div className="flex justify-between"><span className="text-slate-500">Expected Salary</span><span className="text-slate-900 dark:text-white">{app.expectedSalary}</span></div>
              )}
              {app.preferredWorkMode && (
                <div className="flex justify-between"><span className="text-slate-500">Work Mode</span><span className="text-slate-900 dark:text-white capitalize">{app.preferredWorkMode}</span></div>
              )}
            </div>
          </Card>

          {/* Job Info */}
          {app.job && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Job Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Position</span><span className="text-slate-900 dark:text-white">{app.job.title}</span></div>
                {app.job.department && (
                  <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="text-slate-900 dark:text-white">{app.job.department}</span></div>
                )}
                <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="text-slate-900 dark:text-white capitalize">{app.job.jobType.replace(/_/g, " ")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-slate-900 dark:text-white">{app.job.location}</span></div>
                {app.job.salaryMin && app.job.salaryMax && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Salary</span>
                    <span className="text-slate-900 dark:text-white">
                      {app.job.salaryCurrency} {app.job.salaryMin.toLocaleString()} - {app.job.salaryMax.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Interview */}
          {interview && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-500" /> Interview Details
              </h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-500 block">Type</span><span className="text-slate-900 dark:text-white">{interview.interviewType}</span></div>
                <div><span className="text-slate-500 block">Date & Time</span><span className="text-slate-900 dark:text-white">{formatDateTime(interview.scheduledAt)}</span></div>
                <div><span className="text-slate-500 block">Duration</span><span className="text-slate-900 dark:text-white">{interview.durationMinutes} min</span></div>
                {(interview.meetingLink || interview.location) && (
                  <div><span className="text-slate-500 block">Location</span><span className="text-slate-900 dark:text-white">{interview.meetingLink || interview.location}</span></div>
                )}
                <div><span className="text-slate-500 block">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    interview.status === "completed" ? "bg-success-50 text-success-600" :
                    interview.status === "cancelled" ? "bg-danger-50 text-danger-600" :
                    "bg-primary-50 text-primary-600"
                  }`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1).replace(/_/g, " ")}
                  </span>
                </div>
                {interview.notes && <p className="text-xs text-slate-500 italic mt-2">{interview.notes}</p>}
                {interview.feedback && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Feedback</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{interview.feedback}</p>
                  </div>
                )}
                {interview.rating != null && (
                  <div><span className="text-slate-500">Rating</span><span className="ml-2 text-amber-500 font-medium">{"★".repeat(interview.rating)}{"☆".repeat(5 - interview.rating)}</span></div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
