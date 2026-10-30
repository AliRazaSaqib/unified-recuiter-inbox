import { ListFilter, X } from "lucide-react";
import { CHANNELS, CHANNEL_ORDER } from "@/config/channels";
import { STAGE_ORDER } from "@/config/stages";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import { useInboxStore, type InboxSort } from "@/store/use-inbox-store";

interface CandidateFiltersProps {
  open: boolean;
  onToggle: () => void;
}

export function CandidateFilters({ open, onToggle }: CandidateFiltersProps) {
  const { t } = useTranslation();
  const stageFilter = useInboxStore((state) => state.stageFilter);
  const channelFilter = useInboxStore((state) => state.channelFilter);
  const sort = useInboxStore((state) => state.sort);
  const setStageFilter = useInboxStore((state) => state.setStageFilter);
  const setChannelFilter = useInboxStore((state) => state.setChannelFilter);
  const setSort = useInboxStore((state) => state.setSort);
  const clearFilters = useInboxStore((state) => state.clearFilters);

  const dirty = stageFilter !== "all" || channelFilter !== "all";

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant={open || dirty ? "subtle" : "ghost"}
          size="sm"
          onClick={onToggle}
          className="gap-1.5"
        >
          <ListFilter className="h-3.5 w-3.5" />
          {t("filters.label")}
          {dirty ? (
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          ) : null}
        </Button>

        <Select<InboxSort>
          value={sort}
          onChange={setSort}
          size="sm"
          aria-label={t("filters.sortLabel")}
          className="ml-auto w-[124px]"
          options={[
            { value: "recent", label: t("filters.sortRecent") },
            { value: "unread", label: t("filters.sortUnread") },
            { value: "name", label: t("filters.sortName") },
          ]}
        />
      </div>

      {open ? (
        <div className="animate-rise mt-2.5 space-y-3 rounded-control border border-border-subtle bg-surface-sunken p-2.5">
          <div>
            <p className="mb-1.5 text-[10.5px] font-semibold tracking-wider text-ink-faint uppercase">
              {t("filters.stageHeading")}
            </p>
            <div className="flex flex-wrap gap-1">
              <FilterChip
                active={stageFilter === "all"}
                onClick={() => setStageFilter("all")}
                label={t("filters.anyStage")}
              />
              {STAGE_ORDER.map((stage) => (
                <FilterChip
                  key={stage}
                  active={stageFilter === stage}
                  onClick={() => setStageFilter(stage)}
                  label={t(`stage.${stage}`)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[10.5px] font-semibold tracking-wider text-ink-faint uppercase">
              {t("filters.channelHeading")}
            </p>
            <div className="flex flex-wrap gap-1">
              <FilterChip
                active={channelFilter === "all"}
                onClick={() => setChannelFilter("all")}
                label={t("filters.anyChannel")}
              />
              {CHANNEL_ORDER.map((channel) => (
                <FilterChip
                  key={channel}
                  active={channelFilter === channel}
                  onClick={() => setChannelFilter(channel)}
                  label={CHANNELS[channel].label}
                  icon={<ChannelGlyph channel={channel} size="xs" />}
                />
              ))}
            </div>
          </div>

          {dirty ? (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
            >
              <X className="h-3 w-3" />
              {t("filters.clear")}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-6.5 items-center gap-1 rounded-full border px-2 text-[11.5px] font-medium transition",
        active
          ? "border-transparent bg-accent text-accent-ink"
          : "border-border-subtle bg-surface text-ink-muted hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
