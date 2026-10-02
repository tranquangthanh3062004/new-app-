import React from 'react';
import { AnalyticsDashboard, GamificationStats } from '../types';
import { upgradeTier } from '../api';
import {
  BarChart3,
  Flame,
  Trophy,
  Sparkles,
  Zap,
  Target,
  Crown,
  CheckCircle2,
  Share2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface GrowthViewProps {
  dashboard: AnalyticsDashboard | null;
  gamification: GamificationStats | null;
  onRefreshStats: () => void;
  onNavigateCreate: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const GrowthView: React.FC<GrowthViewProps> = ({
  dashboard,
  gamification,
  onRefreshStats,
  onNavigateCreate,
  showToast
}) => {
  const isPro = gamification?.tier === 'pro';

  const handleToggleUpgrade = async () => {
    try {
      const nextTier = isPro ? 'free' : 'pro';
      const res = await upgradeTier(nextTier);
      showToast(res.message, 'success');
      onRefreshStats();
    } catch (err: any) {
      showToast(err.message || 'Lỗi nâng cấp', 'error');
    }
  };

  const habit = dashboard?.habit_loop || {
    greeting: 'Chào buổi sáng Creator 👋',
    headline: 'Hôm nay ngách của bạn có 7 cơ hội tiềm năng!',
    stats_breakdown: { rising: 3, emerging: 2, evergreen: 2 },
    best_opportunity: 'AI Agents Tự Động Hóa Công Việc'
  };

  const funnel = dashboard?.funnel || {
    app_opens: 18,
    trend_views: 32,
    content_generations: 7,
    content_copies_saves: 9,
    content_shares: 4
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-cyan-400" />
          Chỉ Số Tăng Trưởng & Gamification
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Đo lường mức độ biến cơ hội xu hướng thành tài sản thực tế và thăng cấp huy hiệu Trend Hunter.
        </p>
      </div>

      {/* Daily Habit Loop Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-950/80 via-dark-card to-dark-surface border border-brand-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
          <Sparkles className="w-44 h-44 text-brand-400" />
        </div>

        <div className="relative z-10">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Daily Loop • Thói Quen Sáng Tạo
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            {habit.greeting}
          </h2>
          <p className="text-sm font-semibold text-slate-200 mt-1">
            {habit.headline}
          </p>

          {/* Quick stats pills */}
          <div className="flex flex-wrap items-center gap-2.5 my-3.5">
            <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> {habit.stats_breakdown.rising} Đang bùng nổ
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> {habit.stats_breakdown.emerging} Mới chớm nở
            </span>
            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> {habit.stats_breakdown.evergreen} Bền vững
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-bg/80 border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Cơ hội tốt nhất hôm nay:
              </span>
              <span className="text-sm font-extrabold text-white">"{habit.best_opportunity}"</span>
            </div>

            <button
              onClick={onNavigateCreate}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105"
            >
              Tạo kịch bản ngay <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* North Star Metric Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              North Star Metric
            </span>
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">
            {dashboard?.north_star_metric.name || 'Weekly Content Opportunities Activated'}
          </h3>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-white">
              {dashboard?.north_star_metric.value || 7}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {dashboard?.north_star_metric.unit || 'kịch bản kích hoạt / tuần'}
            </span>
          </div>
          <span className="inline-block text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {dashboard?.north_star_metric.trend_delta || '+40% so với tuần trước'}
          </span>
        </div>

        {/* Gamification Level Card */}
        <div className="p-5 rounded-3xl bg-dark-card border border-dark-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Cấp Độ Trend Hunter
            </span>
            <Trophy className="w-5 h-5 text-brand-gold" />
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            {gamification?.level_title || 'Trend Hunter 🔥'}
          </h3>
          <div className="flex items-center gap-3 pt-1 text-xs">
            <span className="text-slate-300 font-bold">
              {gamification?.points || 85} <span className="text-slate-500 font-normal">Điểm kinh nghiệm</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Chuỗi {gamification?.streak_days || 2} ngày
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-amber-400 to-brand-500 h-2 rounded-full"
              style={{ width: `${Math.min(100, ((gamification?.points || 85) % 100))}%` }}
            />
          </div>
          <span className="block text-[10px] text-slate-400">
            Còn {100 - ((gamification?.points || 85) % 100)} điểm để thăng cấp tiếp theo
          </span>
        </div>
      </div>

      {/* Creator Growth Funnel */}
      <div className="p-5 sm:p-6 rounded-3xl bg-dark-card border border-dark-border">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Phễu Chuyển Đổi Sáng Tạo (Creator Activation Funnel)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Mở ứng dụng</span>
            <span className="text-xl font-bold text-white">{funnel.app_opens}</span>
            <span className="text-[10px] text-slate-500 block mt-1">App Opens</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Xem xu hướng</span>
            <span className="text-xl font-bold text-cyan-400">{funnel.trend_views}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Trend Views</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-surface border border-brand-500/40 text-center bg-brand-950/20">
            <span className="text-[11px] text-brand-300 block mb-1">Tạo kịch bản</span>
            <span className="text-xl font-black text-brand-400">{funnel.content_generations}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Generations</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Lưu & Sao chép</span>
            <span className="text-xl font-bold text-amber-400">{funnel.content_copies_saves}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Saves / Copies</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dark-surface border border-dark-border text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block mb-1">Chia sẻ đồng đội</span>
            <span className="text-xl font-bold text-emerald-400">{funnel.content_shares}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Viral Shares</span>
          </div>
        </div>
      </div>

      {/* Freemium & Pro Monetization Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-surface to-dark-card border border-dark-border relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-brand-gold" />
              <h3 className="text-lg font-extrabold text-white">Mô Hình Freemium Sáng Tạo</h3>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isPro ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {isPro ? 'Gói Pro Kích Hoạt' : 'Gói Miễn Phí (Free)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              TrendSpark AI tuân thủ nguyên tắc Free-First: Người dùng miễn phí luôn được trải nghiệm giá trị khám phá và tạo nội dung cốt lõi mỗi ngày.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Miễn phí: 5 lượt khám phá & 3 kịch bản/ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Pro: Không giới hạn & Repurposing đa kênh</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleUpgrade}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shrink-0 ${
              isPro
                ? 'bg-dark-surface border border-slate-700 text-slate-300 hover:text-white'
                : 'bg-gradient-to-r from-amber-500 to-brand-500 text-dark-bg font-extrabold shadow-amber-500/20 hover:scale-105'
            }`}
          >
            {isPro ? 'Chuyển về gói Free (Demo)' : '⚡ Nâng Cấp Pro (Dùng Thử)'}
          </button>
        </div>
      </div>
    </div>
  );
};
