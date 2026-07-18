import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, Phone, Users, CheckCircle, XCircle, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatDate } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { getInterviews, completeInterview, cancelInterview, createInterview } from "@/lib/services/interviewsService";
import { getApplications } from "@/lib/services/applicationsService";

const typeIcons = { video: Video, phone: Phone, in_person: Users, technical: CheckCircle };

export default function HRInterviews() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  const [formApplicationId, setFormApplicationId] = useState("");
  const [formScheduledAt, setFormScheduledAt] = useState("");
  const [formDuration, setFormDuration] = useState("60");
  const [formType, setFormType] = useState("video");
  const [formLocation, setFormLocation] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const { data: scheduledData, isLoading: loadingScheduled } = useQuery({
    queryKey: ["interviews", "scheduled"],
    queryFn: () => getInterviews({ status: "scheduled", per_page: 100 }),
  });

  const { data: completedData, isLoading: loadingCompleted } = useQuery({
    queryKey: ["interviews", "completed"],
    queryFn: () => getInterviews({ status: "completed", per_page: 100 }),
  });

  const { data: applicationsData } = useQuery({
    queryKey: ["applications", "all"],
    queryFn: () => getApplications({ per_page: 100 }),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, notes, rating, feedback }: { id: string; notes?: string; rating?: number; feedback?: string }) =>
      completeInterview(id, { notes, rating, feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      showToast.success("Interview marked as completed!");
      setShowCompleteModal(false);
      setRating(0);
      setNotes("");
    },
    onError: () => {
      showToast.error("Failed to complete interview.");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelInterview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      showToast.success("Interview cancelled!");
    },
    onError: () => {
      showToast.error("Failed to cancel interview.");
    },
  });

  const createMutation = useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      showToast.success("Interview scheduled!");
      setShowModal(false);
      resetForm();
    },
    onError: () => {
      showToast.error("Failed to schedule interview.");
    },
  });

  const scheduled = scheduledData?.items ?? [];
  const completed = completedData?.items ?? [];
  const isLoading = loadingScheduled || loadingCompleted;

  const applicationOptions = (applicationsData?.items ?? []).map((app) => ({
    value: app.id,
    label: `${app.applicantName ?? "Unknown"} — ${app.jobTitle ?? "Unknown"}`,
  }));

  function resetForm() {
    setFormApplicationId("");
    setFormScheduledAt("");
    setFormDuration("60");
    setFormType("video");
    setFormLocation("");
    setFormNotes("");
  }

  function handleSchedule() {
    if (!formApplicationId || !formScheduledAt) {
      showToast.error("Please select a candidate and date/time.");
      return;
    }
    createMutation.mutate({
      application_id: formApplicationId,
      scheduled_at: new Date(formScheduledAt).toISOString(),
      duration_minutes: Number(formDuration) || 60,
      interview_type: formType,
      location: formLocation || undefined,
      notes: formNotes || undefined,
    });
  }

  function handleComplete() {
    if (!selectedInterview) return;
    completeMutation.mutate({
      id: selectedInterview,
      rating: rating || undefined,
      notes: notes || undefined,
    });
  }

  function handleCancel(id: string) {
    cancelMutation.mutate(id);
  }

  const skeletonRows = Array.from({ length: 3 });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interviews</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{scheduled.length} upcoming, {completed.length} completed</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button onClick={() => setView("list")} className={`px-3 py-1.5 text-xs font-medium ${view === "list" ? "bg-primary-500 text-white" : ""}`}>List</button>
            <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-xs font-medium ${view === "calendar" ? "bg-primary-500 text-white" : ""}`}>Calendar</button>
          </div>
          <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowModal(true)}>Schedule</Button>
        </div>
      </motion.div>

      {view === "list" ? (
        <div className="space-y-6">
          {/* Scheduled */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Upcoming</h3>
            <div className="space-y-3">
              {isLoading
                ? skeletonRows.map((_, idx) => (
                    <Card key={idx} glass hover={false} className="!p-4 animate-pulse">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                          <div>
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-1.5" />
                            <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    </Card>
                  ))
                : scheduled.map((int) => {
                    const TypeIcon = typeIcons[int.interviewType as keyof typeof typeIcons] || Video;
                    return (
                      <Card key={int.id} glass hover={false} className="!p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                              <TypeIcon className="h-5 w-5 text-primary-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{int.applicantName ?? "Unknown"}</p>
                              <p className="text-xs text-slate-500">{int.jobTitle ?? "Unknown"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-500">
                              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(int.scheduledAt)}</span>
                            </div>
                            <Badge status={int.status} />
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => { setSelectedInterview(int.id); setShowCompleteModal(true); }} icon={<CheckCircle className="h-3.5 w-3.5" />}>
                                Complete
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleCancel(int.id)} icon={<XCircle className="h-3.5 w-3.5" />} className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              {!isLoading && scheduled.length === 0 && (
                <Card glass hover={false} className="!p-8 text-center">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No upcoming interviews</p>
                </Card>
              )}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Completed</h3>
            <div className="space-y-3">
              {isLoading
                ? skeletonRows.map((_, idx) => (
                    <Card key={idx} glass hover={false} className="!p-4 animate-pulse opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                          <div>
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-1.5" />
                            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    </Card>
                  ))
                : completed.map((int) => (
                    <Card key={int.id} glass hover={false} className="!p-4 opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-success-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{int.applicantName ?? "Unknown"}</p>
                            <p className="text-xs text-slate-500">{int.jobTitle ?? "Unknown"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {int.rating != null && int.rating > 0 && (
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < int.rating! ? "fill-warning-400 text-warning-400" : "text-slate-300"}`} />
                              ))}
                            </div>
                          )}
                          <Badge status={int.status} />
                        </div>
                      </div>
                    </Card>
                  ))}
              {!isLoading && completed.length === 0 && (
                <Card glass hover={false} className="!p-8 text-center">
                  <CheckCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No completed interviews</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Card glass hover={false}>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Calendar view coming soon</p>
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview" size="lg">
        <div className="space-y-4">
          <Select
            label="Candidate"
            placeholder="Select a candidate"
            options={applicationOptions}
            value={formApplicationId}
            onChange={(e) => setFormApplicationId(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date & Time" type="datetime-local" value={formScheduledAt} onChange={(e) => setFormScheduledAt(e.target.value)} />
            <Input label="Duration (minutes)" type="number" placeholder="60" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} />
          </div>
          <Select
            label="Type"
            options={[
              { value: "video", label: "Video Call" },
              { value: "phone", label: "Phone" },
              { value: "in_person", label: "In Person" },
              { value: "technical", label: "Technical" },
            ]}
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
          />
          <Input label="Location" placeholder="Meeting room or link" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              placeholder="Interview notes..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSchedule} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Modal */}
      <Modal isOpen={showCompleteModal} onClose={() => setShowCompleteModal(false)} title="Complete Interview">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star className={`h-6 w-6 ${s <= rating ? "fill-warning-400 text-warning-400" : "text-slate-300 hover:text-warning-200"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" placeholder="Interview notes..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowCompleteModal(false)}>Cancel</Button>
            <Button onClick={handleComplete} disabled={completeMutation.isPending}>
              {completeMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
