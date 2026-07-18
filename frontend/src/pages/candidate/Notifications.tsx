import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { timeAgo } from "@/lib/utils";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type PaginatedNotifications,
} from "@/lib/services/notificationsService";
import type { Notification } from "@/types";

const typeIcons: Record<Notification["type"], typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors: Record<Notification["type"], string> = {
  info: "bg-primary-50 dark:bg-primary-900/20 text-primary-500",
  success: "bg-success-50 dark:bg-success-900/20 text-success-500",
  warning: "bg-warning-50 dark:bg-warning-900/20 text-warning-500",
  error: "bg-danger-50 dark:bg-danger-900/20 text-danger-500",
};

function NotificationSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-40 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CandidateNotifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedNotifications>({
    queryKey: ["notifications", { is_read: filter === "unread" ? false : undefined }],
    queryFn: () => getNotifications({ is_read: filter === "unread" ? false : undefined, per_page: 50 }),
  });

  const notifications = data?.items ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium disabled:opacity-50"
          >
            {markAllReadMutation.isPending ? "Marking..." : "Mark all read"}
          </button>
        </div>
      </motion.div>

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary-500 text-white"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  glass
                  hover={false}
                  className={`!p-4 ${
                    !notif.isRead ? "border-l-4 border-l-primary-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notif.isRead && (
                        <button
                          onClick={() => markReadMutation.mutate(notif.id)}
                          disabled={markReadMutation.isPending}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-50"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(notif.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-danger-500" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
