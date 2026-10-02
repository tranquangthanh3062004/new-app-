import React from 'react';
import { Flame, Sparkles, Bookmark, BarChart3, User } from 'lucide-react';

export type NavTab = 'trends' | 'create' | 'saved' | 'growth' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount = 0
}) => {
  const tabs = [
    { id: 'trends', label: 'Xu hướng', icon: Flame, badge: null },
    { id: 'create', label: 'Tạo kịch bản', icon: Sparkles, badge: 'AI' },
    { id: 'saved', label: 'Đã lưu', icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
    { id: 'growth', label: 'Tăng trưởng', icon: BarChart3, badge: null },
    { id: 'profile', label: 'Cá nhân', icon: User, badge: null },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur-lg border-t border-dark-border px-3 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as NavTab)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-brand-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400 stroke-[2.5]' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 min-w-4 text-[9px] font-extrabold rounded-full bg-brand-500 text-white text-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
