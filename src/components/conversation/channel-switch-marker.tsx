import { ArrowRight } from "lucide-react";
import { CHANNELS } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { formatGapLabel } from "@/lib/format";
import type { ChannelId } from "@/types/domain";

interface ChannelSwitchMarkerProps {
  from: ChannelId;
  to: ChannelId;
  gapHours: number;
}

export function ChannelSwitchMarker({ from, to, gapHours }: ChannelSwitchMarkerProps) {
  const gapLabel = formatGapLabel(gapHours);

  return (
    <div className="flex items-center gap-2 py-1" role="separator">
      <span className="h-px flex-1 bg-border-subtle" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-2 py-1 text-[11px] font-medium text-ink-muted shadow-sm">
        <ChannelGlyph channel={from} size="xs" />
        <span style={{ color: CHANNELS[from].colorVar }}>{CHANNELS[from].label}</span>
        <ArrowRight className="h-3 w-3 text-ink-faint" />
        <ChannelGlyph channel={to} size="xs" />
        <span style={{ color: CHANNELS[to].colorVar }}>{CHANNELS[to].label}</span>
        <span className="text-ink-faint">· {gapLabel}</span>
      </span>
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}
