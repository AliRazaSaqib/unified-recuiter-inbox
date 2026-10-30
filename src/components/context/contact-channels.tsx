import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { CHANNELS, CHANNEL_ORDER } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { Candidate, ChannelHealth, ChannelId } from "@/types/domain";

const HEALTH_CLASS: Record<ChannelHealth, string> = {
  connected: "text-positive",
  degraded: "text-warning",
  unavailable: "text-critical",
  not_linked: "text-ink-faint",
};

interface ContactChannelsProps {
  candidate: Candidate;
  onCompose: (channel: ChannelId) => void;
}

export function ContactChannels({ candidate, onCompose }: ContactChannelsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  const handleOf = (channel: ChannelId) => {
    switch (channel) {
      case "email":
        return candidate.contacts.email;
      case "linkedin":
        return candidate.contacts.linkedinUrl;
      case "whatsapp":
        return candidate.contacts.whatsapp;
      default:
        return candidate.contacts.phone;
    }
  };

  const copy = (value: string) => {
    void navigator.clipboard?.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1400);
  };

  return (
    <ul className="space-y-1">
      {CHANNEL_ORDER.map((channel) => {
        const handle = handleOf(channel);
        const health = candidate.channelHealth[channel];
        const usable = health === "connected" || health === "degraded";

        return (
          <li
            key={channel}
            className="group flex items-center gap-2 rounded-control px-1.5 py-1.5 transition hover:bg-surface-sunken"
          >
            <ChannelGlyph channel={channel} size="sm" className={cn(!handle && "opacity-40")} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-ink">
                {handle ?? t("contacts.noHandle", { channel: CHANNELS[channel].label })}
              </p>
              <p className={cn("text-[10.5px]", HEALTH_CLASS[health])}>
                {CHANNELS[channel].label} · {t(`channel.health.${health}`)}
              </p>
            </div>

            {handle ? (
              <button
                onClick={() => copy(handle)}
                aria-label={t("contacts.copy", { channel: CHANNELS[channel].label })}
                className="rounded p-1 text-ink-faint opacity-0 transition group-hover:opacity-100 hover:text-ink"
              >
                {copied === handle ? (
                  <Check className="h-3 w-3 text-positive" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            ) : null}

            {usable && CHANNELS[channel].canCompose ? (
              <button
                onClick={() => onCompose(channel)}
                className="rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold text-accent opacity-0 transition group-hover:opacity-100 hover:bg-accent-soft"
              >
                {t("contacts.write")}
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
