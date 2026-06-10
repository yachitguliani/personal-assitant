# [FEAT] Predictive Streak Analysis

**Phase:** Phase 4 — Advanced  
**Status:** OPEN  
**Effort:** ~8h  
**Labels:** backend, life-os, algorithm  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Detect burnout patterns 14 days out using regression.

---

## Acceptance Criteria

- [ ] Extend burnout_engine with 14-day projection
- [ ] Linear regression on composite score trend
- [ ] GET /api/burnout/forecast returns projected score in 7 and 14 days
- [ ] Frontend forecast line on pattern charts (dashed)

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/services/burnout_engine.py` | Add forecast functions |
| `backend/app/api/burnout.py` | Add /forecast endpoint |
| `frontend/src/components/dashboard/pattern-chart.tsx` | Add forecast overlay |

---

## Suggested Approach

Simple linear regression on daily composite scores. No sklearn needed.

---

## Brainstorming Notes

14-day needs more data — require minimum 10 days logged before forecasting.

---

## Dependencies

Issue 05

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Add 14-day burnout forecast using linear regression on daily composite scores.
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
