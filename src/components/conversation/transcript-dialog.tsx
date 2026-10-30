import { useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { SearchField } from "@/components/ui/search-field";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Highlight } from "./highlight";
import { cn } from "@/lib/cn";
import { formatDuration, formatFullTimestamp } from "@/lib/format";
import { SearchX } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";
import type { CallEntry } from "@/types/domain";

interface TranscriptDialogProps {
  entry: CallEntry | undefined;
  candidateName: string;
  onClose: () => void;
}

export function TranscriptDialog({ entry, candidateName, onClose }: TranscriptDialogProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const lines = useMemo(() => {
    if (!entry) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return entry.transcript;
    return entry.transcript.filter((line) => line.text.toLowerCase().includes(needle));
  }, [entry, query]);

  if (!entry) return null;

  return (
    <Dialog
      open
      onClose={onClose}
      title={t("call.dialogTitle", { name: candidateName })}
      description={t("call.dialogMeta", {
        timestamp: formatFullTimestamp(entry.timestamp),
        duration: formatDuration(entry.durationSec),
        direction: t(
          entry.direction === "outbound" ? "call.directionOutbound" : "call.directionInbound",
        ),
      })}
    >
      <div className="space-y-4 p-5">
        <div className="rounded-panel border border-border-subtle bg-surface-sunken p-3">
          <p className="mb-1 text-[10.5px] font-semibold tracking-wider text-ink-faint uppercase">
            {t("call.aiSummary")}
          </p>
          <p className="text-[13px] leading-relaxed text-ink">{entry.summary}</p>
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder={t("call.searchTranscript")}
        />

        {lines.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={t("call.noTranscriptMatchTitle")}
            description={t("call.noTranscriptMatchDescription")}
          />
        ) : (
          <ol className="space-y-3">
            {lines.map((line) => {
              const isRecruiter = line.speaker === "recruiter";
              return (
                <li key={line.id} className="flex gap-3">
                  <span className="w-11 shrink-0 pt-0.5 text-right font-mono text-[11px] text-ink-faint tabular-nums">
                    {formatDuration(line.startSec)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge tone={isRecruiter ? "accent" : "neutral"} size="sm">
                      {isRecruiter ? t("call.speakerRecruiter") : candidateName}
                    </Badge>
                    <p
                      className={cn(
                        "mt-1 text-[13px] leading-relaxed",
                        isRecruiter ? "text-ink" : "text-ink-muted",
                      )}
                    >
                      <Highlight text={line.text} query={query} />
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Dialog>
  );
}
