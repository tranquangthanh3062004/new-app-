import asyncio
from backend.app.ai.content_pipeline import generate_creator_content_pipeline
from backend.app.services.opportunity_service import calculate_opportunity_score

def test_opportunity_score_calculation():
    # Higher momentum, freshness and low competition = high opportunity
    score_high = calculate_opportunity_score(momentum=95.0, freshness=90.0, competition=30.0)
    score_low = calculate_opportunity_score(momentum=50.0, freshness=40.0, competition=90.0)
    assert score_high > score_low
    assert 40.0 <= score_high <= 99.0

def test_content_pipeline():
    result = asyncio.run(generate_creator_content_pipeline(
        trend_name="AI Agents Automation",
        trend_category="Technology",
        trend_context="Công nghệ AI tự động hóa đang phát triển mạnh",
        platform="TikTok",
        tone="Educational",
        goal="Engagement"
    ))
    
    assert "title" in result
    assert len(result["hook_options"]) == 5
    assert len(result["script_sections"]) == 5
    assert result["script_sections"][0]["role"] == "HOOK"
    assert result["script_sections"][4]["role"] == "CTA"
    assert len(result["shot_list"]) > 0
    assert "Instagram Reel" in result["repurposed_variants"]
    assert "LinkedIn Post" in result["repurposed_variants"]

if __name__ == "__main__":
    test_opportunity_score_calculation()
    test_content_pipeline()
    print("All pipeline tests passed successfully!")
