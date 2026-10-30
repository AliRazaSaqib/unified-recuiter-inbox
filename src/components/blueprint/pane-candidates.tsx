import { useTranslation } from "@/i18n/use-translation";
import { ACCENT, FAINT, INK, MUTED, PANE, STROKE, SUNKEN } from "./diagram-tokens";

const DOTS = ["var(--app-ch-whatsapp)", "var(--app-ch-linkedin)", "var(--app-ch-email)"];

export function PaneCandidates() {
  const { t } = useTranslation();

  return (
    <g>
      <rect x="16" y="56" width="248" height="398" rx="10" fill={PANE} stroke={STROKE} />
      <text x="30" y="78" fill={INK} fontSize="12" fontWeight="700">
        {t("blueprint.diagram.paneCandidates")}
      </text>
      <rect x="30" y="88" width="220" height="22" rx="7" fill={SUNKEN} />
      <text x="40" y="103" fill={FAINT} fontSize="10">
        {t("blueprint.diagram.listSearch")}
      </text>
      <rect x="30" y="118" width="220" height="20" rx="7" fill={SUNKEN} />
      <text x="40" y="132" fill={MUTED} fontSize="9.5">
        {t("blueprint.diagram.listTabs")}
      </text>

      {[0, 1, 2, 3].map((index) => {
        const y = 150 + index * 74;
        const active = index === 0;
        return (
          <g key={index}>
            <rect
              x="30"
              y={y}
              width="220"
              height="66"
              rx="9"
              fill={active ? "var(--app-accent-soft)" : "transparent"}
              stroke={active ? ACCENT : STROKE}
              strokeWidth={active ? 1.5 : 1}
            />
            <circle cx="50" cy={y + 22} r="12" fill={ACCENT} opacity={0.85} />
            <rect x="70" y={y + 12} width="90" height="8" rx="4" fill={INK} opacity="0.75" />
            <rect x="200" y={y + 12} width="34" height="8" rx="4" fill={FAINT} opacity="0.5" />
            <rect x="70" y={y + 26} width="150" height="6" rx="3" fill={MUTED} opacity="0.45" />
            <rect x="70" y={y + 38} width="120" height="6" rx="3" fill={MUTED} opacity="0.3" />
            <rect x="70" y={y + 50} width="46" height="10" rx="5" fill={ACCENT} opacity="0.2" />
            {DOTS.map((color, dot) => (
              <circle key={color} cx={192 + dot * 14} cy={y + 55} r="5" fill={color} />
            ))}
          </g>
        );
      })}

      <text x="30" y="448" fill={FAINT} fontSize="9.5">
        {t("blueprint.diagram.listFooter")}
      </text>
    </g>
  );
}
