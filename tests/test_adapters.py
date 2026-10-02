import pytest
from backend.app.adapters.google_trends import GoogleTrendsAdapter, infer_category
from backend.app.adapters.tiktok_trends import TikTokTrendsAdapter

def test_infer_category():
    assert infer_category("ChatGPT ra mắt tính năng mới", "OpenAI giới thiệu mô hình mới") == "Technology"
    assert infer_category("Cổ phiếu VinFast tăng vọt", "Thị trường tài chính sôi động") == "Business"
    assert infer_category("Trận cầu kịch tính Arsenal vs MU", "Bóng đá Ngoại hạng Anh") == "Sports"

def test_tiktok_adapter():
    adapter = TikTokTrendsAdapter()
    trends = adapter.fetch_trends(region="VN")
    assert len(trends) > 0
    top = trends[0]
    assert "trend_id" in top
    assert "canonical_name" in top
    assert top["verification_status"] == "VERIFIED_TREND"
    assert top["search_momentum"] is not None

def test_google_trends_adapter_structure():
    adapter = GoogleTrendsAdapter()
    trends = adapter.fetch_trends(region="VN")
    # Feedparser might return 0 if offline, but shouldn't crash
    assert isinstance(trends, list)
    if len(trends) > 0:
        first = trends[0]
        assert "trend_id" in first
        assert first["verification_status"] == "VERIFIED_TREND"
        assert first["region"] == "VN"

if __name__ == "__main__":
    test_infer_category()
    test_tiktok_adapter()
    test_google_trends_adapter_structure()
    print("All adapter tests passed successfully!")
