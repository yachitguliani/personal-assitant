# System Architecture — NEURON OS

NEURON OS is organized as a modular monorepo comprising a Next.js client, a FastAPI API gateway, and a PostgreSQL database.

## 🗺️ Monorepo Diagram
```mermaid
graph TD
    Client[Next.js Client: Port 3000] <-->|HTTP REST / Streams| API[FastAPI Server: Port 8000]
    API <-->|SQLAlchemy Sessions| DB[(PostgreSQL + pgvector: Port 5432)]
    API -.->|Vector Fallback| SQLite[(Local SQLite: neuron.db)]
    API <-->|HTTP Requests| LLM[OpenAI / Claude API Providers]
```

## 📂 Core Directories

* **`/frontend`:** Handles presentation, dashboard graphs, system telemetry polls, and chat displays.
* **`/backend`:** Exposes REST interfaces, runs NLP calculations, computes similarity scores, manages security, and connects database models.
* **`/project-context`:** The persistent engineering specifications (SSOT).
* **`docker-compose.yml`:** Container orchestrator for Postgres, FastAPI backend, and Next.js frontend.

## 🔗 Communication Protocols
1. **HTTP REST:** Used for database updates, register, logins, fetching conversation arrays, and deleting nodes.
2. **Server Streams:** Response flows are written using FastAPI `StreamingResponse` over HTTP chunk transfers, allowing real-time token feedback.
