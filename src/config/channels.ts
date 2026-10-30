import type { ComponentType } from "react";
import { Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { LinkedinGlyph } from "@/components/channel/linkedin-glyph";
import { t } from "@/i18n/dictionary";
import type { ChannelId, ChannelMeta } from "@/types/domain";

export type ChannelIcon = ComponentType<{ className?: string; strokeWidth?: number }>;

export const CHANNEL_ORDER: ChannelId[] = ["whatsapp", "linkedin", "email", "sms", "call"];

export const CHANNEL_COLORS: Record<ChannelId, string> = {
  whatsapp: "var(--app-ch-whatsapp)",
  linkedin: "var(--app-ch-linkedin)",
  email: "var(--app-ch-email)",
  sms: "var(--app-ch-sms)",
  call: "var(--app-ch-call)",
};

const CAPABILITIES: Record<
  ChannelId,
  Pick<ChannelMeta, "canCompose" | "supportsAttachments" | "supportsSubject" | "charLimit">
> = {
  whatsapp: {
    canCompose: true,
    supportsAttachments: true,
    supportsSubject: false,
    charLimit: 4096,
  },
  linkedin: {
    canCompose: true,
    supportsAttachments: false,
    supportsSubject: true,
    charLimit: 1900,
  },
  email: { canCompose: true, supportsAttachments: true, supportsSubject: true },
  sms: { canCompose: true, supportsAttachments: false, supportsSubject: false, charLimit: 320 },
  call: { canCompose: false, supportsAttachments: false, supportsSubject: false },
};

export function channelMeta(id: ChannelId): ChannelMeta {
  return {
    id,
    label: t(`channel.${id}`),
    colorVar: CHANNEL_COLORS[id],
    composeHint: t(`channel.hint.${id}`),
    ...CAPABILITIES[id],
  };
}

export const CHANNELS = new Proxy({} as Record<ChannelId, ChannelMeta>, {
  get: (_target, prop: string) => channelMeta(prop as ChannelId),
});

export const CHANNEL_ICONS: Record<ChannelId, ChannelIcon> = {
  whatsapp: MessageCircle,
  linkedin: LinkedinGlyph,
  email: Mail,
  sms: MessageSquare,
  call: Phone,
};

export const COMPOSABLE_CHANNELS = CHANNEL_ORDER.filter((id) => CAPABILITIES[id].canCompose);
