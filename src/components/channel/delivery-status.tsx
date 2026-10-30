import { AlertCircle, Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/i18n/use-translation";
import type { DeliveryStatus as Status } from "@/types/domain";

interface DeliveryStatusProps {
  status: Status;
  className?: string;
  withLabel?: boolean;
}

export function DeliveryStatus({ status, className, withLabel }: DeliveryStatusProps) {
  const { t } = useTranslation();
  const label = t(`delivery.${status}`);
  const Icon =
    status === "queued"
      ? Clock
      : status === "failed"
        ? AlertCircle
        : status === "sent"
          ? Check
          : CheckCheck;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px]",
        status === "read" && "text-accent",
        status === "failed" && "text-critical",
        status !== "read" && status !== "failed" && "text-ink-faint",
        className,
      )}
      title={label}
    >
      <Icon className={cn("h-3 w-3", status === "queued" && "animate-pulse")} />
      {withLabel ? label : null}
    </span>
  );
}
