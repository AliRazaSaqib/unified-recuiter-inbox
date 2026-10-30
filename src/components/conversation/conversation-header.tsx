import { ArrowLeft, PanelRightClose, PanelRightOpen, Phone, Video } from "lucide-react";
import { CHANNELS, CHANNEL_ORDER } from "@/config/channels";
import { STAGE_ORDER } from "@/config/stages";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { Candidate, CandidateStage, ChannelHealth } from "@/types/domain";

const HEALTH_DOT: Record<ChannelHealth, string> = {
  connected: "bg-positive",
  degraded: "bg-warning",
  unavailable: "bg-critical",
  not_linked: "bg-border-strong",
};

interface ConversationHeaderProps {
  candidate: Candidate;
  compact: boolean;
  onBack?: () => void;
  channelCount: number;
  messageCount: number;
  contextRailOpen: boolean;
  onToggleContextRail: () => void;
  onStageChange: (stage: CandidateStage) => void;
  onStartCall: () => void;
}

export function ConversationHeader({
  candidate,
  compact,
  onBack,
  channelCount,
  messageCount,
  contextRailOpen,
  onToggleContextRail,
  onStageChange,
  onStartCall,
}: ConversationHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border-subtle bg-surface px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
      {onBack ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label={t("conversation.backToList")}
          className="-ml-1 shrink-0 md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      ) : null}

      <Avatar name={candidate.name} color={candidate.avatarColor} className="hidden sm:flex" />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-[15px] font-semibold text-ink">{candidate.name}</h1>
        </div>
        <p className="truncate text-[12px] text-ink-muted">
          {candidate.roleAppliedFor}
          <span className="hidden sm:inline">
            {" · "}
            {candidate.location} · {candidate.timezone}
          </span>
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Tooltip
          side="bottom"
          label={t("conversation.interactionSummary", {
            count: messageCount,
            channels: channelCount,
          })}
        >
          <span className="hidden items-center gap-1 rounded-control border border-border-subtle bg-surface-sunken px-2 py-1.5 xl:inline-flex">
            {CHANNEL_ORDER.map((channel) => {
              const health = candidate.channelHealth[channel];
              return (
                <span key={channel} className="relative">
                  <ChannelGlyph
                    channel={channel}
                    size="sm"
                    className={cn(health === "not_linked" && "opacity-35")}
                  />
                  <span
                    className={cn(
                      "absolute -right-0.5 -bottom-0.5 h-1.5 w-1.5 rounded-full ring-2 ring-surface-sunken",
                      HEALTH_DOT[health],
                    )}
                    aria-label={`${CHANNELS[channel].label}: ${t(`channel.health.${health}`)}`}
                  />
                </span>
              );
            })}
          </span>
        </Tooltip>

        <Select<CandidateStage>
          value={candidate.stage}
          onChange={onStageChange}
          aria-label={t("conversation.stageLabel")}
          className="w-[108px] sm:w-[116px]"
          options={STAGE_ORDER.map((stage) => ({
            value: stage,
            label: t(`stage.${stage}`),
          }))}
        />

        <Tooltip side="bottom" label={t("conversation.startCall")}>
          <Button
            variant="outline"
            size="icon"
            onClick={onStartCall}
            disabled={candidate.channelHealth.call !== "connected"}
            aria-label={t("conversation.callCandidate")}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip side="bottom" label={t("conversation.videoInterview")} className="hidden sm:inline-flex">
          <Button variant="outline" size="icon" aria-label={t("conversation.startVideo")}>
            <Video className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip
          side="bottom"
          label={t(contextRailOpen ? "conversation.hideContext" : "conversation.showContext")}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleContextRail}
            aria-label={t("conversation.toggleContext")}
          >
            {contextRailOpen && !compact ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}
