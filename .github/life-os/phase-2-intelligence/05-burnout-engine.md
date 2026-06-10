# [FEAT] Burnout Risk Engine (Backend)

**Phase:** Phase 2 — Intelligence  
**Status:** IMPLEMENTED (enhancement welcome)  
**Effort:** ~6h  
**Labels:** backend, life-os, algorithm  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Composite burnout score from 4 sliding-window signals.

---

## Acceptance Criteria

- [ ] Sleep debt score (< 7h accumulates debt)
- [ ] Deep work decline (> 30% over 5 days)
- [ ] Screen time spike (> 20% above baseline)
- [ ] Energy/mood linear regression trend
- [ ] Composite weighted score 0-100, warning at > 65
- [ ] Persist weekly signal to burnout_signals table

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/services/burnout_engine.py` | Create/extend |
| `backend/app/models/burnout_signal.py` | Create/extend |
| `backend/app/api/burnout.py` | Expose endpoints |

---

## Suggested Approach

Pure Python, no ML deps. Testable functions per signal.

---

## Brainstorming Notes

Weights: sleep 30%, work 25%, screen 20%, wellbeing 25%. Tune via config later.

---

## Dependencies

Issue 01

---

## Remaining Work (for contributors)

Configurable weights, calibration mode, unit tests

---

## AI Starter Prompt

```
Add configurable weights via settings, calibration period (no warnings first 7 days), pytest for each signal.
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
