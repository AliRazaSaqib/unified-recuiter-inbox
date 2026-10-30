import { useState } from "react";
import { Plus } from "lucide-react";
import { ChannelGlyph } from "@/components/channel/channel-glyph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { formatDueDate } from "@/lib/format";
import { useNow } from "@/hooks/use-now";
import { useTranslation } from "@/i18n/use-translation";
import type { FollowUpTask } from "@/types/domain";

interface TasksPanelProps {
  tasks: FollowUpTask[];
  onToggle: (taskId: string) => void;
  onAdd: (title: string) => void;
}

export function TasksPanel({ tasks, onToggle, onAdd }: TasksPanelProps) {
  const { t } = useTranslation();
  const now = useNow();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    setAdding(false);
  };

  const sorted = [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    return a.dueAt.localeCompare(b.dueAt);
  });

  return (
    <div className="space-y-2">
      {sorted.length === 0 ? (
        <p className="text-[12.5px] text-ink-muted">{t("tasks.empty")}</p>
      ) : (
        <ul className="space-y-1">
          {sorted.map((task) => {
            const overdue = task.status === "open" && new Date(task.dueAt).getTime() < now;
            return (
              <li key={task.id} className="flex items-start gap-2">
                <button
                  onClick={() => onToggle(task.id)}
                  aria-label={t(task.status === "done" ? "tasks.reopen" : "tasks.complete")}
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0 rounded-[5px] border transition",
                    task.status === "done"
                      ? "border-accent bg-accent"
                      : "border-border-strong hover:border-accent",
                  )}
                >
                  {task.status === "done" ? (
                    <svg viewBox="0 0 12 12" className="h-full w-full text-accent-ink">
                      <path
                        d="M3 6.2 5 8.2 9 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : null}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-[12.5px] leading-snug",
                      task.status === "done" ? "text-ink-faint line-through" : "text-ink",
                    )}
                  >
                    {task.title}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 flex items-center gap-1 text-[10.5px]",
                      overdue ? "font-semibold text-critical" : "text-ink-faint",
                    )}
                  >
                    {task.channel ? <ChannelGlyph channel={task.channel} size="xs" /> : null}
                    {task.status === "done" ? t("tasks.completed") : formatDueDate(task.dueAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <div className="flex gap-1.5">
          <Input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
              if (event.key === "Escape") setAdding(false);
            }}
            placeholder={t("tasks.addPlaceholder")}
            className="h-8"
          />
          <Button size="sm" variant="primary" onClick={submit}>
            {t("tasks.addConfirm")}
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
        >
          <Plus className="h-3 w-3" />
          {t("tasks.add")}
        </button>
      )}
    </div>
  );
}
