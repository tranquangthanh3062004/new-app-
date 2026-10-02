from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import Trend, ContentDraft, User
from ..schemas import (
    GenerateContentRequest,
    ContentPackageSchema,
    RepurposeRequest
)
from ..ai.content_pipeline import generate_creator_content_pipeline

router = APIRouter(prefix="/api/content", tags=["content"])

@router.post("/generate", response_model=ContentPackageSchema)
async def generate_content(req: GenerateContentRequest, db: Session = Depends(get_db)):
    """
    Generate complete Creator Asset Package with multi-agent pipeline:
    Hook Engine, 5 Timestamps, Shot List, B-Roll, Opportunity Profile, Repurposing.
    """
    trend = db.query(Trend).filter(Trend.trend_id == req.trend_id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")

    user = db.query(User).first()
    if not user:
        user = User(username="Creator")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check free tier quota (3 generations/day for free tier)
    if user.tier == "free" and (user.daily_generations_count or 0) >= 10:  # Allow generous demo limit
        raise HTTPException(status_code=429, detail="Bạn đã đạt giới hạn 10 lượt tạo nội dung hôm nay. Nâng cấp Pro để tạo không giới hạn!")

    # Run AI Content Pipeline
    package = await generate_creator_content_pipeline(
        trend_name=trend.canonical_name,
        trend_category=trend.category,
        trend_context=trend.why_trending or "Chủ đề đang bùng nổ tìm kiếm",
        platform=req.platform,
        tone=req.tone,
        goal=req.goal,
        custom_angle=req.custom_angle
    )

    # Save draft into database
    draft = ContentDraft(
        trend_id=trend.trend_id,
        user_id=user.id,
        platform=req.platform,
        tone=req.tone,
        goal=req.goal,
        title=package["title"],
        hook_options=package["hook_options"],
        selected_hook=package["selected_hook"],
        script_sections=package["script_sections"],
        full_script=package["full_script"],
        caption=package["caption"],
        cta=package["cta"],
        hashtags=package["hashtags"],
        shot_list=package["shot_list"],
        b_roll_ideas=package["b_roll_ideas"],
        on_screen_text=package["on_screen_text"],
        thumbnail_idea=package["thumbnail_idea"],
        visual_style=package["visual_style"],
        voice_style=package["voice_style"],
        music_direction=package["music_direction"],
        opportunity_profile=package["opportunity_profile"],
        failure_risks=package["failure_risks"],
        share_trigger=package["share_trigger"],
        comment_trigger=package["comment_trigger"],
        differentiation_note=package["differentiation_note"],
        repurposed_variants=package["repurposed_variants"]
    )
    db.add(draft)

    # Update user gamification stats
    user.daily_generations_count = (user.daily_generations_count or 0) + 1
    user.trend_hunter_points = (user.trend_hunter_points or 50) + 25  # 25 points per generation
    db.commit()
    db.refresh(draft)

    result_dict = package.copy()
    result_dict["id"] = draft.id
    result_dict["trend_id"] = trend.trend_id
    result_dict["user_id"] = user.id
    result_dict["platform"] = req.platform
    result_dict["tone"] = req.tone
    result_dict["goal"] = req.goal
    result_dict["created_at"] = draft.created_at

    return ContentPackageSchema(**result_dict)

@router.get("/history", response_model=List[ContentPackageSchema])
def get_content_history(limit: int = 20, db: Session = Depends(get_db)):
    """Get history of generated content assets"""
    drafts = db.query(ContentDraft).order_by(ContentDraft.created_at.desc()).limit(limit).all()
    results = []
    for d in drafts:
        results.append(ContentPackageSchema(
            id=d.id,
            trend_id=d.trend_id,
            user_id=d.user_id,
            platform=d.platform,
            tone=d.tone,
            goal=d.goal,
            title=d.title,
            hook_options=d.hook_options or [],
            selected_hook=d.selected_hook or "",
            script_sections=d.script_sections or [],
            full_script=d.full_script or "",
            caption=d.caption or "",
            cta=d.cta or "",
            hashtags=d.hashtags or [],
            shot_list=d.shot_list or [],
            b_roll_ideas=d.b_roll_ideas or [],
            on_screen_text=d.on_screen_text or [],
            thumbnail_idea=d.thumbnail_idea or "",
            visual_style=d.visual_style or "",
            voice_style=d.voice_style or "",
            music_direction=d.music_direction or "",
            opportunity_profile=d.opportunity_profile or {},
            failure_risks=d.failure_risks or "",
            share_trigger=d.share_trigger or "",
            comment_trigger=d.comment_trigger or "",
            differentiation_note=d.differentiation_note or "",
            repurposed_variants=d.repurposed_variants or {},
            created_at=d.created_at
        ))
    return results

@router.post("/repurpose")
def repurpose_content(req: RepurposeRequest, db: Session = Depends(get_db)):
    """Retrieve platform-native repurposed draft for Instagram, LinkedIn, etc."""
    draft = db.query(ContentDraft).filter(ContentDraft.id == req.draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    variants = draft.repurposed_variants or {}
    variant = variants.get(req.target_platform)
    if not variant:
        # Fallback format
        return {
            "platform": req.target_platform,
            "title": draft.title,
            "content": f"Bản chuyển đổi chuyên biệt cho {req.target_platform}:\n\n{draft.caption}",
            "visual_tip": "Tối ưu tỷ lệ khung hình phù hợp với định dạng nền tảng."
        }

    return {
        "platform": req.target_platform,
        "title": draft.title,
        "format": variant.get("format", ""),
        "caption": variant.get("caption", ""),
        "visual_tip": variant.get("visual_tip", "")
    }
