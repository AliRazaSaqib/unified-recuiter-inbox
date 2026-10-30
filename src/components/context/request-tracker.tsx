import { ArrowRight, Check, CircleDashed, RotateCcw } from "lucide-react";
import { CHANNELS } from "@/config/channels";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import { requestLabelOf } from "@/lib/request-detection";
import { useTranslation } from "@/i18n/use-translation";
import type { CandidateRequest } from "@/types/domain";

interface RequestTrackerProps {
  requests: CandidateRequest[];
  onResolve: (requestId: string) => void;
  onReopen: (requestId: string) => void;
  onJumpToEntry: (entryId: string) => void;
}

export function RequestTracker({
  requests,
  onResolve,
  onReopen,
  onJumpToEntry,
}: RequestTrackerProps) {
  const { t } = useTranslation();

  if (requests.length === 0) {
    return <p className="text-[12.5px] leading-relaxed text-ink-muted">{t("requests.empty")}</p>;
  }

  const open = requests.filter((request) => request.status === "open");
  const fulfilled = requests.filter((request) => request.status === "fulfilled");

  return (
    <div className="space-y-3">
      {open.length > 0 ? (
        <ul className="space-y-1.5">
          {open.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onResolve={onResolve}
              onReopen={onReopen}
              onJumpToEntry={onJumpToEntry}
            />
          ))}
        </ul>
      ) : null}

      {fulfilled.length > 0 ? (
        <div>
          <p className="mb-1.5 text-[10.5px] font-semibold tracking-wider text-ink-faint uppercase">
            {t("requests.alreadyReceived")}
          </p>
          <ul className="space-y-1.5">
            {fulfilled.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onResolve={onResolve}
                onReopen={onReopen}
                onJumpToEntry={onJumpToEntry}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function RequestCard({
  request,
  onResolve,
  onReopen,
  onJumpToEntry,
}: {
  request: CandidateRequest;
  onResolve: (requestId: string) => void;
  onReopen: (requestId: string) => void;
  onJumpToEntry: (entryId: string) => void;
}) {
  const { t } = useTranslation();
  const done = request.status === "fulfilled";

  return (
    <li
      className={cn(
        "group rounded-control border px-2.5 py-2 transition",
        done
          ? "border-border-subtle bg-surface-sunken/60"
          : "border-warning/30 bg-warning-soft/40",
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
            done ? "bg-positive text-white" : "text-warning",
          )}
        >
          {done ? <Check className="h-2.5 w-2.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[12.5px] font-medium",
              done ? "text-ink-muted line-through decoration-ink-faint/40" : "text-ink",
            )}
          >
            {requestLabelOf(request)}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink-muted">
            <button
              onClick={() => onJumpToEntry(request.askedEntryId)}
              className="inline-flex items-center gap-1 rounded hover:underline"
              title={t("requests.jumpToAsk")}
            >
              <ChannelGlyph channel={request.askedChannel} size="xs" />
              {t("requests.askedWhen", { when: formatRelative(request.askedAt) })}
            </button>

            {request.askedCount > 1 ? (
              <span className="rounded-full bg-critical-soft px-1.5 font-semibold text-critical">
                {t("requests.askedTimes", { count: request.askedCount })}
              </span>
            ) : null}

            {done && request.resolvedChannel ? (
              <>
                <ArrowRight className="h-2.5 w-2.5 text-ink-faint" />
                <button
                  onClick={() =>
                    request.resolvedEntryId && onJumpToEntry(request.resolvedEntryId)
                  }
                  className="inline-flex items-center gap-1 rounded font-medium text-positive hover:underline"
                  title={t("requests.jumpToAnswer")}
                >
                  <ChannelGlyph channel={request.resolvedChannel} size="xs" />
                  {t("requests.viaChannel", {
                    channel: CHANNELS[request.resolvedChannel].label,
                  })}
                </button>
              </>
            ) : null}
          </div>

          {done && request.resolvedNote ? (
            <p className="mt-1 truncate text-[11px] text-ink-faint">{request.resolvedNote}</p>
          ) : null}
        </div>

        <Button
          size="icon-sm"
          variant="ghost"
          className="opacity-0 transition group-hover:opacity-100"
          title={t(done ? "requests.markOutstanding" : "requests.markReceived")}
          aria-label={t(done ? "requests.reopen" : "requests.markReceived")}
          onClick={() => (done ? onReopen(request.id) : onResolve(request.id))}
        >
          {done ? <RotateCcw className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </li>
  );
}
