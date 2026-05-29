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
