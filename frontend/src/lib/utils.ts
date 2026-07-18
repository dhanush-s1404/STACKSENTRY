import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import type { ApplicationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy h:mm a");
  } catch {
    return dateStr;
  }
}

export function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    applied: "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
    under_review: "bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
    shortlisted: "bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400",
    interview_scheduled: "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    interview_completed: "bg-secondary-100 text-secondary-700 dark:bg-secondary-700/30 dark:text-secondary-300",
    offer_sent: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400",
    hired: "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300",
    rejected: "bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400",
    withdrawn: "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400",
  };
  return colors[status] || "bg-slate-100 text-slate-600";
}

export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    applied: "Applied",
    under_review: "Under Review",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    interview_completed: "Interview Completed",
    offer_sent: "Offer Sent",
    hired: "Hired",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };
  return labels[status] || status;
}

export function generateGradient(index: number): string {
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-emerald-500 to-cyan-600",
    "from-orange-500 to-pink-600",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-success-600",
    "from-rose-500 to-danger-600",
  ];
  return gradients[index % gradients.length];
}

export function formatSalary(amount: number): string {
  if (amount >= 100000) {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
