import { t } from "@/i18n/dictionary";
import type { CandidateRequest, RequestKind } from "@/types/domain";

interface RequestMatcher {
  kind: RequestKind;
  patterns: RegExp[];
}

const MATCHERS: RequestMatcher[] = [
  {
    kind: "cv",
    patterns: [/\bcv\b/i, /\bresume\b/i, /\bcurriculum vitae\b/i],
  },
  {
    kind: "availability",
    patterns: [
      /\bavailability\b/i,
      /\bare you (free|available)\b/i,
      /\bwhat times?\b/i,
      /\bwhen (are|can) you\b/i,
      /\bbook (a|the) (call|slot|interview)\b/i,
    ],
  },
  {
    kind: "salary",
    patterns: [
      /\bsalary\b/i,
      /\bcompensation\b/i,
      /\bexpected package\b/i,
      /\bday rate\b/i,
      /\bpay expectation/i,
    ],
  },
  {
    kind: "notice_period",
    patterns: [/\bnotice period\b/i, /\bhow (long|much) notice\b/i, /\bwhen (could|can) you start\b/i],
  },
  {
    kind: "portfolio",
    patterns: [/\bportfolio\b/i, /\bcase stud(y|ies)\b/i, /\bgithub\b/i, /\bdribbble\b/i],
  },
  {
    kind: "references",
    patterns: [/\breferences?\b/i, /\breferees?\b/i],
  },
  {
    kind: "documents",
    patterns: [
      /\bpassport\b/i,
      /\bvisa\b/i,
      /\bemirates id\b/i,
      /\bright to work\b/i,
      /\bdegree certificate\b/i,
    ],
  },
];

export function requestLabel(kind: RequestKind) {
  return t(`requests.label.${kind}`);
}

export function detectRequestKinds(text: string): RequestKind[] {
  if (!text.trim()) return [];
  const asking = /\?|\bcould you\b|\bcan you\b|\bplease send\b|\bshare\b|\bsend (me|over|across)\b|\bdo you have\b|\bwhat('?s| is)\b/i.test(
    text,
  );
  if (!asking) return [];

  return MATCHERS.filter((matcher) => matcher.patterns.some((pattern) => pattern.test(text))).map(
    (matcher) => matcher.kind,
  );
}

export interface AskGuard {
  request: CandidateRequest;
  severity: "already_received" | "already_asked";
}

export function findAskGuards(
  draftText: string,
  requests: CandidateRequest[],
): AskGuard[] {
  const kinds = detectRequestKinds(draftText);
  if (kinds.length === 0) return [];

  return kinds
    .map((kind) => {
      const request = requests.find((item) => item.kind === kind);
      if (!request) return null;
      return {
        request,
        severity:
          request.status === "fulfilled"
            ? ("already_received" as const)
            : ("already_asked" as const),
      };
    })
    .filter((guard): guard is AskGuard => guard !== null);
}

export function openRequestsOf(requests: CandidateRequest[]) {
  return requests.filter((request) => request.status === "open");
}

export function fulfilledRequestsOf(requests: CandidateRequest[]) {
  return requests.filter((request) => request.status === "fulfilled");
}

export function requestLabelOf(request: CandidateRequest) {
  return request.labelKey ? t(request.labelKey) : requestLabel(request.kind);
}
