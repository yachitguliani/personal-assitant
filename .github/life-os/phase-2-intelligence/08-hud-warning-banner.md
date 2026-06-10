# [FEAT] HUD Warning Banner

**Phase:** Phase 2 — Intelligence  
**Status:** IMPLEMENTED (enhancement welcome)  
**Effort:** ~2h  
**Labels:** good-first-issue, frontend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Visible warning when burnout risk exceeds threshold.

---

## Acceptance Criteria

- [ ] Banner appears in HUD when risk > 65
- [ ] Shows score and recommendation text
- [ ] Dismissible for current session
- [ ] Badge on Life OS nav tab
- [ ] Polls risk score every 60s

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/weekly-warning-banner.tsx` | Create/extend |
| `frontend/src/components/dashboard/hud-header.tsx` | Integrate badge |
| `frontend/src/hooks/use-burnout-risk.ts` | Create/extend |

---

## Suggested Approach

useBurnoutRisk hook + AnimatePresence banner.

---

## Brainstorming Notes

Don't nag — dismiss persists for session only, resets on reload.

---

## Dependencies

Issue 05

---

## Remaining Work (for contributors)

24h snooze, deep link to patterns page

---

## AI Starter Prompt

```
Add snooze for 24h via localStorage, link to /dashboard/patterns from banner.
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
