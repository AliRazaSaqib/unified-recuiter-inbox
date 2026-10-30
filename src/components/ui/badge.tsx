import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "positive" | "warning" | "critical";
type Size = "sm" | "md";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-sunken text-ink-muted border-border-subtle",
  accent: "bg-accent-soft text-accent border-transparent",
  positive: "bg-positive-soft text-positive border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  critical: "bg-critical-soft text-critical border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "h-5 px-1.5 text-[10.5px] gap-1",
  md: "h-6 px-2 text-[11.5px] gap-1.5",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  icon?: ReactNode;
}

export function Badge({
  className,
  tone = "neutral",
  size = "md",
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
        TONES[tone],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {icon}
      {children}
    </span>
  );
}
