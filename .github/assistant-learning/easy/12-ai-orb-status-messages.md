# [LEARN] AI Orb Contextual Status Messages

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~1–2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Orb shows helpful hints ('Try /help', 'Listening...', 'Memory saved') — makes the assistant feel alive.

---

## Concepts You'll Learn

- **Global state (Context)**
- **UI feedback loops**
- **Animation states**
- **UX microcopy**

---

## Read These Files First

- `frontend/src/context/neuron-os-context.tsx`
- `frontend/src/components/core/ai-orb.tsx`

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
Add orbMessage string to NeuronOsContext. Orb displays it below the animation. Helper setOrbMessage(msg, autoClearMs) used across chat/memory.
```

### Prompt 3 — Implement

```
Extend context with orbMessage. Display in AiOrb or chat panel. Wire to save-memory, voice input, stream complete events.
```

### Prompt 4 — Test & open a PR

```
Messages appear and auto-clear. Don't overlap with orbState labels.
```

---

## Resources

- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Microcopy tips](https://www.nngroup.com/articles/microcopy/)

---

## Acceptance Criteria

- [ ] orbMessage in NeuronOsContext
- [ ] Displayed near AI orb during actions
- [ ] Auto-clears after 3 seconds
- [ ] Used in at least 3 flows (chat, memory, voice)

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/context/neuron-os-context.tsx` | Modify |
| `frontend/src/components/core/ai-orb.tsx` | Modify |

---

## Suggested Approach

setOrbMessage with setTimeout clear. Keep messages short.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-orb-state-feedback` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
