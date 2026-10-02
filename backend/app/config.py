import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from root or current dir
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/backend/data/trendspark.db")
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Defaults
    DEFAULT_REGION: str = os.getenv("DEFAULT_REGION", "VN")
    DEFAULT_NICHE: str = os.getenv("DEFAULT_NICHE", "Technology")
    TREND_CACHE_TTL_MINUTES: int = int(os.getenv("TREND_CACHE_TTL_MINUTES", "30"))

settings = Settings()
