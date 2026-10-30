import { CHANNELS } from "@/config/channels";
import { cn } from "@/lib/cn";
import type { ChannelId } from "@/types/domain";
import { ChannelGlyph } from "./channel-glyph";

interface ChannelTagProps {
  channel: ChannelId;
  className?: string;
  showLabel?: boolean;
}

export function ChannelTag({ channel, className, showLabel = true }: ChannelTagProps) {
  const meta = CHANNELS[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tracking-wide",
        className,
      )}
      style={{
        color: meta.colorVar,
        backgroundColor: `color-mix(in oklab, ${meta.colorVar} 12%, transparent)`,
      }}
    >
      <ChannelGlyph channel={channel} size="xs" className="bg-transparent!" />
      {showLabel ? meta.label : null}
    </span>
  );
}
