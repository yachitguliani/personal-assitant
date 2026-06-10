"""
Burnout risk engine — 7-day sliding window analysis.

Signals:
  - Sleep debt (< 7h per night accumulates debt)
  - Deep work momentum (> 30% decline over recent 5 days)
  - Screen time spike (> 20% above personal baseline)
  - Energy/mood trend (negative linear regression slope)
"""
from __future__ import annotations

import json
from datetime import date, timedelta
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.models.burnout_signal import BurnoutSignal
from app.models.life_metrics import LifeMetric

SLEEP_TARGET_HOURS = 7.0
WARNING_THRESHOLD = 65.0
DEEP_WORK_DECLINE_THRESHOLD = 0.30
SCREEN_TIME_SPIKE_THRESHOLD = 0.20


def _linear_regression_slope(values: List[float]) -> float:
    n = len(values)
    if n < 2:
        return 0.0
    x_mean = (n - 1) / 2.0
    y_mean = sum(values) / n
    numerator = sum((i - x_mean) * (v - y_mean) for i, v in enumerate(values))
    denominator = sum((i - x_mean) ** 2 for i in range(n))
    return numerator / denominator if denominator else 0.0


def _clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def _week_start(d: date) -> date:
    return d - timedelta(days=d.weekday())


def fetch_metrics_window(
    db: Session, user_id: int, end_date: Optional[date] = None, days: int = 14
) -> List[LifeMetric]:
    end = end_date or date.today()
    start = end - timedelta(days=days - 1)
    return (
        db.query(LifeMetric)
        .filter(
            LifeMetric.user_id == user_id,
            LifeMetric.log_date >= start,
            LifeMetric.log_date <= end,
        )
        .order_by(LifeMetric.log_date.asc())
        .all()
    )


def compute_sleep_debt_score(metrics: List[LifeMetric]) -> Tuple[float, Dict[str, Any]]:
    recent = metrics[-7:] if len(metrics) >= 7 else metrics
    if not recent:
        return 0.0, {"sleep_debt_hours": 0, "days_logged": 0}

    debt_hours = sum(
        max(0.0, SLEEP_TARGET_HOURS - (m.sleep_hours or SLEEP_TARGET_HOURS))
        for m in recent
    )
    # 7h debt over the week ≈ score 50; 14h ≈ 100
    score = _clamp((debt_hours / 14.0) * 100.0)
    return score, {
        "sleep_debt_hours": round(debt_hours, 2),
        "days_logged": len(recent),
        "avg_sleep": round(
            sum(m.sleep_hours or 0 for m in recent) / len(recent), 2
        ),
    }


def compute_deep_work_score(metrics: List[LifeMetric]) -> Tuple[float, Dict[str, Any]]:
    recent = metrics[-7:]
    if len(recent) < 5:
        return 0.0, {"insufficient_data": True}

    values = [float(m.deep_work_minutes or 0) for m in recent]
    early_avg = sum(values[:3]) / 3.0
    late_avg = sum(values[-2:]) / 2.0

    if early_avg <= 0:
        decline_pct = 0.0
    else:
        decline_pct = max(0.0, (early_avg - late_avg) / early_avg)

    if decline_pct >= DEEP_WORK_DECLINE_THRESHOLD:
        score = _clamp((decline_pct / DEEP_WORK_DECLINE_THRESHOLD) * 80.0)
    else:
        score = _clamp(decline_pct * 100.0)

    return score, {
        "early_avg_minutes": round(early_avg, 1),
        "late_avg_minutes": round(late_avg, 1),
        "decline_pct": round(decline_pct * 100, 1),
    }


def compute_screen_time_score(metrics: List[LifeMetric]) -> Tuple[float, Dict[str, Any]]:
    if len(metrics) < 3:
        return 0.0, {"insufficient_data": True}

    screen_values = [float(m.screen_time_minutes or 0) for m in metrics]
    baseline_pool = screen_values[:-3] if len(screen_values) > 3 else screen_values[:-1]
    baseline = sum(baseline_pool) / len(baseline_pool) if baseline_pool else 0.0
    recent_avg = sum(screen_values[-3:]) / min(3, len(screen_values[-3:]))

    if baseline <= 0:
        spike_pct = 0.0
    else:
        spike_pct = max(0.0, (recent_avg - baseline) / baseline)

    if spike_pct >= SCREEN_TIME_SPIKE_THRESHOLD:
        score = _clamp((spike_pct / SCREEN_TIME_SPIKE_THRESHOLD) * 75.0)
    else:
        score = _clamp(spike_pct * 150.0)

    return score, {
        "baseline_minutes": round(baseline, 1),
        "recent_avg_minutes": round(recent_avg, 1),
        "spike_pct": round(spike_pct * 100, 1),
    }


def compute_wellbeing_score(metrics: List[LifeMetric]) -> Tuple[float, Dict[str, Any]]:
    recent = metrics[-7:]
    energy = [float(m.energy_level or 5) for m in recent if m.energy_level is not None]
    mood = [float(m.mood or 5) for m in recent if m.mood is not None]

    if len(energy) < 2 and len(mood) < 2:
        return 0.0, {"insufficient_data": True}

    energy_slope = _linear_regression_slope(energy) if len(energy) >= 2 else 0.0
    mood_slope = _linear_regression_slope(mood) if len(mood) >= 2 else 0.0
    combined_slope = (energy_slope + mood_slope) / 2.0

    # Negative slope → rising risk; -1 pt/day ≈ score 70
    score = _clamp(max(0.0, -combined_slope * 70.0))
    return score, {
        "energy_slope": round(energy_slope, 3),
        "mood_slope": round(mood_slope, 3),
    }


def compute_composite_risk(metrics: List[LifeMetric]) -> Dict[str, Any]:
    sleep_score, sleep_meta = compute_sleep_debt_score(metrics)
    work_score, work_meta = compute_deep_work_score(metrics)
    screen_score, screen_meta = compute_screen_time_score(metrics)
    wellbeing_score, wellbeing_meta = compute_wellbeing_score(metrics)

    weights = {"sleep": 0.30, "deep_work": 0.25, "screen_time": 0.20, "wellbeing": 0.25}
    composite = (
        sleep_score * weights["sleep"]
        + work_score * weights["deep_work"]
        + screen_score * weights["screen_time"]
        + wellbeing_score * weights["wellbeing"]
    )
    composite = round(_clamp(composite), 1)
    warning = composite > WARNING_THRESHOLD

    return {
        "risk_score": composite,
        "warning_triggered": warning,
        "threshold": WARNING_THRESHOLD,
        "factors": {
            "sleep_debt": {"score": round(sleep_score, 1), **sleep_meta},
            "deep_work_decline": {"score": round(work_score, 1), **work_meta},
            "screen_time_spike": {"score": round(screen_score, 1), **screen_meta},
            "wellbeing_trend": {"score": round(wellbeing_score, 1), **wellbeing_meta},
        },
        "weights": weights,
        "days_analyzed": len(metrics[-7:]),
    }


def get_or_compute_risk(
    db: Session, user_id: int, persist: bool = True
) -> Dict[str, Any]:
    metrics = fetch_metrics_window(db, user_id, days=14)
    result = compute_composite_risk(metrics)
    week_of = _week_start(date.today()).isoformat()

    if persist:
        existing = (
            db.query(BurnoutSignal)
            .filter(
                BurnoutSignal.user_id == user_id,
                BurnoutSignal.week_of == week_of,
            )
            .first()
        )
        factors_json = json.dumps(result["factors"])
        if existing:
            existing.computed_risk_score = result["risk_score"]
            existing.warning_triggered = result["warning_triggered"]
            existing.factors_json = factors_json
        else:
            db.add(
                BurnoutSignal(
                    user_id=user_id,
                    week_of=week_of,
                    computed_risk_score=result["risk_score"],
                    warning_triggered=result["warning_triggered"],
                    factors_json=factors_json,
                )
            )
        db.commit()

    result["week_of"] = week_of
    return result
