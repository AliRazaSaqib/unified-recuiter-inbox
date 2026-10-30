export interface WhatsAppPayload {
  wamid: string;
  candidate_ref: string;
  from: string;
  to: string;
  timestamp: string;
  type: "text" | "document";
  text?: { body: string };
  document?: { filename: string; mime_type: string; file_size: number };
  status: "sent" | "delivered" | "read" | "failed";
  errors?: { title: string }[];
}

export interface LinkedInPayload {
  urn: string;
  candidate_ref: string;
  conversationUrn: string;
  senderType: "RECRUITER" | "MEMBER";
  createdAt: number;
  subject?: string;
  body: string;
  seen: boolean;
}

export interface EmailPayload {
  messageId: string;
  candidate_ref: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  bodyText: string;
  internalDate: string;
  labelIds: string[];
  attachments?: { filename: string; mimeType: string; sizeBytes: number }[];
}

export interface SmsPayload {
  sid: string;
  candidate_ref: string;
  from: string;
  to: string;
  body: string;
  date_sent: string;
  direction: "inbound" | "outbound-api";
  status: "delivered" | "sent" | "failed";
  error_message?: string;
}

export interface CallPayload {
  callId: string;
  candidate_ref: string;
  direction: "inbound" | "outbound";
  startedAt: string;
  durationSeconds: number;
  disposition: "completed" | "missed" | "voicemail" | "no-answer";
  aiSummary: string;
  transcript: { speaker: "agent" | "contact"; offsetMs: number; utterance: string }[];
}

export interface SystemPayload {
  eventId: string;
  candidate_ref: string;
  occurredAt: string;
  kind: "channel_switch" | "stage_change" | "consent" | "assignment";
  surface: "whatsapp" | "linkedin" | "email" | "sms" | "call";
  description: string;
}
