import { CHANNELS, COMPOSABLE_CHANNELS } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { ChannelHealth, ChannelId } from "@/types/domain";

interface ChannelPickerProps {
  value: ChannelId;
  onChange: (channel: ChannelId) => void;
  health: Record<ChannelId, ChannelHealth>;
  lastInboundChannel?: ChannelId;
}

export function ChannelPicker({
  value,
  onChange,
  health,
  lastInboundChannel,
}: ChannelPickerProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-1 rounded-[11px] border border-border-subtle bg-surface-sunken p-0.5"
      role="radiogroup"
      aria-label={t("composer.channelGroupLabel")}
    >
      {COMPOSABLE_CHANNELS.map((channel) => {
        const state = health[channel];
        const blocked = state === "unavailable" || state === "not_linked";
        const active = channel === value;
        const suggested = channel === lastInboundChannel && !active;

        return (
          <button
            key={channel}
            role="radio"
            aria-checked={active}
            disabled={blocked}
            title={
              state === "connected"
                ? t("composer.sendOnChannel", { channel: CHANNELS[channel].label })
                : t(`channel.blockedReason.${state}`)
            }
            onClick={() => onChange(channel)}
            className={cn(
              "relative inline-flex h-8 items-center gap-1.5 rounded-control px-2.5 text-[12px] font-medium transition",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-muted hover:text-ink disabled:opacity-40 disabled:hover:text-ink-muted",
              blocked && "cursor-not-allowed line-through",
            )}
            style={active ? { color: CHANNELS[channel].colorVar } : undefined}
          >
            <ChannelGlyph channel={channel} size="xs" solid={active} />
            <span className="hidden sm:inline">{CHANNELS[channel].label}</span>
            {state === "degraded" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            ) : null}
            {suggested ? (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-surface-sunken" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
