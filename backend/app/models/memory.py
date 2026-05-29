from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
import json

class MemoryNode(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String, default="semantic")  # semantic, episodic, procedural
    tags = Column(String, default="")  # comma-separated values (e.g. "work,agent,notes")
    embedding_data = Column(Text, nullable=True)  # JSON-encoded array of floats
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def get_embedding(self):
        if not self.embedding_data:
            return []
        try:
            return json.loads(self.embedding_data)
        except Exception:
            return []

    def set_embedding(self, vector):
        self.embedding_data = json.dumps([float(x) for x in vector])
