from sqlalchemy import Column, Integer, Float, Boolean, ForeignKey, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class BurnoutSignal(Base):
    __tablename__ = "burnout_signals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    week_of = Column(String, nullable=False, index=True)  # ISO week start date YYYY-MM-DD
    computed_risk_score = Column(Float, nullable=False, default=0.0)
    warning_triggered = Column(Boolean, default=False)
    factors_json = Column(Text, nullable=True)  # JSON breakdown of signal factors
    created_at = Column(DateTime(timezone=True), server_default=func.now())
