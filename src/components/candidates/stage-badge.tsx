import { STAGE_TONES } from "@/config/stages";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n/use-translation";
import type { CandidateStage } from "@/types/domain";

interface StageBadgeProps {
  stage: CandidateStage;
  size?: "sm" | "md";
}

export function StageBadge({ stage, size = "sm" }: StageBadgeProps) {
  const { t } = useTranslation();

  return (
    <Badge tone={STAGE_TONES[stage]} size={size} dot>
      {t(`stage.${stage}`)}
    </Badge>
  );
}
