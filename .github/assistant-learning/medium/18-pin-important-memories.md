# [LEARN] Pin Important Memories

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~3–4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Pin critical facts so they always appear in assistant context — like pinned notes.

---

## Concepts You'll Learn

- **Schema migration pattern**
- **Boolean flags**
- **Priority sorting**
- **Context injection**

---

## Read These Files First

- `backend/app/models/memory.py`
- `backend/app/services/ai_orchestrator.py`

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
Add is_pinned boolean to MemoryNode. PATCH /memory/{id}/pin. Always include pinned memories in AI context. UI star icon toggle.
```

### Prompt 3 — Implement

```
Model field + migration via create_all on new DBs (document manual ALTER for existing). Pin toggle in memory panel. Orchestrator prepends pinned to context.
```

### Prompt 4 — Test & open a PR

```
Pin memory, ask unrelated question — pinned still in context. Unpin removes.
```

---

## Resources

- [SQLAlchemy column defaults](https://docs.sqlalchemy.org/en/20/core/defaults.html)

---

## Acceptance Criteria

- [ ] is_pinned field on memories
- [ ] Toggle pin from memory UI
- [ ] Pinned memories always injected into chat context
- [ ] Pinned section at top of memory panel

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/models/memory.py` | Modify |
| `backend/app/api/memory.py` | Add pin endpoint |
| `backend/app/services/ai_orchestrator.py` | Modify |
| `frontend/src/components/dashboard/memory-search-panel.tsx` | Modify |

---

## Suggested Approach

POST /memory/{id}/pin and /unpin. Sort pinned first in list.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-pin-memories` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
