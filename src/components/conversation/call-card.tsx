import { FileAudio, PhoneIncoming, PhoneMissed, PhoneOutgoing, Voicemail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Highlight } from "./highlight";
import { cn } from "@/lib/cn";
import { formatClock, formatDuration } from "@/lib/format";
import { useTranslation } from "@/i18n/use-translation";
import type { CallEntry } from "@/types/domain";

interface CallCardProps {
  entry: CallEntry;
  query: string;
  onOpenTranscript: (entryId: string) => void;
}

export function CallCard({ entry, query, onOpenTranscript }: CallCardProps) {
  const { t } = useTranslation();
  const outbound = entry.direction === "outbound";
  const Icon =
    entry.outcome === "missed"
      ? PhoneMissed
      : entry.outcome === "voicemail"
        ? Voicemail
        : outbound
          ? PhoneOutgoing
          : PhoneIncoming;

  const unanswered = entry.outcome === "missed" || entry.outcome === "no_answer";

  return (
    <article className="animate-rise mx-auto w-full max-w-[720px]">
      <div
        className="overflow-hidden rounded-panel border border-border-subtle bg-surface shadow-sm"
        style={{ borderLeft: "2.5px solid var(--app-ch-call)" }}
      >
        <header className="flex flex-wrap items-center gap-2 px-3.5 py-2.5">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-[9px]"
            style={{
              backgroundColor: "color-mix(in oklab, var(--app-ch-call) 14%, transparent)",
              color: "var(--app-ch-call)",
            }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>

          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-ink">
              {t(outbound ? "call.outbound" : "call.inbound")}
              {entry.durationSec > 0 ? (
                <span className="ml-1.5 font-mono text-[11.5px] font-normal text-ink-muted">
                  {formatDuration(entry.durationSec)}
                </span>
              ) : null}
            </p>
            <p className="text-[11px] text-ink-faint">
              {entry.authorName} · {formatClock(entry.timestamp)}
            </p>
          </div>

          <Badge
            tone={unanswered ? "critical" : entry.outcome === "voicemail" ? "warning" : "positive"}
            size="sm"
            className="ml-auto"
          >
            {t(`call.outcome.${entry.outcome}`)}
          </Badge>
        </header>

        {entry.summary ? (
          <div
            className={cn(
              "border-t border-border-subtle bg-surface-sunken/60 px-3.5 py-2.5",
              unanswered && "bg-transparent",
            )}
          >
            <p className="mb-0.5 text-[10.5px] font-semibold tracking-wider text-ink-faint uppercase">
              {t("call.aiSummary")}
            </p>
            <p className="text-[12.5px] leading-relaxed text-ink-muted">
              <Highlight text={entry.summary} query={query} />
            </p>
          </div>
        ) : null}

        {entry.transcript.length > 0 ? (
          <footer className="flex items-center gap-2 border-t border-border-subtle px-3.5 py-2">
            <FileAudio className="h-3.5 w-3.5 text-ink-faint" />
            <span className="text-[11.5px] text-ink-muted">
              {t("call.transcriptTurns", { count: entry.transcript.length })}
            </span>
            <Button
              size="sm"
              variant="subtle"
              className="ml-auto"
              onClick={() => onOpenTranscript(entry.id)}
            >
              {t("call.openTranscript")}
            </Button>
          </footer>
        ) : null}
      </div>
    </article>
  );
}
