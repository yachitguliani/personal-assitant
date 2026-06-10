# [LEARN] Conversation Sidebar in Chat Panel

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2–3h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Add a left sidebar listing all chat conversations so users can switch threads like ChatGPT — core personal assistant UX.

---

## Concepts You'll Learn

- **React lists & keys**
- **REST GET endpoints**
- **Active state UI**
- **Responsive layout**

---

## Read These Files First

- `frontend/src/components/dashboard/chat-panel.tsx`
- `backend/app/api/chat.py` → `GET /chat/conversations`

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
Design a conversation sidebar for chat-panel.tsx that fetches GET /api/chat/conversations on mount. No new backend work. Output component tree and state variables.
```

### Prompt 3 — Implement

```
Implement the conversation sidebar in chat-panel.tsx. Use existing api.get('/chat/conversations'). Match cyber glassmorphic style from GlassCard. Clicking a conversation loads GET /chat/conversations/{id}.
```

### Prompt 4 — Test & open a PR

```
Write a manual test checklist: create 2 conversations, switch between them, verify messages load. What edge cases (empty list, loading, error)?
```

---

## Resources

- [React lists docs](https://react.dev/learn/rendering-lists)
- [FastAPI path params](https://fastapi.tiangolo.com/tutorial/path-params/)
- [NEURON chat API](project-context/API_REFERENCE.md)

---

## Acceptance Criteria

- [ ] Sidebar lists all user conversations with title + date
- [ ] Clicking a conversation loads its messages
- [ ] Active conversation is visually highlighted
- [ ] New conversation button creates via POST /chat/conversations
- [ ] Works on desktop; collapses gracefully on mobile

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/utils/api.ts` | Use existing client |

---

## Suggested Approach

Fetch conversations on mount. Store `activeConvId`. Re-use existing message load logic when selection changes.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-conversation-sidebar` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
