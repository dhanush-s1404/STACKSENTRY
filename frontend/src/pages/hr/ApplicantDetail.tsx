import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Download,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate, getStatusLabel } from "@/lib/utils";
import type { ApplicationStatus, User } from "@/types";
import { showToast } from "@/components/ui/Toast";
import { getApplication, updateApplicationStatus } from "@/lib/services/applicationsService";
import {
  getInterviews,
  createInterview,
} from "@/lib/services/interviewsService";

function LinksSection({ user }: { user?: User }) {
  if (!user) return null;
  const extra = user as unknown as Record<string, string>;
  const githubUrl = extra.githubUrl || extra.github;
  const linkedinUrl = extra.linkedinUrl || extra.linkedin;
  if (!githubUrl && !linkedinUrl) return null;
  return (
    <Card glass hover={false}>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
        Links
      </h3>
      <div className="space-y-2 text-sm">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-500"
          >
            <FileText className="h-4 w-4" /> GitHub
          </a>
        )}
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-500"
          >
            <FileText className="h-4 w-4" /> LinkedIn
          </a>
        )}
      </div>
    </Card>
  );
}

export default function HRApplicantDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleType, setScheduleType] = useState("video");

  const { data: app, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id!),
    enabled: !!id,
  });

  const { data: interviewsData } = useQuery({
    queryKey: ["interviews", id],
    queryFn: () => getInterviews({ per_page: 50 }),
    enabled: !!id,
  });

  const interviews = interviewsData?.items.filter(
    (iv) => iv.applicationId === id
  ) ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ status, notes }: { status: string; notes?: string }) =>
      updateApplicationStatus(id!, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      showToast.success("Status updated!");
    },
    onError: () => {
      showToast.error("Failed to update status");
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: () =>
      createInterview({
        application_id: id!,
        scheduled_at: new Date(scheduleDate).toISOString(),
        interview_type: scheduleType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", id] });
      setShowScheduleModal(false);
      setScheduleDate("");
      setScheduleType("video");
      showToast.success("Interview scheduled!");
    },
    onError: () => {
      showToast.error("Failed to schedule interview");
    },
  });

  const noteMutation = useMutation({
    mutationFn: () =>
      updateApplicationStatus(id!, {
        status: app!.status,
        notes: note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      setShowNoteModal(false);
      setNote("");
      showToast.success("Note added!");
    },
    onError: () => {
      showToast.error("Failed to add note");
    },
  });

  const handleStatusUpdate = (newStatus: string) => {
    statusMutation.mutate({ status: newStatus });
  };

  if (isLoading) {
    return <PageSpinner />;
  }

  if (!app) {
    return (
      <div className="space-y-6 max-w-5xl">
        <Link
          to="/hr/applicants"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Applicants
        </Link>
        <Card glass hover={false}>
          <p className="text-center text-slate-500 py-8">
            Application not found.
          </p>
        </Card>
      </div>
    );
  }

  const userName = app.user?.fullName || app.applicantName || "Unknown";
  const userEmail = app.user?.email || "";
  const userPhone = app.user?.phone || "";
  const jobTitle = app.jobTitle || app.job?.title || "";
  const department = app.job?.department || "";

  const profileExtra = (app.user as unknown as Record<string, unknown>) || {};
  const educationItems = Array.isArray(profileExtra.education) ? profileExtra.education : [];
  const skillItems = Array.isArray(profileExtra.skills) ? profileExtra.skills : [];
  const experienceItems = Array.isArray(profileExtra.experience) ? profileExtra.experience : [];

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/hr/applicants"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-500 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Applicants
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
              {userName[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {userName}
              </h2>
              <p className="text-slate-500">
                {jobTitle}
                {department ? ` · ${department}` : ""}
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                {userEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {userEmail}
                  </span>
                )}
                {userPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {userPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Badge status={app.status} size="md" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleStatusUpdate("shortlisted")}
          icon={<CheckCircle className="h-4 w-4" />}
          disabled={statusMutation.isPending}
        >
          Shortlist
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowScheduleModal(true)}
          icon={<Calendar className="h-4 w-4" />}
        >
          Schedule Interview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNoteModal(true)}
          icon={<MessageSquare className="h-4 w-4" />}
        >
          Add Note
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<Mail className="h-4 w-4" />}
        >
          Email
        </Button>
        {(app as unknown as Record<string, string>).resumeUrl && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={() => window.open((app as unknown as Record<string, string>).resumeUrl, "_blank")}
          >
            Download Resume
          </Button>
        )}
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleStatusUpdate("rejected")}
          icon={<XCircle className="h-4 w-4" />}
          disabled={statusMutation.isPending}
        >
          Reject
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Letter */}
          {app.coverLetter && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-500" /> Cover Letter
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {app.coverLetter}
              </p>
            </Card>
          )}

          {/* Personal Information */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block">Full Name</span>
                <span className="text-slate-900 dark:text-white">
                  {userName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Email</span>
                <span className="text-slate-900 dark:text-white">
                  {userEmail}
                </span>
              </div>
              {userPhone && (
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="text-slate-900 dark:text-white">
                    {userPhone}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block">Applied On</span>
                <span className="text-slate-900 dark:text-white">
                  {formatDate(app.createdAt)}
                </span>
              </div>
              {app.expectedSalary && (
                <div>
                  <span className="text-slate-500 block">Expected Salary</span>
                  <span className="text-slate-900 dark:text-white">
                    {app.expectedSalary}
                  </span>
                </div>
              )}
              {app.preferredWorkMode && (
                <div>
                  <span className="text-slate-500 block">Work Mode</span>
                  <span className="text-slate-900 dark:text-white">
                    {app.preferredWorkMode}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Education */}
          {educationItems.length > 0 && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary-500" />{" "}
                Education
              </h3>
              {educationItems.map(
                (
                  edu: {
                    institution?: string;
                    degree?: string;
                    fieldOfStudy?: string;
                    cgpa?: number;
                    graduationYear?: number;
                  },
                  i: number
                ) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 mb-2"
                  >
                    <p className="font-medium text-slate-900 dark:text-white">
                      {edu.institution || "—"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {edu.degree || ""}
                      {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                      {edu.cgpa ? ` · CGPA: ${edu.cgpa}` : ""}
                      {edu.graduationYear ? ` · ${edu.graduationYear}` : ""}
                    </p>
                  </div>
                )
              )}
            </Card>
          )}

          {/* Experience */}
          {experienceItems.length > 0 && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary-500" /> Experience
              </h3>
              {experienceItems.map(
                (
                  exp: {
                    company?: string;
                    position?: string;
                    startDate?: string;
                    endDate?: string;
                    description?: string;
                    isCurrent?: boolean;
                  },
                  i: number
                ) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 mb-2"
                  >
                    <p className="font-medium text-slate-900 dark:text-white">
                      {exp.position || "—"}
                      {exp.company ? ` at ${exp.company}` : ""}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {exp.startDate || ""}
                      {exp.endDate ? ` - ${exp.endDate}` : exp.isCurrent ? " - Present" : ""}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </Card>
          )}

          {/* Skills */}
          {skillItems.length > 0 && (
            <Card glass hover={false}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillItems.map(
                  (
                    skill:
                      | string
                      | { name?: string; level?: string },
                    i: number
                  ) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium"
                    >
                      {typeof skill === "string"
                        ? skill
                        : skill.name || "—"}
                    </span>
                  )
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Links */}
          <LinksSection user={app.user} />

          {/* Scheduled Interviews */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-500" /> Interviews
            </h3>
            {interviews.length === 0 ? (
              <p className="text-sm text-slate-500">No interviews scheduled.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((iv) => (
                  <div
                    key={iv.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-white capitalize">
                        {iv.interviewType?.replace(/_/g, " ") || "Interview"}
                      </span>
                      <Badge status={iv.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(iv.scheduledAt)} · {iv.durationMinutes || 30}{" "}
                      min
                    </p>
                    {iv.location && (
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {iv.location}
                      </p>
                    )}
                    {iv.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {iv.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Notes
            </h3>
            <div className="space-y-3">
              {app.hrNotes ? (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 text-sm">
                  <p className="text-slate-700 dark:text-slate-300">
                    {app.hrNotes}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    HR · {formatDate(app.updatedAt)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No notes yet.</p>
              )}
            </div>
          </Card>

          {/* Status History */}
          <Card glass hover={false}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Status History
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span className="text-slate-700 dark:text-slate-300">
                  {getStatusLabel(app.status as ApplicationStatus)}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {formatDate(app.statusUpdatedAt || app.updatedAt)}
                </span>
              </div>
              {app.createdAt !== app.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Application Submitted
                  </span>
                  <span className="text-xs text-slate-500 ml-auto">
                    {formatDate(app.createdAt)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Interview"
      >
        <div className="space-y-4">
          <Input
            label="Date & Time"
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Interview Type
            </label>
            <select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            >
              <option value="video">Video Call</option>
              <option value="phone">Phone</option>
              <option value="in_person">In Person</option>
              <option value="technical">Technical Assessment</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowScheduleModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!scheduleDate) {
                  showToast.error("Please select a date and time");
                  return;
                }
                scheduleMutation.mutate();
              }}
              disabled={scheduleMutation.isPending}
            >
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Note"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              placeholder="Add a note about this applicant..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowNoteModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!note.trim()) {
                  showToast.error("Please enter a note");
                  return;
                }
                noteMutation.mutate();
              }}
              disabled={noteMutation.isPending}
            >
              {noteMutation.isPending ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
