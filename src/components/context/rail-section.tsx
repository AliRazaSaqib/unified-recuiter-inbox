import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface RailSectionProps {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function RailSection({
  title,
  badge,
  action,
  children,
  defaultOpen = true,
}: RailSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-border-subtle last:border-b-0">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <button
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-ink-faint transition",
              !open && "-rotate-90",
            )}
          />
          <h3 className="truncate text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
            {title}
          </h3>
          {badge}
        </button>
        {action}
      </div>
      {open ? <div className="animate-fade px-4 pb-4">{children}</div> : null}
    </section>
  );
}
