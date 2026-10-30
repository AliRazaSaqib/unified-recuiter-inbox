import { epochSeconds } from "../clock";
import { WORKSPACE_PHONE } from "../workspace";
import type { WhatsAppPayload } from "./types";

export const whatsappPayloads: WhatsAppPayload[] = [
  {
    wamid: "wamid.HBgLOTcxNTAxMjM0NTY3",
    candidate_ref: "cand-ali",
    from: WORKSPACE_PHONE,
    to: "971501234567",
    timestamp: String(epochSeconds(6, "09:12")),
    type: "text",
    text: {
      body: "Hi Ali, Saad from HEADFOUND here — moving us to WhatsApp as you suggested. Could you send across your latest CV so I can put you forward to the hiring manager?",
    },
    status: "read",
  },
  {
    wamid: "wamid.HBgLOTcxNTAxMjM0NTY4",
    candidate_ref: "cand-ali",
    from: "971501234567",
    to: WORKSPACE_PHONE,
    timestamp: String(epochSeconds(6, "09:40")),
    type: "text",
    text: { body: "Hi Saad! Sure. Give me until this evening and I'll send the updated one." },
    status: "read",
  },
  {
    wamid: "wamid.HBgLOTcxNTAxMjM0NTcw",
    candidate_ref: "cand-ali",
    from: "971501234567",
    to: WORKSPACE_PHONE,
    timestamp: String(epochSeconds(5, "20:05")),
    type: "text",
    text: {
      body: "Just emailed the CV to your work address — the file was too large to attach here.",
    },
    status: "read",
  },
  {
    wamid: "wamid.HBgLOTcxNTAxMjM0NTcy",
    candidate_ref: "cand-ali",
    from: WORKSPACE_PHONE,
    to: "971501234567",
    timestamp: String(epochSeconds(2, "11:20")),
    type: "text",
    text: {
      body: "Got it, thank you. The team would like to do a 45 minute technical screen. Are you free Thursday afternoon?",
    },
    status: "read",
  },
  {
    wamid: "wamid.HBgLOTcxNTAxMjM0NTc0",
    candidate_ref: "cand-ali",
    from: "971501234567",
    to: WORKSPACE_PHONE,
    timestamp: String(epochSeconds(0, "08:26")),
    type: "text",
    text: {
      body: "Thursday after 2pm works for me. Also — is the role hybrid or fully remote? That wasn't clear in the JD.",
    },
    status: "delivered",
  },
  {
    wamid: "wamid.HBgLOTcxNTA5OTk4ODc3",
    candidate_ref: "cand-mariam",
    from: WORKSPACE_PHONE,
    to: "971509998877",
    timestamp: String(epochSeconds(3, "14:02")),
    type: "text",
    text: {
      body: "Hi Mariam, following up on the design lead role. Do you have a portfolio link you can share?",
    },
    status: "read",
  },
  {
    wamid: "wamid.HBgLOTcxNTA5OTk4ODc4",
    candidate_ref: "cand-mariam",
    from: "971509998877",
    to: WORKSPACE_PHONE,
    timestamp: String(epochSeconds(3, "15:30")),
    type: "text",
    text: { body: "Hi! Yes — mariamdesign.co/work, password is headfound." },
    status: "read",
  },
  {
    wamid: "wamid.HBgLOTcxNTA5OTk4ODc5",
    candidate_ref: "cand-mariam",
    from: WORKSPACE_PHONE,
    to: "971509998877",
    timestamp: String(epochSeconds(0, "10:15")),
    type: "text",
    text: {
      body: "Perfect, thanks. One more thing — what notice period are you on currently?",
    },
    status: "delivered",
  },
  {
    wamid: "wamid.HBgLOTQ0NzcwMDAxMTIy",
    candidate_ref: "cand-james",
    from: WORKSPACE_PHONE,
    to: "447700011223",
    timestamp: String(epochSeconds(1, "16:45")),
    type: "text",
    text: {
      body: "James, the offer letter is with our ops team and should land tomorrow morning.",
    },
    status: "failed",
    errors: [{ title: "Recipient has not opted in to this WhatsApp business number" }],
  },
  {
    wamid: "wamid.HBgLOTIxMzAwNDQ1NTY2",
    candidate_ref: "cand-priya",
    from: "923004455667",
    to: WORKSPACE_PHONE,
    timestamp: String(epochSeconds(0, "07:04")),
    type: "text",
    text: {
      body: "Good morning Saad — any update on the feedback from the panel? Happy to wait, just planning my week.",
    },
    status: "delivered",
  },
];
