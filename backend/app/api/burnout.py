import json
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.burnout_signal import BurnoutSignal
from app.models.user import User
from app.services.burnout_engine import WARNING_THRESHOLD, get_or_compute_risk

router = APIRouter(prefix="/burnout", tags=["burnout"])


class RiskScoreResponse(BaseModel):
    risk_score: float
    warning_triggered: bool
    threshold: float
    week_of: str
    factors: Dict[str, Any]
    days_analyzed: int


class WeeklyReportResponse(BaseModel):
    current: RiskScoreResponse
    history: List[Dict[str, Any]]
    recommendation: str


@router.get("/risk-score", response_model=RiskScoreResponse)
def get_risk_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = get_or_compute_risk(db, current_user.id)
    return {
        "risk_score": result["risk_score"],
        "warning_triggered": result["warning_triggered"],
        "threshold": result["threshold"],
        "week_of": result["week_of"],
        "factors": result["factors"],
        "days_analyzed": result["days_analyzed"],
    }


@router.get("/weekly-report", response_model=WeeklyReportResponse)
def get_weekly_report(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current = get_or_compute_risk(db, current_user.id)

    signals = (
        db.query(BurnoutSignal)
        .filter(BurnoutSignal.user_id == current_user.id)
        .order_by(BurnoutSignal.week_of.desc())
        .limit(8)
        .all()
    )

    history = []
    for sig in reversed(signals):
        factors = {}
        if sig.factors_json:
            try:
                factors = json.loads(sig.factors_json)
            except json.JSONDecodeError:
                factors = {}
        history.append(
            {
                "week_of": sig.week_of,
                "risk_score": sig.computed_risk_score,
                "warning_triggered": sig.warning_triggered,
                "top_factor": _top_factor(factors),
            }
        )

    recommendation = _build_recommendation(current)
    return {
        "current": {
            "risk_score": current["risk_score"],
            "warning_triggered": current["warning_triggered"],
            "threshold": current["threshold"],
            "week_of": current["week_of"],
            "factors": current["factors"],
            "days_analyzed": current["days_analyzed"],
        },
        "history": history,
        "recommendation": recommendation,
    }


def _top_factor(factors: Dict[str, Any]) -> Optional[str]:
    if not factors:
        return None
    ranked = sorted(
        factors.items(),
        key=lambda item: item[1].get("score", 0) if isinstance(item[1], dict) else 0,
        reverse=True,
    )
    return ranked[0][0] if ranked else None


def _build_recommendation(result: Dict[str, Any]) -> str:
    score = result["risk_score"]
    if score <= 35:
        return "Systems nominal. Maintain current rhythm and keep logging daily."
    if score <= WARNING_THRESHOLD:
        return "Early drift detected. Prioritize one recovery block this week — sleep or deep work protection."
    factors = result.get("factors", {})
    top = _top_factor(factors)
    labels = {
        "sleep_debt": "sleep recovery (target 7+ hours for 3 nights)",
        "deep_work_decline": "protected deep work blocks (90 min, no notifications)",
        "screen_time_spike": "screen time boundaries (evening cutoff, app limits)",
        "wellbeing_trend": "energy restoration (walks, social time, lighter evening load)",
    }
    action = labels.get(top or "", "a lighter schedule for 48 hours")
    return f"Burnout risk elevated ({score}/100). Focus on {action} before next week."
