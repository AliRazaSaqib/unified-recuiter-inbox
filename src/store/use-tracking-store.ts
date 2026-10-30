import { create } from "zustand";
import { candidateNotes, candidateRequests, followUpTasks } from "@/data/tracking";
import { RECRUITER_NAME } from "@/data/workspace";
import type {
  CandidateNote,
  CandidateRequest,
  ChannelId,
  FollowUpTask,
  RequestKind,
} from "@/types/domain";

interface TrackingState {
  requests: CandidateRequest[];
  notes: CandidateNote[];
  tasks: FollowUpTask[];
  addRequest: (input: {
    candidateId: string;
    kind: RequestKind;
    channel: ChannelId;
    entryId: string;
  }) => void;
  registerRepeatAsk: (requestId: string, channel: ChannelId, entryId: string) => void;
  resolveRequest: (requestId: string, note?: string) => void;
  reopenRequest: (requestId: string) => void;
  addNote: (candidateId: string, body: string) => void;
  addTask: (candidateId: string, title: string, dueAt: string) => void;
  toggleTask: (taskId: string) => void;
}

export const useTrackingStore = create<TrackingState>()((set) => ({
  requests: candidateRequests,
  notes: candidateNotes,
  tasks: followUpTasks,

  addRequest: ({ candidateId, kind, channel, entryId }) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          id: `req-${candidateId}-${kind}-${Date.now()}`,
          candidateId,
          kind,
          status: "open",
          askedAt: new Date().toISOString(),
          askedChannel: channel,
          askedEntryId: entryId,
          askedCount: 1,
        },
      ],
    })),

  registerRepeatAsk: (requestId, channel, entryId) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              askedCount: request.askedCount + 1,
              askedAt: new Date().toISOString(),
              askedChannel: channel,
              askedEntryId: entryId,
              status: "open",
            }
          : request,
      ),
    })),

  resolveRequest: (requestId, note) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "fulfilled",
              resolvedAt: new Date().toISOString(),
              resolvedNote: note ?? "Marked as received by the recruiter",
            }
          : request,
      ),
    })),

  reopenRequest: (requestId) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "open",
              resolvedAt: undefined,
              resolvedChannel: undefined,
              resolvedEntryId: undefined,
              resolvedNote: undefined,
            }
          : request,
      ),
    })),

  addNote: (candidateId, body) =>
    set((state) => ({
      notes: [
        {
          id: `note-${candidateId}-${Date.now()}`,
          candidateId,
          author: RECRUITER_NAME,
          body,
          createdAt: new Date().toISOString(),
        },
        ...state.notes,
      ],
    })),

  addTask: (candidateId, title, dueAt) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: `task-${candidateId}-${Date.now()}`,
          candidateId,
          title,
          dueAt,
          status: "open",
        },
      ],
    })),

  toggleTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "open" ? "done" : "open" }
          : task,
      ),
    })),
}));
