# [FEAT] Wearable Webhook Receiver

**Phase:** Phase 4 — Advanced  
**Status:** OPEN  
**Effort:** ~6h  
**Labels:** backend, life-os, integration  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Oura/Whoop push sleep and HRV data — NEURON should accept it.

---

## Acceptance Criteria

- [ ] POST /api/webhooks/oura accepts Oura webhook payload
- [ ] POST /api/webhooks/whoop accepts Whoop webhook payload
- [ ] Maps sleep duration and readiness to life_metrics
- [ ] Webhook secret verification via .env
- [ ] Idempotent processing (same event twice = no duplicate)

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/webhooks.py` | Create |
| `backend/app/services/wearable_mapper.py` | Create |
| `backend/app/main.py` | Register router |
| `.env.example` | Add webhook secrets |

---

## Suggested Approach

Start with Oura (better docs). Generic mapper interface for providers.

---

## Brainstorming Notes

Webhooks need public URL — document ngrok for local dev.

---

## Dependencies

Issue 01

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Implement Oura webhook receiver mapping sleep data to life_metrics upsert.
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
