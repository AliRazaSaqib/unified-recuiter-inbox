import { useCallback } from "react";
import { CandidateList } from "@/components/candidates/candidate-list";
import { ContextRail } from "@/components/context/context-rail";
import { ConversationPanel } from "@/components/conversation/conversation-panel";
import { Sheet } from "@/components/ui/sheet";
import { useSelectedSummary } from "@/hooks/use-candidate-summaries";
import { useLayout } from "@/hooks/use-media-query";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import { useConversationStore } from "@/store/use-conversation-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import type { ChannelId } from "@/types/domain";

export function Workspace() {
  const { t } = useTranslation();
  const layout = useLayout();

  const listCollapsed = useWorkspaceStore((state) => state.listCollapsed);
  const contextRailOpen = useWorkspaceStore((state) => state.contextRailOpen);
  const mobilePane = useWorkspaceStore((state) => state.mobilePane);
  const contextSheetOpen = useWorkspaceStore((state) => state.contextSheetOpen);
  const closeContextSheet = useWorkspaceStore((state) => state.closeContextSheet);

  const summary = useSelectedSummary();
  const setDraft = useConversationStore((state) => state.setDraft);
  const resetThreadFilters = useConversationStore((state) => state.resetThreadFilters);

  const candidateId = summary?.candidate.id ?? "";

  const jumpToEntry = useCallback(
    (entryId: string) => {
      resetThreadFilters();
      closeContextSheet();
      window.setTimeout(() => {
        const node = document.getElementById(`entry-${entryId}`);
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
        node?.classList.add("ring-2", "ring-accent", "ring-offset-4", "ring-offset-canvas");
        window.setTimeout(
          () =>
            node?.classList.remove(
              "ring-2",
              "ring-accent",
              "ring-offset-4",
              "ring-offset-canvas",
            ),
          2400,
        );
      }, 80);
    },
    [resetThreadFilters, closeContextSheet],
  );

  const composeOn = useCallback(
    (channel: ChannelId) => {
      if (!candidateId) return;
      closeContextSheet();
      setDraft(candidateId, { channel });
    },
    [candidateId, setDraft, closeContextSheet],
  );

  const rail = summary ? (
    <ContextRail summary={summary} onJumpToEntry={jumpToEntry} onComposeOn={composeOn} />
  ) : null;

  if (layout === "mobile") {
    return (
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className={cn("h-full", mobilePane === "list" ? "block" : "hidden")}>
          <CandidateList />
        </div>
        <div className={cn("h-full", mobilePane === "thread" ? "block" : "hidden")}>
          <ConversationPanel />
        </div>
        <Sheet
          open={contextSheetOpen}
          onClose={closeContextSheet}
          title={t("profile.sheetTitle")}
          widthClassName="w-full"
        >
          {rail}
        </Sheet>
      </div>
    );
  }

  if (layout === "tablet") {
    return (
      <div
        className="grid min-h-0 flex-1 overflow-hidden transition-[grid-template-columns] duration-200"
        style={{
          gridTemplateColumns: `${listCollapsed ? "0px" : "clamp(260px, 32vw, 320px)"} minmax(0, 1fr)`,
        }}
      >
        <div className={cn("min-h-0 overflow-hidden", listCollapsed && "pointer-events-none")}>
          <CandidateList />
        </div>
        <div className="min-h-0 overflow-hidden border-l border-border-subtle">
          <ConversationPanel />
        </div>
        <Sheet
          open={contextSheetOpen}
          onClose={closeContextSheet}
          title={t("profile.sheetTitle")}
        >
          {rail}
        </Sheet>
      </div>
    );
  }

  return (
    <div
      className="grid min-h-0 flex-1 overflow-hidden transition-[grid-template-columns] duration-200"
      style={{
        gridTemplateColumns: [
          listCollapsed ? "0px" : "clamp(280px, 23vw, 340px)",
          "minmax(0, 1fr)",
          contextRailOpen ? "clamp(300px, 24vw, 360px)" : "0px",
        ].join(" "),
      }}
    >
      <div className={cn("min-h-0 overflow-hidden", listCollapsed && "pointer-events-none")}>
        <CandidateList />
      </div>

      <div className="min-h-0 overflow-hidden border-x border-border-subtle">
        <ConversationPanel />
      </div>

      <div className={cn("min-h-0 overflow-hidden", !contextRailOpen && "pointer-events-none")}>
        {rail}
      </div>
    </div>
  );
}
