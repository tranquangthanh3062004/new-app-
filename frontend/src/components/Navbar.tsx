import React from 'react';
import { Flame, Sparkles, RefreshCw, Trophy, Crown } from 'lucide-react';
import { GamificationStats, UserPreferences } from '../types';

interface NavbarProps {
  gamification: GamificationStats | null;
  preferences: UserPreferences | null;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenProfile: () => void;
  onOpenGrowth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  gamification,
  preferences,
  onRefresh,
  isRefreshing,
  onOpenProfile,
  onOpenGrowth
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-dark-bg/85 backdrop-blur-md border-b border-dark-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TrendSpark
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Trend → Opportunity → Content</p>
          </div>
        </div>

        {/* Status / Gamification Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Làm mới dữ liệu xu hướng thực tế"
            className="p-2 rounded-xl bg-dark-card border border-dark-border hover:border-slate-600 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
          </button>

          {/* Gamification Badge */}
          {gamification && (
            <button
              onClick={onOpenGrowth}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all text-xs font-semibold"
            >
              <Flame className="w-4 h-4 text-brand-fire animate-pulse" />
              <span className="text-amber-300">{gamification.streak_days}d</span>
              <span className="text-slate-500">|</span>
              <Trophy className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-slate-200">{gamification.points} pts</span>
            </button>
          )}

          {/* User Niche / Tier Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-900/60 to-dark-surface border border-brand-500/30 hover:border-brand-400 transition-all text-xs font-medium text-slate-200"
          >
            {gamification?.tier === 'pro' ? (
              <Crown className="w-3.5 h-3.5 text-brand-gold" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
            <span className="hidden sm:inline">{preferences?.niche || 'Technology'}</span>
            <span className="text-[10px] font-bold text-brand-300 uppercase px-1.5 py-0.5 rounded bg-brand-500/20">
              {gamification?.tier === 'pro' ? 'PRO' : 'FREE'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
