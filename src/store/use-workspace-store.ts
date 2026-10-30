import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type WorkspaceView = "inbox" | "blueprint";

interface WorkspaceState {
  theme: ThemeMode;
  view: WorkspaceView;
  contextRailOpen: boolean;
  listCollapsed: boolean;
  realtimeEnabled: boolean;
  transcriptEntryId: string | null;
  mobilePane: "list" | "thread";
  contextSheetOpen: boolean;
  toggleTheme: () => void;
  setView: (view: WorkspaceView) => void;
  toggleContextRail: () => void;
  toggleListCollapsed: () => void;
  toggleRealtime: () => void;
  openTranscript: (entryId: string) => void;
  closeTranscript: () => void;
  showList: () => void;
  showThread: () => void;
  openContextSheet: () => void;
  closeContextSheet: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      theme: "light",
      view: "inbox",
      contextRailOpen: true,
      listCollapsed: false,
      realtimeEnabled: true,
      transcriptEntryId: null,
      mobilePane: "list",
      contextSheetOpen: false,
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setView: (view) => set({ view }),
      toggleContextRail: () => set((state) => ({ contextRailOpen: !state.contextRailOpen })),
      toggleListCollapsed: () => set((state) => ({ listCollapsed: !state.listCollapsed })),
      toggleRealtime: () => set((state) => ({ realtimeEnabled: !state.realtimeEnabled })),
      openTranscript: (entryId) => set({ transcriptEntryId: entryId }),
      closeTranscript: () => set({ transcriptEntryId: null }),
      showList: () => set({ mobilePane: "list" }),
      showThread: () => set({ mobilePane: "thread" }),
      openContextSheet: () => set({ contextSheetOpen: true }),
      closeContextSheet: () => set({ contextSheetOpen: false }),
    }),
    {
      name: "uri-workspace",
      partialize: (state) => ({
        theme: state.theme,
        contextRailOpen: state.contextRailOpen,
        listCollapsed: state.listCollapsed,
      }),
    },
  ),
);
