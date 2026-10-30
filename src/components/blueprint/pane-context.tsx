import { useTranslation } from "@/i18n/use-translation";
import { ACCENT, FAINT, INK, MUTED, PANE, STROKE, SUNKEN } from "./diagram-tokens";

const REACHABLE: [string, string][] = [
  ["var(--app-ch-whatsapp)", "channel.whatsapp"],
  ["var(--app-ch-email)", "channel.email"],
];

export function PaneContext() {
  const { t } = useTranslation();

  return (
    <g>
      <rect x="728" y="56" width="256" height="398" rx="10" fill={PANE} stroke={STROKE} />
      <text x="742" y="78" fill={INK} fontSize="12" fontWeight="700">
        {t("blueprint.diagram.paneContext")}
      </text>
      <circle cx="760" cy="104" r="14" fill={ACCENT} />
      <rect x="782" y="94" width="100" height="8" rx="4" fill={INK} opacity="0.75" />
      <rect x="782" y="108" width="140" height="6" rx="3" fill={MUTED} opacity="0.4" />

      {[0, 1, 2, 3, 4].map((index) => (
        <rect
          key={index}
          x={742 + index * 47}
          y="130"
          width="40"
          height="5"
          rx="2.5"
          fill={index < 3 ? ACCENT : STROKE}
        />
      ))}

      <rect
        x="742"
        y="152"
        width="228"
        height="96"
        rx="9"
        fill="var(--app-warning-soft)"
        stroke="var(--app-warning)"
        strokeOpacity="0.4"
      />
      <text x="754" y="170" fill="var(--app-warning)" fontSize="9.5" fontWeight="700">
        {t("blueprint.diagram.requestsHeading")}
      </text>
      <text x="754" y="188" fill={INK} fontSize="9">
        {t("blueprint.diagram.requestOpen")}
      </text>
      <text x="754" y="206" fill={MUTED} fontSize="9">
        {t("blueprint.diagram.requestCv")}
      </text>
      <text x="754" y="224" fill={MUTED} fontSize="9">
        {t("blueprint.diagram.requestAvailability")}
      </text>
      <text x="754" y="240" fill={FAINT} fontSize="8.5">
        {t("blueprint.diagram.requestsFooter")}
      </text>

      <rect x="742" y="262" width="228" height="62" rx="9" fill={SUNKEN} stroke={STROKE} />
      <text x="754" y="280" fill={MUTED} fontSize="9.5" fontWeight="700">
        {t("blueprint.diagram.followUpsHeading")}
      </text>
      <text x="754" y="298" fill="var(--app-critical)" fontSize="9">
        {t("blueprint.diagram.followUpOverdue")}
      </text>
      <text x="754" y="314" fill={MUTED} fontSize="9">
        {t("blueprint.diagram.followUpToday")}
      </text>

      <rect x="742" y="338" width="228" height="56" rx="9" fill={SUNKEN} stroke={STROKE} />
      <text x="754" y="356" fill={MUTED} fontSize="9.5" fontWeight="700">
        {t("blueprint.diagram.reachableHeading")}
      </text>
      {REACHABLE.map(([color, labelKey], index) => (
        <g key={labelKey}>
          <circle cx="760" cy={372 + index * 14} r="4" fill={color} />
          <text x="772" y={375 + index * 14} fill={MUTED} fontSize="8.5">
            {t(labelKey)}
          </text>
          <circle cx="950" cy={372 + index * 14} r="3" fill="var(--app-positive)" />
        </g>
      ))}

      <rect x="742" y="406" width="228" height="38" rx="9" fill={SUNKEN} stroke={STROKE} />
      <text x="754" y="424" fill={MUTED} fontSize="9.5" fontWeight="700">
        {t("blueprint.diagram.notesHeading")}
      </text>
      <text x="754" y="438" fill={FAINT} fontSize="8.5">
        {t("blueprint.diagram.notesFooter")}
      </text>
    </g>
  );
}
