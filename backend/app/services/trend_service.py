from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models import Trend, TrendOpportunity, UserPreference
from ..adapters.google_trends import GoogleTrendsAdapter
from ..adapters.tiktok_trends import TikTokTrendsAdapter
from .opportunity_service import generate_opportunity_profile, build_opportunities_for_trend

google_adapter = GoogleTrendsAdapter()
tiktok_adapter = TikTokTrendsAdapter()

# In-memory cache for fast near-instant response
_CACHE = {
    "trends": [],
    "last_fetched": None,
    "region": "VN"
}

def normalize_topic_name(name: str) -> str:
    cleaned = " ".join(name.strip().split())
    return cleaned

def fetch_and_sync_trends(db: Session, region: str = "VN", force_refresh: bool = False) -> List[Trend]:
    global _CACHE
    now = datetime.utcnow()
    
    # Check cache freshness (valid for 30 minutes unless forced)
    if not force_refresh and _CACHE["last_fetched"] and (now - _CACHE["last_fetched"]) < timedelta(minutes=30) and _CACHE["region"] == region:
        # Load from DB
        db_trends = db.query(Trend).filter(Trend.region == region).order_by(Trend.opportunity_score.desc()).all()
        if db_trends:
            return db_trends

    # Ingest from real adapters
    all_raw = []
    
    # 1. Real Google Trends data
    gt_trends = google_adapter.fetch_trends(region=region)
    all_raw.extend(gt_trends)
    
    # 2. Verified TikTok & Social Trends data
    tt_trends = tiktok_adapter.fetch_trends(region=region)
    all_raw.extend(tt_trends)
    
    saved_trends = []
    
    for item in all_raw:
        tid = item["trend_id"]
        canonical = normalize_topic_name(item["canonical_name"])
        
        # Calculate opportunity profile
        opp_profile = generate_opportunity_profile(item)
        item["opportunity_score"] = opp_profile["overall_opportunity_score"]
        
        existing = db.query(Trend).filter(Trend.trend_id == tid).first()
        if not existing:
            # Lifecycle note
            status = item.get("trend_status", "RISING")
            lifecycle = f"Chủ đề đang ở chu kỳ {status}. Lượng tìm kiếm và thảo luận tương tác đang duy trì mức cao."
            if status == "DECLINING":
                lifecycle = "Lượng quan tâm có dấu hiệu hạ nhiệt so với tuần trước. Khuyến nghị góc nhìn tổng kết hoặc bài học rút ra."
            
            trend = Trend(
                trend_id=tid,
                canonical_name=canonical,
                raw_queries=item.get("raw_queries", [canonical]),
                source=item.get("source", "Google Trends"),
                source_url=item.get("source_url"),
                region=region,
                category=item.get("category", "General"),
                detected_at=item.get("detected_at", now),
                trend_status=status,
                verification_status=item.get("verification_status", "VERIFIED_TREND"),
                search_momentum=item.get("search_momentum"),
                social_momentum=item.get("social_momentum"),
                freshness=item.get("freshness", 85.0),
                competition=item.get("competition", 50.0),
                confidence=item.get("confidence", 85.0),
                opportunity_score=item.get("opportunity_score", 80.0),
                traffic_estimate=item.get("traffic_estimate", "DATA_UNAVAILABLE"),
                why_trending=item.get("why_trending", ""),
                signals_breakdown=item.get("signals_breakdown", {}),
                related_topics=item.get("related_topics", []),
                target_audience=item.get("target_audience", []),
                lifecycle_note=lifecycle
            )
            db.add(trend)
            db.flush()
            
            # Add opportunities
            opp_list = build_opportunities_for_trend(item)
            for op in opp_list:
                db_opp = TrendOpportunity(
                    trend_id=tid,
                    who_should_create=op["who_should_create"],
                    why_now=op["why_now"],
                    best_platform=op["best_platform"],
                    best_format=op["best_format"],
                    best_hook_angle=op["best_hook_angle"],
                    production_difficulty=op["production_difficulty"],
                    commercial_relevance=op["commercial_relevance"],
                    risk_assessment=op["risk_assessment"]
                )
                db.add(db_opp)
            
            saved_trends.append(trend)
        else:
            # Update freshness & opportunity score
            existing.freshness = item.get("freshness", existing.freshness)
            existing.opportunity_score = item.get("opportunity_score", existing.opportunity_score)
            existing.updated_at = now
            saved_trends.append(existing)
            
    db.commit()
    
    _CACHE["last_fetched"] = now
    _CACHE["region"] = region
    
    return db.query(Trend).filter(Trend.region == region).order_by(Trend.opportunity_score.desc()).all()

def rank_personalized_trends(
    trends: List[Trend],
    user_pref: Optional[UserPreference] = None,
    filter_category: Optional[str] = None,
    filter_status: Optional[str] = None,
    search_query: Optional[str] = None
) -> List[Trend]:
    """
    Ranks the trend feed according to personalized relevance:
    Score = Freshness + Momentum + User Niche Relevance + Content Opportunity
    """
    user_niche = user_pref.niche.lower() if user_pref and user_pref.niche else ""
    
    filtered = trends
    
    if search_query:
        sq = search_query.lower().strip()
        filtered = [t for t in filtered if sq in t.canonical_name.lower() or sq in t.category.lower() or sq in (t.why_trending or '').lower()]
        
    if filter_category and filter_category != "All":
        filtered = [t for t in filtered if filter_category.lower() in t.category.lower()]
        
    if filter_status and filter_status != "All":
        filtered = [t for t in filtered if t.trend_status.upper() == filter_status.upper()]
        
    def score_item(t: Trend) -> float:
        base = t.opportunity_score or 50.0
        niche_boost = 0.0
        if user_niche:
            if user_niche in t.category.lower() or t.category.lower() in user_niche:
                niche_boost = 25.0
            elif any(user_niche in q.lower() for q in (t.raw_queries or [])):
                niche_boost = 20.0
                
        freshness_score = (t.freshness or 70.0) * 0.15
        momentum_score = ((t.search_momentum or t.social_momentum or 70.0)) * 0.20
        return base + niche_boost + freshness_score + momentum_score

    return sorted(filtered, key=score_item, reverse=True)

def generate_trend_creative_ideas(trend: Trend) -> Dict[str, List[str]]:
    name = trend.canonical_name
    cat = trend.category
    
    return {
        "short_video_ideas": [
            f"Thử thách 24h kiểm chứng: Liệu '{name}' có thật sự tốt như lời đồn?",
            f"3 điều cấm kỵ bạn phải biết trước khi bắt trend '{name}'",
            f"POV: Khi bạn là người duy nhất chưa biết đến '{name}' và cái kết...",
            f"Giải thích ngắn trong 30s: Vì sao '{name}' đang chiếm sóng mạng xã hội?",
            f"Review chân thực không nhận tài trợ về '{name}' từ góc nhìn {cat}"
        ],
        "post_ideas": [
            f"Góc nhìn chuyên sâu: 5 bài học đáng giá rút ra từ làn sóng '{name}'.",
            f"Bàn luận: '{name}' sẽ thay đổi ngành {cat} như thế nào trong 6 tháng tới?",
            f"Checklist 4 bước giúp bạn ứng dụng ngay '{name}' vào công việc hàng ngày.",
            f"Liệu '{name}' là xu hướng dài hạn hay chỉ là bong bóng sớm tàn?",
            f"Tổng hợp 3 sai lầm phổ biến nhất của người mới khi tiếp cận '{name}'."
        ],
        "carousel_ideas": [
            f"Slide 1-5: Cẩm nang toàn diện về '{name}' cho người bận rộn.",
            f"Trước & Sau: Cách '{name}' tạo ra bước nhảy vọt về hiệu suất.",
            f"So sánh trực quan: '{name}' vs các giải pháp truyền thống."
        ],
        "story_ideas": [
            f"Vote thăm dò: Bạn đã nghe tin về '{name}' sáng nay chưa? (Yes/No)",
            f"Hậu trường: Đang thử nghiệm '{name}', kết quả bất ngờ sẽ công bố vào 8h tối nay!",
            f"Q&A mở: Bạn có thắc mắc gì về '{name}' không? Đặt câu hỏi tại đây."
        ],
        "long_form_ideas": [
            f"Video phân tích chuyên sâu 10 phút: Toàn cảnh hiện tượng '{name}' và cơ hội kiếm tiền.",
            f"Podcast đàm đạo: Phỏng vấn người trong cuộc về tác động thực tế của '{name}'.",
            f"Bài viết nghiên cứu Case Study: Phân tích chiến lược đằng sau sự thành công của '{name}'."
        ]
    }
