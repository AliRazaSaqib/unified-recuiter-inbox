import { useMemo } from "react";
import { useNow } from "./use-now";
import { useConversationStore } from "@/store/use-conversation-store";
import { useInboxStore } from "@/store/use-inbox-store";
import { useTrackingStore } from "@/store/use-tracking-store";
import {
  channelsUsed,
  entriesForCandidate,
  lastEntryOf,
  needsReply,
  previewOf,
  searchableText,
} from "@/lib/timeline";
import type { Candidate, ChannelId, TimelineEntry } from "@/types/domain";

export interface CandidateSummary {
  candidate: Candidate;
  entries: TimelineEntry[];
  lastEntry: TimelineEntry | undefined;
  preview: string;
  lastActivityAt: string;
  unread: number;
  awaitingReply: boolean;
  channels: ChannelId[];
  openRequests: number;
  overdueTasks: number;
}

export function useCandidateSummaries(): CandidateSummary[] {
  const candidates = useInboxStore((state) => state.candidates);
  const unread = useInboxStore((state) => state.unread);
  const entries = useConversationStore((state) => state.entries);
  const requests = useTrackingStore((state) => state.requests);
  const tasks = useTrackingStore((state) => state.tasks);
  const now = useNow();

  return useMemo(() => {
    return candidates.map((candidate) => {
      const candidateEntries = entriesForCandidate(entries, candidate.id);
      const lastEntry = lastEntryOf(candidateEntries);
      return {
        candidate,
        entries: candidateEntries,
        lastEntry,
        preview: previewOf(lastEntry),
        lastActivityAt: lastEntry?.timestamp ?? candidate.appliedAt,
        unread: unread[candidate.id] ?? 0,
        awaitingReply: needsReply(candidateEntries),
        channels: channelsUsed(candidateEntries),
        openRequests: requests.filter(
          (request) => request.candidateId === candidate.id && request.status === "open",
        ).length,
        overdueTasks: tasks.filter(
          (task) =>
            task.candidateId === candidate.id &&
            task.status === "open" &&
            new Date(task.dueAt).getTime() < now,
        ).length,
      };
    });
  }, [candidates, entries, requests, tasks, unread, now]);
}

export function useFilteredCandidates(): CandidateSummary[] {
  const summaries = useCandidateSummaries();
  const query = useInboxStore((state) => state.query);
  const stageFilter = useInboxStore((state) => state.stageFilter);
  const channelFilter = useInboxStore((state) => state.channelFilter);
  const unreadOnly = useInboxStore((state) => state.unreadOnly);
  const needsReplyOnly = useInboxStore((state) => state.needsReplyOnly);
  const sort = useInboxStore((state) => state.sort);

  return useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = summaries.filter((summary) => {
      if (stageFilter !== "all" && summary.candidate.stage !== stageFilter) return false;
      if (channelFilter !== "all" && !summary.channels.includes(channelFilter)) return false;
      if (unreadOnly && summary.unread === 0) return false;
      if (needsReplyOnly && !summary.awaitingReply) return false;
      if (!normalized) return true;

      const haystack = [
        summary.candidate.name,
        summary.candidate.headline,
        summary.candidate.roleAppliedFor,
        summary.candidate.location,
        summary.candidate.tags.join(" "),
        summary.entries.map(searchableText).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });

    return filtered.sort((a, b) => {
      if (a.candidate.pinned !== b.candidate.pinned) return a.candidate.pinned ? -1 : 1;
      if (sort === "name") return a.candidate.name.localeCompare(b.candidate.name);
      if (sort === "unread" && a.unread !== b.unread) return b.unread - a.unread;
      return b.lastActivityAt.localeCompare(a.lastActivityAt);
    });
  }, [summaries, query, stageFilter, channelFilter, unreadOnly, needsReplyOnly, sort]);
}

export function useSelectedSummary(): CandidateSummary | undefined {
  const summaries = useCandidateSummaries();
  const selectedId = useInboxStore((state) => state.selectedCandidateId);
  return summaries.find((summary) => summary.candidate.id === selectedId);
}
