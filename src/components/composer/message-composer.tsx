import { useMemo, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Sparkles, TriangleAlert } from "lucide-react";
import { CHANNELS } from "@/config/channels";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { AskGuardBanner } from "./ask-guard-banner";
import { ChannelPicker } from "./channel-picker";
import { QuickReplies } from "./quick-replies";
import { cn } from "@/lib/cn";
import { findAskGuards } from "@/lib/request-detection";
import { useTranslation } from "@/i18n/use-translation";
import type { Candidate, CandidateRequest, ChannelId } from "@/types/domain";
import type { Draft } from "@/store/use-conversation-store";

interface MessageComposerProps {
  candidate: Candidate;
  draft: Draft;
  requests: CandidateRequest[];
  lastInboundChannel?: ChannelId;
  onDraftChange: (patch: Partial<Draft>) => void;
  onSend: () => void;
  onJumpToEntry: (entryId: string) => void;
}

export function MessageComposer({
  candidate,
  draft,
  requests,
  lastInboundChannel,
  onDraftChange,
  onSend,
  onJumpToEntry,
}: MessageComposerProps) {
  const { t } = useTranslation();
  const [guardDismissed, setGuardDismissed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const meta = CHANNELS[draft.channel];
  const health = candidate.channelHealth[draft.channel];
  const blocked = health === "unavailable" || health === "not_linked";

  const guards = useMemo(
    () => findAskGuards(draft.body, requests),
    [draft.body, requests],
  );

  const visibleGuards = guardDismissed ? [] : guards;
  const overLimit = meta.charLimit ? draft.body.length > meta.charLimit : false;
  const canSend = draft.body.trim().length > 0 && !blocked && !overLimit;

  const recipient =
    draft.channel === "email"
      ? candidate.contacts.email
      : draft.channel === "linkedin"
        ? candidate.contacts.linkedinUrl
        : candidate.contacts.phone;

  const handleSend = () => {
    if (!canSend) return;
    onSend();
    setGuardDismissed(false);
  };

  const applyQuickReply = (text: string) => {
    onDraftChange({ body: draft.body ? `${draft.body.trimEnd()} ${text}` : text });
    setGuardDismissed(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="shrink-0 border-t border-border-subtle bg-surface">
      <AskGuardBanner
        guards={visibleGuards}
        onJumpToEntry={onJumpToEntry}
        onDismiss={() => setGuardDismissed(true)}
      />

      <div className="flex flex-wrap items-center gap-2 px-3 pt-3 sm:px-4">
        <ChannelPicker
          value={draft.channel}
          onChange={(channel) => onDraftChange({ channel })}
          health={candidate.channelHealth}
          lastInboundChannel={lastInboundChannel}
        />

        <div className="flex min-w-0 items-center gap-1.5 text-[11.5px] text-ink-muted">
          <span className="text-ink-faint">{t("composer.to")}</span>
          <span className="truncate font-medium text-ink">{recipient ?? "—"}</span>
        </div>

        <QuickReplies
          channel={draft.channel}
          onPick={applyQuickReply}
          className="order-last w-full sm:order-none sm:ml-auto sm:w-auto"
        />
      </div>

      {blocked ? (
        <p className="mx-3 mt-2 flex flex-wrap items-center gap-2 rounded-control border border-critical/35 bg-critical-soft px-3 py-2 text-[12.5px] text-critical sm:mx-4">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          {t("composer.unreachable", { name: candidate.name, channel: meta.label })}
          {lastInboundChannel && lastInboundChannel !== draft.channel ? (
            <button
              className="font-semibold underline underline-offset-2"
              onClick={() => onDraftChange({ channel: lastInboundChannel })}
            >
              {t("composer.useInstead", { channel: CHANNELS[lastInboundChannel].label })}
            </button>
          ) : null}
        </p>
      ) : health === "degraded" ? (
        <p className="mx-3 mt-2 flex items-center gap-2 rounded-control border border-warning/35 bg-warning-soft px-3 py-2 text-[12.5px] text-warning sm:mx-4">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          {t("composer.degraded", { channel: meta.label })}
        </p>
      ) : null}

      {meta.supportsSubject ? (
        <div className="px-3 pt-2 sm:px-4">
          <Input
            value={draft.subject}
            onChange={(event) => onDraftChange({ subject: event.target.value })}
            placeholder={t("composer.subjectPlaceholder", { channel: meta.label })}
            className="h-9"
          />
        </div>
      ) : null}

      <div className="px-3 py-2 sm:px-4">
        <div
          className={cn(
            "rounded-panel border bg-surface transition focus-within:ring-2 focus-within:ring-accent/20",
            overLimit ? "border-critical" : "border-border-subtle focus-within:border-accent",
          )}
        >
          <Textarea
            ref={textareaRef}
            rows={3}
            value={draft.body}
            disabled={blocked}
            onChange={(event) => {
              onDraftChange({ body: event.target.value });
              setGuardDismissed(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("composer.placeholder", {
              name: candidate.name.split(" ")[0],
              channel: meta.label,
            })}
            className="border-0 bg-transparent focus:ring-0"
          />

          <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle px-2.5 py-2">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!meta.supportsAttachments || blocked}
              title={
                meta.supportsAttachments
                  ? t("composer.attach")
                  : t("composer.noAttachments", { channel: meta.label })
              }
              aria-label={t("composer.attach")}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" className="gap-1.5" disabled={blocked}>
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("composer.draftWithContext")}</span>
            </Button>

            <span className="hidden text-[11.5px] text-ink-faint md:inline">
              {meta.composeHint}
            </span>

            <div className="ml-auto flex items-center gap-2.5">
              {meta.charLimit ? (
                <span
                  className={cn(
                    "text-[11.5px] tabular-nums",
                    overLimit ? "font-semibold text-critical" : "text-ink-faint",
                  )}
                >
                  {draft.body.length}/{meta.charLimit}
                </span>
              ) : null}

              <Button
                variant="primary"
                size="md"
                onClick={handleSend}
                disabled={!canSend}
                className="gap-1.5"
              >
                <SendHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {t("composer.sendOnChannel", { channel: meta.label })}
                </span>
                <span className="sm:hidden">{meta.label}</span>
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-1.5 hidden text-center text-[11px] text-ink-faint sm:block">
          {t("composer.sendHintPrefix")}{" "}
          <kbd className="rounded border border-border-subtle px-1">⌘</kbd>
          <kbd className="rounded border border-border-subtle px-1">↵</kbd>{" "}
          {t("composer.sendHintSuffix")}
        </p>
      </div>
    </div>
  );
}
