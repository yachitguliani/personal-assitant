"""Generate Life OS contributor issue markdown files."""
import os

BASE = os.path.join(os.path.dirname(__file__), "..", ".github", "life-os")


def render(issue: dict) -> str:
    files_table = "\n".join(f"| `{f}` | {a} |" for f, a in issue["files"])
    criteria = "\n".join(f"- [ ] {c}" for c in issue["criteria"])
    return f"""# [FEAT] {issue['title']}

**Phase:** {issue['phase']}  
**Status:** {issue['status']}  
**Effort:** {issue['effort']}  
**Labels:** {issue['labels']}  

---

## Vision

> One system that treats your personal life with the same seriousness you give your startup.
> Reads your patterns — sleep, output, screen time — and warns you the week before you crash. Not after.

---

## Problem

{issue['problem']}

---

## Acceptance Criteria

{criteria}

---

## Files to Touch

| File | Action |
|------|--------|
{files_table}

---

## Suggested Approach

{issue['approach']}

---

## Brainstorming Notes

{issue['brainstorm']}

---

## Dependencies

{issue['deps']}

---

## Remaining Work (for contributors)

{issue['remaining']}

---

## AI Starter Prompt

```
{issue['ai_prompt']}
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
"""


ISSUES = [
    ("phase-1-foundation/01-daily-metrics-api.md", {
        "title": "Daily Life Metrics Logging API",
        "phase": "Phase 1 — Foundation",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~4h",
        "labels": "good-first-issue, backend, life-os",
        "problem": "Users need a fast way to log daily sleep, deep work, screen time, energy, and mood.",
        "criteria": [
            "POST /api/metrics/log upserts one record per user per day",
            "GET /api/metrics/history?days=N returns ascending date order",
            "GET /api/metrics/summary returns averages for the period",
            "All fields validated (energy/mood 1-10, sleep 0-24)",
            "Protected with JWT auth",
        ],
        "files": [
            ("backend/app/models/life_metrics.py", "Create/extend"),
            ("backend/app/api/metrics.py", "Create/extend"),
            ("backend/app/main.py", "Register router"),
            ("project-context/API_REFERENCE.md", "Document endpoints"),
        ],
        "approach": "Follow memory.py pattern. UniqueConstraint on user_id+log_date for upsert.",
        "brainstorm": "Upsert prevents duplicate daily entries. Keep optional fields nullable.",
        "ai_prompt": "Add pytest tests, CSV export, and date range validation to metrics API.",
        "deps": "None — foundation issue",
        "remaining": "Unit tests, CSV export, validation edge cases",
    }),
    ("phase-1-foundation/02-goals-crud-api.md", {
        "title": "Goals CRUD API",
        "phase": "Phase 1 — Foundation",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~4h",
        "labels": "good-first-issue, backend, life-os",
        "problem": "Personal goals need REST CRUD with progress tracking.",
        "criteria": [
            "Full CRUD on /api/goals",
            "POST /api/goals/{id}/checkin updates progress",
            "Categories: health, work, learning, relationships",
            "Auto-complete when progress reaches 100",
            "User-scoped access control",
        ],
        "files": [
            ("backend/app/models/goals.py", "Create/extend"),
            ("backend/app/api/life_goals.py", "Create/extend"),
            ("project-context/DATABASE_SCHEMA.md", "Document table"),
        ],
        "approach": "Mirror existing CRUD routes. PATCH for partial updates.",
        "brainstorm": "Keep goals simple — no subtasks in v1.",
        "ai_prompt": "Add category filter, target_date sorting, milestone notes on checkin.",
        "deps": "None",
        "remaining": "Goal notes/history table, filter params, tests",
    }),
    ("phase-1-foundation/03-energy-log-ui.md", {
        "title": "Energy Log UI Component",
        "phase": "Phase 1 — Foundation",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~3h",
        "labels": "good-first-issue, frontend, life-os",
        "problem": "Daily logging must take under 30 seconds with on-brand UI.",
        "criteria": [
            "Slider form for all 5 metrics",
            "Submits to POST /api/metrics/log",
            "Glassmorphic cyber style",
            "Success/error feedback",
            "Refreshes burnout gauge after submit",
        ],
        "files": [
            ("frontend/src/components/dashboard/energy-log.tsx", "Create/extend"),
            ("frontend/src/app/dashboard/life/page.tsx", "Integrate"),
            ("frontend/src/utils/api.ts", "lifeOsApi.logMetric"),
        ],
        "approach": "Range inputs with accent-cyber-cyan. Reference energy-log.tsx.",
        "brainstorm": "Sliders beat forms for speed. Sensible defaults.",
        "ai_prompt": "Add date picker for backfill and mobile touch optimization.",
        "deps": "Issue 01",
        "remaining": "Date picker, preset buttons, mobile layout",
    }),
    ("phase-1-foundation/04-goals-tracker-ui.md", {
        "title": "Goals Tracker UI Card",
        "phase": "Phase 1 — Foundation",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~3h",
        "labels": "good-first-issue, frontend, life-os",
        "problem": "Visual goal progress with category colors and quick check-in.",
        "criteria": [
            "SVG progress rings on goal cards",
            "Category color coding",
            "Inline create form",
            "+10 quick checkin",
            "Delete action",
        ],
        "files": [
            ("frontend/src/components/dashboard/goals-tracker.tsx", "Create/extend"),
            ("frontend/src/app/dashboard/life/page.tsx", "Integrate"),
        ],
        "approach": "SVG progress ring, GlassCard with purple glow.",
        "brainstorm": "Archive completed goals to reduce clutter.",
        "ai_prompt": "Add edit modal, target date display, completed archive tab.",
        "deps": "Issue 02",
        "remaining": "Edit modal, archive tab, drag-to-reorder",
    }),
    ("phase-2-intelligence/05-burnout-engine.md", {
        "title": "Burnout Risk Engine (Backend)",
        "phase": "Phase 2 — Intelligence",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~6h",
        "labels": "backend, life-os, algorithm",
        "problem": "Composite burnout score from 4 sliding-window signals.",
        "criteria": [
            "Sleep debt score (< 7h accumulates debt)",
            "Deep work decline (> 30% over 5 days)",
            "Screen time spike (> 20% above baseline)",
            "Energy/mood linear regression trend",
            "Composite weighted score 0-100, warning at > 65",
            "Persist weekly signal to burnout_signals table",
        ],
        "files": [
            ("backend/app/services/burnout_engine.py", "Create/extend"),
            ("backend/app/models/burnout_signal.py", "Create/extend"),
            ("backend/app/api/burnout.py", "Expose endpoints"),
        ],
        "approach": "Pure Python, no ML deps. Testable functions per signal.",
        "brainstorm": "Weights: sleep 30%, work 25%, screen 20%, wellbeing 25%. Tune via config later.",
        "ai_prompt": "Add configurable weights via settings, calibration period (no warnings first 7 days), pytest for each signal.",
        "deps": "Issue 01",
        "remaining": "Configurable weights, calibration mode, unit tests",
    }),
    ("phase-2-intelligence/06-burnout-gauge.md", {
        "title": "Burnout Gauge Component",
        "phase": "Phase 2 — Intelligence",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~4h",
        "labels": "frontend, life-os",
        "problem": "Animated neon risk meter showing 0-100 burnout score.",
        "criteria": [
            "Canvas arc gauge 0-100",
            "Glows red when score > 65",
            "Threshold marker at 65",
            "Pulse animation on elevated risk",
            "Matches vector-viz.tsx aesthetic",
        ],
        "files": [
            ("frontend/src/components/dashboard/burnout-gauge.tsx", "Create/extend"),
            ("frontend/src/app/dashboard/life/page.tsx", "Integrate"),
        ],
        "approach": "HTML5 Canvas arc. Framer Motion pulse when elevated.",
        "brainstorm": "Color zones: green < 40, yellow 40-65, red > 65.",
        "ai_prompt": "Add factor breakdown tooltip on hover showing individual signal scores.",
        "deps": "Issue 05",
        "remaining": "Factor tooltip, accessibility labels, responsive sizing",
    }),
    ("phase-2-intelligence/07-pattern-charts.md", {
        "title": "Weekly Pattern Charts",
        "phase": "Phase 2 — Intelligence",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~5h",
        "labels": "frontend, life-os",
        "problem": "7-day sparklines for sleep, deep work, screen time, energy.",
        "criteria": [
            "Canvas sparkline charts (no chart library)",
            "Area fill gradient under line",
            "Trend indicator (up/down vs previous day)",
            "Empty state when no data",
            "Responsive to container width",
        ],
        "files": [
            ("frontend/src/components/dashboard/pattern-chart.tsx", "Create/extend"),
            ("frontend/src/app/dashboard/patterns/page.tsx", "Integrate"),
        ],
        "approach": "Follow vector-viz canvas pattern. devicePixelRatio for sharpness.",
        "brainstorm": "4 charts on patterns page. Keep y-axis implicit (min-max auto scale).",
        "ai_prompt": "Add day labels on x-axis, crosshair on hover, compare-to-baseline dashed line.",
        "deps": "Issue 01",
        "remaining": "X-axis labels, hover crosshair, baseline comparison line",
    }),
    ("phase-2-intelligence/08-hud-warning-banner.md", {
        "title": "HUD Warning Banner",
        "phase": "Phase 2 — Intelligence",
        "status": "IMPLEMENTED (enhancement welcome)",
        "effort": "~2h",
        "labels": "good-first-issue, frontend, life-os",
        "problem": "Visible warning when burnout risk exceeds threshold.",
        "criteria": [
            "Banner appears in HUD when risk > 65",
            "Shows score and recommendation text",
            "Dismissible for current session",
            "Badge on Life OS nav tab",
            "Polls risk score every 60s",
        ],
        "files": [
            ("frontend/src/components/dashboard/weekly-warning-banner.tsx", "Create/extend"),
            ("frontend/src/components/dashboard/hud-header.tsx", "Integrate badge"),
            ("frontend/src/hooks/use-burnout-risk.ts", "Create/extend"),
        ],
        "approach": "useBurnoutRisk hook + AnimatePresence banner.",
        "brainstorm": "Don't nag — dismiss persists for session only, resets on reload.",
        "ai_prompt": "Add snooze for 24h via localStorage, link to /dashboard/patterns from banner.",
        "deps": "Issue 05",
        "remaining": "24h snooze, deep link to patterns page",
    }),
    ("phase-3-integrations/09-health-import.md", {
        "title": "Apple Health / Google Fit Import",
        "phase": "Phase 3 — Integrations",
        "status": "OPEN",
        "effort": "~8h",
        "labels": "backend, life-os, integration",
        "problem": "Manual logging is friction. Import sleep/activity from health exports.",
        "criteria": [
            "POST /api/metrics/import accepts CSV (Apple Health export format)",
            "Maps sleep analysis and exercise minutes to life_metrics fields",
            "Deduplicates by date (merge with existing logs)",
            "Returns import summary (rows processed, skipped, errors)",
            "Frontend upload button on /dashboard/life",
        ],
        "files": [
            ("backend/app/api/metrics.py", "Add import endpoint"),
            ("backend/app/services/health_import.py", "Create parser"),
            ("frontend/src/components/dashboard/health-import.tsx", "Create UI"),
        ],
        "approach": "Start with Apple Health CSV (most documented format). Parse with csv module.",
        "brainstorm": "Google Fit export varies — support Apple first, document Google as follow-up.",
        "ai_prompt": "Implement Apple Health CSV import for sleep and active energy. See metrics.py for upsert pattern.",
        "deps": "Issue 01",
        "remaining": "Full implementation",
    }),
    ("phase-3-integrations/10-screen-time-import.md", {
        "title": "Screen Time API Integration",
        "phase": "Phase 3 — Integrations",
        "status": "OPEN",
        "effort": "~6h",
        "labels": "backend, life-os, integration",
        "problem": "Screen time is a key burnout signal but hard to log manually.",
        "criteria": [
            "POST /api/metrics/import/screen-time accepts RescueTime CSV or manual JSON",
            "Maps to screen_time_minutes on life_metrics",
            "Optional: RescueTime API key in .env for auto-sync",
            "Daily cron or manual sync button in UI",
        ],
        "files": [
            ("backend/app/services/screen_time_import.py", "Create"),
            ("backend/app/api/metrics.py", "Add endpoint"),
            ("backend/app/core/config.py", "Add RESCUETIME_API_KEY setting"),
            ("frontend/src/components/dashboard/screen-time-import.tsx", "Create"),
        ],
        "approach": "CSV import first (no API key needed). RescueTime API as stretch goal.",
        "brainstorm": "iOS Screen Time has no public API — RescueTime or manual CSV is realistic.",
        "ai_prompt": "Implement RescueTime CSV import mapping productivity time to screen_time_minutes.",
        "deps": "Issue 01",
        "remaining": "Full implementation",
    }),
    ("phase-3-integrations/11-ai-weekly-debrief.md", {
        "title": "AI Weekly Debrief",
        "phase": "Phase 3 — Integrations",
        "status": "OPEN",
        "effort": "~4h",
        "labels": "backend, life-os, ai",
        "problem": "Raw scores need human-readable narrative insights.",
        "criteria": [
            "GET /api/burnout/weekly-debrief returns AI-generated narrative",
            "Uses existing AIOrchestrator with metrics + factors as context",
            "Graceful fallback when no API key (template-based summary)",
            "Display on /dashboard/patterns page",
        ],
        "files": [
            ("backend/app/api/burnout.py", "Add debrief endpoint"),
            ("backend/app/services/burnout_engine.py", "Export context builder"),
            ("frontend/src/app/dashboard/patterns/page.tsx", "Display debrief"),
        ],
        "approach": "Build prompt from factors JSON + 7-day metrics. Stream or single response.",
        "brainstorm": "Keep prompt short — 3 paragraphs max. Tone: direct, not clinical.",
        "ai_prompt": "Add AI weekly debrief using ai_orchestrator.py with burnout factors as context.",
        "deps": "Issues 05, 07",
        "remaining": "Full implementation",
    }),
    ("phase-3-integrations/12-goal-memory-bridge.md", {
        "title": "Goal to Memory Bridge",
        "phase": "Phase 3 — Integrations",
        "status": "OPEN",
        "effort": "~3h",
        "labels": "backend, life-os",
        "problem": "Goal completions should persist in semantic memory for AI context.",
        "criteria": [
            "On goal completion (progress=100), auto-create memory node",
            "Category: episodic, tags: [life-goal, category]",
            "On checkin milestones (25/50/75%), optional memory entry",
            "Chat AI can reference completed goals via memory search",
        ],
        "files": [
            ("backend/app/api/life_goals.py", "Hook on checkin/complete"),
            ("backend/app/services/memory_service.py", "Reuse add_memory"),
        ],
        "approach": "Call MemoryService.add_memory() in checkin_goal when progress hits milestones.",
        "brainstorm": "Only auto-save completions and 100% — avoid memory spam on every +10.",
        "ai_prompt": "Bridge goal completions to semantic memory using MemoryService.add_memory.",
        "deps": "Issues 02, memory API",
        "remaining": "Full implementation",
    }),
    ("phase-4-advanced/13-predictive-streaks.md", {
        "title": "Predictive Streak Analysis",
        "phase": "Phase 4 — Advanced",
        "status": "OPEN",
        "effort": "~8h",
        "labels": "backend, life-os, algorithm",
        "problem": "Detect burnout patterns 14 days out using regression.",
        "criteria": [
            "Extend burnout_engine with 14-day projection",
            "Linear regression on composite score trend",
            "GET /api/burnout/forecast returns projected score in 7 and 14 days",
            "Frontend forecast line on pattern charts (dashed)",
        ],
        "files": [
            ("backend/app/services/burnout_engine.py", "Add forecast functions"),
            ("backend/app/api/burnout.py", "Add /forecast endpoint"),
            ("frontend/src/components/dashboard/pattern-chart.tsx", "Add forecast overlay"),
        ],
        "approach": "Simple linear regression on daily composite scores. No sklearn needed.",
        "brainstorm": "14-day needs more data — require minimum 10 days logged before forecasting.",
        "ai_prompt": "Add 14-day burnout forecast using linear regression on daily composite scores.",
        "deps": "Issue 05",
        "remaining": "Full implementation",
    }),
    ("phase-4-advanced/14-push-email-alerts.md", {
        "title": "Push Notification / Email Alerts",
        "phase": "Phase 4 — Advanced",
        "status": "OPEN",
        "effort": "~6h",
        "labels": "backend, life-os",
        "problem": "In-app warnings are missed if user doesn't open NEURON.",
        "criteria": [
            "Weekly cron checks burnout risk for all users",
            "Send email when risk > 65 (SMTP or SendGrid via .env)",
            "User preference: opt-in/opt-out in settings",
            "Email includes score, top factor, and recommendation",
        ],
        "files": [
            ("backend/app/services/alert_service.py", "Create"),
            ("backend/app/core/config.py", "Add SMTP settings"),
            ("backend/app/models/user.py", "Add alert_preferences JSON field"),
        ],
        "approach": "APScheduler or simple cron script. Start with email, push later.",
        "brainstorm": "Default opt-in false. One email per week max — no spam.",
        "ai_prompt": "Implement weekly email alert when burnout risk > 65 using SMTP config.",
        "deps": "Issue 05, 08",
        "remaining": "Full implementation",
    }),
    ("phase-4-advanced/15-mobile-quick-log.md", {
        "title": "Mobile Metrics Quick-Log",
        "phase": "Phase 4 — Advanced",
        "status": "OPEN",
        "effort": "~8h",
        "labels": "frontend, life-os, mobile",
        "problem": "Logging on mobile should be one-tap, PWA-optimized.",
        "criteria": [
            "New route /dashboard/log optimized for mobile viewport",
            "Large touch targets, minimal fields (energy + sleep only)",
            "PWA manifest + service worker for add-to-homescreen",
            "Works offline with sync-on-reconnect",
        ],
        "files": [
            ("frontend/src/app/dashboard/log/page.tsx", "Create"),
            ("frontend/public/manifest.json", "Create/update"),
            ("frontend/next.config.ts", "PWA config if needed"),
        ],
        "approach": "Mobile-first layout. localStorage queue for offline logs.",
        "brainstorm": "Quick-log = 2 fields only. Full log stays on /dashboard/life.",
        "ai_prompt": "Create PWA mobile quick-log page with offline sync for life metrics.",
        "deps": "Issue 03",
        "remaining": "Full implementation",
    }),
    ("phase-4-advanced/16-wearable-webhooks.md", {
        "title": "Wearable Webhook Receiver",
        "phase": "Phase 4 — Advanced",
        "status": "OPEN",
        "effort": "~6h",
        "labels": "backend, life-os, integration",
        "problem": "Oura/Whoop push sleep and HRV data — NEURON should accept it.",
        "criteria": [
            "POST /api/webhooks/oura accepts Oura webhook payload",
            "POST /api/webhooks/whoop accepts Whoop webhook payload",
            "Maps sleep duration and readiness to life_metrics",
            "Webhook secret verification via .env",
            "Idempotent processing (same event twice = no duplicate)",
        ],
        "files": [
            ("backend/app/api/webhooks.py", "Create"),
            ("backend/app/services/wearable_mapper.py", "Create"),
            ("backend/app/main.py", "Register router"),
            (".env.example", "Add webhook secrets"),
        ],
        "approach": "Start with Oura (better docs). Generic mapper interface for providers.",
        "brainstorm": "Webhooks need public URL — document ngrok for local dev.",
        "ai_prompt": "Implement Oura webhook receiver mapping sleep data to life_metrics upsert.",
        "deps": "Issue 01",
        "remaining": "Full implementation",
    }),
]


def main():
    for path, data in ISSUES:
        full = os.path.join(BASE, path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w", encoding="utf-8") as f:
            f.write(render(data))
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
