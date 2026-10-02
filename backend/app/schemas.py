from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class UserPreferenceBase(BaseModel):
    niche: str = "Technology"
    country: str = "VN"
    language: str = "vi"
    platforms: List[str] = ["TikTok", "YouTube Short", "Instagram Reel"]
    audience: str = "Gen Z & Tech Enthusiasts in Vietnam"
    tone: str = "Educational & Bold"
    content_goal: str = "Engagement & Followers"
    experience_level: str = "Intermediate"

class UserPreferenceResponse(UserPreferenceBase):
    id: str
    user_id: str
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TrendOpportunitySchema(BaseModel):
    id: Optional[str] = None
    who_should_create: str
    why_now: str
    best_platform: str
    best_format: str
    best_hook_angle: str
    production_difficulty: str
    commercial_relevance: str
    risk_assessment: str

    class Config:
        from_attributes = True

class TrendSummarySchema(BaseModel):
    trend_id: str
    canonical_name: str
    source: str
    source_url: Optional[str] = None
    region: str
    category: str
    detected_at: datetime
    trend_status: str  # EMERGING, RISING, PEAK, STABLE, DECLINING, EXPIRED
    verification_status: str  # VERIFIED_TREND, INFERRED_TREND, DATA_UNAVAILABLE
    search_momentum: Optional[float] = None
    social_momentum: Optional[float] = None
    freshness: float
    competition: float
    confidence: float
    opportunity_score: float
    traffic_estimate: Optional[str] = "DATA_UNAVAILABLE"
    why_trending: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CreativeIdeaGroup(BaseModel):
    short_video_ideas: List[str]
    post_ideas: List[str]
    carousel_ideas: List[str]
    story_ideas: List[str]
    long_form_ideas: List[str]

class TrendDetailSchema(TrendSummarySchema):
    signals_breakdown: Dict[str, Any] = {}
    related_topics: List[str] = []
    target_audience: List[str] = []
    lifecycle_note: str = ""
    opportunities: List[TrendOpportunitySchema] = []
    creative_ideas: Optional[CreativeIdeaGroup] = None

    class Config:
        from_attributes = True

class GenerateContentRequest(BaseModel):
    trend_id: str
    platform: str = "TikTok"  # TikTok, Instagram Reel, YouTube Short, Facebook, LinkedIn, Blog
    tone: str = "Educational"  # Educational, Funny, Storytelling, Bold, Professional, Emotional, Experimental
    goal: str = "Engagement"  # Views, Followers, Engagement, Leads, Sales, Brand Awareness
    custom_angle: Optional[str] = None
    target_duration: Optional[str] = "30-50s"

class ScriptSection(BaseModel):
    time: str
    role: str  # HOOK, CONTEXT, CORE VALUE, PAYOFF, CTA
    text: str

class ContentPackageSchema(BaseModel):
    id: Optional[str] = None
    trend_id: str
    user_id: Optional[str] = None
    platform: str
    tone: str
    goal: str
    title: str
    hook_options: List[Dict[str, str]] = []  # [{type: "Curiosity", hook: "..."}, ...]
    selected_hook: str
    script_sections: List[ScriptSection] = []
    full_script: str
    caption: str
    cta: str
    hashtags: List[str] = []
    shot_list: List[str] = []
    b_roll_ideas: List[str] = []
    on_screen_text: List[str] = []
    thumbnail_idea: str
    visual_style: str
    voice_style: str
    music_direction: str
    opportunity_profile: Dict[str, Any] = {}
    failure_risks: str
    share_trigger: str
    comment_trigger: str
    differentiation_note: str
    repurposed_variants: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RepurposeRequest(BaseModel):
    draft_id: str
    target_platform: str  # TikTok, Instagram Reel, YouTube Short, Facebook, LinkedIn, X Thread

class SaveItemRequest(BaseModel):
    item_type: str  # "trend" or "draft"
    trend_id: Optional[str] = None
    draft_id: Optional[str] = None
    notes: Optional[str] = None

class SavedItemResponse(BaseModel):
    id: str
    user_id: str
    item_type: str
    trend_id: Optional[str] = None
    draft_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    trend: Optional[TrendSummarySchema] = None
    draft: Optional[ContentPackageSchema] = None

    class Config:
        from_attributes = True

class AnalyticsEventRequest(BaseModel):
    event_name: str
    properties: Dict[str, Any] = {}

class GamificationStats(BaseModel):
    user_id: str
    tier: str
    points: int
    streak_days: int
    daily_discoveries_count: int
    daily_generations_count: int
    max_free_discoveries: int = 5
    max_free_generations: int = 3
    level_title: str
