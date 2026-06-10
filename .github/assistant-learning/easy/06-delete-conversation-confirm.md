# [LEARN] Delete Conversation with Confirmation Modal

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Let users clean up old threads — essential for a personal assistant with history.

---

## Concepts You'll Learn

- **DELETE requests**
- **Confirmation modals**
- **Optimistic UI**
- **State cleanup**

---

## Read These Files First

- `backend/app/api/chat.py` DELETE /conversations/{id}
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
Add trash icon on conversation sidebar items. Click opens confirm modal. On confirm: DELETE /api/chat/conversations/{id}, remove from list, clear if active.
```

### Prompt 3 — Implement

```
Implement confirm modal with GlassCard styling. Use api.delete(). Handle deleting the active conversation gracefully.
```

### Prompt 4 — Test & open a PR

```
Delete non-active conv, delete active conv, cancel modal, API error handling.
```

---

## Resources

- [FastAPI DELETE](https://fastapi.tiangolo.com/tutorial/path-params/)
- [React modal patterns](https://react.dev/learn/escape-hatches)

---

## Acceptance Criteria

- [ ] Delete button on each conversation in sidebar
- [ ] Confirmation modal before delete
- [ ] Calls DELETE /chat/conversations/{id}
- [ ] UI updates without page reload

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/components/ui/confirm-modal.tsx` | Create |

---

## Suggested Approach

Reusable ConfirmModal component. Pass onConfirm callback.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-delete-conversation` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
