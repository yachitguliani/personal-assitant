# Life OS — Contributor Issue Backlog

> **Vision:** One system that treats your personal life with the same seriousness you give your startup. Goals, energy, deep work — all in one place. Reads your patterns — sleep, output, screen time — and warns you **the week before you crash**. Not after.

Welcome, contributor. This folder contains **16 ready-to-pick issues** for the NEURON Life OS expansion. Each issue is a self-contained markdown spec you can implement and submit as a PR.

---

## Quick Start

1. Read [`LIFE_OS_GUIDE.md`](../../LIFE_OS_GUIDE.md) — vision, mental model, architecture
2. Read [`CURSOR_LIFE_OS_PROMPT.md`](../../CURSOR_LIFE_OS_PROMPT.md) — paste into Cursor for AI-assisted implementation
3. Pick an issue below (start with **OPEN** issues if core is already done)
4. Comment "I'd like to work on this" on GitHub (or open a PR referencing the issue file)
5. Branch off `dev`: `feature/life-os-XX-short-name`
6. Submit PR using [pull request template](../pull_request_template.md)

---

## Issue Index

### Phase 1 — Foundation (~3–4h each)

| # | Issue | Status | Effort | Skills |
|---|-------|--------|--------|--------|
| 01 | [Daily Life Metrics Logging API](./phase-1-foundation/01-daily-metrics-api.md) | ✅ Implemented | ~4h | Backend, FastAPI |
| 02 | [Goals CRUD API](./phase-1-foundation/02-goals-crud-api.md) | ✅ Implemented | ~4h | Backend, FastAPI |
| 03 | [Energy Log UI Component](./phase-1-foundation/03-energy-log-ui.md) | ✅ Implemented | ~3h | Frontend, React |
| 04 | [Goals Tracker UI Card](./phase-1-foundation/04-goals-tracker-ui.md) | ✅ Implemented | ~3h | Frontend, React |

**Good first PRs for Phase 1:** Pick any issue and work on the **Remaining Work** section (tests, polish, mobile).

---

### Phase 2 — Intelligence (~2–6h each)

| # | Issue | Status | Effort | Skills |
|---|-------|--------|--------|--------|
| 05 | [Burnout Risk Engine](./phase-2-intelligence/05-burnout-engine.md) | ✅ Implemented | ~6h | Python, algorithms |
| 06 | [Burnout Gauge Component](./phase-2-intelligence/06-burnout-gauge.md) | ✅ Implemented | ~4h | Canvas, React |
| 07 | [Weekly Pattern Charts](./phase-2-intelligence/07-pattern-charts.md) | ✅ Implemented | ~5h | Canvas, React |
| 08 | [HUD Warning Banner](./phase-2-intelligence/08-hud-warning-banner.md) | ✅ Implemented | ~2h | Frontend, React |

**Good first PRs for Phase 2:** Issue 08 enhancements (snooze, deep links) or Issue 06 (factor tooltips).

---

### Phase 3 — Integrations (~3–8h each) — **OPEN**

| # | Issue | Status | Effort | Skills |
|---|-------|--------|--------|--------|
| 09 | [Apple Health / Google Fit Import](./phase-3-integrations/09-health-import.md) | 🟢 OPEN | ~8h | Backend, CSV parsing |
| 10 | [Screen Time API Integration](./phase-3-integrations/10-screen-time-import.md) | 🟢 OPEN | ~6h | Backend, integrations |
| 11 | [AI Weekly Debrief](./phase-3-integrations/11-ai-weekly-debrief.md) | 🟢 OPEN | ~4h | AI, FastAPI |
| 12 | [Goal → Memory Bridge](./phase-3-integrations/12-goal-memory-bridge.md) | 🟢 OPEN | ~3h | Backend |

**Best for new contributors:** Issue 12 (smallest scope) or Issue 11 (if you know LLM APIs).

---

### Phase 4 — Advanced (~6–8h each) — **OPEN**

| # | Issue | Status | Effort | Skills |
|---|-------|--------|--------|--------|
| 13 | [Predictive Streak Analysis](./phase-4-advanced/13-predictive-streaks.md) | 🟢 OPEN | ~8h | Algorithms, Python |
| 14 | [Push / Email Alerts](./phase-4-advanced/14-push-email-alerts.md) | 🟢 OPEN | ~6h | Backend, email |
| 15 | [Mobile Metrics Quick-Log](./phase-4-advanced/15-mobile-quick-log.md) | 🟢 OPEN | ~8h | Frontend, PWA |
| 16 | [Wearable Webhook Receiver](./phase-4-advanced/16-wearable-webhooks.md) | 🟢 OPEN | ~6h | Backend, webhooks |

---

## What's Already Built

The core Life OS (Phases 1–2) is **implemented in the repo**:

```
backend/app/models/life_metrics.py    backend/app/api/metrics.py
backend/app/models/goals.py           backend/app/api/life_goals.py
backend/app/models/burnout_signal.py  backend/app/api/burnout.py
backend/app/services/burnout_engine.py

frontend/src/app/dashboard/life/       frontend/src/app/dashboard/patterns/
frontend/src/components/dashboard/burnout-gauge.tsx
frontend/src/components/dashboard/goals-tracker.tsx
frontend/src/components/dashboard/energy-log.tsx
frontend/src/components/dashboard/pattern-chart.tsx
frontend/src/components/dashboard/weekly-warning-banner.tsx
```

Run locally:
```bash
docker-compose up --build
# or manually: backend on :8000, frontend on :3000
# Visit http://localhost:3000/dashboard/life
```

---

## Creating GitHub Issues from These Files

Maintainers can bulk-create GitHub issues from these markdown files:

```bash
# Example: create one issue manually
gh issue create --title "[FEAT] Apple Health Import" \
  --body-file .github/life-os/phase-3-integrations/09-health-import.md \
  --label "life-os,good-first-issue"
```

Or copy the markdown body into GitHub's "New Issue" form using the [Life OS template](../ISSUE_TEMPLATE/life_os_feature.md).

---

## Definition of Done (Every PR)

- [ ] Follows existing code patterns (see `project-context/BACKEND_GUIDELINES.md`)
- [ ] No regressions to chat, memory, or auth
- [ ] API changes documented in `project-context/API_REFERENCE.md`
- [ ] Schema changes in `project-context/DATABASE_SCHEMA.md`
- [ ] UI matches cyber glassmorphic design system
- [ ] Manual test steps in PR description
- [ ] Screenshots for UI changes

---

## Labels (Suggested)

| Label | Meaning |
|-------|---------|
| `life-os` | Part of Life OS expansion |
| `good-first-issue` | Suitable for first-time contributors |
| `backend` | Python/FastAPI work |
| `frontend` | Next.js/React work |
| `integration` | Third-party API/CSV import |
| `algorithm` | Burnout engine / scoring logic |

---

*Help people avoid burning out. Pick an issue, ship a PR.*
