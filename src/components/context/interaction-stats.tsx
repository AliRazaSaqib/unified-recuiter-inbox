import { useMemo } from "react";
import { CHANNELS, CHANNEL_ORDER } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { formatAgo, formatFullTimestamp } from "@/lib/format";
import { useTranslation } from "@/i18n/use-translation";
import type { TimelineEntry } from "@/types/domain";

interface InteractionStatsProps {
  entries: TimelineEntry[];
}

export function InteractionStats({ entries }: InteractionStatsProps) {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const conversational = entries.filter((entry) => entry.type !== "system");
    const perChannel = CHANNEL_ORDER.map((channel) => ({
      channel,
      count: conversational.filter((entry) => entry.channel === channel).length,
    })).filter((item) => item.count > 0);

    const max = Math.max(1, ...perChannel.map((item) => item.count));

    const inbound = conversational.filter((entry) => entry.direction === "inbound");
    const outbound = conversational.filter((entry) => entry.direction === "outbound");

    return {
      perChannel,
      max,
      total: conversational.length,
      inbound: inbound.length,
      outbound: outbound.length,
      first: conversational[0],
      lastInbound: inbound.at(-1),
    };
  }, [entries]);

  if (stats.total === 0) {
    return <p className="text-[12.5px] text-ink-muted">{t("stats.empty")}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t("stats.total")} value={stats.total} />
        <Stat label={t("stats.received")} value={stats.inbound} />
        <Stat label={t("stats.sent")} value={stats.outbound} />
      </div>

      <ul className="space-y-1.5">
        {stats.perChannel.map(({ channel, count }) => (
          <li key={channel} className="flex items-center gap-2">
            <ChannelGlyph channel={channel} size="xs" />
            <span className="w-16 shrink-0 text-[11.5px] text-ink-muted">
              {CHANNELS[channel].label}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${(count / stats.max) * 100}%`,
                  backgroundColor: CHANNELS[channel].colorVar,
                }}
              />
            </span>
            <span className="w-5 text-right text-[11.5px] text-ink-faint tabular-nums">
              {count}
            </span>
          </li>
        ))}
      </ul>

      <dl className="space-y-1 border-t border-border-subtle pt-2.5 text-[11.5px]">
        {stats.first ? (
          <div className="flex justify-between gap-2">
            <dt className="text-ink-faint">{t("stats.firstContact")}</dt>
            <dd className="truncate text-ink-muted">
              {CHANNELS[stats.first.channel].label} · {formatFullTimestamp(stats.first.timestamp)}
            </dd>
          </div>
        ) : null}
        {stats.lastInbound ? (
          <div className="flex justify-between gap-2">
            <dt className="text-ink-faint">{t("stats.lastHeardFrom")}</dt>
            <dd className="truncate text-ink-muted">
              {CHANNELS[stats.lastInbound.channel].label} ·{" "}
              {formatAgo(stats.lastInbound.timestamp)}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-control border border-border-subtle bg-surface-sunken/60 px-2 py-1.5 text-center">
      <p className="text-[15px] font-semibold text-ink tabular-nums">{value}</p>
      <p className="text-[10px] tracking-wide text-ink-faint uppercase">{label}</p>
    </div>
  );
}
