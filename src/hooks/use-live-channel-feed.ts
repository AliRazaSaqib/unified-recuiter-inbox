import { useEffect } from "react";
import { useConversationStore } from "@/store/use-conversation-store";
import { useInboxStore } from "@/store/use-inbox-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import type { ChannelId, MessageEntry } from "@/types/domain";

interface IncomingSeed {
  candidateId: string;
  channel: ChannelId;
  body: string;
}

const INCOMING: IncomingSeed[] = [
  {
    candidateId: "cand-tunde",
    channel: "linkedin",
    body: "Thanks for the brief — the role looks interesting. Could we speak later this week?",
  },
  {
    candidateId: "cand-james",
    channel: "email",
    body: "Following up on the start date and relocation terms. My current notice is four weeks.",
  },
  {
    candidateId: "cand-priya",
    channel: "whatsapp",
    body: "No problem, I'll wait for the written feedback. Thanks for keeping me posted.",
  },
  {
    candidateId: "cand-mariam",
    channel: "whatsapp",
    body: "I'm on two months' notice, but I could potentially negotiate it down to six weeks.",
  },
  {
    candidateId: "cand-ali",
    channel: "sms",
    body: "Signal is poor here — texting instead. Still good for Thursday at 14:00.",
  },
];

const INTERVAL_MS = 22_000;

export function useLiveChannelFeed() {
  const enabled = useWorkspaceStore((state) => state.realtimeEnabled);

  useEffect(() => {
    if (!enabled) return;

    let index = 0;

    const timer = window.setInterval(() => {
      const seed = INCOMING[index % INCOMING.length];
      index += 1;

      const { entries, receiveEntry } = useConversationStore.getState();
      const alreadyDelivered = entries.some(
        (entry) => entry.sourceRef === `live-${seed.candidateId}-${seed.channel}`,
      );
      if (alreadyDelivered) return;

      const entry: MessageEntry = {
        id: `live:${seed.candidateId}:${Date.now()}`,
        candidateId: seed.candidateId,
        type: "message",
        channel: seed.channel,
        direction: "inbound",
        timestamp: new Date().toISOString(),
        body: seed.body,
        status: "delivered",
        attachments: [],
        authorName: "Candidate",
        sourceRef: `live-${seed.candidateId}-${seed.channel}`,
      };

      receiveEntry(entry);

      const { selectedCandidateId, bumpUnread } = useInboxStore.getState();
      if (selectedCandidateId !== seed.candidateId) {
        bumpUnread(seed.candidateId);
      }
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [enabled]);
}
