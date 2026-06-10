# [FEAT] Mobile Metrics Quick-Log

**Phase:** Phase 4 — Advanced  
**Status:** OPEN  
**Effort:** ~8h  
**Labels:** frontend, life-os, mobile  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Logging on mobile should be one-tap, PWA-optimized.

---

## Acceptance Criteria

- [ ] New route /dashboard/log optimized for mobile viewport
- [ ] Large touch targets, minimal fields (energy + sleep only)
- [ ] PWA manifest + service worker for add-to-homescreen
- [ ] Works offline with sync-on-reconnect

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/app/dashboard/log/page.tsx` | Create |
| `frontend/public/manifest.json` | Create/update |
| `frontend/next.config.ts` | PWA config if needed |

---

## Suggested Approach

Mobile-first layout. localStorage queue for offline logs.

---

## Brainstorming Notes

Quick-log = 2 fields only. Full log stays on /dashboard/life.

---

## Dependencies

Issue 03

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Create PWA mobile quick-log page with offline sync for life metrics.
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
