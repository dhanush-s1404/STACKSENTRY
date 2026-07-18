import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

interface BadgeProps {
  status: ApplicationStatus | string;
  className?: string;
  size?: "sm" | "md";
}

const extraColors: Record<string, string> = {
  active:
    "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400",
  inactive:
    "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400",
  scheduled:
    "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
  completed:
    "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400",
  cancelled:
    "bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400",
  rescheduled:
    "bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
  full_time:
    "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
  part_time:
    "bg-secondary-100 text-secondary-600 dark:bg-secondary-700/40 dark:text-secondary-400",
  contract:
    "bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
  internship:
    "bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400",
  remote:
    "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400",
};

export default function Badge({ status, className, size = "sm" }: BadgeProps) {
  const color =
    getStatusColor(status as ApplicationStatus) ||
    extraColors[status] ||
    "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400";

  return (
    <span
      className={cn(
        "badge-base whitespace-nowrap",
        color,
        size === "md" && "px-3 py-1 text-sm",
        className
      )}
    >
      {getStatusLabel(status as ApplicationStatus) ||
        status.replace(/_/g, " ")}
    </span>
  );
}
