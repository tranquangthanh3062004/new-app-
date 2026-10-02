import React, { useState, useEffect } from 'react';
import {
  fetchTrends,
  fetchTrendDetail,
  fetchPreferences,
  fetchSavedItems,
  fetchContentHistory,
  fetchDashboard,
  fetchGamification,
  saveItem,
  trackEvent
} from './api';
import {
  Trend,
  ContentPackage,
  UserPreferences,
  SavedItem,
  AnalyticsDashboard,
  GamificationStats
} from './types';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { TrendCard } from './components/TrendCard';
import { TrendDetailModal } from './components/TrendDetailModal';
import { ContentGeneratorView } from './components/ContentGeneratorView';
import { SavedView } from './components/SavedView';
import { GrowthView } from './components/GrowthView';
import { ProfileView } from './components/ProfileView';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  Flame,
  Search,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  Sparkles,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('trends');

  // Data states
  const [trends, setTrends] = useState<Trend[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [historyDrafts, setHistoryDrafts] = useState<ContentPackage[]>([]);
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [gamification, setGamification] = useState<GamificationStats | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('VN');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Loading states
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Modals & Selected Trends
  const [activeModalTrend, setActiveModalTrend] = useState<Trend | null>(null);
  const [targetGenerateTrend, setTargetGenerateTrend] = useState<Trend | null>(null);
  const [targetGenerateAngle, setTargetGenerateAngle] = useState<string | undefined>(undefined);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Load
  const loadInitialData = async () => {
    try {
      trackEvent('app_open');
      const [prefData, savedData, draftData, dashData, gamData] = await Promise.all([
        fetchPreferences().catch(() => null),
        fetchSavedItems().catch(() => []),
        fetchContentHistory().catch(() => []),
        fetchDashboard().catch(() => null),
        fetchGamification().catch(() => null)
      ]);

      if (prefData) setPreferences(prefData);
      setSavedItems(savedData);
      setHistoryDrafts(draftData);
      if (dashData) setDashboard(dashData);
      if (gamData) setGamification(gamData);

      // Load trends with user preferred region/category
      await loadTrends(false, prefData?.country || 'VN');
    } catch (err: any) {
      console.error('[TrendSpark] Init error:', err);
    }
  };

  const loadTrends = async (forceRefresh: boolean = false, regionCode: string = selectedRegion) => {
    setIsLoadingTrends(true);
    setErrorMsg(null);
    try {
      const data = await fetchTrends({
        region: regionCode,
        category: selectedCategory,
        status: selectedStatus,
        search: searchQuery,
        forceRefresh
      });
      setTrends(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tải dữ liệu xu hướng');
    } finally {
      setIsLoadingTrends(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Re-fetch trends when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTrends(false, selectedRegion);
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedRegion, selectedCategory, selectedStatus, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showToast('Đang kéo dữ liệu mới nhất từ Google Trends & TikTok Creative Center...', 'info');
    await loadTrends(true, selectedRegion);
    // Refresh dashboard stats
    fetchDashboard().then(setDashboard).catch(() => {});
    fetchGamification().then(setGamification).catch(() => {});
    showToast('Dữ liệu xu hướng đã được cập nhật!', 'success');
  };

  const handleExploreTrend = async (trend: Trend) => {
    trackEvent('trend_view', { trend_id: trend.trend_id, name: trend.canonical_name });
    try {
      const fullDetail = await fetchTrendDetail(trend.trend_id);
      setActiveModalTrend(fullDetail);
    } catch (e) {
      setActiveModalTrend(trend);
    }
  };

  const handleStartCreation = (trend: Trend, ideaAngle?: string) => {
    setActiveModalTrend(null);
    setTargetGenerateTrend(trend);
    setTargetGenerateAngle(ideaAngle);
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTrend = async (trend: Trend) => {
    const alreadySaved = savedItems.some((item) => item.trend_id === trend.trend_id);
    if (alreadySaved) {
      showToast('Xu hướng này đã có trong danh sách lưu!', 'info');
      return;
    }

    try {
      await saveItem({
        item_type: 'trend',
        trend_id: trend.trend_id,
        notes: `Lưu từ trang khám phá: ${trend.canonical_name}`
      });
      const updatedSaved = await fetchSavedItems();
      setSavedItems(updatedSaved);
      fetchGamification().then(setGamification).catch(() => {});
      showToast(`Đã lưu "${trend.canonical_name}" vào kho ý tưởng!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu xu hướng', 'error');
    }
  };

  const categories = [
    'All',
    'Technology',
    'AI',
    'Business',
    'Finance',
    'Education',
    'Lifestyle',
    'Entertainment',
    'Food',
    'Travel'
  ];

  const statuses = [
    { id: 'All', label: 'Tất cả' },
    { id: 'RISING', label: '🔥 Đang bùng nổ' },
    { id: 'EMERGING', label: '🌱 Mới chớm nở' },
    { id: 'PEAK', label: '⚡ Đỉnh điểm' },
    { id: 'STABLE', label: '📈 Bền vững' }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white pb-16">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        gamification={gamification}
        preferences={preferences}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenGrowth={() => setCurrentTab('growth')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto">
        {/* TAB 1: TRENDS FEED */}
        {currentTab === 'trends' && (
          <div className="px-4 py-6 space-y-6">
            {/* Hero / Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-rose-500 font-extrabold text-sm uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-4 h-4 animate-bounce" /> Real Data Engine
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    Google Trends & TikTok Signals
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Hôm nay có gì Hot? 🔥
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">
                  Khám phá xu hướng thực tế đang tăng trưởng mạnh, phân tích cơ hội nội dung và lấy kịch bản trong 30 giây.
                </p>
              </div>

              {/* Region Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-dark-card border border-dark-border self-start sm:self-auto">
                <Globe className="w-4 h-4 text-slate-400 ml-2" />
                <button
                  onClick={() => setSelectedRegion('VN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRegion === 'VN'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Việt Nam (VN)
                </button>
                <button
                  onClick={() => setSelectedRegion('US')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRegion === 'US'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hoa Kỳ / Global (US)
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm xu hướng, từ khóa hoặc chủ đề (ví dụ: AI agents, tài chính, TikTok...)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-dark-card border border-dark-border text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-inner"
              />
            </div>

            {/* Filter Pills */}
            <div className="space-y-2.5">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-dark-bg font-extrabold shadow-md'
                        : 'bg-dark-card text-slate-400 border border-dark-border hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'All' ? 'Tất cả ngách' : cat}
                  </button>
                ))}
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {statuses.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatus(st.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      selectedStatus === st.id
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner if any */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={() => loadTrends(true)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-bold"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Trends Grid */}
            {isLoadingTrends ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-dark-card/60 animate-pulse border border-dark-border" />
                ))}
              </div>
            ) : trends.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-3xl bg-dark-card/40 border border-dark-border">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">Không tìm thấy xu hướng phù hợp</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Thử chuyển đổi ngách hoặc bấm làm mới để kéo dữ liệu mới nhất.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-slate-300 hover:text-white"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trends.map((trend) => (
                  <TrendCard
                    key={trend.trend_id}
                    trend={trend}
                    onExplore={handleExploreTrend}
                    onCreateContent={handleStartCreation}
                    onSave={handleSaveTrend}
                    isSaved={savedItems.some((s) => s.trend_id === trend.trend_id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI CONTENT GENERATOR */}
        {currentTab === 'create' && (
          <ContentGeneratorView
            initialTrend={targetGenerateTrend}
            initialAngle={targetGenerateAngle}
            allTrends={trends}
            onSavedSuccess={() => {
              fetchSavedItems().then(setSavedItems);
              fetchContentHistory().then(setHistoryDrafts);
              fetchGamification().then(setGamification);
            }}
            showToast={showToast}
          />
        )}

        {/* TAB 3: SAVED & CONTENT HISTORY */}
        {currentTab === 'saved' && (
          <SavedView
            savedItems={savedItems}
            historyDrafts={historyDrafts}
            onRefreshSaved={() => {
              fetchSavedItems().then(setSavedItems);
              fetchContentHistory().then(setHistoryDrafts);
            }}
            onExploreTrend={handleExploreTrend}
            onCreateContent={handleStartCreation}
            showToast={showToast}
          />
        )}

        {/* TAB 4: GROWTH & GAMIFICATION */}
        {currentTab === 'growth' && (
          <GrowthView
            dashboard={dashboard}
            gamification={gamification}
            onRefreshStats={() => {
              fetchDashboard().then(setDashboard);
              fetchGamification().then(setGamification);
            }}
            onNavigateCreate={() => setCurrentTab('create')}
            showToast={showToast}
          />
        )}

        {/* TAB 5: PROFILE & NICHE PERSONALIZATION */}
        {currentTab === 'profile' && (
          <ProfileView
            preferences={preferences}
            gamification={gamification}
            onPreferencesUpdated={(newPref) => {
              setPreferences(newPref);
              setSelectedRegion(newPref.country || 'VN');
              loadTrends(false, newPref.country || 'VN');
            }}
            showToast={showToast}
          />
        )}
      </main>

      {/* Trend Detail Modal */}
      {activeModalTrend && (
        <TrendDetailModal
          trend={activeModalTrend}
          onClose={() => setActiveModalTrend(null)}
          onCreateContent={handleStartCreation}
        />
      )}

      {/* Mobile-First Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedItems.length}
      />
    </div>
  );
};
export default App;
