import React, { useState } from 'react';
import { Trend } from '../types';
import {
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Flame,
  Clock,
  Compass,
  Video,
  FileText,
  Layers,
  Smartphone,
  PlaySquare,
  AlertTriangle
} from 'lucide-react';

interface TrendDetailModalProps {
  trend: Trend | null;
  onClose: () => void;
  onCreateContent: (trend: Trend, ideaAngle?: string) => void;
}

export const TrendDetailModal: React.FC<TrendDetailModalProps> = ({
  trend,
  onClose,
  onCreateContent
}) => {
  if (!trend) return null;

  const [activeIdeaTab, setActiveIdeaTab] = useState<'video' | 'post' | 'carousel' | 'story' | 'longform'>('video');

  const ideas = trend.creative_ideas || {
    short_video_ideas: [
      `Thử thách 24h: Ứng dụng ${trend.canonical_name} vào thực tế`,
      `3 sai lầm chết người khi bắt trend ${trend.canonical_name}`,
      `POV: Khi bạn khám phá ra ${trend.canonical_name} trước đám đông`,
      `Giải thích ngắn 30s: Tại sao ai cũng đang nói về ${trend.canonical_name}?`,
      `Review chân thật: ${trend.canonical_name} có xứng đáng như kỳ vọng?`
    ],
    post_ideas: [
      `5 bài học kinh doanh/sáng tạo rút ra từ làn sóng ${trend.canonical_name}`,
      `Phân tích xu hướng: Liệu ${trend.canonical_name} có duy trì được 6 tháng nữa?`,
      `Checklist hành động ngay cho người mới bắt đầu với ${trend.canonical_name}`,
      `Góc nhìn trái chiều về sự bùng nổ của ${trend.canonical_name}`,
      `Hướng dẫn từng bước thực hành cho người bận rộn`
    ],
    carousel_ideas: [
      `Slide 1-5: Cẩm nang toàn diện về ${trend.canonical_name}`,
      `Trước & Sau: Kết quả thực tế khi áp dụng đúng phương pháp`,
      `So sánh trực quan: Phương pháp mới vs Cách làm truyền thống`
    ],
    story_ideas: [
      `Bình chọn tương tác: Bạn đã nghe về ${trend.canonical_name} chưa?`,
      `Hậu trường: Đang thử nghiệm góc nhìn mới, đón xem tối nay!`,
      `Hỏi đáp nhanh: Thắc mắc lớn nhất của bạn về xu hướng này?`
    ],
    long_form_ideas: [
      `Video YouTube 10 phút: Toàn cảnh xu hướng và chiến lược khai thác`,
      `Podcast đàm đạo: Phỏng vấn góc nhìn đa chiều về ${trend.canonical_name}`,
      `Case study chi tiết: Giải mã công thức tăng trưởng đằng sau xu hướng`
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl my-6 bg-dark-card border border-dark-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-dark-border/80 bg-gradient-to-r from-brand-950/40 via-dark-card to-dark-surface">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {trend.trend_status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {trend.category}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {trend.verification_status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {trend.region} • {trend.source}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {trend.canonical_name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-hover border border-transparent hover:border-dark-border transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Signal Explainer: Why is it trending? */}
          <div className="p-4 rounded-2xl bg-dark-bg/80 border border-dark-border">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-300 flex items-center gap-1.5 mb-2">
              <Compass className="w-4 h-4" />
              Tại sao xu hướng này bùng nổ?
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed mb-3">
              {trend.why_trending}
            </p>

            {trend.signals_breakdown && Object.keys(trend.signals_breakdown).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-dark-border/60 text-xs">
                {Object.entries(trend.signals_breakdown).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className="font-semibold text-slate-400 capitalize">{k.replace('_', ' ')}:</span>
                    <span className="truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            {trend.source_url && (
              <a
                href={trend.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium mt-3"
              >
                Xem dữ liệu gốc từ nguồn <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Decision-Support Opportunity Indicators */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3">
              Chỉ số hỗ trợ quyết định (Decision-Support Profile)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                <span className="text-[11px] text-slate-400 block mb-1">Động lượng tìm kiếm</span>
                <span className="text-lg font-bold text-cyan-400">
                  {Math.round(trend.search_momentum || trend.social_momentum || 75)}%
                </span>
                <span className="text-[10px] text-slate-500 block">Tăng trưởng thảo luận</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                <span className="text-[11px] text-slate-400 block mb-1">Độ tươi mới</span>
                <span className="text-lg font-bold text-emerald-400">{Math.round(trend.freshness)}%</span>
                <span className="text-[10px] text-slate-500 block">Vừa được ghi nhận</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                <span className="text-[11px] text-slate-400 block mb-1">Mức độ bão hòa</span>
                <span className="text-lg font-bold text-amber-400">{Math.round(trend.competition)}%</span>
                <span className="text-[10px] text-slate-500 block">Độ cạnh tranh nhà sáng tạo</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                <span className="text-[11px] text-slate-400 block mb-1">Điểm cơ hội tổng</span>
                <span className="text-lg font-bold text-brand-300">{Math.round(trend.opportunity_score)}/100</span>
                <span className="text-[10px] text-slate-500 block">Tiềm năng chuyển đổi</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                <span className="text-[11px] text-slate-400 block mb-1">Độ khó sản xuất</span>
                <span className="text-lg font-bold text-slate-200">Thấp - Trung bình</span>
                <span className="text-[10px] text-slate-500 block">Dễ quay dựng trong ngày</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-surface border border-dark-border">
                <span className="text-[11px] text-slate-400 block mb-1">Chu kỳ sống</span>
                <span className="text-lg font-bold text-rose-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 24-72h
                </span>
                <span className="text-[10px] text-slate-500 block">Cửa sổ vàng để đăng</span>
              </div>
            </div>
          </div>

          {/* Content Opportunities */}
          {trend.opportunities && trend.opportunities.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3">
                Cơ hội nội dung khả thi (Actionable Opportunities)
              </h4>
              <div className="space-y-3">
                {trend.opportunities.map((opp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-dark-surface border border-dark-border/80 hover:border-brand-500/30 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-slate-200">
                        Cơ hội #{idx + 1}: {opp.best_platform}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                        {opp.best_format}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">
                      <strong className="text-slate-400">Ai nên tạo: </strong> {opp.who_should_create}
                    </p>
                    <p className="text-xs text-slate-300 mb-2">
                      <strong className="text-slate-400">Gợi ý Hook: </strong> "{opp.best_hook_angle}"
                    </p>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-dark-bg/60 text-[11px] text-amber-300/90 border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <span>Rủi ro: {opp.risk_assessment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* "WHAT CAN YOU CREATE?" Idea generator suggestions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Gợi ý ý tưởng nhanh (What Can You Create?)
              </h4>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-bg border border-dark-border overflow-x-auto mb-3">
              {[
                { id: 'video', label: '5 Video ngắn', icon: Video },
                { id: 'post', label: '5 Bài viết', icon: FileText },
                { id: 'carousel', label: '3 Carousel', icon: Layers },
                { id: 'story', label: '3 Story', icon: Smartphone },
                { id: 'longform', label: '3 Dài hạn', icon: PlaySquare },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeIdeaTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveIdeaTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Idea List */}
            <div className="space-y-2">
              {activeIdeaTab === 'video' &&
                ideas.short_video_ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    onClick={() => onCreateContent(trend, idea)}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 cursor-pointer transition-all group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-brand-300">
                      {idea}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Chọn góc này →
                    </span>
                  </div>
                ))}

              {activeIdeaTab === 'post' &&
                ideas.post_ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    onClick={() => onCreateContent(trend, idea)}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 cursor-pointer transition-all group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-brand-300">
                      {idea}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Chọn góc này →
                    </span>
                  </div>
                ))}

              {activeIdeaTab === 'carousel' &&
                ideas.carousel_ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    onClick={() => onCreateContent(trend, idea)}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 cursor-pointer transition-all group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-brand-300">
                      {idea}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Chọn góc này →
                    </span>
                  </div>
                ))}

              {activeIdeaTab === 'story' &&
                ideas.story_ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    onClick={() => onCreateContent(trend, idea)}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 cursor-pointer transition-all group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-brand-300">
                      {idea}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Chọn góc này →
                    </span>
                  </div>
                ))}

              {activeIdeaTab === 'longform' &&
                ideas.long_form_ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    onClick={() => onCreateContent(trend, idea)}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border hover:border-brand-500/40 cursor-pointer transition-all group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-brand-300">
                      {idea}
                    </span>
                    <span className="text-[11px] font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Chọn góc này →
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-dark-border/80 bg-dark-surface flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-dark-border text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Đóng
          </button>

          <button
            onClick={() => onCreateContent(trend)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Khởi động AI Content Generator
          </button>
        </div>
      </div>
    </div>
  );
};
