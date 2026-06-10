# Cursor Composer Prompt — Life OS Implementation

Copy everything below the line into Cursor Composer (Agent mode) when extending Life OS features.

---

```
You are implementing features for NEURON OS — a personal Life Operating System with predictive burnout detection.

## Vision
One system that treats your personal life with the same seriousness you give your startup.
Goals, energy, deep work — all in one place. Reads patterns (sleep, output, screen time)
and warns the user the week BEFORE they crash — not after.

## Existing Architecture (DO NOT reinvent)

### Backend (FastAPI, sync SQLAlchemy)
- Models extend `Base` from `backend/app/core/database.py`
- Auth: `Depends(get_current_user)` from `backend/app/api/auth.py`
- DB: `db: Session = Depends(get_db)` — sync, NOT async
- Routers registered in `backend/app/main.py` with `settings.API_V1_STR` prefix
- Tables auto-created via `Base.metadata.create_all()` — no Alembic
- Inline Pydantic schemas in route files (no separate schemas/ folder)

### Existing Life OS files (already implemented)
- Models: `life_metrics.py`, `goals.py`, `burnout_signal.py`
- APIs: `metrics.py`, `life_goals.py`, `burnout.py`
- Service: `services/burnout_engine.py` (7-day window, composite score, threshold 65)
- Frontend: `/dashboard/life`, `/dashboard/patterns`
- Components: burnout-gauge, goals-tracker, energy-log, pattern-chart, weekly-warning-banner
- API client: `frontend/src/utils/api.ts` → `lifeOsApi` object

### Frontend (Next.js App Router)
- `"use client"` on interactive pages
- UI: `GlassCard`, `CyberButton`, `NeonInput` from `components/ui/`
- Canvas viz pattern: see `components/vector-viz.tsx` and `pattern-chart.tsx`
- Auth: `getAuthToken()` from localStorage, redirect to `/login` if missing
- Typography: `text-[9px] font-mono uppercase tracking-widest` for labels
- Colors: `text-cyber-cyan`, `text-cyber-purple`, `bg-cyber-dark`

## Task
[DESCRIBE YOUR SPECIFIC TASK HERE — e.g. "Implement Apple Health CSV import for issue #09"]

## Requirements
1. Follow existing file patterns exactly — read neighboring files before writing
2. Minimize scope — only change files required for this task
3. All new protected routes use `Depends(get_current_user)`
4. All new API calls go through `lifeOsApi` in `api.ts`
5. Update `project-context/API_REFERENCE.md` if adding endpoints
6. Update `project-context/DATABASE_SCHEMA.md` if adding tables
7. Match glassmorphic cyber UI — no generic Bootstrap/MUI

## Burnout Engine Reference
Signals (weighted composite):
- Sleep debt (30%): nights below 7h accumulate
- Deep work decline (25%): >30% drop over recent 5 days
- Screen time spike (20%): >20% above personal baseline
- Wellbeing trend (25%): negative slope on energy + mood

Warning threshold: 65/100

## Verification
1. Backend starts: `cd backend && python -m uvicorn app.main:app --reload`
2. Frontend starts: `cd frontend && npm run dev`
3. Login → /dashboard/life → log metrics → check burnout gauge
4. Existing chat and memory features still work

## Files you will likely touch
[List from the issue spec]

Begin by reading the relevant existing files, then implement.
```

---

## Usage Tips

1. Replace `[DESCRIBE YOUR SPECIFIC TASK HERE]` with the issue title and acceptance criteria
2. Paste the issue's "Files to touch" section into the bottom
3. For UI tasks, reference `frontend/src/components/dashboard/energy-log.tsx` as the style baseline
4. For API tasks, reference `backend/app/api/metrics.py` as the pattern baseline
