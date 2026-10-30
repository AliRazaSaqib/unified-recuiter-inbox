import { CHANNELS } from "@/config/channels";
import { formatDayLabel, isSameDay } from "./format";
import type { ChannelId, TimelineEntry } from "@/types/domain";

export interface ChannelSwitchMarker {
  kind: "switch";
  id: string;
  from: ChannelId;
  to: ChannelId;
  timestamp: string;
  gapHours: number;
}

export interface EntryItem {
  kind: "entry";
  id: string;
  entry: TimelineEntry;
}

export type TimelineItem = EntryItem | ChannelSwitchMarker;

export interface TimelineGroup {
  id: string;
  dayLabel: string;
  items: TimelineItem[];
}

export function entriesForCandidate(entries: TimelineEntry[], candidateId: string) {
  return entries
    .filter((entry) => entry.candidateId === candidateId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function filterEntries(
  entries: TimelineEntry[],
  options: { query?: string; mutedChannels?: ChannelId[] },
) {
  const query = options.query?.trim().toLowerCase() ?? "";
  const muted = options.mutedChannels ?? [];

  return entries.filter((entry) => {
    if (muted.includes(entry.channel)) return false;
    if (!query) return true;
    return searchableText(entry).toLowerCase().includes(query);
  });
}

export function searchableText(entry: TimelineEntry) {
  switch (entry.type) {
    case "message":
      return [
        entry.subject ?? "",
        entry.body,
        entry.attachments.map((file) => file.name).join(" "),
      ].join(" ");
    case "call":
      return [entry.summary, entry.transcript.map((line) => line.text).join(" ")].join(" ");
    case "system":
      return entry.body;
  }
}

export function groupTimeline(entries: TimelineEntry[]): TimelineGroup[] {
  const groups: TimelineGroup[] = [];
  let previousConversational: TimelineEntry | undefined;
  let currentDayAnchor: string | undefined;

  entries.forEach((entry) => {
    if (!currentDayAnchor || !isSameDay(currentDayAnchor, entry.timestamp)) {
      currentDayAnchor = entry.timestamp;
      groups.push({
        id: `day-${entry.timestamp.slice(0, 10)}-${groups.length}`,
        dayLabel: formatDayLabel(entry.timestamp),
        items: [],
      });
    }

    const group = groups.at(-1)!;

    if (
      entry.type !== "system" &&
      previousConversational &&
      previousConversational.channel !== entry.channel
    ) {
      group.items.push({
        kind: "switch",
        id: `switch-${entry.id}`,
        from: previousConversational.channel,
        to: entry.channel,
        timestamp: entry.timestamp,
        gapHours: Math.max(
          0,
          Math.round(
            (new Date(entry.timestamp).getTime() -
              new Date(previousConversational.timestamp).getTime()) /
              3_600_000,
          ),
        ),
      });
    }

    group.items.push({ kind: "entry", id: entry.id, entry });

    if (entry.type !== "system") {
      previousConversational = entry;
    }
  });

  return groups;
}

export function lastEntryOf(entries: TimelineEntry[]) {
  return entries.at(-1);
}

export function lastInboundOf(entries: TimelineEntry[]) {
  return [...entries].reverse().find((entry) => entry.direction === "inbound");
}

export function needsReply(entries: TimelineEntry[]) {
  const conversational = entries.filter((entry) => entry.type !== "system");
  const last = conversational.at(-1);
  return Boolean(last && last.direction === "inbound");
}

export function channelsUsed(entries: TimelineEntry[]) {
  const seen = new Set<ChannelId>();
  entries.forEach((entry) => seen.add(entry.channel));
  return [...seen];
}

export function previewOf(entry: TimelineEntry | undefined) {
  if (!entry) return "No messages yet";
  switch (entry.type) {
    case "message":
      return entry.body.replace(/\s+/g, " ").trim();
    case "call":
      return entry.outcome === "completed"
        ? `Call · ${entry.summary}`
        : `${CHANNELS.call.label} · ${entry.outcome.replace("_", " ")}`;
    case "system":
      return entry.body;
  }
}
