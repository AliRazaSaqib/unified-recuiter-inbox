import { CHANNEL_ICONS, CHANNELS } from "@/config/channels";
import { cn } from "@/lib/cn";
import type { ChannelId } from "@/types/domain";

type Size = "xs" | "sm" | "md";

const BOX: Record<Size, string> = {
  xs: "h-4 w-4 rounded-[5px]",
  sm: "h-5.5 w-5.5 rounded-[7px]",
  md: "h-7 w-7 rounded-[9px]",
};

const GLYPH: Record<Size, string> = {
  xs: "h-2.5 w-2.5",
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
};

interface ChannelGlyphProps {
  channel: ChannelId;
  size?: Size;
  solid?: boolean;
  className?: string;
}

export function ChannelGlyph({
  channel,
  size = "sm",
  solid = false,
  className,
}: ChannelGlyphProps) {
  const Icon = CHANNEL_ICONS[channel];
  const color = CHANNELS[channel].colorVar;

  return (
    <span
      className={cn("inline-flex items-center justify-center", BOX[size], className)}
      style={
        solid
          ? { backgroundColor: color, color: "#fff" }
          : { backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`, color }
      }
      aria-hidden
    >
      <Icon className={GLYPH[size]} strokeWidth={2.2} />
    </span>
  );
}
