# Contributor Guide — NEURON OS

Welcome to the NEURON OS contributor team! This document lists commands and branch practices to set up your environment.

## 🛠️ Quickstart Boot Setup

### 1. Boot via Docker Compose
To run all three containers simultaneously (Postgres DB, API backend, Next.js frontend):
```bash
docker-compose up --build
```
* **Frontend UI:** `http://localhost:3000`
* **Backend docs:** `http://localhost:8000/docs`

### 2. Manual Boot

#### Start Backend:
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python app/main.py
```

#### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 📍 Git Branch Strategy
* **`main`:** Contains production-stable code.
* **`dev`:** Target branch for development pull requests.
* **`feature/*`:** Sandbox for developing modules (e.g. `feature/voice-control`).

## 📌 Commit Syntax Conventions
We enforce semantic commits:
* `feat(scope): ...` (New functionality)
* `fix(scope): ...` (Bug resolution)
* `docs(scope): ...` (Documentation changes)
* `style(scope): ...` (Linters or spacing)

## 🌱 Life OS Contributions

NEURON is expanding into a **Life Operating System** with predictive burnout detection.

> One system that treats your personal life with the same seriousness you give your startup.

**Start here:**
- [`LIFE_OS_GUIDE.md`](../LIFE_OS_GUIDE.md) — vision, mental model, implementation guide
- [`.github/life-os/README.md`](../.github/life-os/README.md) — 16 pick-up issues by phase
- [`CURSOR_LIFE_OS_PROMPT.md`](../CURSOR_LIFE_OS_PROMPT.md) — AI-assisted implementation prompt

**Branch naming:** `feature/life-os-XX-short-name` (e.g. `feature/life-os-09-health-import`)

### Personal Assistant Learning Track (24 issues)

Learn chat, memory, voice, and AI features while contributing:

- [`ASSISTANT_LEARNING.md`](../ASSISTANT_LEARNING.md) — full learning guide + GPT tips
- [`.github/assistant-learning/README.md`](../.github/assistant-learning/README.md) — 12 easy + 12 medium issues
