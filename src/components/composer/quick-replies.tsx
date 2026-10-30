import { Zap } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { ChannelId } from "@/types/domain";

const SNIPPETS: { id: string; channels?: ChannelId[] }[] = [
  { id: "shareBrief", channels: ["email", "whatsapp"] },
  { id: "proposeTimes" },
  { id: "confirmInWriting" },
  { id: "chasePolitely" },
];

interface QuickRepliesProps {
  channel: ChannelId;
  onPick: (text: string) => void;
  className?: string;
}

export function QuickReplies({ channel, onPick, className }: QuickRepliesProps) {
  const { t } = useTranslation();
  const available = SNIPPETS.filter(
    (snippet) => !snippet.channels || snippet.channels.includes(channel),
  );

  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto", className)}>
      <Zap className="h-3 w-3 shrink-0 text-ink-faint" />
      {available.map((snippet) => (
        <button
          key={snippet.id}
          onClick={() => onPick(t(`composer.quickReplies.${snippet.id}Text`))}
          className="shrink-0 rounded-full border border-border-subtle bg-surface px-2 py-1 text-[11px] font-medium text-ink-muted transition hover:border-border-strong hover:text-ink"
        >
          {t(`composer.quickReplies.${snippet.id}`)}
        </button>
      ))}
    </div>
  );
}
