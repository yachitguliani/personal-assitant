# NEURON OS
### Neural Engine for Unified Reasoning and Operational Networks

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack: Next.js + FastAPI + Postgres](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Postgres-blue.svg)](#)

> **Build Philosophy:** *"Computers adapted humans to software. NEURON adapts software to humans."*

NEURON OS is an open-source, AI-powered personal operating system inspired by cinematic sci-fi interfaces (like Jarvis and Iron Man's HUD). It is designed to act as a personalized intelligence layer for human life, functioning as a second brain, an AI chief-of-staff, and a proactive life assistant.

---

## 🌌 Core Pillars

1. **Second Brain & Memory Engine:** Seamlessly links discussions, tasks, and system notes into a semantic vector memory index for long-term retrieval and cognitive assistance.
2. **AI Orchestration & Chief-of-Staff:** Conducts streaming conversations, coordinates system tools, and processes background intelligence.
3. **Cinematic Cyberpunk Experience:** A premium holographic visual dashboard featuring glassmorphic controls, live telemetry status displays, and a real-time vector memory timeline.
4. **Modularity & Scalability:** Designed from the ground up for open-source extension, paving the way for multi-agent coordination, voice control, and mobile integration.

---

## 🏗️ Architecture Layout

NEURON OS is organized as a clean, modular monorepo:

```
NEURON-OS/
├── .github/              # Issue and Pull Request templates
├── backend/              # Python FastAPI server (APIs, DB Models, Vector Memory)
│   ├── app/
│   │   ├── api/          # REST & WebSocket Endpoints (auth, chat, memory)
│   │   ├── core/         # DB Connection, Security, Configurations
│   │   ├── models/       # SQLModel/SQLAlchemy DB Models
│   │   └── services/     # Semantic memory indices & AI model orchestration
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # Next.js Application (React, TS, Tailwind CSS v4, Framer Motion)
│   ├── src/
│   │   ├── app/          # Pages (Landing, Dashboard, Auth)
│   │   ├── components/   # Cinematic UI (Cyber-button, Telemetry, Canvas particles)
│   │   └── utils/        # HTTP API client modules
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml    # Combined Docker local run environment
```

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14+, React, Tailwind CSS v4, Framer Motion, TypeScript, HTML5 Canvas.
* **Backend:** FastAPI, Python, SQLAlchemy, Uvicorn.
* **Database:** PostgreSQL with `pgvector` (semantic vector index), falling back to transient cosine similarity memory.
* **Orchestration:** Docker, Docker Compose.

---

## 🚀 Quickstart

### Prerequisites
* [Node.js (v18+)](https://nodejs.org/)
* [Python (3.10+)](https://www.python.org/)
* [Docker & Docker Compose](https://www.docker.com/) (Optional)

### Running Locally with Docker
To spin up the entire ecosystem (Postgres + Backend + Frontend) in one command:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:3000` and the backend documentation at `http://localhost:8000/docs`.

### Running Manually

#### 1. Start the Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app/main.py
```

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🗺️ Project Roadmap (Phase 1 Focus)

- [x] **Phase 1: Foundation & Core Experience**
  - Project architecture & file structures.
  - Cinematic Landing Page & Core Dashboard (HUD).
  - Streaming Chat UI with Markdown.
  - Semantic memory timeline & tag searches.
  - JWT Session Auth and security routes.
  - Multi-container Docker orchestration.
- [ ] **Phase 2: Multi-Agent Coordination & Voice Core** (Upcoming)
- [ ] **Phase 3: Automation Ecosystem & Platform integrations** (Upcoming)
- [ ] **Phase 4: Health-Aware Companionship & Mobile Client** (Upcoming)

---

## 🤝 Contributing

We welcome developers, UI designers, and AI enthusiasts to help build NEURON OS. Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
