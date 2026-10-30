import { useTranslation } from "@/i18n/use-translation";
import { ACCENT, FAINT, INK, PANE, STROKE, SUNKEN } from "./diagram-tokens";
import { PaneCandidates } from "./pane-candidates";
import { PaneContext } from "./pane-context";
import { PaneConversation } from "./pane-conversation";

export function LayoutDiagram() {
  const { t } = useTranslation();

  return (
    <svg
      viewBox="0 0 1000 470"
      className="h-auto w-full"
      role="img"
      aria-label={t("blueprint.diagram.layoutAria")}
    >
      <rect
        x="4"
        y="4"
        width="992"
        height="462"
        rx="14"
        fill={SUNKEN}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      <rect x="4" y="4" width="992" height="40" rx="14" fill={PANE} stroke={STROKE} />
      <circle cx="28" cy="24" r="5" fill={ACCENT} />
      <text x="44" y="28" fill={INK} fontSize="12" fontWeight="600">
        {t("app.name")}
      </text>
      <text x="452" y="28" fill={FAINT} fontSize="11">
        {t("blueprint.diagram.chromeActions")}
      </text>

      <PaneCandidates />
      <PaneConversation />
      <PaneContext />
    </svg>
  );
}
