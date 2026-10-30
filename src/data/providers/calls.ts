import { iso } from "../clock";
import type { CallPayload } from "./types";

export const callPayloads: CallPayload[] = [
  {
    callId: "call-aa-01",
    candidate_ref: "cand-ali",
    direction: "outbound",
    startedAt: iso(3, "16:00"),
    durationSeconds: 744,
    disposition: "completed",
    aiSummary:
      "Walked through the role and team structure. Ali confirmed the CV was already sent by email. Agreed to a technical screen later this week. Open question on hybrid vs remote and on the notice period.",
    transcript: [
      {
        speaker: "agent",
        offsetMs: 2_000,
        utterance: "Hi Ali, Saad here. Thanks for taking the call — is now still a good time?",
      },
      {
        speaker: "contact",
        offsetMs: 9_000,
        utterance: "Yes, perfect. I'm between meetings but I have twenty minutes.",
      },
      {
        speaker: "agent",
        offsetMs: 16_000,
        utterance:
          "Great. First, I want to confirm I have your CV — I think you sent it over by email on Tuesday?",
      },
      {
        speaker: "contact",
        offsetMs: 25_000,
        utterance:
          "That's right, I emailed it because the file was too big for WhatsApp. It's the 2026 version with the design system work.",
      },
      {
        speaker: "agent",
        offsetMs: 38_000,
        utterance:
          "Got it, I have it. So the team is eight engineers, split across the web platform and the internal tooling side.",
      },
      {
        speaker: "contact",
        offsetMs: 51_000,
        utterance: "And is it hybrid? That part wasn't clear in the job description.",
      },
      {
        speaker: "agent",
        offsetMs: 58_000,
        utterance:
          "Let me confirm that in writing with the hiring manager rather than guess — I'll come back to you on it.",
      },
      {
        speaker: "contact",
        offsetMs: 70_000,
        utterance: "Appreciated. And on timing — I'd be on a two month notice period.",
      },
      {
        speaker: "agent",
        offsetMs: 80_000,
        utterance:
          "Two months is workable. Let's get the technical screen booked — are afternoons better for you?",
      },
      {
        speaker: "contact",
        offsetMs: 92_000,
        utterance: "Afternoons, yes. Thursday after two would be ideal.",
      },
    ],
  },
  {
    callId: "call-aa-02",
    candidate_ref: "cand-ali",
    direction: "inbound",
    startedAt: iso(1, "12:30"),
    durationSeconds: 0,
    disposition: "missed",
    aiSummary: "Missed inbound call. No voicemail left.",
    transcript: [],
  },
  {
    callId: "call-mk-01",
    candidate_ref: "cand-mariam",
    direction: "outbound",
    startedAt: iso(5, "10:30"),
    durationSeconds: 512,
    disposition: "completed",
    aiSummary:
      "Intro call. Mariam is actively interviewing elsewhere and has one offer pending. Asked for the compensation band in writing before committing to a panel.",
    transcript: [
      {
        speaker: "agent",
        offsetMs: 1_500,
        utterance: "Hi Mariam, thanks for making time. How's the search going so far?",
      },
      {
        speaker: "contact",
        offsetMs: 8_000,
        utterance:
          "Busy — I'm at final stage with one company and I have an offer I need to respond to by the end of next week.",
      },
      {
        speaker: "agent",
        offsetMs: 20_000,
        utterance: "Understood. What would make this role worth the conversation for you?",
      },
      {
        speaker: "contact",
        offsetMs: 28_000,
        utterance:
          "Honestly, the band. Can you send me the compensation range in writing before we book anything?",
      },
      { speaker: "agent", offsetMs: 40_000, utterance: "I'll email it to you today." },
    ],
  },
  {
    callId: "call-pn-01",
    candidate_ref: "cand-priya",
    direction: "outbound",
    startedAt: iso(4, "15:10"),
    durationSeconds: 95,
    disposition: "voicemail",
    aiSummary: "Left a voicemail confirming the panel time and asking her to reply on WhatsApp.",
    transcript: [
      {
        speaker: "agent",
        offsetMs: 1_000,
        utterance:
          "Hi Priya, it's Saad from HEADFOUND. Just confirming Thursday at ten for the panel — drop me a WhatsApp if that's changed. Thanks.",
      },
    ],
  },
];
