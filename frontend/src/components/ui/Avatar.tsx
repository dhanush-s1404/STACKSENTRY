import { cn, getInitials, generateGradient } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
};

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm",
          sizeStyles[size],
          className
        )}
      />
    );
  }

  const gradient = generateGradient(name.charCodeAt(0));

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-slate-800 shadow-sm bg-gradient-to-br",
        gradient,
        sizeStyles[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
