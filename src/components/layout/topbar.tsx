import { LayoutPanelLeft, Moon, RadioTower, Sun, WifiOff, Workflow } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { RECRUITER_NAME } from "@/data/workspace";
import { useTranslation } from "@/i18n/use-translation";
import { useWorkspaceStore, type WorkspaceView } from "@/store/use-workspace-store";

export function Topbar() {
  const { t } = useTranslation();
  const theme = useWorkspaceStore((state) => state.theme);
  const toggleTheme = useWorkspaceStore((state) => state.toggleTheme);
  const view = useWorkspaceStore((state) => state.view);
  const setView = useWorkspaceStore((state) => state.setView);
  const realtimeEnabled = useWorkspaceStore((state) => state.realtimeEnabled);
  const toggleRealtime = useWorkspaceStore((state) => state.toggleRealtime);
  const toggleListCollapsed = useWorkspaceStore((state) => state.toggleListCollapsed);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border-subtle bg-surface px-2 sm:gap-3 sm:px-3">
      <Tooltip label={t("topbar.toggleList")} side="bottom" className="hidden md:inline-flex">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleListCollapsed}
          aria-label={t("topbar.toggleList")}
        >
          <LayoutPanelLeft className="h-4 w-4" />
        </Button>
      </Tooltip>

      <div className="flex min-w-0 items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] bg-accent text-accent-ink">
          <Workflow className="h-4 w-4" />
        </span>
        <div className="hidden min-w-0 leading-tight sm:block">
          <p className="truncate text-[13px] font-semibold tracking-tight whitespace-nowrap text-ink">
            {t("app.name")}
          </p>
          <p className="hidden text-[10.5px] text-ink-faint lg:block">{t("app.tagline")}</p>
        </div>
      </div>

      <div className="mx-auto shrink-0">
        <SegmentedControl<WorkspaceView>
          value={view}
          onChange={setView}
          options={[
            { value: "inbox", label: t("topbar.viewWorkspace") },
            { value: "blueprint", label: t("topbar.viewBlueprint") },
          ]}
        />
      </div>

      <Tooltip
        label={t(realtimeEnabled ? "topbar.liveOn" : "topbar.liveOff")}
        side="bottom"
        className="hidden sm:inline-flex"
      >
        <Button
          variant={realtimeEnabled ? "subtle" : "ghost"}
          size="sm"
          onClick={toggleRealtime}
          className="gap-1.5"
        >
          {realtimeEnabled ? (
            <RadioTower className="h-3.5 w-3.5" />
          ) : (
            <WifiOff className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{t(realtimeEnabled ? "topbar.live" : "topbar.paused")}</span>
        </Button>
      </Tooltip>

      <Tooltip label={t(theme === "light" ? "topbar.themeDark" : "topbar.themeLight")} side="bottom">
        <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label={t("topbar.toggleTheme")}>
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </Tooltip>

      <div className="flex items-center gap-2 border-l border-border-subtle pl-2 sm:pl-3">
        <div className="hidden text-right leading-tight lg:block">
          <p className="text-[12px] font-medium text-ink">{RECRUITER_NAME}</p>
          <p className="text-[10.5px] text-ink-faint">{t("app.org")}</p>
        </div>
        <Avatar name={RECRUITER_NAME} color="#0f766e" size="sm" />
      </div>
    </header>
  );
}
