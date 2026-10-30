import { rfc2822 } from "../clock";
import { WORKSPACE_PHONE } from "../workspace";
import type { SmsPayload } from "./types";

export const smsPayloads: SmsPayload[] = [
  {
    sid: "SM0001",
    candidate_ref: "cand-ali",
    from: WORKSPACE_PHONE,
    to: "971501234567",
    body: "Ali — tried WhatsApp but it shows as undelivered. Confirming our call for 4pm today. Saad, HEADFOUND.",
    date_sent: rfc2822(3, "08:55"),
    direction: "outbound-api",
    status: "delivered",
  },
  {
    sid: "SM0002",
    candidate_ref: "cand-ali",
    from: "971501234567",
    to: WORKSPACE_PHONE,
    body: "Got it, 4pm works. I'm travelling with patchy data so SMS is safest today.",
    date_sent: rfc2822(3, "09:10"),
    direction: "inbound",
    status: "delivered",
  },
  {
    sid: "SM0010",
    candidate_ref: "cand-james",
    from: WORKSPACE_PHONE,
    to: "447700011223",
    body: "James — WhatsApp isn't reaching you. Offer letter lands tomorrow AM. Saad.",
    date_sent: rfc2822(1, "16:50"),
    direction: "outbound-api",
    status: "delivered",
  },
  {
    sid: "SM0011",
    candidate_ref: "cand-priya",
    from: WORKSPACE_PHONE,
    to: "923004455667",
    body: "Priya — panel ran long today, I'll have written feedback for you by tomorrow. Saad.",
    date_sent: rfc2822(1, "18:30"),
    direction: "outbound-api",
    status: "failed",
    error_message: "Carrier rejected the message (landline destination)",
  },
];
