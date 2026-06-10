# [FEAT] Goals CRUD API

**Phase:** Phase 1 — Foundation  
**Status:** IMPLEMENTED (enhancement welcome)  
**Effort:** ~4h  
**Labels:** good-first-issue, backend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Personal goals need REST CRUD with progress tracking.

---

## Acceptance Criteria

- [ ] Full CRUD on /api/goals
- [ ] POST /api/goals/{id}/checkin updates progress
- [ ] Categories: health, work, learning, relationships
- [ ] Auto-complete when progress reaches 100
- [ ] User-scoped access control

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/models/goals.py` | Create/extend |
| `backend/app/api/life_goals.py` | Create/extend |
| `project-context/DATABASE_SCHEMA.md` | Document table |

---

## Suggested Approach

Mirror existing CRUD routes. PATCH for partial updates.

---

## Brainstorming Notes

Keep goals simple — no subtasks in v1.

---

## Dependencies

None

---

## Remaining Work (for contributors)

Goal notes/history table, filter params, tests

---

## AI Starter Prompt

```
Add category filter, target_date sorting, milestone notes on checkin.
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
