# [FEAT] Goals Tracker UI Card

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

Visual goal progress with category colors and quick check-in.

---

## Acceptance Criteria

- [ ] SVG progress rings on goal cards
- [ ] Category color coding
- [ ] Inline create form
- [ ] +10 quick checkin
- [ ] Delete action

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/goals-tracker.tsx` | Create/extend |
| `frontend/src/app/dashboard/life/page.tsx` | Integrate |

---

## Suggested Approach

SVG progress ring, GlassCard with purple glow.

---

## Brainstorming Notes

Archive completed goals to reduce clutter.

---

## Dependencies

Issue 02

---

## Remaining Work (for contributors)

Edit modal, archive tab, drag-to-reorder

---

## AI Starter Prompt

```
Add edit modal, target date display, completed archive tab.
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
