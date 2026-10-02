import React, { useState } from 'react';
import { SavedItem, ContentPackage, Trend } from '../types';
import { deleteSavedItem } from '../api';
import { Bookmark, Sparkles, Trash2, Copy, Check, Clock, ExternalLink } from 'lucide-react';

interface SavedViewProps {
  savedItems: SavedItem[];
  historyDrafts: ContentPackage[];
  onRefreshSaved: () => void;
  onExploreTrend: (trend: Trend) => void;
  onCreateContent: (trend: Trend) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedItems,
  historyDrafts,
  onRefreshSaved,
  onExploreTrend,
  onCreateContent,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'history'>('trends');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);

  const savedTrends = savedItems.filter((item) => item.item_type === 'trend');

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedItem(id);
      showToast('Đã xóa khỏi danh sách lưu', 'info');
      onRefreshSaved();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa', 'error');
    }
  };

  const handleCopyDraft = (draft: ContentPackage) => {
    const text = `TIÊU ĐỀ: ${draft.title}\n\nHOOK:\n${draft.selected_hook}\n\nKỊCH BẢN CHI TIẾT:\n${draft.full_script}\n\nCAPTION:\n${draft.caption}\n\nCTA: ${draft.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedDraftId(draft.id || 'copied');
    showToast('Đã sao chép kịch bản vào clipboard!', 'success');
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-brand-400" />
            Đã Lưu & Lịch Sử Sáng Tạo
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý kho ý tưởng, xu hướng đã đánh dấu và các kịch bản đã tạo sẵn sàng để đăng tải.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-dark-card border border-dark-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'trends'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Xu hướng đã lưu ({savedTrends.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lịch sử kịch bản ({historyDrafts.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Saved Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-3">
          {savedTrends.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-dark-card/50 border border-dark-border">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">Chưa có xu hướng nào được lưu</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bấm vào biểu tượng bookmark trên bất kỳ thẻ xu hướng nào ở trang Khám Phá để lưu lại nghiên cứu sau.
              </p>
            </div>
          ) : (
            savedTrends.map((item) => {
              const t = item.trend;
              if (!t) return null;
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300">
                        {t.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {t.source}
                      </span>
                      <span className="text-[11px] font-bold text-cyan-400">
                        Cơ hội: {Math.round(t.opportunity_score || 80)}%
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white hover:text-brand-300 cursor-pointer">
                      {t.canonical_name}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {t.why_trending}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onCreateContent(t as Trend)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Tạo kịch bản
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Xóa khỏi danh sách"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Content Generation History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyDrafts.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-dark-card/50 border border-dark-border">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">Chưa có kịch bản nào được tạo</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Chuyển sang tab Tạo Kịch Bản để bắt đầu biến xu hướng thành nội dung thực chiến!
              </p>
            </div>
          ) : (
            historyDrafts.map((draft) => (
              <div
                key={draft.id || Math.random()}
                className="p-5 rounded-3xl bg-dark-card border border-dark-border hover:border-brand-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/40">
                        {draft.platform}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        Tông giọng: {draft.tone}
                      </span>
                      {draft.created_at && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(draft.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-white">{draft.title}</h4>
                  </div>

                  <button
                    onClick={() => handleCopyDraft(draft)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-xs font-semibold text-slate-200 transition-all shrink-0"
                  >
                    {copiedDraftId === draft.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDraftId === draft.id ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>

                {/* Hook Box */}
                <div className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border text-xs">
                  <span className="font-extrabold text-amber-400 mr-2">HOOK:</span>
                  <span className="italic text-slate-200 font-medium">"{draft.selected_hook}"</span>
                </div>

                {/* Full script snippet */}
                <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border/80 text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line font-mono">
                  {draft.full_script}
                </div>

                {/* Footer Caption */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-dark-border/60">
                  <span className="truncate max-w-md">CTA: {draft.cta}</span>
                  <span className="text-slate-500 font-mono shrink-0">
                    {draft.hashtags?.length || 0} hashtags
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
