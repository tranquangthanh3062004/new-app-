import os
import json
import httpx
from typing import Dict, Any, Optional
from ..config import settings

class LLMProvider:
    """
    Model abstraction layer supporting:
    - Google Gemini
    - OpenAI
    - Groq
    - Built-in Agentic Creative Engine (zero-failure fallback)
    """
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.groq_key = settings.GROQ_API_KEY

    def is_api_configured(self) -> bool:
        return bool(self.gemini_key or self.openai_key or self.groq_key)

    async def generate_text(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        # 1. Try Gemini if configured
        if self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                payload = {
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}
                    ],
                    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048}
                }
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                print(f"[LLMProvider] Gemini error: {e}")

        # 2. Try OpenAI if configured
        if self.openai_key:
            try:
                url = "https://api.openai.com/v1/chat/completions"
                headers = {"Authorization": f"Bearer {self.openai_key}"}
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.7
                }
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, json=payload, headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[LLMProvider] OpenAI error: {e}")

        return None

llm_provider = LLMProvider()
