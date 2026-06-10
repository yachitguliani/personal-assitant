# [LEARN] Chat Streaming Error Handling & Retry

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~3h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

When LLM stream fails, show error + Retry button — production-quality assistant UX.

---

## Concepts You'll Learn

- **Error boundaries**
- **Fetch streaming**
- **Retry patterns**
- **User-facing error copy**

---

## Read These Files First

- `frontend/src/components/dashboard/chat-panel.tsx` api.stream
- `frontend/src/utils/api.ts` stream wrapper

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
Wrap api.stream in try/catch. On error show red banner on message with Retry. Retry re-sends last user message. Add offline detection.
```

### Prompt 3 — Implement

```
StreamError state per message. Retry button calls stream again. Show 'NEURON offline — using local mode' when API unreachable.
```

### Prompt 4 — Test & open a PR

```
Kill backend mid-stream. Invalid token. Retry succeeds. Multiple retries.
```

---

## Resources

- [Fetch streams MDN](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Error UX patterns](https://www.nngroup.com/articles/error-message-guidelines/)

---

## Acceptance Criteria

- [ ] Stream errors show inline error state
- [ ] Retry button re-attempts last message
- [ ] Does not duplicate user message on retry
- [ ] Offline banner when backend unreachable

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/utils/api.ts` | Improve stream error propagation |

---

## Suggested Approach

Store lastFailedUserMsg. onError sets failed state. Retry clears and re-streams.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-stream-retry` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
