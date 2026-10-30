import { ArrowRightLeft, BadgeCheck, ShieldCheck, UserCog } from "lucide-react";
import { Highlight } from "./highlight";
import { formatClock } from "@/lib/format";
import type { SystemEntry } from "@/types/domain";

const ICONS = {
  channel_switch: ArrowRightLeft,
  stage_change: BadgeCheck,
  consent: ShieldCheck,
  assignment: UserCog,
} as const;

interface SystemNoteProps {
  entry: SystemEntry;
  query: string;
}

export function SystemNote({ entry, query }: SystemNoteProps) {
  const Icon = ICONS[entry.kind];

  return (
    <div className="flex justify-center py-0.5">
      <span className="inline-flex max-w-[600px] flex-wrap items-center justify-center gap-x-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-center text-[11.5px] text-ink-muted">
        <Icon className="h-3 w-3 shrink-0 text-ink-faint" />
        <Highlight text={entry.body} query={query} />
        <span className="whitespace-nowrap text-ink-faint">· {formatClock(entry.timestamp)}</span>
      </span>
    </div>
  );
}
