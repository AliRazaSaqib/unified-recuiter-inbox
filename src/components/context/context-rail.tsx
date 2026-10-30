import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ContactChannels } from "./contact-channels";
import { InteractionStats } from "./interaction-stats";
import { NotesPanel } from "./notes-panel";
import { RailSection } from "./rail-section";
import { RequestTracker } from "./request-tracker";
import { StageProgress } from "./stage-progress";
import { TasksPanel } from "./tasks-panel";
import { formatAgo } from "@/lib/format";
import { useTranslation } from "@/i18n/use-translation";
import { useInboxStore } from "@/store/use-inbox-store";
import { useTrackingStore } from "@/store/use-tracking-store";
import type { CandidateSummary } from "@/hooks/use-candidate-summaries";
import type { CandidateStage, ChannelId } from "@/types/domain";

interface ContextRailProps {
  summary: CandidateSummary;
  onJumpToEntry: (entryId: string) => void;
  onComposeOn: (channel: ChannelId) => void;
}

export function ContextRail({ summary, onJumpToEntry, onComposeOn }: ContextRailProps) {
  const { t } = useTranslation();
  const { candidate, entries } = summary;

  const setStage = useInboxStore((state) => state.setStage);

  const allRequests = useTrackingStore((state) => state.requests);
  const allNotes = useTrackingStore((state) => state.notes);
  const allTasks = useTrackingStore((state) => state.tasks);

  const requests = useMemo(
    () => allRequests.filter((request) => request.candidateId === candidate.id),
    [allRequests, candidate.id],
  );
  const notes = useMemo(
    () => allNotes.filter((note) => note.candidateId === candidate.id),
    [allNotes, candidate.id],
  );
  const tasks = useMemo(
    () => allTasks.filter((task) => task.candidateId === candidate.id),
    [allTasks, candidate.id],
  );

  const resolveRequest = useTrackingStore((state) => state.resolveRequest);
  const reopenRequest = useTrackingStore((state) => state.reopenRequest);
  const addNote = useTrackingStore((state) => state.addNote);
  const addTask = useTrackingStore((state) => state.addTask);
  const toggleTask = useTrackingStore((state) => state.toggleTask);

  const openRequests = requests.filter((request) => request.status === "open").length;
  const openTasks = tasks.filter((task) => task.status === "open").length;

  const handleStage = (stage: CandidateStage) => setStage(candidate.id, stage);

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-border-subtle bg-surface">
      <div className="shrink-0 border-b border-border-subtle p-4">
        <div className="flex items-start gap-3">
          <Avatar name={candidate.name} color={candidate.avatarColor} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[14.5px] font-semibold text-ink">{candidate.name}</h2>
            <p className="truncate text-[12px] text-ink-muted">{candidate.headline}</p>
            <p className="mt-0.5 truncate text-[11px] text-ink-faint">
              {t("profile.ownerLine", {
                owner: candidate.owner,
                when: formatAgo(candidate.appliedAt),
              })}
            </p>
          </div>
        </div>

        {candidate.tags.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {candidate.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-3">
          <StageProgress stage={candidate.stage} onChange={handleStage} />
        </div>
      </div>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
        <RailSection
          title={t("requests.sectionTitle")}
          badge={
            openRequests > 0 ? (
              <Badge tone="warning" size="sm">
                {t("requests.openCount", { count: openRequests })}
              </Badge>
            ) : (
              <Badge tone="positive" size="sm">
                {t("requests.allClear")}
              </Badge>
            )
          }
        >
          <RequestTracker
            requests={requests}
            onResolve={resolveRequest}
            onReopen={reopenRequest}
            onJumpToEntry={onJumpToEntry}
          />
        </RailSection>

        <RailSection
          title={t("tasks.sectionTitle")}
          badge={
            openTasks > 0 ? (
              <Badge tone="accent" size="sm">
                {openTasks}
              </Badge>
            ) : undefined
          }
        >
          <TasksPanel
            tasks={tasks}
            onToggle={toggleTask}
            onAdd={(title) =>
              addTask(candidate.id, title, new Date(Date.now() + 86_400_000).toISOString())
            }
          />
        </RailSection>

        <RailSection title={t("contacts.sectionTitle")}>
          <ContactChannels candidate={candidate} onCompose={onComposeOn} />
        </RailSection>

        <RailSection title={t("notes.sectionTitle")} defaultOpen={false}>
          <NotesPanel notes={notes} onAdd={(body) => addNote(candidate.id, body)} />
        </RailSection>

        <RailSection title={t("stats.sectionTitle")} defaultOpen={false}>
          <InteractionStats entries={entries} />
        </RailSection>
      </div>
    </aside>
  );
}
