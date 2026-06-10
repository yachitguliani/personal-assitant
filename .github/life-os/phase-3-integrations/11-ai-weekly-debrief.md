# [FEAT] AI Weekly Debrief

**Phase:** Phase 3 — Integrations  
**Status:** OPEN  
**Effort:** ~4h  
**Labels:** backend, life-os, ai  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

Raw scores need human-readable narrative insights.

---

## Acceptance Criteria

- [ ] GET /api/burnout/weekly-debrief returns AI-generated narrative
- [ ] Uses existing AIOrchestrator with metrics + factors as context
- [ ] Graceful fallback when no API key (template-based summary)
- [ ] Display on /dashboard/patterns page

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/burnout.py` | Add debrief endpoint |
| `backend/app/services/burnout_engine.py` | Export context builder |
| `frontend/src/app/dashboard/patterns/page.tsx` | Display debrief |

---

## Suggested Approach

Build prompt from factors JSON + 7-day metrics. Stream or single response.

---

## Brainstorming Notes

Keep prompt short — 3 paragraphs max. Tone: direct, not clinical.

---

## Dependencies

Issues 05, 07

---

## Remaining Work (for contributors)

Full implementation

---

## AI Starter Prompt

```
Add AI weekly debrief using ai_orchestrator.py with burnout factors as context.
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
