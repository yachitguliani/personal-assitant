# [LEARN] Memory Tags Editor — API + UI

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Edit memory text and tags after saving — organizing your assistant's knowledge base.

---

## Concepts You'll Learn

- **PATCH API design**
- **Tag input UX**
- **String ↔ array parsing**
- **Form validation**

---

## Read These Files First

- `backend/app/models/memory.py` tags field
- `backend/app/services/memory_service.py`

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
Add PATCH /memory/{id} for text and tags[]. Build edit modal with NeonInput + tag chips. Re-embed on text change optional stretch goal.
```

### Prompt 3 — Implement

```
Backend PATCH route. Frontend edit modal from memory search row. Parse comma tags to array on submit.
```

### Prompt 4 — Test & open a PR

```
Edit text and tags. Invalid id 404. Empty text rejected.
```

---

## Resources

- [Tag input UX patterns](https://carbondesignsystem.com/patterns/forms)
- [OpenAI embeddings overview](https://platform.openai.com/docs/guides/embeddings)

---

## Acceptance Criteria

- [ ] PATCH /memory/{id} updates text and tags
- [ ] Edit modal accessible from memory panel
- [ ] Tags displayed as editable chips
- [ ] API documented in API_REFERENCE.md

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/memory.py` | Modify |
| `frontend/src/components/dashboard/memory-edit-modal.tsx` | Create |
| `frontend/src/components/dashboard/memory-search-panel.tsx` | Modify |

---

## Suggested Approach

PATCH with MemoryUpdate schema. Modal reuses GlassCard + CyberButton.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-memory-tags-editor` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
