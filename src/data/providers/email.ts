import { epochMs } from "../clock";
import { WORKSPACE_EMAIL } from "../workspace";
import type { EmailPayload } from "./types";

export const emailPayloads: EmailPayload[] = [
  {
    messageId: "msg-aa-0001",
    candidate_ref: "cand-ali",
    threadId: "thread-aa-01",
    from: "ali.ahmed@fastmail.com",
    to: WORKSPACE_EMAIL,
    subject: "CV — Ali Ahmed (Senior Frontend Engineer)",
    bodyText:
      "Hi Saad,\n\nAs promised, please find my updated CV attached. I've highlighted the design system work we spoke about.\n\nBest,\nAli",
    internalDate: String(epochMs(5, "20:02")),
    labelIds: ["INBOX"],
    attachments: [
      { filename: "Ali-Ahmed-CV-2026.pdf", mimeType: "application/pdf", sizeBytes: 486_400 },
    ],
  },
  {
    messageId: "msg-aa-0002",
    candidate_ref: "cand-ali",
    threadId: "thread-aa-01",
    from: WORKSPACE_EMAIL,
    to: "ali.ahmed@fastmail.com",
    subject: "Re: CV — Ali Ahmed (Senior Frontend Engineer)",
    bodyText:
      "Received, thank you Ali. Sharing with the hiring manager today and I'll come back with next steps.\n\nSaad",
    internalDate: String(epochMs(4, "09:30")),
    labelIds: ["SENT"],
  },
  {
    messageId: "msg-aa-0003",
    candidate_ref: "cand-ali",
    threadId: "thread-aa-02",
    from: WORKSPACE_EMAIL,
    to: "ali.ahmed@fastmail.com",
    subject: "Technical screen — scheduling",
    bodyText:
      "Hi Ali,\n\nThe hiring manager would like to run a 45 minute technical screen. Attaching the interview brief so you know what to expect. Could you also send me two references I can contact?\n\nSaad",
    internalDate: String(epochMs(2, "11:05")),
    labelIds: ["SENT"],
    attachments: [
      {
        filename: "HEADFOUND-Technical-Screen-Brief.pdf",
        mimeType: "application/pdf",
        sizeBytes: 212_992,
      },
    ],
  },
  {
    messageId: "msg-mk-0001",
    candidate_ref: "cand-mariam",
    threadId: "thread-mk-01",
    from: WORKSPACE_EMAIL,
    to: "mariam.khalid@proton.me",
    subject: "Design Lead — compensation range",
    bodyText:
      "Hi Mariam,\n\nThe band for this role is AED 38–45k per month plus bonus. Let me know if that works before we book the panel.\n\nSaad",
    internalDate: String(epochMs(2, "16:40")),
    labelIds: ["SENT"],
  },
  {
    messageId: "msg-mk-0002",
    candidate_ref: "cand-mariam",
    threadId: "thread-mk-01",
    from: "mariam.khalid@proton.me",
    to: WORKSPACE_EMAIL,
    subject: "Re: Design Lead — compensation range",
    bodyText:
      "That works for me. I'd want to understand the bonus structure during the panel.\n\nMariam",
    internalDate: String(epochMs(1, "08:15")),
    labelIds: ["INBOX"],
  },
  {
    messageId: "msg-jc-0001",
    candidate_ref: "cand-james",
    threadId: "thread-jc-01",
    from: WORKSPACE_EMAIL,
    to: "james.coulter@outlook.com",
    subject: "Offer — Platform Engineering Manager",
    bodyText:
      "Hi James,\n\nDelighted to confirm the offer. The formal letter follows from our operations team within 48 hours.\n\nSaad",
    internalDate: String(epochMs(3, "12:00")),
    labelIds: ["SENT"],
  },
  {
    messageId: "msg-jc-0002",
    candidate_ref: "cand-james",
    threadId: "thread-jc-01",
    from: "james.coulter@outlook.com",
    to: WORKSPACE_EMAIL,
    subject: "Re: Offer — Platform Engineering Manager",
    bodyText:
      "Thanks Saad — great news. Could you confirm the start date and the relocation support in writing?\n\nJames",
    internalDate: String(epochMs(2, "19:22")),
    labelIds: ["INBOX"],
  },
  {
    messageId: "msg-pn-0001",
    candidate_ref: "cand-priya",
    threadId: "thread-pn-01",
    from: WORKSPACE_EMAIL,
    to: "priya.nair@gmail.com",
    subject: "Panel interview — Thursday 10:00",
    bodyText:
      "Hi Priya,\n\nConfirming your panel interview on Thursday at 10:00 Gulf time. Calendar invite to follow.\n\nSaad",
    internalDate: String(epochMs(6, "10:40")),
    labelIds: ["SENT"],
  },
  {
    messageId: "msg-td-0001",
    candidate_ref: "cand-tunde",
    threadId: "thread-td-01",
    from: WORKSPACE_EMAIL,
    to: "tunde.bakare@hey.com",
    subject: "Backend Engineer (Go) — role brief",
    bodyText:
      "Hi Tunde,\n\nAttaching the full role brief as promised on LinkedIn. Could you also send me your latest CV?\n\nSaad",
    internalDate: String(epochMs(3, "13:15")),
    labelIds: ["SENT"],
    attachments: [
      {
        filename: "Backend-Engineer-Go-Brief.pdf",
        mimeType: "application/pdf",
        sizeBytes: 180_224,
      },
    ],
  },
];
