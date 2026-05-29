# Architecture Decision Log — NEURON OS

This document records the technical rationale behind key architectural decisions.

---

## 🏛️ Decision 1: Monorepo Separation of Next.js & FastAPI
* **Status:** Approved (Phase 1 Scaffolding)
* **Rationale:** Keeping the client separate from the API engine maximizes modularity. The frontend can compile static assets independently, while the backend serves as a clean gateway that can be redeployed or expanded without rebuilding the UI.

---

## 🎨 Decision 2: Tailwind CSS v4 & Framer Motion
* **Status:** Approved (Phase 1 Frontend)
* **Rationale:** Tailwind CSS v4 offers faster builds and supports native CSS variables natively, streamlining the custom HUD palette. Framer Motion simplifies styling scifi elements.

---

## 🧠 Decision 3: Deterministic Offline Memory & API Fallback
* **Status:** Approved (Phase 1 AI Core)
* **Rationale:** A major friction point in developing AI applications is requiring cloud database servers and API keys. We implemented automatic local fallbacks (SQLite database + NumPy cosine similarity + word hashing mock vectors) so that the application runs locally out-of-the-box.

---

## 📡 Decision 4: HTTP Streaming over WebSockets
* **Status:** Approved (Phase 1 Chat)
* **Rationale:** For simple streaming chat prompts, Server-Sent Events (SSE) or chunked HTTP responses are simpler, require no connection handshakes, and handle network disconnects more gracefully than WebSockets.
