from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .config import settings
from .database import engine, Base, SessionLocal
from .routers import trends, content, preferences, saved, analytics
from .services.trend_service import fetch_and_sync_trends

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    
    # Warmup trend cache from live external sources
    try:
        db = SessionLocal()
        fetch_and_sync_trends(db, region=settings.DEFAULT_REGION)
        db.close()
        print("[Startup] Live trend sources synced successfully.")
    except Exception as e:
        print(f"[Startup] Warmup warning: {e}")
        
    yield

app = FastAPI(
    title="TrendSpark AI API",
    description="AI Trend Intelligence + Content Generation + Creator Growth Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(trends.router)
app.include_router(content.router)
app.include_router(preferences.router)
app.include_router(saved.router)
app.include_router(analytics.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "TrendSpark AI",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }
