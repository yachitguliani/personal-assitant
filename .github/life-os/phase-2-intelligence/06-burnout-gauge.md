# [FEAT] Burnout Gauge Component

**Phase:** Phase 2 — Intelligence  
**Status:** IMPLEMENTED (enhancement welcome)  
**Effort:** ~4h  
**Labels:** frontend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Animated neon risk meter showing 0-100 burnout score.

---

## Acceptance Criteria

- [ ] Canvas arc gauge 0-100
- [ ] Glows red when score > 65
- [ ] Threshold marker at 65
- [ ] Pulse animation on elevated risk
- [ ] Matches vector-viz.tsx aesthetic

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/burnout-gauge.tsx` | Create/extend |
| `frontend/src/app/dashboard/life/page.tsx` | Integrate |

---

## Suggested Approach

HTML5 Canvas arc. Framer Motion pulse when elevated.

---

## Brainstorming Notes

Color zones: green < 40, yellow 40-65, red > 65.

---

## Dependencies

Issue 05

---

## Remaining Work (for contributors)

Factor tooltip, accessibility labels, responsive sizing

---

## AI Starter Prompt

```
Add factor breakdown tooltip on hover showing individual signal scores.
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
