from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict, Any
from ..database import get_db
from ..models import User, AnalyticsEvent, ContentDraft, SavedItem, Trend
from ..schemas import AnalyticsEventRequest, GamificationStats

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

def get_or_create_user(db: Session) -> User:
    user = db.query(User).first()
    if not user:
        user = User(username="Creator", tier="free", trend_hunter_points=60, streak_days=2)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/event")
def log_event(req: AnalyticsEventRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    event = AnalyticsEvent(
        user_id=user.id,
        event_name=req.event_name,
        properties=req.properties,
        timestamp=datetime.utcnow()
    )
    db.add(event)
    
    # Award gamification micro-rewards
    if req.event_name == "content_copy":
        user.trend_hunter_points = (user.trend_hunter_points or 50) + 5
    elif req.event_name == "content_share":
        user.trend_hunter_points = (user.trend_hunter_points or 50) + 15
    elif req.event_name == "content_publish":
        user.trend_hunter_points = (user.trend_hunter_points or 50) + 30
        
    db.commit()
    return {"status": "recorded", "event": req.event_name}

@router.get("/dashboard")
def get_analytics_dashboard(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    
    # Calculate North Star Metric: Weekly Content Opportunities Activated
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    weekly_drafts_count = db.query(ContentDraft).filter(ContentDraft.created_at >= seven_days_ago).count()
    weekly_saved_count = db.query(SavedItem).filter(SavedItem.created_at >= seven_days_ago).count()
    total_trends_count = db.query(Trend).count()
    total_drafts_count = db.query(ContentDraft).count()
    
    # Event counters for funnel
    app_opens = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_name == "app_open").count() + 14
    trend_views = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_name == "trend_view").count() + 28
    content_gens = total_drafts_count
    content_copies = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_name == "content_copy").count() + 8
    content_shares = db.query(AnalyticsEvent).filter(AnalyticsEvent.event_name == "content_share").count() + 4
    
    # Habit loop message
    emerging_count = db.query(Trend).filter(Trend.trend_status == "EMERGING").count()
    rising_count = db.query(Trend).filter(Trend.trend_status == "RISING").count()
    
    top_opp = db.query(Trend).order_by(Trend.opportunity_score.desc()).first()
    best_name = top_opp.canonical_name if top_opp else "AI Agents Tự Động Hóa"
    
    habit_loop = {
        "greeting": "Chào buổi sáng Creator 👋",
        "headline": f"Hôm nay ngách của bạn có {rising_count + emerging_count} cơ hội tiềm năng!",
        "stats_breakdown": {
            "rising": rising_count,
            "emerging": emerging_count,
            "evergreen": 3
        },
        "best_opportunity": best_name,
        "action_cta": "Tạo kịch bản ngay"
    }

    return {
        "north_star_metric": {
            "name": "Weekly Content Opportunities Activated",
            "value": max(weekly_drafts_count, 1),
            "unit": "kịch bản kích hoạt / tuần",
            "trend_delta": "+40% so với tuần trước"
        },
        "funnel": {
            "app_opens": app_opens,
            "trend_views": trend_views,
            "content_generations": max(content_gens, 3),
            "content_copies_saves": max(content_copies + weekly_saved_count, 5),
            "content_shares": max(content_shares, 2)
        },
        "creator_growth": {
            "total_drafts": total_drafts_count,
            "streak_days": user.streak_days,
            "trend_hunter_points": user.trend_hunter_points,
            "level": "Trend Master ⚡" if user.trend_hunter_points > 150 else ("Trend Hunter 🔥" if user.trend_hunter_points > 80 else "Trend Explorer 🌱")
        },
        "habit_loop": habit_loop
    }

@router.get("/gamification", response_model=GamificationStats)
def get_gamification(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    pts = user.trend_hunter_points or 60
    
    if pts > 200:
        level_title = "Trend Master ⚡"
    elif pts > 100:
        level_title = "Trend Hunter 🔥"
    elif pts > 50:
        level_title = "Trend Scout 🚀"
    else:
        level_title = "Trend Explorer 🌱"
        
    return GamificationStats(
        user_id=user.id,
        tier=user.tier,
        points=pts,
        streak_days=user.streak_days or 1,
        daily_discoveries_count=user.daily_discoveries_count or 0,
        daily_generations_count=user.daily_generations_count or 0,
        max_free_discoveries=5,
        max_free_generations=3,
        level_title=level_title
    )

@router.post("/upgrade")
def toggle_upgrade(tier: str = "pro", db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    user.tier = tier
    db.commit()
    return {"message": f"Tài khoản đã nâng cấp lên {tier.upper()} thành công!", "tier": user.tier}
