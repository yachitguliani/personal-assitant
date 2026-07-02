from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.goals import Goal
from app.models.user import User
from app.services.memory_service import MemoryService

router = APIRouter(prefix="/goals", tags=["life-goals"])

VALID_CATEGORIES = {"health", "work", "learning", "relationships"}
VALID_STATUSES = {"active", "completed", "paused", "abandoned"}


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: str = "work"
    target_date: Optional[date] = None
    progress: int = Field(0, ge=0, le=100)
    status: str = "active"


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    target_date: Optional[date] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    status: Optional[str] = None


class GoalCheckin(BaseModel):
    progress: int = Field(..., ge=0, le=100)
    note: Optional[str] = None


class GoalResponse(BaseModel):
    id: int
    title: str
    category: str
    target_date: Optional[str]
    progress: int
    status: str
    created_at: str

    class Config:
        from_attributes = True


def _serialize_goal(g: Goal) -> dict:
    return {
        "id": g.id,
        "title": g.title,
        "category": g.category,
        "target_date": g.target_date.isoformat() if g.target_date else None,
        "progress": g.progress,
        "status": g.status,
        "created_at": g.created_at.isoformat(),
    }


def _get_user_goal(db: Session, user_id: int, goal_id: int) -> Goal:
    goal = (
        db.query(Goal)
        .filter(Goal.id == goal_id, Goal.user_id == user_id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


@router.get("", response_model=List[GoalResponse])
def list_goals(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Goal).filter(Goal.user_id == current_user.id)
    if status_filter:
        query = query.filter(Goal.status == status_filter)
    goals = query.order_by(Goal.created_at.desc()).all()
    return [_serialize_goal(g) for g in goals]


@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {', '.join(sorted(VALID_CATEGORIES))}",
        )
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(sorted(VALID_STATUSES))}",
        )

    goal = Goal(
        user_id=current_user.id,
        title=payload.title,
        category=payload.category,
        target_date=payload.target_date,
        progress=payload.progress,
        status=payload.status,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return _serialize_goal(goal)


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _serialize_goal(_get_user_goal(db, current_user.id, goal_id))


@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = _get_user_goal(db, current_user.id, goal_id)
    data = payload.model_dump(exclude_unset=True)

    if "category" in data and data["category"] not in VALID_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")
    if "status" in data and data["status"] not in VALID_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")

    for key, value in data.items():
        setattr(goal, key, value)

    if goal.progress >= 100 and goal.status == "active":
        goal.status = "completed"

    db.commit()
    db.refresh(goal)
    return _serialize_goal(goal)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = _get_user_goal(db, current_user.id, goal_id)
    db.delete(goal)
    db.commit()
    return


@router.post("/{goal_id}/checkin", response_model=GoalResponse)
def checkin_goal(
    goal_id: int,
    payload: GoalCheckin,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = _get_user_goal(db, current_user.id, goal_id)
    was_complete = goal.progress >= 100
    goal.progress = payload.progress
    if goal.progress >= 100:
        goal.status = "completed"
    db.commit()
    db.refresh(goal)

    if goal.progress >= 100 and not was_complete:
        MemoryService.add_memory(
            db=db,
            user_id=current_user.id,
            text=f"Completed life goal: {goal.title}",
            category="episodic",
            tags_list=["life-goal", goal.category],
        )

    return _serialize_goal(goal)
