# NEURON OS — Life OS Expansion Guide

> **Vision:** One system that treats your personal life with the same seriousness you give your startup. Goals, energy, deep work — all in one place. Reads your patterns — sleep, output, screen time — and warns you **the week before you crash**. Not after.

---

## Table of Contents

1. [The Problem](#a-the-problem-why-this-matters)
2. [The Mental Model](#b-the-mental-model)
3. [Normal Brainstorming Walkthrough](#c-normal-brainstorming-walkthrough)
4. [AI-Assisted Brainstorming Walkthrough](#d-ai-assisted-brainstorming-walkthrough)
5. [Implementation Sequence](#e-implementation-sequence)
6. [What's Already Built](#f-whats-already-built)
7. [How to Contribute](#g-how-to-contribute)
8. [Architecture Reference](#h-architecture-reference)

---

## A. The Problem (Why This Matters)

Founders and builders treat business metrics with obsession — runway, burn rate, velocity, NPS — but ignore the **personal system metrics** that actually determine whether they can sustain the work.

Burnout is not random. It has **leading indicators**, not just lagging ones:

| Lagging (too late) | Leading (predictive) |
|---|---|
| "I'm exhausted" | Sleep debt accumulating over 5 days |
| Missed deadlines | Deep work minutes declining 30%+ |
| Quitting | Screen time spiking above baseline |
| Therapy referral | Energy/mood slope trending down |

Most tools (Notion, Whoop, RescueTime) are **siloed**. Nothing synthesizes signal into a single actionable warning. NEURON Life OS closes that gap.

---

## B. The Mental Model

### Startup Analogy

| Business Metric | Life Metric | What It Means |
|---|---|---|
| Cash runway | Sleep hours | How long until you crash |
| Product velocity | Deep work minutes | Output momentum |
| Team morale | Energy level (1–10) | Recovery capacity |
| Customer sentiment | Mood (1–10) | Directional wellbeing |

### Predictive vs. Reactive

Track the **rate of change**, not just today's value. A single bad night is noise. Five nights of declining sleep + falling deep work + rising screen time is a signal.

### Four Key Signals (Burnout Engine)

1. **Sleep debt** — nights below 7h accumulate debt
2. **Output momentum** — deep work decline > 30% over 5 days
3. **Recovery time** — screen time spike > 20% above personal baseline
4. **Mood trend** — negative linear regression on energy + mood over 7 days

Composite score 0–100. **Warning at > 65.**

---

## C. Normal Brainstorming Walkthrough

### Step 1: What data can you log in 30 seconds?

Start with manual input. Don't wait for Apple Health integration.

- Sleep hours (slider)
- Deep work minutes (slider)
- Screen time (slider or estimate)
- Energy 1–10
- Mood 1–10

If it takes longer than 30 seconds, adoption dies.

### Step 2: Log first, infer later

Week 1–2 is **calibration**. No warnings, no scores. Just collect baseline data. The engine needs ~7 days before signals are meaningful.

### Step 3: Why 7-day windows beat daily snapshots

Daily variance is high (bad Tuesday, great Wednesday). A 7-day sliding window smooths noise while catching trends early enough to act **this week**, not next month.

### Step 4: Set your own baselines

The engine computes personal baselines from *your* history — not population averages. Your 5h sleep might be fine; your 4h sleep for 5 nights is not.

### Step 5: Avoid over-engineering

| Do now | Do later |
|---|---|
| Manual daily log | Wearable webhooks |
| Simple composite score | ML prediction |
| In-app warning banner | Push notifications |
| Canvas sparklines | D3 interactive dashboards |

---

## D. AI-Assisted Brainstorming Walkthrough

### Prompt 1 — Ideate features

```
I'm building a Life OS inside a personal AI assistant called NEURON OS.
Core idea: predictive burnout detection from sleep, deep work, screen time, energy, mood.

What are 10 features that:
- Can be logged in under 30 seconds
- Produce leading (not lagging) indicators
- Don't require third-party integrations on day one

Format as a table: Feature | Data Source | Signal Type | Effort (S/M/L)
```

### Prompt 2 — Schema design

```
Given these Life OS metrics: sleep_hours, deep_work_minutes, screen_time_minutes,
energy_level, mood, goals with progress — design SQLAlchemy models that:
- Extend a shared Base class
- Have user_id FK on every table
- Support one log per user per day (unique constraint)
- Include a burnout_signals table for computed weekly scores

Output Python model files following FastAPI + SQLAlchemy sync patterns.
```

### Prompt 3 — API spec

```
Design REST endpoints for:
- POST /metrics/log (upsert daily)
- GET /metrics/history?days=7
- CRUD /goals
- GET /burnout/risk-score
- GET /burnout/weekly-report

Include Pydantic request/response schemas and auth via JWT Bearer token.
```

### Prompt 4 — Implementation

Use the full prompt in [`CURSOR_LIFE_OS_PROMPT.md`](./CURSOR_LIFE_OS_PROMPT.md).

### Prompt chaining flow

```
Idea → "What signals matter?" (Prompt 1)
     → "What tables store this?" (Prompt 2)
     → "What endpoints expose it?" (Prompt 3)
     → "Implement it" (CURSOR_LIFE_OS_PROMPT.md)
     → "Write tests for edge cases" (follow-up)
```

---

## E. Implementation Sequence

Build in this order. Each step unlocks the next.

```
1. LOG        → Daily metrics API + energy log UI
2. VISUALIZE  → Pattern charts + 7-day history
3. SCORE      → Burnout engine + risk gauge
4. ALERT      → HUD warning banner at score > 65
5. INTEGRATE  → Health imports, screen time, AI debrief
6. PREDICT    → 14-day regression, push alerts, wearables
```

**Current status:** Steps 1–4 are implemented. Steps 5–6 are open contributor issues.

---

## F. What's Already Built

### Backend

| File | Purpose |
|---|---|
| `backend/app/models/life_metrics.py` | Daily log model |
| `backend/app/models/goals.py` | Personal goals |
| `backend/app/models/burnout_signal.py` | Weekly computed scores |
| `backend/app/api/metrics.py` | Metrics CRUD |
| `backend/app/api/life_goals.py` | Goals CRUD + checkin |
| `backend/app/api/burnout.py` | Risk score + weekly report |
| `backend/app/services/burnout_engine.py` | 7-day sliding window analysis |

### Frontend

| Route / Component | Purpose |
|---|---|
| `/dashboard/life` | Life OS panel |
| `/dashboard/patterns` | Weekly pattern charts |
| `burnout-gauge.tsx` | Animated risk meter |
| `goals-tracker.tsx` | Goal cards with progress rings |
| `energy-log.tsx` | Daily quick-log form |
| `pattern-chart.tsx` | Canvas sparklines |
| `weekly-warning-banner.tsx` | HUD warning when risk > 65 |

### API Endpoints

See [`project-context/API_REFERENCE.md`](./project-context/API_REFERENCE.md#-life-os-routes).

---

## G. How to Contribute

### 1. Pick an issue

Browse [`.github/life-os/README.md`](./.github/life-os/README.md) — issues are organized by phase and effort estimate.

### 2. Claim it

Comment on the GitHub issue (or open a Discussion) with: `I'd like to work on this`.

### 3. Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/life-os-<issue-number>-short-name
```

### 4. Build

- Follow patterns in `project-context/BACKEND_GUIDELINES.md` and `FRONTEND_GUIDELINES.md`
- Match existing UI: `GlassCard`, `CyberButton`, cyber-mono typography
- All protected routes: `Depends(get_current_user)`

### 5. Test

```bash
# Backend
cd backend && .venv\Scripts\python -m uvicorn app.main:app --reload

# Frontend
cd frontend && npm run dev

# Smoke test
# POST /api/metrics/log → GET /api/burnout/risk-score
# Visit http://localhost:3000/dashboard/life
```

### 6. PR

Use the PR template. Link the issue. Include screenshots for UI changes.

### Definition of Done (all Life OS PRs)

- [ ] Code follows existing patterns (sync SQLAlchemy, `api.ts` client)
- [ ] No regressions to chat/memory/auth
- [ ] API documented in `API_REFERENCE.md` if endpoints changed
- [ ] UI matches glassmorphic cyber design system
- [ ] Manual test steps in PR description

---

## H. Architecture Reference

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                     │
│  /dashboard/life  /dashboard/patterns                   │
│  energy-log → api.ts → POST /metrics/log                │
│  burnout-gauge → api.ts → GET /burnout/risk-score       │
└──────────────────────┬──────────────────────────────────┘
                       │ JWT Bearer
┌──────────────────────▼──────────────────────────────────┐
│  FastAPI Backend                                        │
│  metrics.py │ life_goals.py │ burnout.py                │
│       └────────── burnout_engine.py ──────────┘         │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  SQLite / Postgres                                      │
│  life_metrics │ goals │ burnout_signals                 │
└─────────────────────────────────────────────────────────┘
```

---

*Built with the NEURON OS contributor community. Pick an issue, ship a PR, help people avoid burning out.*
