# Confluence Inbox — unified candidate communication interface

A single workspace where a recruiter sees **every** interaction with one candidate —
LinkedIn, WhatsApp, email, SMS and transcribed phone calls — in one chronological
timeline, and can reply on any of those channels without leaving the screen.

**Live demo:** https://unified-recruiter-inbox.vercel.app

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

React 19 · TypeScript · Vite · Zustand · Tailwind v4 · lucide-react. No backend —
the provider payloads in `src/data/providers/` stand in for the real APIs.
Fully responsive: mobile, tablet and desktop. Light and dark themes.

## The problem this solves

A recruiter runs 100+ conversations at once, and a single candidate's conversation
hops platform to platform: sourced on LinkedIn, moved to WhatsApp, a call, the CV by
email, SMS when they're travelling. Three things go wrong:

1. **Context is scattered.** Answering one question means opening four apps.
2. **Things get missed.** A promise made on a call is invisible in the chat history.
3. **Reputation damage.** You ask for the CV on WhatsApp, forget, then ask again on
   LinkedIn. To the candidate you look disorganised.

## What's on screen

**Left — candidates.** Search that covers every message *and* every call transcript,
not just names. Quick views for Unread and Waiting-on-you, plus stage and
channel-used filters. Each row shows stage, unread count, overdue follow-ups, and the
channels the conversation has touched.

**Centre — the unified timeline.** One chronological thread. Every entry is labelled
with its channel, direction and delivery state. Where the conversation changed
platform, an explicit marker is drawn (`LinkedIn → WhatsApp · 1d later`) so the jump
is visible rather than implied. Calls appear inline with duration, outcome, an AI
summary and a searchable transcript. Per-thread search highlights matches; individual
channels can be hidden.

**Right — context.** The **Requests & commitments** tracker is the answer to problem
3: every ask is recorded with the channel it was asked on and the channel the answer
arrived on (*"Updated CV — asked on WhatsApp → received via Email"*). Below it,
follow-ups with overdue state, per-channel reachability, private notes and
interaction stats.

**Composer.** Channel picker, with the recipient and the sending channel stated on
the button itself so you cannot send to the wrong place by accident. Unreachable
channels are disabled with the reason and the channel the candidate last replied on
is suggested instead. Per-channel rules are respected — subject line for email and
LinkedIn, character limits for SMS, no attachments on LinkedIn.

### The duplicate-ask guard

Type *"could you send me your CV?"* to a candidate who already sent one and the
composer warns **before** you send, naming where it was asked and where it arrived,
with a "Show me" link that jumps to the exact message. New asks you send are detected
and tracked automatically; repeats bump an `asked 2×` counter.

## Internationalisation

**Every user-facing string lives in `src/i18n/locales/en.json`** — nothing is hardcoded
in a component, including channel names, stage names, relative dates, delivery states,
aria-labels, the blueprint prose and the diagram labels. Components read them through
`useTranslation().t("namespace.key")`; pure modules such as `lib/format.ts` use the
module-level `t` from `src/i18n/dictionary.ts`. Interpolation is `{{token}}`, missing
keys fall back to the key with a dev-only warning, and `tList()` returns array content.
Adding a language is a new JSON file plus one entry in `DICTIONARIES` — not a component
rewrite.

## Responsive behaviour

One codebase, three layouts, driven by `useLayout()` (`useSyncExternalStore` over
`matchMedia`, so no resize listeners or layout thrash):

- **Desktop (≥1280px)** — the full three-pane workspace.
- **Tablet (768–1279px)** — candidate list + conversation; the context rail becomes a
  right-hand sheet.
- **Mobile (<768px)** — one pane at a time. Picking a candidate pushes to the thread, a
  back arrow returns to the list, and the context rail opens as a full-screen sheet. The
  composer stacks, channel pills reduce to icons, and the header drops to essentials.

## Architecture

```
provider payloads → adapters → TimelineEntry → zustand stores → components
```

**`src/data/providers/*`** holds deliberately *different* payload shapes, the way five
real APIs would: WhatsApp's `wamid` + unix-second strings, LinkedIn's `urn` + epoch
millis, Gmail-style `labelIds`, Twilio's RFC-2822 `date_sent`, and a call payload with
a transcript array.

**`src/lib/adapters.ts`** normalizes each into one `TimelineEntry`
(`id · candidateId · channel · direction · timestamp · status · attachments ·
sourceRef`). Components render one shape; channel-specific detail survives on the
entry. A websocket/SSE feed would re-enter here and dedupe by `id`.

**Stores** (`src/store/`) are split by concern: `useInboxStore` (list, selection,
filters, unread), `useConversationStore` (entries, drafts, optimistic send),
`useTrackingStore` (requests, notes, follow-ups), `useWorkspaceStore` (theme, panels,
live feed). Derived data lives in `useCandidateSummaries`, never duplicated in state.

**`src/lib/timeline.ts`** is pure: filtering, day grouping, channel-switch detection,
reply-needed. **`src/lib/request-detection.ts`** is the intent matcher behind the
guard. Both are testable without React.

## Fidelity notes

Real behaviour, not a static mock: sends are optimistic and move
`queued → sent → delivered`; failed sends show the carrier reason and a retry;
inbound messages arrive on a simulated live feed and bump unread without stealing
your current thread; older messages page in on demand; light and dark themes are
token-driven with no per-component overrides.

The **Blueprint** tab (top centre) holds the layout and data-flow diagrams plus the
problem→solution mapping — built to be screen-shared and talked through.

## What I'd add next

Bulk outreach and templates, team handover with assignment, SLA alerts on "waiting on
you", virtualised lists past ~500 candidates, and real transcript timestamps linked to
audio playback.
