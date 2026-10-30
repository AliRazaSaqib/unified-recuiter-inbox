import { useTranslation } from "@/i18n/use-translation";
import { ACCENT, ACCENT_INK, FAINT, INK, MUTED, PANE, STROKE, SUNKEN } from "./diagram-tokens";

const COMPOSER_CHANNELS = [
  "var(--app-ch-whatsapp)",
  "var(--app-ch-linkedin)",
  "var(--app-ch-email)",
  "var(--app-ch-sms)",
];

export function PaneConversation() {
  const { t } = useTranslation();

  return (
    <g>
      <rect x="276" y="56" width="440" height="398" rx="10" fill={PANE} stroke={STROKE} />
      <text x="290" y="78" fill={INK} fontSize="12" fontWeight="700">
        {t("blueprint.diagram.paneConversation")}
      </text>
      <line x1="276" y1="88" x2="716" y2="88" stroke={STROKE} />
      <rect x="290" y="96" width="412" height="20" rx="7" fill={SUNKEN} />
      <text x="300" y="110" fill={FAINT} fontSize="9.5">
        {t("blueprint.diagram.threadSearch")}
      </text>

      <rect x="446" y="128" width="100" height="16" rx="8" fill={SUNKEN} />
      <text x="474" y="140" fill={MUTED} fontSize="9">
        {t("blueprint.diagram.dayChip")}
      </text>

      <rect x="290" y="154" width="250" height="46" rx="9" fill={SUNKEN} stroke={STROKE} />
      <rect x="290" y="154" width="3" height="46" fill="var(--app-ch-linkedin)" />
      <text x="302" y="170" fill="var(--app-ch-linkedin)" fontSize="9" fontWeight="700">
        {t("blueprint.diagram.linkedinReceived")}
      </text>
      <rect x="302" y="178" width="200" height="6" rx="3" fill={MUTED} opacity="0.45" />
      <rect x="302" y="188" width="150" height="6" rx="3" fill={MUTED} opacity="0.3" />

      <line x1="290" y1="216" x2="400" y2="216" stroke={STROKE} />
      <rect x="406" y="206" width="180" height="20" rx="10" fill={PANE} stroke={STROKE} />
      <text x="416" y="220" fill={MUTED} fontSize="9">
        {t("blueprint.diagram.switchMarker")}
      </text>
      <line x1="592" y1="216" x2="702" y2="216" stroke={STROKE} />

      <rect x="452" y="236" width="250" height="46" rx="9" fill={ACCENT} />
      <text x="464" y="252" fill={ACCENT_INK} fontSize="9" fontWeight="700">
        {t("blueprint.diagram.whatsappSent")}
      </text>
      <rect x="464" y="260" width="200" height="6" rx="3" fill="#fff" opacity="0.6" />
      <rect x="464" y="270" width="130" height="6" rx="3" fill="#fff" opacity="0.4" />

      <rect x="330" y="296" width="332" height="56" rx="9" fill={SUNKEN} stroke={STROKE} />
      <rect x="330" y="296" width="3" height="56" fill="var(--app-ch-call)" />
      <text x="344" y="314" fill="var(--app-ch-call)" fontSize="9" fontWeight="700">
        {t("blueprint.diagram.callRow")}
      </text>
      <rect x="344" y="322" width="290" height="6" rx="3" fill={MUTED} opacity="0.4" />
      <rect x="344" y="332" width="230" height="6" rx="3" fill={MUTED} opacity="0.28" />
      <rect
        x="556"
        y="300"
        width="96"
        height="16"
        rx="8"
        fill="var(--app-accent-soft)"
        stroke={ACCENT}
      />
      <text x="568" y="312" fill={ACCENT} fontSize="8.5" fontWeight="700">
        {t("blueprint.diagram.openTranscript")}
      </text>

      <rect
        x="290"
        y="364"
        width="412"
        height="24"
        rx="8"
        fill="var(--app-positive-soft)"
        stroke="var(--app-positive)"
      />
      <text x="302" y="380" fill="var(--app-positive)" fontSize="9" fontWeight="700">
        {t("blueprint.diagram.guardLine")}
      </text>

      <rect x="290" y="396" width="412" height="48" rx="9" fill={SUNKEN} stroke={STROKE} />
      {COMPOSER_CHANNELS.map((color, index) => (
        <rect
          key={color}
          x={300 + index * 42}
          y="404"
          width="38"
          height="16"
          rx="8"
          fill={index === 0 ? color : "transparent"}
          stroke={color}
          opacity={index === 0 ? 1 : 0.5}
        />
      ))}
      <text x="300" y="436" fill={FAINT} fontSize="9">
        {t("blueprint.diagram.composerPlaceholder")}
      </text>
      <rect x="586" y="424" width="106" height="16" rx="8" fill={ACCENT} />
      <text x="600" y="435.5" fill={ACCENT_INK} fontSize="8" fontWeight="700">
        {t("blueprint.diagram.sendButton")}
      </text>
    </g>
  );
}
