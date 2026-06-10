# [FEAT] Weekly Pattern Charts

**Phase:** Phase 2 — Intelligence  
**Status:** IMPLEMENTED (enhancement welcome)  
**Effort:** ~5h  
**Labels:** frontend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

7-day sparklines for sleep, deep work, screen time, energy.

---

## Acceptance Criteria

- [ ] Canvas sparkline charts (no chart library)
- [ ] Area fill gradient under line
- [ ] Trend indicator (up/down vs previous day)
- [ ] Empty state when no data
- [ ] Responsive to container width

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/pattern-chart.tsx` | Create/extend |
| `frontend/src/app/dashboard/patterns/page.tsx` | Integrate |

---

## Suggested Approach

Follow vector-viz canvas pattern. devicePixelRatio for sharpness.

---

## Brainstorming Notes

4 charts on patterns page. Keep y-axis implicit (min-max auto scale).

---

## Dependencies

Issue 01

---

## Remaining Work (for contributors)

X-axis labels, hover crosshair, baseline comparison line

---

## AI Starter Prompt

```
Add day labels on x-axis, crosshair on hover, compare-to-baseline dashed line.
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
