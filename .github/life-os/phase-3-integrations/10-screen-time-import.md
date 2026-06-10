# [FEAT] Screen Time API Integration

**Phase:** Phase 3 — Integrations  
**Status:** OPEN  
**Effort:** ~6h  
**Labels:** backend, life-os, integration  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Screen time is a key burnout signal but hard to log manually.

---

## Acceptance Criteria

- [ ] POST /api/metrics/import/screen-time accepts RescueTime CSV or manual JSON
- [ ] Maps to screen_time_minutes on life_metrics
- [ ] Optional: RescueTime API key in .env for auto-sync
- [ ] Daily cron or manual sync button in UI

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/services/screen_time_import.py` | Create |
| `backend/app/api/metrics.py` | Add endpoint |
| `backend/app/core/config.py` | Add RESCUETIME_API_KEY setting |
| `frontend/src/components/dashboard/screen-time-import.tsx` | Create |

---

## Suggested Approach

CSV import first (no API key needed). RescueTime API as stretch goal.

---

## Brainstorming Notes

iOS Screen Time has no public API — RescueTime or manual CSV is realistic.

---

## Dependencies

Issue 01

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Implement RescueTime CSV import mapping productivity time to screen_time_minutes.
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
