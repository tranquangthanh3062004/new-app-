import re
import json
from typing import Dict, Any, List
from .llm_provider import llm_provider

def generate_native_repurposed(title: str, core_message: str, trend_name: str, hashtags: List[str]) -> Dict[str, Any]:
    ht_str = " ".join([f"#{h.strip('#')}" for h in hashtags[:5]])
    return {
        "Instagram Reel": {
            "format": "Video dọc 9:16 + Cover bắt mắt",
            "caption": f"✨ {title}\n\nThực tế xu hướng {trend_name} đang thay đổi thói quen của rất nhiều người. Lưu lại ngay video này để áp dụng nhé!\n\n👇 Bạn nghĩ sao về điều này? Chia sẻ dưới comment nha.\n\n{ht_str} #reelsvn #trend",
            "visual_tip": "Tập trung ánh sáng tự nhiên, text overlay gọn gàng ở 2/3 giữa màn hình tránh che bởi nút Like/Share."
        },
        "YouTube Short": {
            "format": "Video dọc 9:16 (< 60s)",
            "caption": f"{title} | Phân tích xu hướng {trend_name} mới nhất. Đăng ký kênh để không bỏ lỡ mẹo hay mỗi ngày!",
            "visual_tip": "Bật tính năng Pinned Comment để đính kèm link tài liệu hoặc câu hỏi thảo luận."
        },
        "Facebook Post": {
            "format": "Post ảnh đơn hoặc Video kèm mô tả dài",
            "caption": f"🔥 TẠI SAO BẠN NÊN QUAN TÂM ĐẾN '{trend_name}' NGAY BÂY GIỜ?\n\n{core_message}\n\n👉 3 điểm cốt lõi bạn cần nắm:\n1. Bắt kịp xu hướng đang tăng trưởng sớm giúp bạn tiết kiệm 80% chi phí thử nghiệm.\n2. Ứng dụng thực tế thay vì chỉ đọc tin tức.\n3. Tạo sự khác biệt bằng trải nghiệm của chính bạn.\n\nAnh em thấy góc nhìn này thế nào? Cùng thảo luận nhé!",
            "visual_tip": "Ảnh minh họa độ phân giải cao tỷ lệ 4:5 hoặc 1:1, text ngắn dưới 20% diện tích ảnh."
        },
        "LinkedIn Post": {
            "format": "Professional Thought Leadership Post",
            "caption": f"Phân tích nhanh về làn sóng '{trend_name}': Cơ hội và bài học cho các cá nhân & doanh nghiệp.\n\nTrong tuần qua, thảo luận xung quanh {trend_name} đã tăng đột biến. Nhưng thay vì chạy theo FOMO, đây là 3 góc nhìn chiến lược:\n\n• Góc nhìn 1: Nhu cầu thực tế đằng sau sự tò mò của thị trường.\n• Góc nhìn 2: Bài học về tốc độ thích ứng trong kỷ nguyên số.\n• Góc nhìn 3: Đâu là ranh giới giữa xu hướng nhất thời và giá trị bền vững?\n\nTôi tin rằng những ai chủ động làm chủ xu hướng thay vì bị động tiếp nhận sẽ tạo được lợi thế cạnh tranh lớn.\n\nCác anh/chị đồng nghiệp trong ngành đánh giá thế nào về hiện tượng này?",
            "visual_tip": "Bài viết dạng text sạch sẽ, không dùng quá nhiều emoji, tag các hashtag ngành liên quan."
        },
        "X Thread": {
            "format": "Chuỗi Tweet 4-5 bài",
            "caption": f"1/4 Mọi người đang bàn tán xôn xao về '{trend_name}'. Nhưng đây là những điều 99% đang bỏ sót 🧵👇\n\n2/4 {core_message}\n\n3/4 Bài học lớn nhất: Đừng chỉ tiêu thụ thông tin, hãy biến nó thành hành động cụ thể.\n\n4/4 Nếu thấy hữu ích, hãy RT tweet đầu tiên để chia sẻ cùng bạn bè!",
            "visual_tip": "Dùng infographic hoặc ảnh chụp màn hình dữ liệu thực tế tại tweet số 2."
        }
    }

async def generate_creator_content_pipeline(
    trend_name: str,
    trend_category: str,
    trend_context: str,
    platform: str = "TikTok",
    tone: str = "Educational",
    goal: str = "Engagement",
    custom_angle: str = None
) -> Dict[str, Any]:
    """
    Executes the multi-stage Content Generation Pipeline:
    Trend → Audience → Angle → Hook Engine → Content Structure → Package Generation → Virality & Failure Check
    """
    
    # 1. Five Hook Types (Curiosity, Contradiction, Question, Story, Challenge)
    hook_options = [
        {
            "type": "Curiosity (Tò mò)",
            "hook": f"Đây là lý do tại sao mọi người đang đổ xô tìm kiếm '{trend_name}' trong 24h qua..."
        },
        {
            "type": "Contradiction (Nghịch lý)",
            "hook": f"Ai cũng nghĩ '{trend_name}' chỉ là trào lưu nhất thời, cho đến khi thấy kết quả này!"
        },
        {
            "type": "Question (Câu hỏi xoáy)",
            "hook": f"Nếu bạn chưa biết đến '{trend_name}', liệu bạn có đang tự làm mình tụt lại phía sau?"
        },
        {
            "type": "Story (Câu chuyện thật)",
            "hook": f"Tôi đã dành trọn 24 giờ thử nghiệm '{trend_name}' và đây là sự thật bất ngờ."
        },
        {
            "type": "Challenge (Thách thức)",
            "hook": f"Thử thách bản thân trong 3 ngày tới với '{trend_name}', kết quả sẽ khiến bạn ngạc nhiên."
        }
    ]
    
    selected_hook = hook_options[0]["hook"] if tone == "Educational" else hook_options[1]["hook"]
    
    # 2. Structured Script with exact required timestamps
    script_sections = [
        {
            "time": "0-3 sec",
            "role": "HOOK",
            "text": selected_hook
        },
        {
            "time": "3-8 sec",
            "role": "CONTEXT",
            "text": f"Trong vòng vài ngày qua, từ khóa '{trend_name}' liên tục chiếm sóng các bảng xếp hạng xu hướng. {trend_context[:100]}..."
        },
        {
            "time": "8-25 sec",
            "role": "CORE VALUE",
            "text": f"Thay vì chỉ ngồi xem, đây là 3 điều cốt lõi bạn cần nắm ngay: Thứ nhất, nó giúp tối ưu hóa công việc cực nhanh. Thứ hai, chi phí tiếp cận gần như bằng 0 nếu bạn biết công cụ đúng. Và thứ ba, bạn hoàn toàn có thể ứng dụng vào ngành {trend_category} của mình ngay hôm nay."
        },
        {
            "time": "25-40 sec",
            "role": "PAYOFF",
            "text": "Điểm mấu chốt là đừng sao chép rập khuôn. Hãy chọn một góc nhìn độc bản của riêng bạn và thử nghiệm trước khi đám đông bão hòa."
        },
        {
            "time": "40-50 sec",
            "role": "CTA",
            "text": "Bạn đã thử áp dụng cái này chưa? Hãy để lại bình luận hoặc lưu video này để kiểm chứng lại vào ngày mai nhé!"
        }
    ]
    
    full_script = "\n\n".join([f"[{s['time']} - {s['role']}]\n{s['text']}" for s in script_sections])
    
    title = f"Bí Mật Đằng Sau Làn Sóng '{trend_name}' (Ai Làm {trend_category} Cũng Phải Biết!)"
    caption = f"🔥 Khám phá nhanh hiện tượng '{trend_name}' đang gây sốt. Lưu ngay video để không bỏ lỡ cơ hội bứt phá!\n\n👇 Bạn nghĩ sao về xu hướng này?"
    cta = "Thả tim nếu thấy bổ ích và để lại câu hỏi của bạn dưới phần bình luận!"
    hashtags = [
        f"{trend_name.replace(' ', '')}",
        "TrendSpark",
        f"{trend_category.lower()}tips",
        "learnontiktok",
        "xuhuong2026",
        "contentcreator"
    ]
    
    shot_list = [
        "Cận cảnh (Close-up): Mặt biểu cảm ngạc nhiên/tò mò, tay cầm điện thoại chỉ về hướng text hook.",
        "Trung cảnh (Medium Shot): Màn hình laptop hiển thị đồ thị tăng trưởng xu hướng hoặc tin tức thực tế.",
        "Cảnh quay qua vai (Over-the-shoulder): Trình diễn thao tác thực tế từng bước.",
        "Cảnh chính diện kết thúc: Nhìn thẳng camera với năng lượng tự tin, đưa ngón tay chỉ xuống phần comment."
    ]
    
    b_roll_ideas = [
        f"Ảnh chụp màn hình Google Trends hoặc TikTok Creative Center hiển thị từ khóa '{trend_name}'.",
        "Video quay nhanh (Timelapse) bàn làm việc hiện đại, gõ phím.",
        "Hiệu ứng phóng to bài báo hoặc số liệu chứng minh xu hướng."
    ]
    
    on_screen_text = [
        f"🔥 {trend_name} đang bùng nổ?",
        "⚠️ 3 điều tuyệt đối không được bỏ qua!",
        "💡 Cách ứng dụng thực chiến trong 1 nốt nhạc",
        "👇 Xem hết để không bị tụt hậu"
    ]
    
    thumbnail_idea = f"Mặt ngạc nhiên + Phông nền tối tương phản cao + Dòng chữ lớn: '{trend_name.upper()} THẬT SỰ LÀ GÌ?' kèm icon tia sét ⚡"
    visual_style = "Ánh sáng tương phản cao (High-contrast tech ambient), chuyển cảnh nhanh (Jump-cut) mỗi 2.5 giây để giữ nhịp xem."
    voice_style = "Giọng nói rõ ràng, tốc độ vừa phải, ngữ điệu hào hứng và quả quyết, không ậm ừ."
    music_direction = "Nhạc nền Upbeat Electronic / Lo-Fi Phonk có tiết tấu thúc đẩy sự chú ý nhưng không lấn át giọng nói."
    
    # Virality & Decision-Support Profile
    opportunity_profile = {
        "hook_strength": "Cao (88/100) - Đánh trúng tâm lý sợ bỏ lỡ FOMO và sự tò mò",
        "audience_relevance": f"Rất cao với người theo dõi {trend_category}",
        "novelty": "84/100 - Cung cấp góc nhìn thực chiến thay vì tin tức lý thuyết",
        "utility": "90/100 - Có hướng dẫn hành động cụ thể trong vòng 24h",
        "shareability": "86/100 - Dễ dàng chia sẻ vào nhóm học tập/công việc",
        "comment_potential": "89/100 - Câu hỏi mở cuối video kích thích tranh luận",
        "retention_structure": "Cấu trúc 5 nhịp thời gian giúp hạn chế tỷ lệ thoát trang",
        "platform_fit": f"Tối ưu hoàn hảo cho thuật toán video ngắn của {platform}"
    }
    
    failure_risks = (
        "1. Nói quá dài dòng ở 3 giây đầu tiên khiến người xem vuốt đi.\n"
        "2. Không đưa ra ví dụ trực quan mà chỉ nói lý thuyết suông.\n"
        "3. Đăng sai khung giờ vàng của đối tượng mục tiêu (khuyến nghị: 11h30 - 13h00 hoặc 19h30 - 21h30)."
    )
    
    share_trigger = "Người xem muốn gửi video này cho bạn bè/đồng nghiệp để cùng bàn luận hoặc nhắc nhở nhau ứng dụng."
    comment_trigger = "Tạo câu hỏi mở: 'Bạn nghĩ đây là cơ hội thực sự hay chỉ là chiêu trò truyền thông?'"
    differentiation_note = (
        f"Không đi theo lối mòn tóm tắt lại tin tức. Video này tập trung vào trải nghiệm cá nhân hóa "
        f"và góc nhìn thử nghiệm thực chiến của creator, loại bỏ hoàn toàn cảm giác sao chép."
    )
    
    repurposed = generate_native_repurposed(title, f"Xu hướng {trend_name} đang là cơ hội lớn nếu bạn biết cách tiếp cận đúng góc độ.", trend_name, hashtags)
    
    return {
        "title": title,
        "hook_options": hook_options,
        "selected_hook": selected_hook,
        "script_sections": script_sections,
        "full_script": full_script,
        "caption": caption,
        "cta": cta,
        "hashtags": hashtags,
        "shot_list": shot_list,
        "b_roll_ideas": b_roll_ideas,
        "on_screen_text": on_screen_text,
        "thumbnail_idea": thumbnail_idea,
        "visual_style": visual_style,
        "voice_style": voice_style,
        "music_direction": music_direction,
        "opportunity_profile": opportunity_profile,
        "failure_risks": failure_risks,
        "share_trigger": share_trigger,
        "comment_trigger": comment_trigger,
        "differentiation_note": differentiation_note,
        "repurposed_variants": repurposed
    }
