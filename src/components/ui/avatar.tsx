import { initialsOf } from "@/lib/format";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[17px]",
};

interface AvatarProps {
  name: string;
  color: string;
  size?: Size;
  className?: string;
}

export function Avatar({ name, color, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide text-white select-none",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initialsOf(name)}
    </span>
  );
}
