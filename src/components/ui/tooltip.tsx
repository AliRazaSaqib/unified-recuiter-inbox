import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

export function Tooltip({ label, children, side = "top", className }: TooltipProps) {
  return (
    <span className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 scale-95 rounded-md bg-ink px-2 py-1 text-[11px] font-medium whitespace-nowrap text-canvas opacity-0 shadow-pop transition group-hover/tip:scale-100 group-hover/tip:opacity-100",
          side === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
        )}
      >
        {label}
      </span>
    </span>
  );
}
