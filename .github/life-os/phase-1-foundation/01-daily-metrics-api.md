# [FEAT] Daily Life Metrics Logging API

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

Users need a fast way to log daily sleep, deep work, screen time, energy, and mood.

---

## Acceptance Criteria

- [ ] POST /api/metrics/log upserts one record per user per day
- [ ] GET /api/metrics/history?days=N returns ascending date order
- [ ] GET /api/metrics/summary returns averages for the period
- [ ] All fields validated (energy/mood 1-10, sleep 0-24)
- [ ] Protected with JWT auth

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/models/life_metrics.py` | Create/extend |
| `backend/app/api/metrics.py` | Create/extend |
| `backend/app/main.py` | Register router |
| `project-context/API_REFERENCE.md` | Document endpoints |

---

## Suggested Approach

Follow memory.py pattern. UniqueConstraint on user_id+log_date for upsert.

---

## Brainstorming Notes

Upsert prevents duplicate daily entries. Keep optional fields nullable.

---

## Dependencies

None — foundation issue

---

## Remaining Work (for contributors)

Unit tests, CSV export, validation edge cases

---

## AI Starter Prompt

```
Add pytest tests, CSV export, and date range validation to metrics API.
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
