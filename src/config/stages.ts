import { t } from "@/i18n/dictionary";
import type { CandidateStage } from "@/types/domain";

export const STAGE_ORDER: CandidateStage[] = [
  "sourced",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export const PIPELINE_STAGES: CandidateStage[] = [
  "sourced",
  "screening",
  "interview",
  "offer",
  "hired",
];

export function stageLabel(stage: CandidateStage) {
  return t(`stage.${stage}`);
}

export const STAGE_TONES: Record<
  CandidateStage,
  "neutral" | "accent" | "positive" | "warning" | "critical"
> = {
  sourced: "neutral",
  screening: "accent",
  interview: "warning",
  offer: "accent",
  hired: "positive",
  rejected: "critical",
};
