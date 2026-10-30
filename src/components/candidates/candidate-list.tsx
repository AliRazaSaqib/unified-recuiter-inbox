import { useState } from "react";
import { Inbox, SearchX } from "lucide-react";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { CandidateFilters } from "./candidate-filters";
import { CandidateRow } from "./candidate-row";
import { useCandidateSummaries, useFilteredCandidates } from "@/hooks/use-candidate-summaries";
import { useTranslation } from "@/i18n/use-translation";
import { useInboxStore } from "@/store/use-inbox-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";

type QuickView = "all" | "unread" | "needs_reply";

export function CandidateList() {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const summaries = useCandidateSummaries();
  const filtered = useFilteredCandidates();

  const query = useInboxStore((state) => state.query);
  const setQuery = useInboxStore((state) => state.setQuery);
  const selectedId = useInboxStore((state) => state.selectedCandidateId);
  const selectCandidate = useInboxStore((state) => state.selectCandidate);
  const showThread = useWorkspaceStore((state) => state.showThread);
  const togglePin = useInboxStore((state) => state.togglePin);
  const unreadOnly = useInboxStore((state) => state.unreadOnly);
  const needsReplyOnly = useInboxStore((state) => state.needsReplyOnly);
  const toggleUnreadOnly = useInboxStore((state) => state.toggleUnreadOnly);
  const toggleNeedsReplyOnly = useInboxStore((state) => state.toggleNeedsReplyOnly);
  const clearFilters = useInboxStore((state) => state.clearFilters);

  const quickView: QuickView = unreadOnly ? "unread" : needsReplyOnly ? "needs_reply" : "all";

  const onQuickView = (next: QuickView) => {
    if (next === "unread" && !unreadOnly) {
      if (needsReplyOnly) toggleNeedsReplyOnly();
      toggleUnreadOnly();
    } else if (next === "needs_reply" && !needsReplyOnly) {
      if (unreadOnly) toggleUnreadOnly();
      toggleNeedsReplyOnly();
    } else if (next === "all") {
      if (unreadOnly) toggleUnreadOnly();
      if (needsReplyOnly) toggleNeedsReplyOnly();
    }
  };

  const handleSelect = (candidateId: string) => {
    selectCandidate(candidateId);
    showThread();
  };

  const unreadCount = summaries.filter((summary) => summary.unread > 0).length;
  const needsReplyCount = summaries.filter((summary) => summary.awaitingReply).length;

  return (
    <section className="flex h-full min-h-0 flex-col bg-surface">
      <header className="shrink-0 space-y-2.5 border-b border-border-subtle p-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold tracking-wide text-ink">{t("candidateList.title")}</h2>
          <span className="text-[11.5px] text-ink-faint tabular-nums">
            {t("candidateList.counter", { shown: filtered.length, total: summaries.length })}
          </span>
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder={t("candidateList.searchPlaceholder")}
        />

        <SegmentedControl<QuickView>
          size="sm"
          className="w-full [&>button]:flex-1"
          value={quickView}
          onChange={onQuickView}
          options={[
            { value: "all", label: t("candidateList.viewAll") },
            { value: "unread", label: t("candidateList.viewUnread"), count: unreadCount },
            { value: "needs_reply", label: t("candidateList.viewWaiting"), count: needsReplyCount },
          ]}
        />

        <CandidateFilters open={filtersOpen} onToggle={() => setFiltersOpen((o) => !o)} />
      </header>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto" role="listbox">
        {filtered.length === 0 ? (
          <EmptyState
            icon={query ? SearchX : Inbox}
            title={t(query ? "candidateList.noMatchTitle" : "candidateList.emptyTitle")}
            description={t(
              query ? "candidateList.noMatchDescription" : "candidateList.emptyDescription",
            )}
            action={
              <Button size="sm" variant="outline" onClick={clearFilters}>
                {t("candidateList.resetFilters")}
              </Button>
            }
          />
        ) : (
          filtered.map((summary) => (
            <CandidateRow
              key={summary.candidate.id}
              summary={summary}
              active={summary.candidate.id === selectedId}
              onSelect={handleSelect}
              onTogglePin={togglePin}
            />
          ))
        )}
      </div>
    </section>
  );
}
