"""Centralized settings for agents and backend integration."""

import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv


load_dotenv()


@dataclass
class Settings:
	backend_api_url: str = os.getenv("BACKEND_API_URL", "http://localhost:5000")
	request_timeout: int = int(os.getenv("REQUEST_TIMEOUT", "15"))
	max_retries: int = int(os.getenv("MAX_RETRIES", "3"))
	retry_backoff: float = float(os.getenv("RETRY_BACKOFF", "0.5"))

	llm_provider: str = os.getenv("LLM_PROVIDER", "openrouter")
	llm_model: str = os.getenv("LLM_MODEL", "mistralai/devstral-2512:free")
	openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
	google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
	llm_api_version: str = os.getenv("LLM_API_VERSION", "v1beta")

	log_to_backend: bool = os.getenv("LOG_TO_BACKEND", "true").lower() == "true"
	ueba_enabled: bool = os.getenv("UEBA_ENABLED", "true").lower() == "true"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings()
