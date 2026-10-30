import { iso } from "../clock";
import type { SystemPayload } from "./types";

export const systemPayloads: SystemPayload[] = [
  {
    eventId: "sys-aa-01",
    candidate_ref: "cand-ali",
    occurredAt: iso(10, "19:03"),
    kind: "consent",
    surface: "whatsapp",
    description: "Candidate shared a mobile number on LinkedIn and opted in to WhatsApp contact.",
  },
  {
    eventId: "sys-aa-02",
    candidate_ref: "cand-ali",
    occurredAt: iso(4, "09:35"),
    kind: "stage_change",
    surface: "email",
    description: "Stage moved from Screening to Interview by Saad Rahman.",
  },
  {
    eventId: "sys-mk-01",
    candidate_ref: "cand-mariam",
    occurredAt: iso(1, "08:20"),
    kind: "stage_change",
    surface: "email",
    description: "Stage moved from Screening to Interview by Saad Rahman.",
  },
  {
    eventId: "sys-jc-01",
    candidate_ref: "cand-james",
    occurredAt: iso(3, "12:05"),
    kind: "stage_change",
    surface: "email",
    description: "Stage moved from Interview to Offer by Dana Vuković.",
  },
];
