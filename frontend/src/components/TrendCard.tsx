import React from 'react';
import { Trend } from '../types';
import { Sparkles, ArrowUpRight, Bookmark, ShieldCheck, Flame, Zap, Sprout, TrendingUp } from 'lucide-react';

interface TrendCardProps {
  trend: Trend;
  onExplore: (trend: Trend) => void;
  onCreateContent: (trend: Trend) => void;
  onSave: (trend: Trend) => void;
  isSaved?: boolean;
}

export const TrendCard: React.FC<TrendCardProps> = ({
  trend,
  onExplore,
  onCreateContent,
  onSave,
  isSaved = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RISING':
        return {
          icon: Flame,
          label: 'Đang bùng nổ',
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      case 'EMERGING':
        return {
          icon: Sprout,
          label: 'Mới chớm nở',
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'PEAK':
        return {
          icon: Zap,
          label: 'Đỉnh điểm',
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      default:
        return {
          icon: TrendingUp,
          label: 'Ổn định',
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
    }
  };

  const statusInfo = getStatusBadge(trend.trend_status);
  const StatusIcon = statusInfo.icon;
  const oppScore = Math.round(trend.opportunity_score);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-dark-border/80 hover:border-brand-500/40 bg-gradient-to-b from-dark-card to-dark-surface/90 transition-all">
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.bg}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </span>

            {/* Category */}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
              {trend.category}
            </span>

            {/* Verification */}
            <span
              title="Dữ liệu xác thực từ nguồn chính thức"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400/90"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {trend.verification_status === 'VERIFIED_TREND' ? 'Xác thực' : 'Inferred'}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onSave(trend)}
            title={isSaved ? 'Đã lưu' : 'Lưu cơ hội xu hướng'}
            className={`p-1.5 rounded-lg border transition-all ${
              isSaved
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-dark-border'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-400' : ''}`} />
          </button>
        </div>

        {/* Canonical Title */}
        <h3
          onClick={() => onExplore(trend)}
          className="text-lg sm:text-xl font-bold text-white hover:text-brand-300 cursor-pointer transition-colors leading-snug tracking-tight"
        >
          {trend.canonical_name}
        </h3>

        {/* Traffic / Momentum context badge */}
        <div className="flex items-center gap-2 mt-2 mb-3 text-xs text-slate-400 font-medium">
          <span className="px-2 py-0.5 rounded bg-dark-border/50 text-slate-300 text-[11px]">
            {trend.source} ({trend.region})
          </span>
          {trend.traffic_estimate && trend.traffic_estimate !== 'DATA_UNAVAILABLE' && (
            <span className="text-amber-400/90 text-[11px] font-medium">
              ⚡ {trend.traffic_estimate}
            </span>
          )}
        </div>

        {/* Decision-Support Indicators */}
        <div className="grid grid-cols-2 gap-2.5 my-3.5 p-3 rounded-xl bg-dark-bg/60 border border-dark-border/60">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Độ tươi mới</span>
              <span className="font-semibold text-emerald-400">{Math.round(trend.freshness)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${trend.freshness}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Động lượng</span>
              <span className="font-semibold text-cyan-400">
                {Math.round(trend.search_momentum || trend.social_momentum || 75)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${trend.search_momentum || trend.social_momentum || 75}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Độ cạnh tranh</span>
              <span className="font-semibold text-amber-400">{Math.round(trend.competition)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${trend.competition}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300 font-medium">Cơ hội nội dung</span>
              <span className="font-bold text-brand-300">{oppScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${oppScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Why is it trending? snippet */}
        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-4">
          <strong className="text-slate-400 font-medium">Tại sao hot: </strong>
          {trend.why_trending}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-dark-border/40">
        <button
          onClick={() => onExplore(trend)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-xs font-semibold text-slate-200 transition-all"
        >
          Chi tiết xu hướng
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => onCreateContent(trend)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Tạo kịch bản
        </button>
      </div>
    </div>
  );
};
