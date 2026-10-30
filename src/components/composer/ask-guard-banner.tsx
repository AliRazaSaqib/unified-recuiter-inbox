import { CheckCircle2, Clock3, X } from "lucide-react";
import { CHANNELS } from "@/config/channels";
import { ChannelTag } from "@/components/channel/channel-tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import { requestLabelOf } from "@/lib/request-detection";
import { useTranslation } from "@/i18n/use-translation";
import type { AskGuard } from "@/lib/request-detection";

interface AskGuardBannerProps {
  guards: AskGuard[];
  onJumpToEntry: (entryId: string) => void;
  onDismiss: () => void;
}

export function AskGuardBanner({ guards, onJumpToEntry, onDismiss }: AskGuardBannerProps) {
  const { t } = useTranslation();

  if (guards.length === 0) return null;

  return (
    <div className="animate-rise space-y-1.5 px-3 pt-3 sm:px-4">
      {guards.map(({ request, severity }) => {
        const received = severity === "already_received";
        return (
          <div
            key={request.id}
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-control border px-3 py-2 text-[12.5px]",
              received
                ? "border-positive/35 bg-positive-soft text-positive"
                : "border-warning/35 bg-warning-soft text-warning",
            )}
            role="status"
          >
            {received ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Clock3 className="h-4 w-4 shrink-0" />
            )}

            <span className="flex flex-wrap items-center gap-1.5">
              <strong className="font-semibold">
                {t(received ? "askGuard.alreadyHave" : "askGuard.alreadyAsked")}
              </strong>
              <span className="opacity-90">
                {t("askGuard.askedOn", {
                  label: requestLabelOf(request),
                  channel: CHANNELS[request.askedChannel].label,
                  when: formatRelative(request.askedAt),
                })}
                {request.askedCount > 1
                  ? ` · ${t("askGuard.askedTimes", { count: request.askedCount })}`
                  : ""}
              </span>
              {received && request.resolvedChannel ? (
                <span className="inline-flex items-center gap-1 opacity-90">
                  · {t("askGuard.receivedVia")}
                  <ChannelTag channel={request.resolvedChannel} />
                  {request.resolvedNote ? `(${request.resolvedNote})` : null}
                </span>
              ) : null}
            </span>

            <div className="ml-auto flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-current hover:bg-black/5"
                onClick={() =>
                  onJumpToEntry(
                    received && request.resolvedEntryId
                      ? request.resolvedEntryId
                      : request.askedEntryId,
                  )
                }
              >
                {t("askGuard.showMe")}
              </Button>
              <button
                onClick={onDismiss}
                aria-label={t("askGuard.dismiss")}
                className="rounded p-1 opacity-60 transition hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
