from datetime import date, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.life_metrics import LifeMetric
from app.models.user import User

router = APIRouter(prefix="/metrics", tags=["life-metrics"])


class MetricLogCreate(BaseModel):
    log_date: Optional[date] = None
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    deep_work_minutes: Optional[int] = Field(None, ge=0)
    screen_time_minutes: Optional[int] = Field(None, ge=0)
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[int] = Field(None, ge=1, le=10)


class MetricResponse(BaseModel):
    id: int
    log_date: str
    sleep_hours: Optional[float]
    deep_work_minutes: Optional[int]
    screen_time_minutes: Optional[int]
    energy_level: Optional[int]
    mood: Optional[int]

    class Config:
        from_attributes = True


class MetricSummaryResponse(BaseModel):
    days_logged: int
    avg_sleep_hours: Optional[float]
    avg_deep_work_minutes: Optional[float]
    avg_screen_time_minutes: Optional[float]
    avg_energy: Optional[float]
    avg_mood: Optional[float]
    period_days: int


def _serialize_metric(m: LifeMetric) -> dict:
    return {
        "id": m.id,
        "log_date": m.log_date.isoformat(),
        "sleep_hours": m.sleep_hours,
        "deep_work_minutes": m.deep_work_minutes,
        "screen_time_minutes": m.screen_time_minutes,
        "energy_level": m.energy_level,
        "mood": m.mood,
    }


@router.post("/log", response_model=MetricResponse)
def log_metric(
    payload: MetricLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log_date = payload.log_date or date.today()
    existing = (
        db.query(LifeMetric)
        .filter(LifeMetric.user_id == current_user.id, LifeMetric.log_date == log_date)
        .first()
    )

    if existing:
        for field in (
            "sleep_hours",
            "deep_work_minutes",
            "screen_time_minutes",
            "energy_level",
            "mood",
        ):
            value = getattr(payload, field)
            if value is not None:
                setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return _serialize_metric(existing)

    metric = LifeMetric(
        user_id=current_user.id,
        log_date=log_date,
        sleep_hours=payload.sleep_hours,
        deep_work_minutes=payload.deep_work_minutes,
        screen_time_minutes=payload.screen_time_minutes,
        energy_level=payload.energy_level,
        mood=payload.mood,
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return _serialize_metric(metric)


@router.get("/history", response_model=List[MetricResponse])
def get_metric_history(
    days: int = Query(14, ge=1, le=90),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    end = date.today()
    start = end - timedelta(days=days - 1)
    metrics = (
        db.query(LifeMetric)
        .filter(
            LifeMetric.user_id == current_user.id,
            LifeMetric.log_date >= start,
            LifeMetric.log_date <= end,
        )
        .order_by(LifeMetric.log_date.asc())
        .all()
    )
    return [_serialize_metric(m) for m in metrics]


@router.get("/summary", response_model=MetricSummaryResponse)
def get_metric_summary(
    days: int = Query(7, ge=1, le=90),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    end = date.today()
    start = end - timedelta(days=days - 1)
    metrics = (
        db.query(LifeMetric)
        .filter(
            LifeMetric.user_id == current_user.id,
            LifeMetric.log_date >= start,
            LifeMetric.log_date <= end,
        )
        .all()
    )

    def _avg(values: List[float]) -> Optional[float]:
        return round(sum(values) / len(values), 2) if values else None

    return {
        "days_logged": len(metrics),
        "avg_sleep_hours": _avg([m.sleep_hours for m in metrics if m.sleep_hours is not None]),
        "avg_deep_work_minutes": _avg(
            [float(m.deep_work_minutes) for m in metrics if m.deep_work_minutes is not None]
        ),
        "avg_screen_time_minutes": _avg(
            [float(m.screen_time_minutes) for m in metrics if m.screen_time_minutes is not None]
        ),
        "avg_energy": _avg([float(m.energy_level) for m in metrics if m.energy_level is not None]),
        "avg_mood": _avg([float(m.mood) for m in metrics if m.mood is not None]),
        "period_days": days,
    }
