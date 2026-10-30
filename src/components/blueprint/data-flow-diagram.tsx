import { useTranslation } from "@/i18n/use-translation";

const STROKE = "var(--app-border-strong)";
const PANE = "var(--app-surface)";
const SUNKEN = "var(--app-surface-sunken)";
const INK = "var(--app-ink)";
const MUTED = "var(--app-ink-muted)";
const FAINT = "var(--app-ink-faint)";

const SOURCES = [
  { label: "WhatsApp API", shape: "wamid · unix ts · status", color: "var(--app-ch-whatsapp)" },
  { label: "LinkedIn API", shape: "urn · epoch ms · seen", color: "var(--app-ch-linkedin)" },
  { label: "Email API", shape: "messageId · labelIds", color: "var(--app-ch-email)" },
  { label: "SMS API", shape: "sid · RFC 2822 · direction", color: "var(--app-ch-sms)" },
  { label: "Calls API", shape: "callId · transcript[]", color: "var(--app-ch-call)" },
];

export function DataFlowDiagram() {
  const { t } = useTranslation();

  return (
    <svg
      viewBox="0 0 1000 400"
      className="h-auto w-full"
      role="img"
      aria-label={t("blueprint.diagram.flowAria")}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={STROKE} />
        </marker>
      </defs>

      <text x="20" y="24" fill={FAINT} fontSize="10" fontWeight="700" letterSpacing="1">
        {t("blueprint.diagram.sourcesHeading")}
      </text>
      {SOURCES.map((source, index) => {
        const y = 36 + index * 66;
        return (
          <g key={source.label}>
            <rect
              x="20"
              y={y}
              width="190"
              height="52"
              rx="9"
              fill={PANE}
              stroke={source.color}
              strokeWidth="1.5"
            />
            <rect x="20" y={y} width="4" height="52" rx="2" fill={source.color} />
            <text x="36" y={y + 22} fill={INK} fontSize="11.5" fontWeight="600">
              {source.label}
            </text>
            <text x="36" y={y + 38} fill={FAINT} fontSize="9">
              {source.shape}
            </text>
            <line
              x1="212"
              y1={y + 26}
              x2="268"
              y2={y + 26}
              stroke={STROKE}
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          </g>
        );
      })}

      <text x="276" y="24" fill={FAINT} fontSize="10" fontWeight="700" letterSpacing="1">
        {t("blueprint.diagram.adaptersHeading")}
      </text>
      <rect
        x="276"
        y="36"
        width="172"
        height="316"
        rx="11"
        fill={SUNKEN}
        stroke={STROKE}
        strokeDasharray="5 4"
      />
      <text x="294" y="68" fill={INK} fontSize="12" fontWeight="700">
        {t("blueprint.diagram.adapterFile")}
      </text>
      <text x="294" y="90" fill={MUTED} fontSize="9.5">
        fromWhatsApp()
      </text>
      <text x="294" y="108" fill={MUTED} fontSize="9.5">
        fromLinkedIn()
      </text>
      <text x="294" y="126" fill={MUTED} fontSize="9.5">
        fromEmail()
      </text>
      <text x="294" y="144" fill={MUTED} fontSize="9.5">
        fromSms()
      </text>
      <text x="294" y="162" fill={MUTED} fontSize="9.5">
        fromCall()
      </text>
      <line x1="294" y1="178" x2="430" y2="178" stroke={STROKE} />
      <text x="294" y="198" fill={FAINT} fontSize="9">
        {t("blueprint.diagram.oneShape")}
      </text>
      <text x="294" y="216" fill={INK} fontSize="9.5" fontWeight="600">
        {t("blueprint.diagram.entryName")}
      </text>
      <text x="294" y="234" fill={MUTED} fontSize="8.5">
        id · candidateId
      </text>
      <text x="294" y="250" fill={MUTED} fontSize="8.5">
        channel · direction
      </text>
      <text x="294" y="266" fill={MUTED} fontSize="8.5">
        timestamp (ISO)
      </text>
      <text x="294" y="282" fill={MUTED} fontSize="8.5">
        body · status
      </text>
      <text x="294" y="298" fill={MUTED} fontSize="8.5">
        attachments[]
      </text>
      <text x="294" y="314" fill={MUTED} fontSize="8.5">
        sourceRef
      </text>
      <text x="294" y="336" fill={FAINT} fontSize="8.5">
        Channel detail preserved
      </text>

      <line
        x1="450"
        y1="194"
        x2="506"
        y2="194"
        stroke={STROKE}
        strokeWidth="1.5"
        markerEnd="url(#arrow)"
      />

      <text x="514" y="24" fill={FAINT} fontSize="10" fontWeight="700" letterSpacing="1">
        {t("blueprint.diagram.storesHeading")}
      </text>
      {[
        ["useInboxStore", "candidates · selection · filters · unread"],
        ["useConversationStore", "entries · drafts · optimistic send"],
        ["useTrackingStore", "requests · notes · follow-ups"],
        ["useWorkspaceStore", "theme · panels · live feed"],
      ].map(([name, detail], index) => {
        const y = 36 + index * 78;
        return (
          <g key={name}>
            <rect x="514" y={y} width="212" height="62" rx="9" fill={PANE} stroke={STROKE} />
            <text x="530" y={y + 24} fill={INK} fontSize="11.5" fontWeight="600">
              {name}
            </text>
            <text x="530" y={y + 42} fill={FAINT} fontSize="8.5">
              {detail}
            </text>
            <line
              x1="728"
              y1={y + 31}
              x2="784"
              y2={y + 31}
              stroke={STROKE}
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          </g>
        );
      })}

      <text x="792" y="24" fill={FAINT} fontSize="10" fontWeight="700" letterSpacing="1">
        {t("blueprint.diagram.uiHeading")}
      </text>
      {[
        ["CandidateList", "selectors + memo"],
        ["ConversationTimeline", "grouped by day"],
        ["MessageComposer", "ask guard"],
        ["ContextRail", "requests tracker"],
      ].map(([name, detail], index) => {
        const y = 36 + index * 78;
        return (
          <g key={name}>
            <rect
              x="792"
              y={y}
              width="188"
              height="62"
              rx="9"
              fill="var(--app-accent-soft)"
              stroke="var(--app-accent)"
              strokeOpacity="0.5"
            />
            <text x="808" y={y + 24} fill="var(--app-accent)" fontSize="11.5" fontWeight="600">
              {name}
            </text>
            <text x="808" y={y + 42} fill={MUTED} fontSize="8.5">
              {detail}
            </text>
          </g>
        );
      })}

      <g>
        <rect
          x="514"
          y="352"
          width="466"
          height="36"
          rx="9"
          fill={SUNKEN}
          stroke={STROKE}
          strokeDasharray="5 4"
        />
        <text x="530" y="374" fill={MUTED} fontSize="9.5">
          {t("blueprint.diagram.realtimeNote")}
        </text>
      </g>
    </svg>
  );
}
