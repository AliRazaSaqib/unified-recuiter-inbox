import { memo } from "react";
import { CornerUpLeft, Pin, TriangleAlert } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { StageBadge } from "./stage-badge";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import { useTranslation } from "@/i18n/use-translation";
import type { CandidateSummary } from "@/hooks/use-candidate-summaries";

interface CandidateRowProps {
  summary: CandidateSummary;
  active: boolean;
  onSelect: (candidateId: string) => void;
  onTogglePin: (candidateId: string) => void;
}

export const CandidateRow = memo(function CandidateRow({
  summary,
  active,
  onSelect,
  onTogglePin,
}: CandidateRowProps) {
  const { t } = useTranslation();
  const { candidate, lastEntry, preview, unread, awaitingReply, channels, overdueTasks } =
    summary;

  return (
    <div
      role="option"
      aria-selected={active}
      tabIndex={0}
      onClick={() => onSelect(candidate.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(candidate.id);
        }
      }}
      className={cn(
        "group relative w-full cursor-pointer border-b border-border-subtle px-3 py-3 text-left transition",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
        active ? "bg-accent-soft/60" : "hover:bg-surface-sunken",
      )}
    >
      {active ? (
        <span className="absolute inset-y-0 left-0 w-0.5 rounded-r bg-accent" />
      ) : null}

      <div className="flex gap-3">
        <div className="relative shrink-0">
          <Avatar name={candidate.name} color={candidate.avatarColor} />
          {lastEntry ? (
            <span className="absolute -right-1 -bottom-1 rounded-full bg-surface p-[2px]">
              <ChannelGlyph channel={lastEntry.channel} size="xs" solid />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "truncate text-[13.5px] text-ink",
                unread > 0 ? "font-semibold" : "font-medium",
              )}
            >
              {candidate.name}
            </span>
            {candidate.pinned ? (
              <Pin className="h-3 w-3 shrink-0 fill-current text-ink-faint" />
            ) : null}
            <span className="ml-auto shrink-0 text-[11px] text-ink-faint tabular-nums">
              {formatRelative(summary.lastActivityAt)}
            </span>
          </div>

          <p className="mt-0.5 truncate text-[11.5px] text-ink-faint">
            {candidate.roleAppliedFor}
          </p>

          <p
            className={cn(
              "mt-1 line-clamp-2 text-[12.5px] leading-snug",
              unread > 0 ? "text-ink" : "text-ink-muted",
            )}
          >
            {lastEntry?.direction === "outbound" ? (
              <CornerUpLeft className="mr-1 -mt-0.5 inline h-3 w-3 text-ink-faint" />
            ) : null}
            {preview}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StageBadge stage={candidate.stage} />
            {awaitingReply ? (
              <span className="inline-flex h-5 items-center rounded-full bg-warning-soft px-1.5 text-[10.5px] font-semibold text-warning">
                {t("candidateList.needsReply")}
              </span>
            ) : null}
            {overdueTasks > 0 ? (
              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-critical-soft px-1.5 text-[10.5px] font-semibold text-critical">
                <TriangleAlert className="h-2.5 w-2.5" />
                {overdueTasks}
              </span>
            ) : null}

            <span className="ml-auto flex items-center gap-0.5">
              {channels.slice(0, 4).map((channel) => (
                <ChannelGlyph key={channel} channel={channel} size="xs" />
              ))}
            </span>

            {unread > 0 ? (
              <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink tabular-nums">
                {unread}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <button
        onClick={(event) => {
          event.stopPropagation();
          onTogglePin(candidate.id);
        }}
        aria-label={t(candidate.pinned ? "candidateList.unpin" : "candidateList.pin")}
        className="absolute top-2 right-2 hidden rounded-md p-1 text-ink-faint transition hover:bg-surface hover:text-ink group-hover:block"
      >
        <Pin className={cn("h-3 w-3", candidate.pinned && "fill-current")} />
      </button>
    </div>
  );
});
