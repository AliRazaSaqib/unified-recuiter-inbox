import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatAgo } from "@/lib/format";
import { useTranslation } from "@/i18n/use-translation";
import type { CandidateNote } from "@/types/domain";

interface NotesPanelProps {
  notes: CandidateNote[];
  onAdd: (body: string) => void;
}

export function NotesPanel({ notes, onAdd }: NotesPanelProps) {
  const { t } = useTranslation();
  const [body, setBody] = useState("");

  const submit = () => {
    if (!body.trim()) return;
    onAdd(body.trim());
    setBody("");
  };

  return (
    <div className="space-y-2.5">
      <div className="rounded-control border border-border-subtle bg-surface focus-within:border-accent">
        <Textarea
          rows={2}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) submit();
          }}
          placeholder={t("notes.placeholder")}
          className="border-0 bg-transparent text-[12.5px] focus:ring-0"
        />
        {body.trim() ? (
          <div className="flex justify-end px-2 pb-2">
            <Button size="sm" variant="primary" onClick={submit}>
              {t("notes.save")}
            </Button>
          </div>
        ) : null}
      </div>

      {notes.length === 0 ? (
        <p className="text-[12.5px] text-ink-muted">{t("notes.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-control border-l-2 border-accent/40 bg-surface-sunken/70 px-2.5 py-2"
            >
              <p className="text-[12.5px] leading-relaxed text-ink">{note.body}</p>
              <p className="mt-1 text-[10.5px] text-ink-faint">
                {note.author} · {formatAgo(note.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
