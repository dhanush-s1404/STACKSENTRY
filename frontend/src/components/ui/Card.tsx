import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  className?: string;
}

export default function Card({
  children,
  hover = false,
  glass = true,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hover ? { y: -2, transition: { type: "spring", stiffness: 400, damping: 25 } } : undefined
      }
      className={cn(
        "rounded-2xl p-6 transition-shadow duration-300",
        glass
          ? "glass-card hover:shadow-card-hover"
          : "card-base hover:shadow-card-hover",
        hover && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
