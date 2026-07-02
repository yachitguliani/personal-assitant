from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.services.ai_orchestrator import AIOrchestrator

router = APIRouter(prefix="/chat", tags=["chat"])

# Pydantic Schemas
class MessageResponse(BaseModel):
    id: int
    sender: str
    content: str
    created_at: str

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: str
    messages: Optional[List[MessageResponse]] = None

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class ConversationUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)

class MessageCreate(BaseModel):
    content: str

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversations = db.query(Conversation).filter(Conversation.user_id == current_user.id).order_by(Conversation.created_at.desc()).all()
    return conversations

@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(
    conv_in: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = Conversation(user_id=current_user.id, title=conv_in.title)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation_details(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Structure message items manually to ensure clean ISO strings
    messages_data = [
        MessageResponse(
            id=m.id,
            sender=m.sender,
            content=m.content,
            created_at=m.created_at.isoformat()
        ) for m in conv.messages
    ]
    
    return {
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at.isoformat(),
        "messages": messages_data
    }

@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    db.delete(conv)
    db.commit()
    return

@router.patch("/conversations/{conversation_id}", response_model=ConversationResponse)
def update_conversation(
    conversation_id: int,
    payload: ConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    data = payload.model_dump(exclude_unset=True)
    if "title" in data:
        new_title = data["title"].strip()
        if not new_title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty"
            )
        conv.title = new_title
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Structure message items manually to ensure clean ISO strings
    messages_data = [
        MessageResponse(
            id=m.id,
            sender=m.sender,
            content=m.content,
            created_at=m.created_at.isoformat()
        ) for m in conv.messages
    ]

    return {
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at.isoformat(),
        "messages": messages_data
    }

@router.post("/conversations/{conversation_id}/stream")
def stream_chat_response(
    conversation_id: int,
    msg_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify conversation ownership
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    # 1. Save user query
    user_message = Message(
        conversation_id=conversation_id,
        sender="user",
        content=msg_in.content
    )
    db.add(user_message)
    db.commit()

    # 2. Extract conversation history (exclude latest message, already in context)
    history_messages = db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.id != user_message.id
    ).order_by(Message.created_at.asc()).all()
    
    history_list = [{"role": m.sender, "content": m.content} for m in history_messages]

    # 3. Create streaming response generator
    async def event_generator():
        collected_chunks = []
        try:
            async for chunk in AIOrchestrator.generate_response(db, current_user.id, msg_in.content, history_list):
                collected_chunks.append(chunk)
                yield chunk
            
            # Save final response inside session
            full_response = "".join(collected_chunks)
            if full_response.strip():
                assistant_message = Message(
                    conversation_id=conversation_id,
                    sender="assistant",
                    content=full_response
                )
                db.add(assistant_message)
                db.commit()
                
                # Check if we should update conversation title based on first query
                if conv.title == "New Conversation" or len(history_list) == 0:
                    conv.title = msg_in.content[:40] + ("..." if len(msg_in.content) > 40 else "")
                    db.add(conv)
                    db.commit()
        except Exception as e:
            # Commit whatever chunk of text we had if error occurred mid-way
            error_msg = f" [Stream interrupted: {str(e)}]"
            yield error_msg
            full_response = "".join(collected_chunks) + error_msg
            assistant_message = Message(
                conversation_id=conversation_id,
                sender="assistant",
                content=full_response
            )
            db.add(assistant_message)
            db.commit()

    return StreamingResponse(event_generator(), media_type="text/plain")
