# [LEARN] Rename Conversation — API + Inline Edit UI

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~3–4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

PATCH endpoint + double-click to rename threads — standard assistant feature.

---

## Concepts You'll Learn

- **PATCH endpoints**
- **Inline editing**
- **Pydantic partial updates**
- **Optimistic UI**

---

## Read These Files First

- `backend/app/api/chat.py`
- `backend/app/api/life_goals.py` PATCH pattern

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
Add PATCH /chat/conversations/{id} with {title}. Frontend: double-click title in sidebar → inline input → save on Enter.
```

### Prompt 3 — Implement

```
Backend PATCH route with title validation. Frontend inline edit with api.patch(). Rollback on error.
```

### Prompt 4 — Test & open a PR

```
Rename via UI. Empty title rejected. 404 for wrong id. Non-owner blocked.
```

---

## Resources

- [FastAPI body updates](https://fastapi.tiangolo.com/tutorial/body-updates/)
- [Inline edit pattern](https://react.dev/reference/react/useOptimistic)

---

## Acceptance Criteria

- [ ] PATCH /chat/conversations/{id} accepts title
- [ ] Inline rename in conversation sidebar
- [ ] Validates title length (1–100 chars)
- [ ] User-scoped — cannot rename others' conversations

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/chat.py` | Modify |
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/utils/api.ts` | Add patch if missing |
| `project-context/API_REFERENCE.md` | Document |

---

## Suggested Approach

Copy PATCH pattern from life_goals.py. Inline input replaces title span on double-click.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-rename-conversation-api` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
