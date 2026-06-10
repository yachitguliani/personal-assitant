# [FEAT] Energy Log UI Component

**Phase:** Phase 1 — Foundation  
**Status:** IMPLEMENTED (enhancement welcome)  
**Effort:** ~3h  
**Labels:** good-first-issue, frontend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Daily logging must take under 30 seconds with on-brand UI.

---

## Acceptance Criteria

- [ ] Slider form for all 5 metrics
- [ ] Submits to POST /api/metrics/log
- [ ] Glassmorphic cyber style
- [ ] Success/error feedback
- [ ] Refreshes burnout gauge after submit

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/energy-log.tsx` | Create/extend |
| `frontend/src/app/dashboard/life/page.tsx` | Integrate |
| `frontend/src/utils/api.ts` | lifeOsApi.logMetric |

---

## Suggested Approach

Range inputs with accent-cyber-cyan. Reference energy-log.tsx.

---

## Brainstorming Notes

Sliders beat forms for speed. Sensible defaults.

---

## Dependencies

Issue 01

---

## Remaining Work (for contributors)

Date picker, preset buttons, mobile layout

---

## AI Starter Prompt

```
Add date picker for backfill and mobile touch optimization.
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
