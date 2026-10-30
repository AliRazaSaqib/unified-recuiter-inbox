import { PIPELINE_STAGES } from "@/config/stages";
import { useTranslation } from "@/i18n/use-translation";
import { cn } from "@/lib/cn";
import type { CandidateStage } from "@/types/domain";

interface StageProgressProps {
  stage: CandidateStage;
  onChange: (stage: CandidateStage) => void;
}

export function StageProgress({ stage, onChange }: StageProgressProps) {
  const { t } = useTranslation();

  if (stage === "rejected") {
    return (
      <div className="rounded-control border border-critical/30 bg-critical-soft px-3 py-2 text-[12.5px] font-medium text-critical">
        {t("profile.rejected")}
      </div>
    );
  }

  const currentIndex = PIPELINE_STAGES.indexOf(stage);

  return (
    <ol className="flex items-center gap-1">
      {PIPELINE_STAGES.map((item, index) => {
        const reached = index <= currentIndex;
        const current = index === currentIndex;
        return (
          <li key={item} className="flex min-w-0 flex-1 flex-col gap-1">
            <button
              onClick={() => onChange(item)}
              aria-current={current ? "step" : undefined}
              title={t("profile.moveToStage", { stage: t(`stage.${item}`) })}
              className={cn(
                "h-1.5 w-full rounded-full transition",
                reached ? "bg-accent" : "bg-border-subtle hover:bg-border-strong",
              )}
            />
            <span
              className={cn(
                "truncate text-[10px] font-medium",
                current ? "text-accent" : reached ? "text-ink-muted" : "text-ink-faint",
              )}
            >
              {t(`stage.${item}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
