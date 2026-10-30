import { useEffect } from "react";
import { BlueprintView } from "@/components/blueprint/blueprint-view";
import { Topbar } from "@/components/layout/topbar";
import { Workspace } from "@/components/layout/workspace";
import { useLiveChannelFeed } from "@/hooks/use-live-channel-feed";
import { useWorkspaceStore } from "@/store/use-workspace-store";

export default function App() {
  const theme = useWorkspaceStore((state) => state.theme);
  const view = useWorkspaceStore((state) => state.view);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useLiveChannelFeed();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-canvas">
      <Topbar />
      {view === "inbox" ? <Workspace /> : <BlueprintView />}
    </div>
  );
}
