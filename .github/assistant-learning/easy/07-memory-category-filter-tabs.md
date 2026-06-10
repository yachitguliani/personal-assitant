# [LEARN] Memory Category Filter Tabs

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Filter memories by semantic / episodic / procedural — teaches how personal assistants categorize knowledge.

---

## Concepts You'll Learn

- **Tab UI**
- **Query parameters**
- **Filtered API calls**
- **Category taxonomy**

---

## Read These Files First

- `backend/app/api/memory.py` GET ?category=
- Memory model categories in DATABASE_SCHEMA.md

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
Add tabs above memory search: All | Semantic | Episodic | Procedural. Pass category param to GET /memory.
```

### Prompt 3 — Implement

```
Build MemoryCategoryTabs component. Integrate with memory search panel. Active tab uses cyber-cyan highlight.
```

### Prompt 4 — Test & open a PR

```
Each tab filters correctly. All tab shows everything. Count badge optional.
```

---

## Resources

- [NEURON memory types](LIFE_OS_GUIDE.md — mental model section)
- [Headless tab pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

---

## Acceptance Criteria

- [ ] 4 tabs: All, Semantic, Episodic, Procedural
- [ ] Filters GET /memory?category=X
- [ ] Active tab styled per design system
- [ ] Integrates with memory search panel

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/memory-search-panel.tsx` | Modify/create |

---

## Suggested Approach

State: activeCategory. Refetch on tab change.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-memory-category-tabs` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
