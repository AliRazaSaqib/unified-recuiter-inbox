import { create } from "zustand";
import { candidates as seedCandidates } from "@/data/candidates";
import type { Candidate, CandidateStage, ChannelId } from "@/types/domain";

export type StageFilter = CandidateStage | "all";
export type ChannelFilter = ChannelId | "all";
export type InboxSort = "recent" | "unread" | "name";

interface InboxState {
  candidates: Candidate[];
  selectedCandidateId: string;
  query: string;
  stageFilter: StageFilter;
  channelFilter: ChannelFilter;
  unreadOnly: boolean;
  needsReplyOnly: boolean;
  sort: InboxSort;
  unread: Record<string, number>;
  selectCandidate: (candidateId: string) => void;
  setQuery: (query: string) => void;
  setStageFilter: (stage: StageFilter) => void;
  setChannelFilter: (channel: ChannelFilter) => void;
  toggleUnreadOnly: () => void;
  toggleNeedsReplyOnly: () => void;
  setSort: (sort: InboxSort) => void;
  clearFilters: () => void;
  togglePin: (candidateId: string) => void;
  setStage: (candidateId: string, stage: CandidateStage) => void;
  markRead: (candidateId: string) => void;
  bumpUnread: (candidateId: string) => void;
}

export const useInboxStore = create<InboxState>()((set) => ({
  candidates: seedCandidates,
  selectedCandidateId: seedCandidates[0].id,
  query: "",
  stageFilter: "all",
  channelFilter: "all",
  unreadOnly: false,
  needsReplyOnly: false,
  sort: "recent",
  unread: { "cand-ali": 1, "cand-priya": 2, "cand-james": 1, "cand-tunde": 1 },
  selectCandidate: (candidateId) =>
    set((state) => ({
      selectedCandidateId: candidateId,
      unread: { ...state.unread, [candidateId]: 0 },
    })),
  setQuery: (query) => set({ query }),
  setStageFilter: (stageFilter) => set({ stageFilter }),
  setChannelFilter: (channelFilter) => set({ channelFilter }),
  toggleUnreadOnly: () => set((state) => ({ unreadOnly: !state.unreadOnly })),
  toggleNeedsReplyOnly: () => set((state) => ({ needsReplyOnly: !state.needsReplyOnly })),
  setSort: (sort) => set({ sort }),
  clearFilters: () =>
    set({
      query: "",
      stageFilter: "all",
      channelFilter: "all",
      unreadOnly: false,
      needsReplyOnly: false,
    }),
  togglePin: (candidateId) =>
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, pinned: !candidate.pinned } : candidate,
      ),
    })),
  setStage: (candidateId, stage) =>
    set((state) => ({
      candidates: state.candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, stage } : candidate,
      ),
    })),
  markRead: (candidateId) =>
    set((state) => ({ unread: { ...state.unread, [candidateId]: 0 } })),
  bumpUnread: (candidateId) =>
    set((state) => ({
      unread: { ...state.unread, [candidateId]: (state.unread[candidateId] ?? 0) + 1 },
    })),
}));
