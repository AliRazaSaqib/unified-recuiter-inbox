import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/i18n/use-translation";
import { Button } from "./button";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right" | "left";
  widthClassName?: string;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  side = "right",
  widthClassName = "w-[min(380px,92vw)]",
}: SheetProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={title}>
      <div className="animate-fade absolute inset-0 bg-black/45" onClick={onClose} />
      <div
        className={cn(
          "animate-rise relative flex h-full flex-col bg-surface shadow-pop",
          widthClassName,
          side === "right" ? "ml-auto border-l border-border-subtle" : "border-r border-border-subtle",
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <h2 className="truncate text-[13.5px] font-semibold text-ink">{title}</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label={t("common.close")}>
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
