# [FEAT] Push Notification / Email Alerts

**Phase:** Phase 4 — Advanced  
**Status:** OPEN  
**Effort:** ~6h  
**Labels:** backend, life-os  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

In-app warnings are missed if user doesn't open NEURON.

---

## Acceptance Criteria

- [ ] Weekly cron checks burnout risk for all users
- [ ] Send email when risk > 65 (SMTP or SendGrid via .env)
- [ ] User preference: opt-in/opt-out in settings
- [ ] Email includes score, top factor, and recommendation

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/services/alert_service.py` | Create |
| `backend/app/core/config.py` | Add SMTP settings |
| `backend/app/models/user.py` | Add alert_preferences JSON field |

---

## Suggested Approach

APScheduler or simple cron script. Start with email, push later.

---

## Brainstorming Notes

Default opt-in false. One email per week max — no spam.

---

## Dependencies

Issue 05, 08

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Implement weekly email alert when burnout risk > 65 using SMTP config.
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
