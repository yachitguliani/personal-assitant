# [LEARN] Quick Notes Capture API + Chat Integration

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4–5h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Scribble quick notes the assistant remembers — `/note pick up dry cleaning` → saved as procedural memory.

---

## Concepts You'll Learn

- **CRUD API design**
- **Memory categories**
- **Natural language capture**
- **Assistant workflows**

---

## Read These Files First

- `backend/app/api/memory.py`
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
POST /assistant/notes {text} saves as procedural memory with tag 'note' and today's date. Integrate with /note slash command. List GET /assistant/notes.
```

### Prompt 3 — Implement

```
New notes routes wrapping MemoryService.add_memory(category=procedural). Frontend notes list in sidebar. Optional due_date field stretch.
```

### Prompt 4 — Test & open a PR

```
Create note via API and slash command. List shows today notes. Delete note.
```

---

## Resources

- [Building a second brain](https://www.buildingasecondbrain.com/)

---

## Acceptance Criteria

- [ ] POST /assistant/notes creates procedural memory
- [ ] GET /assistant/notes lists recent notes
- [ ] DELETE /assistant/notes/{id}
- [ ] /note slash command wired up
- [ ] Notes panel in dashboard

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/assistant.py` | Create/extend |
| `frontend/src/components/dashboard/notes-panel.tsx` | Create |
| `frontend/src/lib/slash-commands.ts` | Integrate |

---

## Suggested Approach

Thin wrapper over memory API with category=procedural, tags=note.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-quick-notes-api` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
