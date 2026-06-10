# [LEARN] Chat Message Copy Button & Timestamps

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~1–2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Polish the chat panel — copy assistant wisdom to clipboard, see when messages were sent.

---

## Concepts You'll Learn

- **Clipboard API**
- **Date formatting (Intl)**
- **Micro-interactions**
- **Accessibility**

---

## Read These Files First

- `frontend/src/components/dashboard/chat-panel.tsx`
- `frontend/src/lib/markdown.ts`

---

## GPT / Cursor Walkthrough

Copy these prompts into ChatGPT, Claude, or Cursor Composer. Replace `[ISSUE]` with this issue title.

### Prompt 1 — Understand the codebase

```
I'm contributing to NEURON OS, a personal AI assistant (FastAPI + Next.js).
Issue: [ISSUE]

Explain how the existing code works for this area. What patterns must I follow?
List files I should read and any gotchas (JWT auth, sync SQLAlchemy, api.ts client).
```

### Prompt 2 — Plan the implementation

```
Add relative timestamps (e.g. '2m ago') under each message and a copy icon that uses navigator.clipboard.writeText.
```

### Prompt 3 — Implement

```
Add formatRelativeTime helper. Copy button on hover for all messages. Show 'Copied!' feedback for 2s.
```

### Prompt 4 — Test & open a PR

```
Copy works on Chrome/Firefox. Timestamps update correctly. Screen reader can access copy button.
```

---

## Resources

- [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

---

## Acceptance Criteria

- [ ] Relative timestamp on each message
- [ ] Copy button copies raw message text
- [ ] Copied confirmation feedback
- [ ] Works for both user and assistant messages

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/lib/format-time.ts` | Create (optional) |

---

## Suggested Approach

Extract small formatRelativeTime util. Hover toolbar on message bubbles.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-chat-copy-timestamps` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
