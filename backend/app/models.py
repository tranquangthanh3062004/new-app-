import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(100), default="Creator")
    email = Column(String(255), nullable=True)
    tier = Column(String(20), default="free")  # free, pro
    daily_discoveries_count = Column(Integer, default=0)
    daily_generations_count = Column(Integer, default=0)
    last_active_date = Column(String(10), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    trend_hunter_points = Column(Integer, default=50)
    streak_days = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    drafts = relationship("ContentDraft", back_populates="user")
    saved_items = relationship("SavedItem", back_populates="user")

class UserPreference(Base):
    __tablename__ = "user_preferences"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True)
    niche = Column(String(50), default="Technology")
    country = Column(String(10), default="VN")
    language = Column(String(10), default="vi")
    platforms = Column(JSON, default=lambda: ["TikTok", "YouTube Short", "Instagram Reel"])
    audience = Column(String(255), default="Gen Z & Tech Enthusiasts in Vietnam")
    tone = Column(String(50), default="Educational & Bold")
    content_goal = Column(String(50), default="Engagement & Followers")
    experience_level = Column(String(50), default="Intermediate")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="preferences")

class Trend(Base):
    __tablename__ = "trends"
    
    trend_id = Column(String(64), primary_key=True)
    canonical_name = Column(String(255), index=True)
    raw_queries = Column(JSON, default=list)
    source = Column(String(100))  # "Google Trends", "TikTok Creative Center", etc.
    source_url = Column(Text, nullable=True)
    region = Column(String(20), default="VN")
    category = Column(String(100), default="Technology")
    detected_at = Column(DateTime, default=datetime.utcnow)
    
    # Status according to specs
    trend_status = Column(String(30), default="RISING")  # EMERGING, RISING, PEAK, STABLE, DECLINING, EXPIRED
    verification_status = Column(String(30), default="VERIFIED_TREND")  # VERIFIED_TREND, INFERRED_TREND, DATA_UNAVAILABLE
    
    search_momentum = Column(Float, nullable=True)
    social_momentum = Column(Float, nullable=True)
    freshness = Column(Float, default=85.0)
    competition = Column(Float, default=50.0)
    confidence = Column(Float, default=80.0)
    opportunity_score = Column(Float, default=80.0)
    traffic_estimate = Column(String(100), default="DATA_UNAVAILABLE")
    
    # Explainers & details
    why_trending = Column(Text, default="")
    signals_breakdown = Column(JSON, default=dict)
    related_topics = Column(JSON, default=list)
    target_audience = Column(JSON, default=list)
    lifecycle_note = Column(Text, default="")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    opportunities = relationship("TrendOpportunity", back_populates="trend", cascade="all, delete-orphan")
    drafts = relationship("ContentDraft", back_populates="trend")

class TrendOpportunity(Base):
    __tablename__ = "trend_opportunities"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    trend_id = Column(String(64), ForeignKey("trends.trend_id"))
    who_should_create = Column(String(255))
    why_now = Column(Text)
    best_platform = Column(String(50))
    best_format = Column(String(100))
    best_hook_angle = Column(String(255))
    production_difficulty = Column(String(50))  # Low, Medium, High
    commercial_relevance = Column(String(50))  # Low, Medium, High
    risk_assessment = Column(Text)
    
    trend = relationship("Trend", back_populates="opportunities")

class ContentDraft(Base):
    __tablename__ = "content_drafts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    trend_id = Column(String(64), ForeignKey("trends.trend_id"))
    user_id = Column(String(36), ForeignKey("users.id"))
    platform = Column(String(50), default="TikTok")
    tone = Column(String(50), default="Educational")
    goal = Column(String(50), default="Engagement")
    
    title = Column(String(255))
    hook_options = Column(JSON, default=list)  # 5 hook types
    selected_hook = Column(Text)
    script_sections = Column(JSON, default=list)  # [ {time: "0-3s", role: "HOOK", text: "..."}, ... ]
    full_script = Column(Text)
    caption = Column(Text)
    cta = Column(Text)
    hashtags = Column(JSON, default=list)
    
    # Creator asset package
    shot_list = Column(JSON, default=list)
    b_roll_ideas = Column(JSON, default=list)
    on_screen_text = Column(JSON, default=list)
    thumbnail_idea = Column(Text)
    visual_style = Column(String(255))
    voice_style = Column(String(255))
    music_direction = Column(String(255))
    
    # Decision support & Virality profile
    opportunity_profile = Column(JSON, default=dict)
    failure_risks = Column(Text)
    share_trigger = Column(Text)
    comment_trigger = Column(Text)
    differentiation_note = Column(Text)
    
    repurposed_variants = Column(JSON, default=dict)  # Native adaptations for Instagram, YouTube, LinkedIn, X
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    trend = relationship("Trend", back_populates="drafts")
    user = relationship("User", back_populates="drafts")

class SavedItem(Base):
    __tablename__ = "saved_items"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    item_type = Column(String(20))  # "trend", "draft"
    trend_id = Column(String(64), nullable=True)
    draft_id = Column(String(36), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="saved_items")

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    event_name = Column(String(100), index=True)
    properties = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)
