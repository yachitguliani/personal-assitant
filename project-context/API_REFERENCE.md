# API Reference Gateway — NEURON OS

All endpoints must be requested with URL prefix `/api` and attach `Authorization: Bearer <token>` in header fields for protected routes.

## 🔐 Auth Routes (`/auth`)

### 1. `POST /auth/register`
Initializes a new agent profile.
* **Payload:** `{ "email": "agent@neuron.net", "password": "passkey", "full_name": "Agent Name" }`
* **Response:** `{ "access_token": "jwt_string", "token_type": "bearer", "user": { "id": 1, "email": "agent@neuron.net" } }`

### 2. `POST /auth/login`
Checks credentials, returns authorization session headers.
* **Payload:** `{ "email": "agent@neuron.net", "password": "passkey" }`
* **Response:** same as `/register`

---

## 💬 Chat Routes (`/chat`)

### 1. `GET /chat/conversations` (Protected)
Returns list of user conversation sessions.

### 2. `POST /chat/conversations` (Protected)
Creates a new dialogue window.
* **Payload:** `{ "title": "Optional Custom title" }`

### 3. `POST /chat/conversations/{id}/stream` (Protected)
Streams the assistant reply back to client. Saves chat transcript to DB.
* **Payload:** `{ "content": "user query message text" }`
* **Response:** Text chunk stream (Server-Sent Event / HTTP chunked stream).

---

## 🧠 Memory Routes (`/memory`)

### 1. `POST /memory` (Protected)
Saves text logs into the vector index.
* **Payload:** `{ "text": "Project data is safe", "category": "semantic", "tags": ["work", "docs"] }`

### 2. `GET /memory` (Protected)
Returns user memory nodes. Runs vector semantic search if query `q` parameter is present.
* **Parameters:** `q` (Search query string), `category` (Filter options).

### 3. `GET /memory/stats` (Protected)
Returns telemetry count and category ratios.

---

## 🌱 Life OS Routes

Predictive personal metrics — sleep, deep work, goals, burnout detection.

### Metrics (`/metrics`)

#### 1. `POST /metrics/log` (Protected)
Log or upsert daily life metrics (one record per user per day).
* **Payload:** `{ "log_date": "2026-05-31", "sleep_hours": 7.5, "deep_work_minutes": 120, "screen_time_minutes": 180, "energy_level": 7, "mood": 6 }`
* **Response:** Metric object with id and log_date

#### 2. `GET /metrics/history` (Protected)
Returns daily metrics for the last N days.
* **Parameters:** `days` (default 14, max 90)

#### 3. `GET /metrics/summary` (Protected)
Returns averaged metrics for the period.
* **Parameters:** `days` (default 7)

### Goals (`/goals`)

#### 1. `GET /goals` (Protected)
List user goals. Optional filter: `status_filter=active`

#### 2. `POST /goals` (Protected)
Create a goal.
* **Payload:** `{ "title": "Run 5K", "category": "health", "target_date": "2026-06-30", "progress": 0 }`

#### 3. `PATCH /goals/{id}` (Protected)
Update goal fields partially.

#### 4. `DELETE /goals/{id}` (Protected)
Delete a goal.

#### 5. `POST /goals/{id}/checkin` (Protected)
Update progress.
* **Payload:** `{ "progress": 50, "note": "optional" }`

### Burnout (`/burnout`)

#### 1. `GET /burnout/risk-score` (Protected)
Returns composite burnout risk score (0–100) from 7-day sliding window analysis.
* **Response:** `{ "risk_score": 42.5, "warning_triggered": false, "threshold": 65, "factors": {...} }`

#### 2. `GET /burnout/weekly-report` (Protected)
Returns current risk score, 8-week history, and personalized recommendation.
