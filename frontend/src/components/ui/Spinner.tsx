import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border-[1.5px]",
  md: "h-7 w-7 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-slate-200 border-t-primary-500 dark:border-slate-700 dark:border-t-primary-400",
          sizeStyles[size]
        )}
      />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary-500 dark:border-slate-700 dark:border-t-primary-400 mx-auto mb-3" />
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
