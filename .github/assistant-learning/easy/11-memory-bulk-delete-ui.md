# [LEARN] Memory Bulk Select & Delete UI

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2–3h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Select multiple memories and delete — managing your second brain at scale.

---

## Concepts You'll Learn

- **Checkbox state**
- **Batch API calls**
- **Selection UX**
- **Async parallel requests**

---

## Read These Files First

- `backend/app/api/memory.py` DELETE /{id}
- Memory search panel (from issue 02)

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
Add checkbox mode to memory list. Select all / delete selected calls DELETE for each id in parallel with Promise.all.
```

### Prompt 3 — Implement

```
Toggle 'Select mode' button. Checkboxes on rows. Delete selected with confirmation. Show count of selected.
```

### Prompt 4 — Test & open a PR

```
Select 3, delete all, verify gone. Select all. Cancel delete.
```

---

## Resources

- [Promise.all MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

---

## Acceptance Criteria

- [ ] Toggle select mode on memory panel
- [ ] Multi-select with checkboxes
- [ ] Bulk delete with confirmation
- [ ] Loading state during delete

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/memory-search-panel.tsx` | Modify |

---

## Suggested Approach

Set<number> for selected IDs. Parallel DELETE calls.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-memory-delete-bulk` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
