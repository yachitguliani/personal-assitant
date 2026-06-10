# [LEARN] Memory Search Panel in Dashboard

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2–3h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Let users search their second brain from the HUD — type a query and see semantic memory matches.

---

## Concepts You'll Learn

- **Debounced input**
- **Search APIs**
- **Empty/loading states**
- **Semantic search UX**

---

## Read These Files First

- `backend/app/api/memory.py` → GET with `?q=` param
- `frontend/src/components/dashboard/memory-indicator.tsx`

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
Design a MemorySearchPanel component: search input with 300ms debounce, calls GET /api/memory?q=. Show results with text, category, similarity score.
```

### Prompt 3 — Implement

```
Build MemorySearchPanel using NeonInput, GlassCard, api.get('/memory?q=...'). Add to dashboard right panel or new tab. Handle empty query vs no results.
```

### Prompt 4 — Test & open a PR

```
Test: empty query returns list, search query returns ranked results, error state when offline.
```

---

## Resources

- [useDebouncedValue pattern](https://www.developerway.com/posts/debouncing-in-react)
- [NEURON memory service](backend/app/services/memory_service.py)

---

## Acceptance Criteria

- [ ] Search input with debounce (~300ms)
- [ ] Results show memory text, category, and similarity
- [ ] Empty state when no memories match
- [ ] Delete memory action from result row

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/memory-search-panel.tsx` | Create |
| `frontend/src/components/dashboard/dashboard-shell.tsx` | Integrate |

---

## Suggested Approach

New component + debounce hook. Wire into dashboard aside below MemoryIndicator.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-memory-search-ui` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
