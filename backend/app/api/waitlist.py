import csv
import io
from typing import List, Optional

import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.waitlist_entry import WaitlistEntry
from app.services.waitlist_email import send_beta_invite, send_launch_invite, send_welcome_email

logger = logging.getLogger("neuron-os")

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


class WaitlistJoin(BaseModel):
    email: EmailStr
    github_source: bool = False


class WaitlistJoinResponse(BaseModel):
    position: int
    exists: bool = False


class AdminAction(BaseModel):
    action: str
    userId: Optional[int] = None
    email: Optional[str] = None


def _verify_admin(x_admin_password: Optional[str] = Header(None)) -> None:
    if x_admin_password != settings.WAITLIST_ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access")


def _next_position(db: Session) -> int:
    current = db.query(func.max(WaitlistEntry.position)).scalar()
    return (current or 0) + 1


@router.post("", response_model=WaitlistJoinResponse)
def join_waitlist(payload: WaitlistJoin, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    existing = db.query(WaitlistEntry).filter(WaitlistEntry.email == email).first()
    if existing:
        return {"position": existing.position, "exists": True}

    entry = WaitlistEntry(
        email=email,
        position=_next_position(db),
        github_source=payload.github_source,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    try:
        send_welcome_email(email)
    except Exception as exc:
        logger.warning("Welcome email failed for %s: %s", email, exc)

    return {"position": entry.position, "exists": False}


@router.get("/admin")
def admin_list(
    q: Optional[str] = Query(None),
    export: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: None = Depends(_verify_admin),
):
    query = db.query(WaitlistEntry).order_by(WaitlistEntry.position.desc())
    if q:
        query = query.filter(WaitlistEntry.email.ilike(f"%{q}%"))
    users = query.all()

    if export == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Email", "Position", "Created At", "Beta Invited", "Launch Notified", "GitHub Source"])
        for u in users:
            writer.writerow([
                u.id, u.email, u.position, u.created_at.isoformat() if u.created_at else "",
                u.beta_invited, u.launch_notified, u.github_source,
            ])
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=neuron_waitlist.csv"},
        )

    total = db.query(WaitlistEntry).count()
    github = db.query(WaitlistEntry).filter(WaitlistEntry.github_source.is_(True)).count()
    beta = db.query(WaitlistEntry).filter(WaitlistEntry.beta_invited.is_(True)).count()
    launch = db.query(WaitlistEntry).filter(WaitlistEntry.launch_notified.is_(True)).count()

    return {
        "users": [
            {
                "id": str(u.id),
                "email": u.email,
                "position": u.position,
                "created_at": u.created_at.isoformat() if u.created_at else "",
                "beta_invited": u.beta_invited,
                "launch_notified": u.launch_notified,
                "github_source": u.github_source,
            }
            for u in users
        ],
        "stats": {"total": total, "github": github, "beta_invited": beta, "launch_notified": launch},
    }


@router.post("/admin")
def admin_action(
    payload: AdminAction,
    db: Session = Depends(get_db),
    _: None = Depends(_verify_admin),
):
    entry = None
    if payload.userId is not None:
        entry = db.query(WaitlistEntry).filter(WaitlistEntry.id == payload.userId).first()
    if not entry:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.action == "invite_beta":
        if payload.email:
            send_beta_invite(payload.email)
        entry.beta_invited = True
    elif payload.action == "invite_launch":
        if payload.email:
            send_launch_invite(payload.email)
        entry.launch_notified = True
    elif payload.action == "mark_invited":
        entry.beta_invited = True
    elif payload.action == "delete":
        db.delete(entry)
        db.commit()
        return {"success": True}
    else:
        raise HTTPException(status_code=400, detail="Invalid action type")

    db.commit()
    return {"success": True}
