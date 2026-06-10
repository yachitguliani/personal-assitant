# [FEAT] Apple Health / Google Fit Import

**Phase:** Phase 3 — Integrations  
**Status:** OPEN  
**Effort:** ~8h  
**Labels:** backend, life-os, integration  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Manual logging is friction. Import sleep/activity from health exports.

---

## Acceptance Criteria

- [ ] POST /api/metrics/import accepts CSV (Apple Health export format)
- [ ] Maps sleep analysis and exercise minutes to life_metrics fields
- [ ] Deduplicates by date (merge with existing logs)
- [ ] Returns import summary (rows processed, skipped, errors)
- [ ] Frontend upload button on /dashboard/life

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/metrics.py` | Add import endpoint |
| `backend/app/services/health_import.py` | Create parser |
| `frontend/src/components/dashboard/health-import.tsx` | Create UI |

---

## Suggested Approach

Start with Apple Health CSV (most documented format). Parse with csv module.

---

## Brainstorming Notes

Google Fit export varies — support Apple first, document Google as follow-up.

---

## Dependencies

Issue 01

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Implement Apple Health CSV import for sleep and active energy. See metrics.py for upsert pattern.
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
