import { useCallback, useMemo, useState } from "react";
import { UserSearch } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageComposer } from "@/components/composer/message-composer";
import { ConversationHeader } from "./conversation-header";
import { ConversationTimeline } from "./conversation-timeline";
import { ThreadToolbar } from "./thread-toolbar";
import { TranscriptDialog } from "./transcript-dialog";
import { channelsUsed, filterEntries, groupTimeline, lastInboundOf } from "@/lib/timeline";
import { detectRequestKinds } from "@/lib/request-detection";
import { useSelectedSummary } from "@/hooks/use-candidate-summaries";
import { useLayout } from "@/hooks/use-media-query";
import { useConversationStore } from "@/store/use-conversation-store";
import { useInboxStore } from "@/store/use-inbox-store";
import { useTrackingStore } from "@/store/use-tracking-store";
import { useTranslation } from "@/i18n/use-translation";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import type { CallEntry, CandidateStage, ChannelId } from "@/types/domain";

export function ConversationPanel() {
  const { t } = useTranslation();
  const layout = useLayout();
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(null);

  const summary = useSelectedSummary();

  const threadQuery = useConversationStore((state) => state.threadQuery);
  const mutedChannels = useConversationStore((state) => state.mutedChannels);
  const loadingOlder = useConversationStore((state) => state.loadingOlder);
  const drafts = useConversationStore((state) => state.drafts);
  const visibleCount = useConversationStore((state) => state.visibleCount);
  const setThreadQuery = useConversationStore((state) => state.setThreadQuery);
  const toggleMutedChannel = useConversationStore((state) => state.toggleMutedChannel);
  const resetThreadFilters = useConversationStore((state) => state.resetThreadFilters);
  const setDraft = useConversationStore((state) => state.setDraft);
  const sendMessage = useConversationStore((state) => state.sendMessage);
  const retryMessage = useConversationStore((state) => state.retryMessage);
  const loadOlder = useConversationStore((state) => state.loadOlder);

  const setStage = useInboxStore((state) => state.setStage);

  const requests = useTrackingStore((state) => state.requests);
  const addRequest = useTrackingStore((state) => state.addRequest);
  const registerRepeatAsk = useTrackingStore((state) => state.registerRepeatAsk);

  const contextRailOpen = useWorkspaceStore((state) => state.contextRailOpen);
  const toggleContextRail = useWorkspaceStore((state) => state.toggleContextRail);
  const openContextSheet = useWorkspaceStore((state) => state.openContextSheet);
  const showList = useWorkspaceStore((state) => state.showList);
  const transcriptEntryId = useWorkspaceStore((state) => state.transcriptEntryId);
  const openTranscript = useWorkspaceStore((state) => state.openTranscript);
  const closeTranscript = useWorkspaceStore((state) => state.closeTranscript);

  const candidateId = summary?.candidate.id ?? "";

  const candidateRequests = useMemo(
    () => requests.filter((request) => request.candidateId === candidateId),
    [requests, candidateId],
  );

  const windowSize = visibleCount[candidateId] ?? 14;

  const { groups, matchCount, totalCount, hasMore, usedChannels, lastInbound } = useMemo(() => {
    const all = summary?.entries ?? [];
    const visible = all.slice(Math.max(0, all.length - windowSize));
    const filtered = filterEntries(visible, { query: threadQuery, mutedChannels });

    return {
      groups: groupTimeline(filtered),
      matchCount: filtered.length,
      totalCount: visible.length,
      hasMore: all.length > visible.length,
      usedChannels: channelsUsed(all),
      lastInbound: lastInboundOf(all),
    };
  }, [summary?.entries, windowSize, threadQuery, mutedChannels]);

  const jumpToEntry = useCallback(
    (entryId: string) => {
      resetThreadFilters();
      setHighlightedEntryId(entryId);
      window.setTimeout(() => {
        document
          .getElementById(`entry-${entryId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
      window.setTimeout(() => setHighlightedEntryId(null), 2600);
    },
    [resetThreadFilters],
  );

  if (!summary) {
    return (
      <section className="flex h-full items-center justify-center bg-canvas">
        <EmptyState
          icon={UserSearch}
          title={t("conversation.pickCandidateTitle")}
          description={t("conversation.pickCandidateDescription")}
        />
      </section>
    );
  }

  const { candidate } = summary;

  const draft = drafts[candidateId] ?? {
    channel: (lastInbound?.channel === "call"
      ? "whatsapp"
      : (lastInbound?.channel ?? "whatsapp")) as ChannelId,
    subject: "",
    body: "",
  };

  const transcriptEntry = summary.entries.find(
    (entry): entry is CallEntry => entry.type === "call" && entry.id === transcriptEntryId,
  );

  const handleSend = () => {
    const bodyBeforeSend = draft.body;
    const entryId = sendMessage(candidateId);
    if (!entryId) return;

    detectRequestKinds(bodyBeforeSend).forEach((kind) => {
      const existing = candidateRequests.find((request) => request.kind === kind);
      if (existing) {
        registerRepeatAsk(existing.id, draft.channel, entryId);
      } else {
        addRequest({ candidateId, kind, channel: draft.channel, entryId });
      }
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-canvas">
      <ConversationHeader
        candidate={candidate}
        compact={layout !== "desktop"}
        onBack={layout === "mobile" ? showList : undefined}
        channelCount={usedChannels.length}
        messageCount={summary.entries.length}
        contextRailOpen={contextRailOpen}
        onToggleContextRail={layout === "desktop" ? toggleContextRail : openContextSheet}
        onStageChange={(stage: CandidateStage) => setStage(candidateId, stage)}
        onStartCall={() => setDraft(candidateId, { channel: "whatsapp" })}
      />

      <ThreadToolbar
        query={threadQuery}
        onQueryChange={setThreadQuery}
        channels={usedChannels}
        mutedChannels={mutedChannels}
        onToggleChannel={toggleMutedChannel}
        onReset={resetThreadFilters}
        matchCount={matchCount}
        totalCount={totalCount}
      />

      <ConversationTimeline
        groups={groups}
        candidateName={candidate.name}
        query={threadQuery}
        hasMore={hasMore}
        loadingOlder={loadingOlder}
        onLoadOlder={() => loadOlder(candidateId)}
        onRetry={retryMessage}
        onOpenTranscript={openTranscript}
        scrollKey={candidateId}
        isFiltered={threadQuery.trim().length > 0 || mutedChannels.length > 0}
        onResetFilters={resetThreadFilters}
        highlightedEntryId={highlightedEntryId}
      />

      <MessageComposer
        candidate={candidate}
        draft={draft}
        requests={candidateRequests}
        lastInboundChannel={lastInbound?.channel === "call" ? undefined : lastInbound?.channel}
        onDraftChange={(patch) => setDraft(candidateId, patch)}
        onSend={handleSend}
        onJumpToEntry={jumpToEntry}
      />

      <TranscriptDialog
        entry={transcriptEntry}
        candidateName={candidate.name}
        onClose={closeTranscript}
      />
    </section>
  );
}
