import json
from typing import AsyncGenerator, List, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from app.services.memory_service import MemoryService
from openai import OpenAI
import asyncio
import logging

logger = logging.getLogger("neuron-os")

SYSTEM_PROMPT = """You are NEURON (Neural Engine for Unified Reasoning and Operational Networks), a cinematic, highly advanced personal operating system and digital chief-of-staff.
Your tone is intelligent, elegant, alert, futuristic, and slightly cinematic (similar to Jarvis from Iron Man). You are concise, precise, and supportive.
Utilize markdown for formatting, including bullet points, system tags, and code blocks where applicable.

When memories are provided, synthesize them into your answers naturally as part of your "long-term memory bank".
"""

class AIOrchestrator:
    @classmethod
    async def generate_response(
        cls, db: Session, user_id: int, message_content: str, history: List[Dict[str, str]]
    ) -> AsyncGenerator[str, None]:
        """
        Streams response chunks back. Injects semantic memory.
        Falls back to local simulated stream if keys are missing.
        """
        # Step 1: Query memory database for context
        related_memories = MemoryService.search_memories(db, user_id, message_content, limit=3)
        memory_context = ""
        if related_memories:
            memory_context = "\n=== RECALLED SEMANTIC MEMORIES ===\n"
            for m in related_memories:
                if m["similarity"] > 0.35:  # Relevance threshold
                    memory_context += f"- [{m['category']}] (Tags: {', '.join(m['tags'])}): {m['text']}\n"
        
        # Assemble message list
        api_messages = [{"role": "system", "content": SYSTEM_PROMPT + memory_context}]
        
        # Append history
        for msg in history:
            api_messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Append latest message
        api_messages.append({"role": "user", "content": message_content})

        if not settings.OPENAI_API_KEY:
            logger.info("OpenAI API key missing. Streaming simulated NEURON response.")
            async for chunk in cls._stream_simulated_response(message_content, related_memories):
                yield chunk
            return

        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            # Standard openai stream call
            response = client.chat.completions.create(
                model="gpt-4-turbo", # Default to capable model
                messages=api_messages,
                stream=True,
                temperature=0.7
            )
            
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    await asyncio.sleep(0.01) # Yield control to event loop
        except Exception as e:
            logger.error(f"OpenAI completion stream error: {e}. Falling back to simulated stream.")
            async for chunk in cls._stream_simulated_response(message_content, related_memories):
                yield chunk

    @classmethod
    async def _stream_simulated_response(cls, user_query: str, memories: List[Dict[str, Any]]) -> AsyncGenerator[str, None]:
        """
        Streams high-fidelity cinematic operating system responses.
        """
        # Formulate custom responses depending on what user asked
        query = user_query.lower()
        
        # Check if memories were retrieved to show off semantic memory recall
        relevant_memories = [m for m in memories if m["similarity"] > 0.4]
        memory_snippet = ""
        if relevant_memories:
            top_mem = relevant_memories[0]
            memory_snippet = f"\n\n> [!NOTE]\n> **Memory Recall Event:** Accessing node `{top_mem['id']}` tagged with `{', '.join(top_mem['tags'])}`.\n> Decrypted context: *\"{top_mem['text']}\"*\n\n"

        welcome_text = (
            "### NEURON OS — Operational Status Alert\n"
            f"**Interface:** Core Reasoning Engine v1.0.0-Beta\n"
            "**Status:** Online & Synchronized\n"
            "**API Security Key Configuration:** *Not detected (running in Simulator Mode)*\n"
            f"{memory_snippet}"
        )

        if "status" in query or "system" in query or "telemetry" in query:
            response_content = (
                f"{welcome_text}"
                "All operational networks are performing within nominal parameters:\n"
                "- **Neural Network Latency:** 14ms (Simulated)\n"
                "- **Semantic Memory Bank:** Loaded & indexed via transient vector similarity.\n"
                "- **Cognitive Subsystems:** Standing by for task prioritization.\n\n"
                "To connect live LLM providers, add your API keys inside `/backend/.env`."
            )
        elif "remember" in query or "memory" in query or "recall" in query:
            response_content = (
                f"{welcome_text}"
                "My local semantic memory index is fully active. You can save concepts, files, and events by typing key phrases. "
                "Any concept you register will be computed into vector embeddings and visualizable on your **Mind Map** dashboard.\n\n"
                "Try saying: `Remember that project NEURON OS is a futuristic Chief of Staff` and check the memory stream."
            )
        else:
            response_content = (
                f"{welcome_text}"
                f"Processing inquiry: *\"{user_query}\"*\n\n"
                "I have processed your query through my unified reasoning network. "
                "Since we are in local offline mode, here is what my core pipeline recommends:\n\n"
                "1. **Scalability:** Continue expanding the backend endpoints in `/backend/app/api`.\n"
                "2. **Vector Memory:** Try creating memories via the sidebar button or using command parameters.\n"
                "3. **Next Steps:** Complete Phase 1 integrations by booting up Next.js on `localhost:3000`.\n\n"
                "How shall I proceed?"
            )

        # Stream words with slight delay to mimic cinematic text delivery
        words = response_content.split(" ")
        for i, word in enumerate(words):
            yield word + " "
            # Wait varying amounts to feel natural
            delay = 0.04
            if "\n" in word or "." in word:
                delay = 0.15
            await asyncio.sleep(delay)
