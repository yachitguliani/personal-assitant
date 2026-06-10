# [LEARN] Save to Memory Button on Chat Messages

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~1–2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

One-click save any assistant reply into long-term memory — the core loop of a personal assistant.

---

## Concepts You'll Learn

- **Event handlers**
- **POST requests**
- **Memory categories (episodic vs semantic)**
- **Toast feedback**

---

## Read These Files First

- `backend/app/api/memory.py` POST
- `frontend/src/components/dashboard/chat-panel.tsx`

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
Add a bookmark icon on each assistant message. On click POST /api/memory with text=message.content, category=episodic, tags=[chat]. Show brief success toast.
```

### Prompt 3 — Implement

```
Implement save button on assistant messages in chat-panel.tsx. Use api.post('/memory', {...}). Disable button after save. Pulse memory indicator on success.
```

### Prompt 4 — Test & open a PR

```
Save a message, verify it appears in GET /memory. Try saving twice — should not duplicate or should show 'already saved'.
```

---

## Resources

- [NEURON memory categories](project-context/DATABASE_SCHEMA.md)
- [Lucide icons](https://lucide.dev/icons/)

---

## Acceptance Criteria

- [ ] Bookmark/save icon on assistant messages only
- [ ] POSTs to /api/memory with episodic category
- [ ] Visual feedback on success (toast or icon change)
- [ ] Triggers memory pulse in HUD

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/utils/api.ts` | Use existing post |

---

## Suggested Approach

Small hover-reveal button per message bubble. Track saved message IDs in local state.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-save-to-memory` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
