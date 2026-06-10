# [FEAT] Goal to Memory Bridge

**Phase:** Phase 3 — Integrations  
**Status:** OPEN  
**Effort:** ~3h  
**Labels:** backend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Goal completions should persist in semantic memory for AI context.

---

## Acceptance Criteria

- [ ] On goal completion (progress=100), auto-create memory node
- [ ] Category: episodic, tags: [life-goal, category]
- [ ] On checkin milestones (25/50/75%), optional memory entry
- [ ] Chat AI can reference completed goals via memory search

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/life_goals.py` | Hook on checkin/complete |
| `backend/app/services/memory_service.py` | Reuse add_memory |

---

## Suggested Approach

Call MemoryService.add_memory() in checkin_goal when progress hits milestones.

---

## Brainstorming Notes

Only auto-save completions and 100% — avoid memory spam on every +10.

---

## Dependencies

Issues 02, memory API

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Bridge goal completions to semantic memory using MemoryService.add_memory.
```

Also read: LIFE_OS_GUIDE.md, CURSOR_LIFE_OS_PROMPT.md

---

## Test Plan

1. Start backend + frontend locally
2. Login and navigate to the relevant dashboard page
3. Verify feature works end-to-end
4. Confirm no regressions to chat/memory

---

## How to Claim

1. Comment on this issue: "I'd like to work on this"
2. Fork, branch `feature/life-os-XX-short-name` off `dev`
3. Submit PR linking this issue
