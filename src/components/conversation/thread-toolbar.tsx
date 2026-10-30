import { Eye, EyeOff } from "lucide-react";
import { CHANNELS } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { SearchField } from "@/components/ui/search-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { ChannelId } from "@/types/domain";

interface ThreadToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  channels: ChannelId[];
  mutedChannels: ChannelId[];
  onToggleChannel: (channel: ChannelId) => void;
  onReset: () => void;
  matchCount: number;
  totalCount: number;
}

export function ThreadToolbar({
  query,
  onQueryChange,
  channels,
  mutedChannels,
  onToggleChannel,
  onReset,
  matchCount,
  totalCount,
}: ThreadToolbarProps) {
  const { t } = useTranslation();
  const filtering = query.trim().length > 0 || mutedChannels.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface px-3 py-2 sm:px-4">
      <SearchField
        value={query}
        onChange={onQueryChange}
        placeholder={t("conversation.threadSearchPlaceholder")}
        className="min-w-[180px] flex-1"
      />

      <div className="scrollbar-slim flex max-w-full items-center gap-1 overflow-x-auto">
        {channels.map((channel) => {
          const muted = mutedChannels.includes(channel);
          return (
            <button
              key={channel}
              onClick={() => onToggleChannel(channel)}
              title={t(muted ? "conversation.showChannel" : "conversation.hideChannel", {
                channel: CHANNELS[channel].label,
              })}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-control border px-2 text-[11.5px] font-medium transition",
                muted
                  ? "border-border-subtle bg-surface-sunken text-ink-faint line-through"
                  : "border-border-subtle bg-surface text-ink-muted hover:border-border-strong hover:text-ink",
              )}
            >
              <ChannelGlyph channel={channel} size="xs" className={cn(muted && "grayscale")} />
              <span className="hidden xl:inline">{CHANNELS[channel].label}</span>
              {muted ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-40" />}
            </button>
          );
        })}
      </div>

      {filtering ? (
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] text-ink-muted tabular-nums">
            {t("conversation.matchCounter", { match: matchCount, total: totalCount })}
          </span>
          <Button size="sm" variant="ghost" onClick={onReset}>
            {t("conversation.reset")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
