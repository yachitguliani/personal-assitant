from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy import func

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.memory import MemoryNode
from app.services.memory_service import MemoryService

router = APIRouter(prefix="/memory", tags=["memory"])

# Pydantic Schemas
class MemoryCreate(BaseModel):
    text: str
    category: Optional[str] = "semantic"
    tags: Optional[List[str]] = []

class MemoryResponse(BaseModel):
    id: int
    text: str
    category: str
    tags: List[str]
    created_at: str

    class Config:
        from_attributes = True

class MemoryStatsResponse(BaseModel):
    total_count: int
    category_distribution: Dict[str, int]
    top_tags: List[str]

@router.get("", response_model=List[Any])
def list_or_search_memories(
    q: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user memories. Performs semantic search if query `q` is provided.
    """
    if q:
        return MemoryService.search_memories(db, current_user.id, q, limit=limit, category=category)
    
    query = db.query(MemoryNode).filter(MemoryNode.user_id == current_user.id)
    if category:
        query = query.filter(MemoryNode.category == category)
        
    memories = query.order_by(MemoryNode.created_at.desc()).limit(limit).all()
    
    results = []
    for mem in memories:
        results.append({
            "id": mem.id,
            "text": mem.text,
            "category": mem.category,
            "tags": [t.strip() for t in mem.tags.split(",") if t.strip()] if mem.tags else [],
            "created_at": mem.created_at.isoformat(),
            "similarity": 1.0  # Default score for direct list
        })
    return results

@router.post("", response_model=MemoryResponse)
def create_memory(
    mem_in: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mem = MemoryService.add_memory(
        db=db,
        user_id=current_user.id,
        text=mem_in.text,
        category=mem_in.category,
        tags_list=mem_in.tags
    )
    return {
        "id": mem.id,
        "text": mem.text,
        "category": mem.category,
        "tags": mem_in.tags,
        "created_at": mem.created_at.isoformat()
    }

@router.delete("/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(
    memory_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mem = db.query(MemoryNode).filter(
        MemoryNode.id == memory_id,
        MemoryNode.user_id == current_user.id
    ).first()
    if not mem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    db.delete(mem)
    db.commit()
    return

@router.get("/stats", response_model=MemoryStatsResponse)
def get_memory_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns memory statistics to feed UI widgets.
    """
    # 1. Total count
    total = db.query(MemoryNode).filter(MemoryNode.user_id == current_user.id).count()
    
    # 2. Categories
    categories = db.query(
        MemoryNode.category, func.count(MemoryNode.id)
    ).filter(
        MemoryNode.user_id == current_user.id
    ).group_by(
        MemoryNode.category
    ).all()
    category_distribution = {cat: count for cat, count in categories}
    
    # Fill defaults
    for cat in ["semantic", "episodic", "procedural"]:
        if cat not in category_distribution:
            category_distribution[cat] = 0
            
    # 3. Top tags
    memories_with_tags = db.query(MemoryNode.tags).filter(
        MemoryNode.user_id == current_user.id,
        MemoryNode.tags != ""
    ).all()
    
    tag_counts = {}
    for m in memories_with_tags:
        for tag in m.tags.split(","):
            clean_tag = tag.strip()
            if clean_tag:
                tag_counts[clean_tag] = tag_counts.get(clean_tag, 0) + 1
                
    # Sort and take top 5
    sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
    top_tags = [tag for tag, count in sorted_tags[:5]]
    
    return {
        "total_count": total,
        "category_distribution": category_distribution,
        "top_tags": top_tags
    }
