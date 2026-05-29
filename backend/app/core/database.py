from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.orm import Session
from app.core.config import settings
import logging

logger = logging.getLogger("neuron-os")
logging.basicConfig(level=logging.INFO)

# Setup SQLAlchemy DB engine
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_vector_extension(db: Session) -> bool:
    """
    Checks if pgvector extension is enabled in Postgres.
    Returns False for SQLite or if the extension isn't found.
    """
    if settings.DATABASE_URL.startswith("sqlite"):
        return False
    try:
        result = db.execute("SELECT extname FROM pg_extension WHERE extname = 'vector';").fetchone()
        return result is not None
    except Exception as e:
        logger.warning(f"Error checking vector extension: {e}")
        return False
