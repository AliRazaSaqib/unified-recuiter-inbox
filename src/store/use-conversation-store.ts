import { create } from "zustand";
import { RECRUITER_NAME } from "@/data/workspace";
import { buildNormalizedTimeline } from "@/lib/adapters";
import type { ChannelId, MessageEntry, TimelineEntry } from "@/types/domain";

export interface Draft {
  channel: ChannelId;
  subject: string;
  body: string;
}

const INITIAL_WINDOW = 14;

interface ConversationState {
  entries: TimelineEntry[];
  drafts: Record<string, Draft>;
  threadQuery: string;
  mutedChannels: ChannelId[];
  visibleCount: Record<string, number>;
  loadingOlder: boolean;
  setDraft: (candidateId: string, patch: Partial<Draft>) => void;
  clearDraft: (candidateId: string) => void;
  sendMessage: (candidateId: string) => string | null;
  retryMessage: (entryId: string) => void;
  receiveEntry: (entry: TimelineEntry) => void;
  setThreadQuery: (query: string) => void;
  toggleMutedChannel: (channel: ChannelId) => void;
  resetThreadFilters: () => void;
  loadOlder: (candidateId: string) => void;
  visibleWindowFor: (candidateId: string) => number;
}

function updateEntry(
  entries: TimelineEntry[],
  entryId: string,
  patch: Partial<MessageEntry>,
): TimelineEntry[] {
  return entries.map((entry) =>
    entry.id === entryId && entry.type === "message" ? { ...entry, ...patch } : entry,
  );
}

export const useConversationStore = create<ConversationState>()((set, get) => ({
  entries: buildNormalizedTimeline(),
  drafts: {},
  threadQuery: "",
  mutedChannels: [],
  visibleCount: {},
  loadingOlder: false,

  setDraft: (candidateId, patch) =>
    set((state) => {
      const current = state.drafts[candidateId] ?? {
        channel: "whatsapp" as ChannelId,
        subject: "",
        body: "",
      };
      return { drafts: { ...state.drafts, [candidateId]: { ...current, ...patch } } };
    }),

  clearDraft: (candidateId) =>
    set((state) => {
      const current = state.drafts[candidateId];
      if (!current) return state;
      return {
        drafts: { ...state.drafts, [candidateId]: { ...current, body: "", subject: "" } },
      };
    }),

  sendMessage: (candidateId) => {
    const draft = get().drafts[candidateId];
    if (!draft || !draft.body.trim()) return null;

    const entryId = `local:${candidateId}:${Date.now()}`;
    const entry: MessageEntry = {
      id: entryId,
      candidateId,
      type: "message",
      channel: draft.channel,
      direction: "outbound",
      timestamp: new Date().toISOString(),
      body: draft.body.trim(),
      subject: draft.subject.trim() || undefined,
      status: "queued",
      attachments: [],
      authorName: RECRUITER_NAME,
      sourceRef: entryId,
      optimistic: true,
    };

    set((state) => ({
      entries: [...state.entries, entry],
      drafts: { ...state.drafts, [candidateId]: { ...draft, body: "", subject: "" } },
    }));

    window.setTimeout(() => {
      set((state) => ({
        entries: updateEntry(state.entries, entryId, { status: "sent", optimistic: false }),
      }));
    }, 650);

    window.setTimeout(() => {
      set((state) => ({ entries: updateEntry(state.entries, entryId, { status: "delivered" }) }));
    }, 1600);

    return entryId;
  },

  retryMessage: (entryId) => {
    set((state) => ({
      entries: updateEntry(state.entries, entryId, {
        status: "queued",
        failureReason: undefined,
      }),
    }));
    window.setTimeout(() => {
      set((state) => ({ entries: updateEntry(state.entries, entryId, { status: "delivered" }) }));
    }, 1200);
  },

  receiveEntry: (entry) => set((state) => ({ entries: [...state.entries, entry] })),

  setThreadQuery: (threadQuery) => set({ threadQuery }),

  toggleMutedChannel: (channel) =>
    set((state) => ({
      mutedChannels: state.mutedChannels.includes(channel)
        ? state.mutedChannels.filter((item) => item !== channel)
        : [...state.mutedChannels, channel],
    })),

  resetThreadFilters: () => set({ mutedChannels: [], threadQuery: "" }),

  loadOlder: (candidateId) => {
    set({ loadingOlder: true });
    window.setTimeout(() => {
      set((state) => ({
        loadingOlder: false,
        visibleCount: {
          ...state.visibleCount,
          [candidateId]: (state.visibleCount[candidateId] ?? INITIAL_WINDOW) + 20,
        },
      }));
    }, 500);
  },

  visibleWindowFor: (candidateId) => get().visibleCount[candidateId] ?? INITIAL_WINDOW,
}));
