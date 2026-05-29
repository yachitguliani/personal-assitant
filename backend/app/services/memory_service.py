import json
import hashlib
import numpy as np
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.memory import MemoryNode
from openai import OpenAI
import logging

logger = logging.getLogger("neuron-os")

class MemoryService:
    @staticmethod
    def _generate_mock_embedding(text: str, dimensions: int = 1536) -> List[float]:
        """
        Generates a deterministic float vector based on hashing words.
        Provides a mock embedding that responds logically to cosine similarity.
        """
        words = text.lower().strip().split()
        vector = [0.0] * dimensions
        if not words:
            return vector
        
        for i, word in enumerate(words):
            # Generate deterministic values across dimensions for each word
            for d in range(dimensions):
                h = hashlib.sha256(f"{word}-{d}".encode()).hexdigest()
                val = (int(h[:8], 16) / 4294967295.0) * 2.0 - 1.0
                # Scale by word order weight to give first words slightly more emphasis
                weight = 1.0 / (i + 1)
                vector[d] += val * weight
                
        # Normalize vector
        magnitude = sum(x*x for x in vector) ** 0.5
        if magnitude > 0:
            vector = [x / magnitude for x in vector]
        return vector

    @classmethod
    def get_embedding(cls, text: str) -> List[float]:
        """
        Generates text embedding vector.
        Uses OpenAI if credentials are set, falls back to mock hashing otherwise.
        """
        if not settings.OPENAI_API_KEY:
            logger.info("OpenAI API key not configured. Using deterministic fallback embeddings.")
            return cls._generate_mock_embedding(text)

        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.embeddings.create(
                input=[text],
                model=settings.EMBEDDING_MODEL
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI embedding generation failed: {e}. Falling back to mock embeddings.")
            return cls._generate_mock_embedding(text)

    @classmethod
    def add_memory(
        cls, db: Session, user_id: int, text: str, category: str = "semantic", tags_list: Optional[List[str]] = None
    ) -> MemoryNode:
        """
        Creates and stores a memory node.
        """
        vector = cls.get_embedding(text)
        tags_str = ",".join(tags_list) if tags_list else ""
        
        memory_node = MemoryNode(
            user_id=user_id,
            text=text,
            category=category,
            tags=tags_str
        )
        memory_node.set_embedding(vector)
        
        db.add(memory_node)
        db.commit()
        db.refresh(memory_node)
        return memory_node

    @classmethod
    def search_memories(
        cls, db: Session, user_id: int, query: str, limit: int = 5, category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic query lookup using cosine similarity.
        Computes similarities in python for maximum environment portability.
        """
        query_vector = np.array(cls.get_embedding(query))
        
        # Retrieve all candidate memories for user
        query_obj = db.query(MemoryNode).filter(MemoryNode.user_id == user_id)
        if category:
            query_obj = query_obj.filter(MemoryNode.category == category)
            
        memories = query_obj.all()
        if not memories:
            return []

        results = []
        for mem in memories:
            mem_vector = mem.get_embedding()
            if not mem_vector or len(mem_vector) != len(query_vector):
                # Handle empty or dimensional mismatches gracefully
                similarity = 0.0
            else:
                # Cosine similarity
                dot_product = np.dot(query_vector, np.array(mem_vector))
                norm_q = np.linalg.norm(query_vector)
                norm_m = np.linalg.norm(mem_vector)
                similarity = float(dot_product / (norm_q * norm_m)) if norm_q > 0 and norm_m > 0 else 0.0
                
            results.append({
                "id": mem.id,
                "text": mem.text,
                "category": mem.category,
                "tags": [t.strip() for t in mem.tags.split(",") if t.strip()] if mem.tags else [],
                "created_at": mem.created_at.isoformat(),
                "similarity": similarity
            })
            
        # Sort by similarity descending
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:limit]
