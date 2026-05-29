# Current Phase — Phase 1: Foundation & Core Experience

NEURON OS is developed in structured phases to prioritize building modular foundations before implementing complex automated pipelines.

## 🏁 Phase 1 Objectives
Establish the architectural scaffolding and core visual dashboard elements.

- [x] **Project Scaffolding:** Monorepo architecture separating frontend (Next.js) and backend (FastAPI).
- [x] **Cinematic UX:** Futuristic landing page, login gate, and Command Center dashboard.
- [x] **Chat Infrastructure:** HTTP REST streaming connections for chat transcripts.
- [x] **Semantic Memory:** Background calculations of float embeddings, storing text logs.
- [x] **Authentication:** Secure token management, signup, and login workflows.
- [x] **Database setup:** SQLite/PostgreSQL configuration.
- [x] **Docker Setup:** Cross-container linking.

## 🚫 Out of Scope for Phase 1
The following modules must **NOT** be built in the current codebase to avoid over-engineering:
* **Voice Cores:** No advanced speech-to-text or text-to-speech synthesis (postponed to Phase 2).
* **Autonomous Agents:** No recursive agent loops or background tool-calling pipelines (postponed to Phase 2).
* **Automations:** No third-party integrations (WhatsApp, email, browser automation) (postponed to Phase 3).
* **Mobile/Desktop clients:** No Android/iOS apps or electron wraps (postponed to Phase 4).
* **Health Intelligence:** No wearable integrations (Apple Health, Fitbit) (postponed to Phase 4).
