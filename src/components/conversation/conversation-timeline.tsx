import { useEffect, useRef } from "react";
import { MessagesSquare, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CallCard } from "./call-card";
import { ChannelSwitchMarker } from "./channel-switch-marker";
import { MessageBubble } from "./message-bubble";
import { SystemNote } from "./system-note";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { TimelineGroup } from "@/lib/timeline";

interface ConversationTimelineProps {
  groups: TimelineGroup[];
  candidateName: string;
  query: string;
  hasMore: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: (entryId: string) => void;
  onOpenTranscript: (entryId: string) => void;
  scrollKey: string;
  isFiltered: boolean;
  onResetFilters: () => void;
  highlightedEntryId: string | null;
}

export function ConversationTimeline({
  groups,
  candidateName,
  query,
  hasMore,
  loadingOlder,
  onLoadOlder,
  onRetry,
  onOpenTranscript,
  scrollKey,
  isFiltered,
  onResetFilters,
  highlightedEntryId,
}: ConversationTimelineProps) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [scrollKey]);

  const lastGroupSize = groups.at(-1)?.items.length ?? 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lastGroupSize]);

  if (groups.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={isFiltered ? SearchX : MessagesSquare}
          title={t(isFiltered ? "conversation.noMatchTitle" : "conversation.emptyTitle")}
          description={t(
            isFiltered ? "conversation.noMatchDescription" : "conversation.emptyDescription",
          )}
          action={
            isFiltered ? (
              <Button size="sm" variant="outline" onClick={onResetFilters}>
                {t("conversation.clearThreadFilters")}
              </Button>
            ) : null
          }
        />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-[980px] flex-col gap-4 px-3 py-4 sm:px-4 sm:py-5">
        {hasMore ? (
          <div className="flex justify-center">
            <Button size="sm" variant="outline" onClick={onLoadOlder} disabled={loadingOlder}>
              {t(loadingOlder ? "conversation.loading" : "conversation.loadOlder")}
            </Button>
          </div>
        ) : (
          <p className="text-center text-[11.5px] text-ink-faint">
            {t("conversation.historyStart")}
          </p>
        )}

        {groups.map((group) => (
          <section key={group.id} className="flex flex-col gap-3">
            <div className="sticky top-0 z-10 flex justify-center py-1">
              <span className="rounded-full border border-border-subtle bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-ink-muted backdrop-blur">
                {group.dayLabel}
              </span>
            </div>

            {group.items.map((item) => {
              if (item.kind === "switch") {
                return (
                  <ChannelSwitchMarker
                    key={item.id}
                    from={item.from}
                    to={item.to}
                    gapHours={item.gapHours}
                  />
                );
              }

              const { entry } = item;
              return (
                <div
                  key={entry.id}
                  id={`entry-${entry.id}`}
                  className={cn(
                    "scroll-mt-16 rounded-panel transition",
                    highlightedEntryId === entry.id &&
                      "ring-2 ring-accent ring-offset-4 ring-offset-canvas",
                  )}
                >
                  {entry.type === "message" ? (
                    <MessageBubble
                      entry={entry}
                      candidateName={candidateName}
                      query={query}
                      onRetry={onRetry}
                    />
                  ) : entry.type === "call" ? (
                    <CallCard
                      entry={entry}
                      query={query}
                      onOpenTranscript={onOpenTranscript}
                    />
                  ) : (
                    <SystemNote entry={entry} query={query} />
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
