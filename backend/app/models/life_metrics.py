from sqlalchemy import Column, Integer, Float, ForeignKey, Date, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base


class LifeMetric(Base):
    __tablename__ = "life_metrics"
    __table_args__ = (
        UniqueConstraint("user_id", "log_date", name="uq_life_metrics_user_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)
    sleep_hours = Column(Float, nullable=True)
    deep_work_minutes = Column(Integer, nullable=True)
    screen_time_minutes = Column(Integer, nullable=True)
    energy_level = Column(Integer, nullable=True)  # 1-10
    mood = Column(Integer, nullable=True)  # 1-10
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
