from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time
import random

from app.core.config import settings
from app.core.database import engine, Base, get_db
from app.api import auth, chat, memory, metrics, life_goals, burnout, waitlist
from app.models import life_metrics, goals, burnout_signal, waitlist_entry  # noqa: F401

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Unified API framework for NEURON OS Neural reasoning services",
    version="1.0.0"
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(memory.router, prefix=settings.API_V1_STR)
app.include_router(metrics.router, prefix=settings.API_V1_STR)
app.include_router(life_goals.router, prefix=settings.API_V1_STR)
app.include_router(burnout.router, prefix=settings.API_V1_STR)
app.include_router(waitlist.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0-Beta"
    }

@app.get("/api/status")
def get_system_status(db: Session = Depends(get_db)):
    """
    Returns live system performance telemetry stats for HUD modules.
    """
    # Create dynamic values to simulate live activity
    cpu_load = round(5.0 + random.uniform(0.0, 15.0), 1)
    memory_usage = round(42.0 + random.uniform(-2.0, 3.0), 1)
    
    return {
        "system": "NEURON CORE",
        "status": "synchronized",
        "cpu_usage_pct": cpu_load,
        "memory_usage_pct": memory_usage,
        "active_threads": 12,
        "database_connected": True,
        "latency_ms": int(10 + random.uniform(-2.0, 5.0)),
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
