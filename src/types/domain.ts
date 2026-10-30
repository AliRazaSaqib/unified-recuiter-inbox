export type ChannelId = "whatsapp" | "linkedin" | "email" | "sms" | "call";

export type Direction = "inbound" | "outbound";

export type DeliveryStatus = "queued" | "sent" | "delivered" | "read" | "failed";

export type ChannelHealth = "connected" | "degraded" | "unavailable" | "not_linked";

export type CandidateStage =
  | "sourced"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export type CallOutcome = "completed" | "missed" | "voicemail" | "no_answer";

export type RequestKind =
  | "cv"
  | "availability"
  | "salary"
  | "documents"
  | "portfolio"
  | "references"
  | "notice_period";

export type RequestStatus = "open" | "fulfilled" | "declined";

export type TaskStatus = "open" | "done";

export interface Attachment {
  id: string;
  name: string;
  sizeKb: number;
  kind: "pdf" | "doc" | "image" | "audio" | "link";
}

export interface TranscriptLine {
  id: string;
  speaker: "recruiter" | "candidate";
  startSec: number;
  text: string;
}

interface TimelineEntryBase {
  id: string;
  candidateId: string;
  channel: ChannelId;
  direction: Direction;
  timestamp: string;
  sourceRef: string;
}

export interface MessageEntry extends TimelineEntryBase {
  type: "message";
  body: string;
  subject?: string;
  status: DeliveryStatus;
  attachments: Attachment[];
  authorName: string;
  failureReason?: string;
  optimistic?: boolean;
}

export interface CallEntry extends TimelineEntryBase {
  type: "call";
  channel: "call";
  durationSec: number;
  outcome: CallOutcome;
  summary: string;
  transcript: TranscriptLine[];
  authorName: string;
}

export interface SystemEntry extends TimelineEntryBase {
  type: "system";
  kind: "channel_switch" | "stage_change" | "consent" | "assignment";
  body: string;
}

export type TimelineEntry = MessageEntry | CallEntry | SystemEntry;

export interface CandidateRequest {
  id: string;
  candidateId: string;
  kind: RequestKind;
  labelKey?: string;
  status: RequestStatus;
  askedAt: string;
  askedChannel: ChannelId;
  askedEntryId: string;
  askedCount: number;
  resolvedAt?: string;
  resolvedChannel?: ChannelId;
  resolvedEntryId?: string;
  resolvedNote?: string;
}

export interface CandidateNote {
  id: string;
  candidateId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface FollowUpTask {
  id: string;
  candidateId: string;
  title: string;
  dueAt: string;
  status: TaskStatus;
  channel?: ChannelId;
}

export interface CandidateContacts {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  whatsapp?: string;
}

export interface Candidate {
  id: string;
  name: string;
  headline: string;
  roleAppliedFor: string;
  location: string;
  timezone: string;
  stage: CandidateStage;
  avatarColor: string;
  contacts: CandidateContacts;
  channelHealth: Record<ChannelId, ChannelHealth>;
  tags: string[];
  owner: string;
  pinned: boolean;
  appliedAt: string;
}

export interface ChannelMeta {
  id: ChannelId;
  label: string;
  colorVar: string;
  canCompose: boolean;
  supportsAttachments: boolean;
  supportsSubject: boolean;
  charLimit?: number;
  composeHint: string;
}
