from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Trend, User, UserPreference
from ..schemas import TrendSummarySchema, TrendDetailSchema
from ..services.trend_service import (
    fetch_and_sync_trends,
    rank_personalized_trends,
    generate_trend_creative_ideas
)

router = APIRouter(prefix="/api/trends", tags=["trends"])

@router.get("", response_model=List[TrendSummarySchema])
def get_trends(
    region: str = Query("VN", description="Region code (VN, US, etc.)"),
    category: Optional[str] = Query(None, description="Category/Niche filter"),
    status: Optional[str] = Query(None, description="Trend status filter"),
    search: Optional[str] = Query(None, description="Keyword search"),
    force_refresh: bool = Query(False, description="Force re-fetch from sources"),
    db: Session = Depends(get_db)
):
    """
    Get trend feed with live external data and personalized ranking.
    """
    # 1. Fetch & sync
    raw_trends = fetch_and_sync_trends(db, region=region, force_refresh=force_refresh)
    
    # 2. Get user preferences for ranking
    user_pref = db.query(UserPreference).first()
    
    # 3. Apply personalized ranking & filtering
    ranked = rank_personalized_trends(
        raw_trends,
        user_pref=user_pref,
        filter_category=category,
        filter_status=status,
        search_query=search
    )
    
    # Track discovery count on user
    user = db.query(User).first()
    if user:
        user.daily_discoveries_count = (user.daily_discoveries_count or 0) + 1
        user.trend_hunter_points = (user.trend_hunter_points or 50) + 1
        db.commit()
        
    return ranked

@router.get("/{trend_id}", response_model=TrendDetailSchema)
def get_trend_detail(trend_id: str, db: Session = Depends(get_db)):
    """
    Get deep-dive trend intelligence, opportunity assessment, and creative ideas.
    """
    trend = db.query(Trend).filter(Trend.trend_id == trend_id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")
        
    # Generate creative ideas for this trend
    creative_ideas = generate_trend_creative_ideas(trend)
    
    detail = TrendDetailSchema(
        trend_id=trend.trend_id,
        canonical_name=trend.canonical_name,
        source=trend.source,
        source_url=trend.source_url,
        region=trend.region,
        category=trend.category,
        detected_at=trend.detected_at,
        trend_status=trend.trend_status,
        verification_status=trend.verification_status,
        search_momentum=trend.search_momentum,
        social_momentum=trend.social_momentum,
        freshness=trend.freshness,
        competition=trend.competition,
        confidence=trend.confidence,
        opportunity_score=trend.opportunity_score,
        traffic_estimate=trend.traffic_estimate,
        why_trending=trend.why_trending,
        signals_breakdown=trend.signals_breakdown or {},
        related_topics=trend.related_topics or [],
        target_audience=trend.target_audience or [],
        lifecycle_note=trend.lifecycle_note or "",
        opportunities=trend.opportunities,
        creative_ideas=creative_ideas,
        created_at=trend.created_at
    )
    return detail

@router.post("/refresh")
def force_refresh_trends(region: str = "VN", db: Session = Depends(get_db)):
    """Force re-fetch from Google Trends & TikTok Creative Center"""
    trends = fetch_and_sync_trends(db, region=region, force_refresh=True)
    return {"message": "Trends refreshed successfully", "count": len(trends)}
