import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  "aria-label": string;
  className?: string;
  size?: "sm" | "md";
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  className,
  size = "md",
  ...props
}: SelectProps<T>) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-label={props["aria-label"]}
        className={cn(
          "w-full appearance-none rounded-control border border-border-subtle bg-surface pr-7 pl-2.5 font-medium text-ink outline-none transition",
          "focus:border-accent focus:ring-2 focus:ring-accent/20",
          size === "sm" ? "h-8 text-[12px]" : "h-9 text-[12.5px]",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}
