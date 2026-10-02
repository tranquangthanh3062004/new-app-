from typing import Dict, Any, List

def calculate_opportunity_score(
    momentum: float,
    freshness: float,
    competition: float,
    commercial_relevance: float = 75.0,
    production_ease: float = 80.0
) -> float:
    """
    Decision-support opportunity score calculation:
    Higher momentum, higher freshness, higher commercial fit, higher production ease,
    and LOWER competition result in a higher opportunity score.
    """
    comp_inverted = 100.0 - competition
    weighted = (
        (momentum * 0.30) +
        (freshness * 0.25) +
        (comp_inverted * 0.20) +
        (commercial_relevance * 0.15) +
        (production_ease * 0.10)
    )
    return round(min(99.0, max(40.0, weighted)), 1)

def generate_opportunity_profile(trend_data: Dict[str, Any], user_niche: str = "Technology") -> Dict[str, Any]:
    cat = trend_data.get("category", "General")
    momentum = float(trend_data.get("search_momentum") or trend_data.get("social_momentum") or 80.0)
    freshness = float(trend_data.get("freshness", 85.0))
    competition = float(trend_data.get("competition", 55.0))
    
    # Niche alignment boost
    is_niche_match = (user_niche.lower() in cat.lower()) or (cat.lower() in user_niche.lower())
    audience_fit = 92.0 if is_niche_match else 70.0
    
    production_cost_score = 85.0 if competition < 60 else 72.0
    commercial_fit = 88.0 if cat in ["Technology", "Business", "Finance"] else 74.0
    
    opp_score = calculate_opportunity_score(momentum, freshness, competition, commercial_fit, production_cost_score)
    
    return {
        "momentum": round(momentum, 1),
        "freshness": round(freshness, 1),
        "audience_fit": round(audience_fit, 1),
        "competition": round(competition, 1),
        "production_ease": round(production_cost_score, 1),
        "commercial_fit": round(commercial_fit, 1),
        "overall_opportunity_score": opp_score
    }

def build_opportunities_for_trend(trend: Dict[str, Any]) -> List[Dict[str, Any]]:
    name = trend.get("canonical_name", "Chủ đề này")
    cat = trend.get("category", "General")
    status = trend.get("trend_status", "RISING")
    
    opportunities = []
    
    # Opportunity 1: Short-form fast breakdown (TikTok / Reels)
    opportunities.append({
        "who_should_create": f"Creators chuyên về {cat}, người muốn đón đầu sóng thảo luận trong 24 giờ tới.",
        "why_now": f"Trend đang ở giai đoạn {status} với độ tươi mới {trend.get('freshness', 85)}%. Người xem đang chủ động tìm kiếm giải thích ngắn gọn.",
        "best_platform": "TikTok & Instagram Reel",
        "best_format": "Video ngắn 30-45 giây, dạng POV hoặc Phân tích nhanh 3 điểm cốt lõi",
        "best_hook_angle": f"Đừng bỏ qua '{name}' nếu bạn không muốn tụt hậu trong tuần này",
        "production_difficulty": "Low",
        "commercial_relevance": "Medium-High",
        "risk_assessment": "Nếu đăng muộn hơn 48h, độ bão hòa nội dung sẽ tăng cao khiến lượt phân phối ban đầu giảm."
    })
    
    # Opportunity 2: Real Experiment / Case Study
    opportunities.append({
        "who_should_create": "Creators thích chứng minh bằng trải nghiệm thực tế, solo founders, sinh viên.",
        "why_now": "Khán giả đã chán lý thuyết suông và tìm kiếm kết quả thực chứng, giải pháp ứng dụng ngay.",
        "best_platform": "YouTube Short & Facebook Video",
        "best_format": "Thử nghiệm thực tế 24h hoặc Thử thách 'Trước & Sau khi áp dụng'",
        "best_hook_angle": f"Tôi đã thử '{name}' trong 24h và đây là sự thật không ai nói cho bạn",
        "production_difficulty": "Medium",
        "commercial_relevance": "High",
        "risk_assessment": "Cần quay màn hình hoặc bằng chứng trực quan thực tế để giữ uy tín với người xem."
    })
    
    # Opportunity 3: Contrarian / Deep Analysis
    opportunities.append({
        "who_should_create": "Chuyên gia ngách, KOLs phân tích, người xây dựng thương hiệu cá nhân uy tín.",
        "why_now": "Khi mọi người đều nói cùng một góc nhìn tung hô, góc nhìn phản biện hoặc cảnh báo rủi ro sẽ tạo bùng nổ bình luận.",
        "best_platform": "LinkedIn Post / Facebook Long-form / Carousel",
        "best_format": "Bài viết carousel 5 slide hoặc bài phân tích góc nhìn đa chiều",
        "best_hook_angle": f"Góc nhìn trái chiều: Tại sao 90% mọi người đang hiểu sai về '{name}'?",
        "production_difficulty": "Low",
        "commercial_relevance": "High",
        "risk_assessment": "Cần lập luận logic chặt chẽ, tránh công kích cá nhân hoặc thông tin sai lệch."
    })
    
    return opportunities
