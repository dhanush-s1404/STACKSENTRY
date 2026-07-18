import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const IconComponent =
    typeof icon === "function" ? icon : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
        {IconComponent ? (
          <IconComponent className="h-7 w-7 text-slate-400 dark:text-slate-500" />
        ) : typeof icon === "object" && icon !== null ? (
          icon
        ) : (
          <Inbox className="h-7 w-7 text-slate-400 dark:text-slate-500" />
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
