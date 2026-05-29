# Backend Coding Guidelines — NEURON OS

The backend is built with Python 3.10 and FastAPI, utilizing SQLAlchemy for database operations.

## 🛠️ Stack & Dependencies
* **Framework:** FastAPI, Uvicorn (server gateway).
* **Database engine:** SQLAlchemy (for ORM), SQLite/Postgres + pgvector.
* **Security:** Python-Jose (for JWTs), Passlib (with bcrypt for hashing passkeys).
* **OpenAI:** OpenAI client for text vector calculations.

## 📂 Folder Layout
```
backend/app/
├── api/             # REST routing controllers (auth, chat, memory)
├── core/            # configuration parameters, security hashes, DB engines
├── models/          # DB structures (User, Conversation, Message, MemoryNode)
├── services/        # AIOrchestrator and MemoryService logic
└── main.py          # FastAPI mounting entrypoint
```

## 💻 Conventions
1. **Dependency Injection:** Database sessions must be injected using `db: Session = Depends(get_db)`. Current active user details should use `current_user: User = Depends(get_current_user)`.
2. **Settings:** Environment variables are loaded in `core/config.py` using Pydantic Settings. Do not use direct `os.getenv` statements inside routes.
3. **Graceful Fallbacks:** If API keys or specific database extensions (`pgvector`) are absent, services must log warnings and run offline-simulated defaults.
4. **Pydantic Validation:** All incoming payloads must be strictly typed using Pydantic schemas.
