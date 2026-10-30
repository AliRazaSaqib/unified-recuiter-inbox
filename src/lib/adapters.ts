import { RECRUITER_NAME, WORKSPACE_EMAIL, WORKSPACE_PHONE } from "@/data/workspace";
import { callPayloads } from "@/data/providers/calls";
import { emailPayloads } from "@/data/providers/email";
import { linkedinPayloads } from "@/data/providers/linkedin";
import { smsPayloads } from "@/data/providers/sms";
import { systemPayloads } from "@/data/providers/system";
import { whatsappPayloads } from "@/data/providers/whatsapp";
import type {
  CallPayload,
  EmailPayload,
  LinkedInPayload,
  SmsPayload,
  SystemPayload,
  WhatsAppPayload,
} from "@/data/providers/types";
import type {
  Attachment,
  CallEntry,
  DeliveryStatus,
  MessageEntry,
  SystemEntry,
  TimelineEntry,
} from "@/types/domain";

function attachmentKind(mimeType: string): Attachment["kind"] {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("image")) return "image";
  if (mimeType.includes("audio")) return "audio";
  return "doc";
}

export function fromWhatsApp(payload: WhatsAppPayload): MessageEntry {
  const outbound = payload.from === WORKSPACE_PHONE;
  const attachments: Attachment[] = payload.document
    ? [
        {
          id: `${payload.wamid}-doc`,
          name: payload.document.filename,
          sizeKb: Math.round(payload.document.file_size / 1024),
          kind: attachmentKind(payload.document.mime_type),
        },
      ]
    : [];

  return {
    id: `wa:${payload.wamid}`,
    candidateId: payload.candidate_ref,
    type: "message",
    channel: "whatsapp",
    direction: outbound ? "outbound" : "inbound",
    timestamp: new Date(Number(payload.timestamp) * 1000).toISOString(),
    body: payload.text?.body ?? payload.document?.filename ?? "",
    status: payload.status as DeliveryStatus,
    attachments,
    authorName: outbound ? RECRUITER_NAME : "Candidate",
    failureReason: payload.errors?.[0]?.title,
    sourceRef: payload.wamid,
  };
}

export function fromLinkedIn(payload: LinkedInPayload): MessageEntry {
  const outbound = payload.senderType === "RECRUITER";
  return {
    id: `li:${payload.urn}`,
    candidateId: payload.candidate_ref,
    type: "message",
    channel: "linkedin",
    direction: outbound ? "outbound" : "inbound",
    timestamp: new Date(payload.createdAt).toISOString(),
    body: payload.body,
    subject: payload.subject,
    status: payload.seen ? "read" : "delivered",
    attachments: [],
    authorName: outbound ? RECRUITER_NAME : "Candidate",
    sourceRef: payload.urn,
  };
}

export function fromEmail(payload: EmailPayload): MessageEntry {
  const outbound = payload.from === WORKSPACE_EMAIL;
  return {
    id: `em:${payload.messageId}`,
    candidateId: payload.candidate_ref,
    type: "message",
    channel: "email",
    direction: outbound ? "outbound" : "inbound",
    timestamp: new Date(Number(payload.internalDate)).toISOString(),
    body: payload.bodyText,
    subject: payload.subject,
    status: outbound ? "delivered" : "read",
    attachments: (payload.attachments ?? []).map((file, index) => ({
      id: `${payload.messageId}-att-${index}`,
      name: file.filename,
      sizeKb: Math.round(file.sizeBytes / 1024),
      kind: attachmentKind(file.mimeType),
    })),
    authorName: outbound ? RECRUITER_NAME : "Candidate",
    sourceRef: payload.messageId,
  };
}

export function fromSms(payload: SmsPayload): MessageEntry {
  const outbound = payload.direction !== "inbound";
  return {
    id: `sms:${payload.sid}`,
    candidateId: payload.candidate_ref,
    type: "message",
    channel: "sms",
    direction: outbound ? "outbound" : "inbound",
    timestamp: new Date(payload.date_sent).toISOString(),
    body: payload.body,
    status: payload.status as DeliveryStatus,
    attachments: [],
    authorName: outbound ? RECRUITER_NAME : "Candidate",
    failureReason: payload.error_message,
    sourceRef: payload.sid,
  };
}

export function fromCall(payload: CallPayload): CallEntry {
  const outcomeMap = {
    completed: "completed",
    missed: "missed",
    voicemail: "voicemail",
    "no-answer": "no_answer",
  } as const;

  return {
    id: `call:${payload.callId}`,
    candidateId: payload.candidate_ref,
    type: "call",
    channel: "call",
    direction: payload.direction === "outbound" ? "outbound" : "inbound",
    timestamp: payload.startedAt,
    durationSec: payload.durationSeconds,
    outcome: outcomeMap[payload.disposition],
    summary: payload.aiSummary,
    transcript: payload.transcript.map((line, index) => ({
      id: `${payload.callId}-line-${index}`,
      speaker: line.speaker === "agent" ? "recruiter" : "candidate",
      startSec: Math.round(line.offsetMs / 1000),
      text: line.utterance,
    })),
    authorName: RECRUITER_NAME,
    sourceRef: payload.callId,
  };
}

export function fromSystem(payload: SystemPayload): SystemEntry {
  return {
    id: `sys:${payload.eventId}`,
    candidateId: payload.candidate_ref,
    type: "system",
    channel: payload.surface,
    direction: "outbound",
    timestamp: payload.occurredAt,
    kind: payload.kind,
    body: payload.description,
    sourceRef: payload.eventId,
  };
}

export function buildNormalizedTimeline(): TimelineEntry[] {
  return [
    ...whatsappPayloads.map(fromWhatsApp),
    ...linkedinPayloads.map(fromLinkedIn),
    ...emailPayloads.map(fromEmail),
    ...smsPayloads.map(fromSms),
    ...callPayloads.map(fromCall),
    ...systemPayloads.map(fromSystem),
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
