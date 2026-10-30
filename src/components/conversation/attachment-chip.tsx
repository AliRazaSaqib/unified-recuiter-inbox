import { Download, FileText, Image as ImageIcon, Link2, Music } from "lucide-react";
import { formatFileSize } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Attachment } from "@/types/domain";

const ICONS = {
  pdf: FileText,
  doc: FileText,
  image: ImageIcon,
  audio: Music,
  link: Link2,
} as const;

interface AttachmentChipProps {
  attachment: Attachment;
  tone?: "default" | "inverse";
}

export function AttachmentChip({ attachment, tone = "default" }: AttachmentChipProps) {
  const Icon = ICONS[attachment.kind];

  return (
    <button
      className={cn(
        "group/att flex w-full items-center gap-2.5 rounded-control border px-2.5 py-2 text-left transition",
        tone === "inverse"
          ? "border-white/25 bg-white/10 hover:bg-white/20"
          : "border-border-subtle bg-surface hover:border-border-strong",
      )}
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          tone === "inverse" ? "bg-white/20" : "bg-critical-soft text-critical",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-medium">{attachment.name}</span>
        <span
          className={cn(
            "block text-[11px]",
            tone === "inverse" ? "text-white/70" : "text-ink-faint",
          )}
        >
          {formatFileSize(attachment.sizeKb)}
        </span>
      </span>
      <Download
        className={cn(
          "h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover/att:opacity-100",
          tone === "inverse" ? "text-white" : "text-ink-muted",
        )}
      />
    </button>
  );
}
