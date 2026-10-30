import { RotateCw, TriangleAlert } from "lucide-react";
import { CHANNELS } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { DeliveryStatus } from "@/components/channel/delivery-status";
import { AttachmentChip } from "./attachment-chip";
import { Highlight } from "./highlight";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";
import { useTranslation } from "@/i18n/use-translation";
import type { MessageEntry } from "@/types/domain";

interface MessageBubbleProps {
  entry: MessageEntry;
  candidateName: string;
  query: string;
  onRetry: (entryId: string) => void;
}

export function MessageBubble({ entry, candidateName, query, onRetry }: MessageBubbleProps) {
  const { t } = useTranslation();
  const outbound = entry.direction === "outbound";
  const meta = CHANNELS[entry.channel];
  const failed = entry.status === "failed";

  return (
    <article
      className={cn("flex w-full gap-2", outbound ? "justify-end" : "justify-start")}
      aria-label={t("conversation.messageAria", {
        channel: meta.label,
        direction: t(outbound ? "conversation.directionSent" : "conversation.directionReceived"),
      })}
    >
      <div className={cn("flex max-w-[min(680px,88%)] flex-col gap-1 sm:max-w-[min(680px,82%)]", outbound && "items-end")}>
        <div
          className={cn(
            "flex items-center gap-1.5 px-1 text-[11px]",
            outbound && "flex-row-reverse",
          )}
        >
          <ChannelGlyph channel={entry.channel} size="xs" />
          <span className="font-semibold" style={{ color: meta.colorVar }}>
            {meta.label}
          </span>
          <span className="text-ink-faint">
            {outbound ? entry.authorName : candidateName} · {formatClock(entry.timestamp)}
          </span>
        </div>

        <div
          className={cn(
            "animate-rise relative rounded-bubble border px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-sm",
            outbound
              ? "rounded-br-sm border-transparent bg-accent text-accent-ink"
              : "rounded-bl-sm border-border-subtle bg-surface text-ink",
            failed && "border-critical/50",
            entry.optimistic && "opacity-80",
          )}
          style={
            outbound
              ? undefined
              : { borderLeft: `2.5px solid ${meta.colorVar}` }
          }
        >
          {entry.subject ? (
            <p
              className={cn(
                "mb-1 border-b pb-1.5 text-[12.5px] font-semibold",
                outbound ? "border-white/20" : "border-border-subtle",
              )}
            >
              <Highlight text={entry.subject} query={query} />
            </p>
          ) : null}

          <p className="whitespace-pre-wrap">
            <Highlight text={entry.body} query={query} />
          </p>

          {entry.attachments.length > 0 ? (
            <div className="mt-2 flex flex-col gap-1.5">
              {entry.attachments.map((attachment) => (
                <AttachmentChip
                  key={attachment.id}
                  attachment={attachment}
                  tone={outbound ? "inverse" : "default"}
                />
              ))}
            </div>
          ) : null}
        </div>

        {outbound ? (
          <div className="flex items-center gap-2 px-1">
            <DeliveryStatus status={entry.status} withLabel />
          </div>
        ) : null}

        {failed && entry.failureReason ? (
          <div className="flex items-center gap-2 rounded-control border border-critical/40 bg-critical-soft px-2.5 py-1.5 text-[11.5px] text-critical">
            <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1">{entry.failureReason}</span>
            <button
              onClick={() => onRetry(entry.id)}
              className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
            >
              <RotateCw className="h-3 w-3" />
              {t("conversation.retry")}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
