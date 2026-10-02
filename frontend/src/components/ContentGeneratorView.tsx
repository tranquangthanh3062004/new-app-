import React, { useState, useEffect } from 'react';
import { Trend, ContentPackage } from '../types';
import { generateContent, saveItem, trackEvent } from '../api';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Share2,
  RefreshCw,
  Clock,
  Layers,
  Camera,
  Film,
  Music,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Send,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ContentGeneratorViewProps {
  initialTrend: Trend | null;
  initialAngle?: string;
  allTrends: Trend[];
  onSavedSuccess: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContentGeneratorView: React.FC<ContentGeneratorViewProps> = ({
  initialTrend,
  initialAngle,
  allTrends,
  onSavedSuccess,
  showToast
}) => {
  const [selectedTrendId, setSelectedTrendId] = useState<string>(
    initialTrend?.trend_id || (allTrends[0]?.trend_id ?? '')
  );
  const [platform, setPlatform] = useState<string>('TikTok');
  const [tone, setTone] = useState<string>('Educational');
  const [goal, setGoal] = useState<string>('Engagement');
  const [customAngle, setCustomAngle] = useState<string>(initialAngle || '');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<string>('');
  const [result, setResult] = useState<ContentPackage | null>(null);

  // Selected hook
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);
  const [activeRepurposePlatform, setActiveRepurposePlatform] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<'script' | 'assets' | 'virality' | 'repurpose'>('script');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (initialTrend) {
      setSelectedTrendId(initialTrend.trend_id);
    }
  }, [initialTrend]);

  useEffect(() => {
    if (initialAngle) {
      setCustomAngle(initialAngle);
    }
  }, [initialAngle]);

  const selectedTrend = allTrends.find((t) => t.trend_id === selectedTrendId) || initialTrend;

  const handleGenerate = async () => {
    if (!selectedTrend) {
      showToast('Vui lòng chọn một xu hướng để tạo nội dung', 'error');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setIsSaved(false);

    // Multi-agent pipeline animation sequence
    const steps = [
      'Phân tích tín hiệu xu hướng & đối tượng mục tiêu...',
      'Xây dựng 5 góc tiếp cận độc bản (Anti-copying)...',
      'Kích hoạt Hook Engine (Tò mò, Nghịch lý, Thách thức)...',
      'Thiết kế cấu trúc video 5 nhịp thời gian...',
      'Tạo gói tài sản Creator (Shot list, B-roll, On-screen text)...',
      'AI Self-Critique: Kiểm tra tính xác thực & Rủi ro flop...',
      'Hoàn tất kịch bản độc bản!'
    ];

    for (let i = 0; i < steps.length - 1; i++) {
      setPipelineStep(steps[i]);
      await new Promise((r) => setTimeout(r, 400));
    }

    try {
      trackEvent('content_generate_start', { trend_id: selectedTrend.trend_id, platform, tone });
      const pkg = await generateContent({
        trend_id: selectedTrend.trend_id,
        platform,
        tone,
        goal,
        custom_angle: customAngle || undefined
      });
      setResult(pkg);
      setSelectedHookIndex(0);
      setActiveRepurposePlatform(platform === 'TikTok' ? 'Instagram Reel' : 'TikTok');
      showToast('Kịch bản hoàn tất theo chuẩn Creator!', 'success');
      trackEvent('content_generate_success', { trend_id: selectedTrend.trend_id });
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tạo kịch bản', 'error');
    } finally {
      setIsGenerating(false);
      setPipelineStep('');
    }
  };

  const handleCopyScript = () => {
    if (!result) return;
    const textToCopy = `TIÊU ĐỀ: ${result.title}\n\nHOOK:\n${result.hook_options[selectedHookIndex]?.hook || result.selected_hook}\n\nKỊCH BẢN CHI TIẾT (5 TIMESTAMPS):\n${result.full_script}\n\nCAPTION:\n${result.caption}\n\nCTA: ${result.cta}\n\nHASHTAGS: ${result.hashtags.map((h) => `#${h}`).join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast('Đã sao chép toàn bộ kịch bản vào clipboard!', 'success');
    trackEvent('content_copy', { draft_id: result.id });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveDraft = async () => {
    if (!result || isSaved) return;
    try {
      await saveItem({
        item_type: 'draft',
        trend_id: result.trend_id,
        draft_id: result.id,
        notes: `Kịch bản ${result.platform} cho xu hướng ${selectedTrend?.canonical_name}`
      });
      setIsSaved(true);
      showToast('Đã lưu kịch bản vào mục Đã Lưu!', 'success');
      onSavedSuccess();
      trackEvent('content_save', { draft_id: result.id });
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu kịch bản', 'error');
    }
  };

  const handleShare = () => {
    if (!result) return;
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: `Kịch bản ${result.platform} bắt trend ${selectedTrend?.canonical_name} trên TrendSpark AI:\n\n${result.selected_hook}`
      }).catch(() => {});
    } else {
      handleCopyScript();
    }
    trackEvent('content_share', { draft_id: result.id });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Top Banner */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-brand-400" />
          AI Content Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Chuyển hóa tín hiệu xu hướng thực tế thành kịch bản video ngắn và bài viết triệu view có tỷ lệ chuyển đổi cao.
        </p>
      </div>

      {/* Generation Form */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-dark-border mb-8 shadow-xl bg-gradient-to-b from-dark-card to-dark-surface">
        {/* Trend Selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            1. Chọn xu hướng mục tiêu 🔥
          </label>
          <select
            value={selectedTrendId}
            onChange={(e) => setSelectedTrendId(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-sm font-semibold focus:outline-none focus:border-brand-500 transition-colors"
          >
            {allTrends.map((t) => (
              <option key={t.trend_id} value={t.trend_id}>
                {t.canonical_name} ({t.category} • Cơ hội {Math.round(t.opportunity_score)}%)
              </option>
            ))}
          </select>
        </div>

        {/* Platform Selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            2. Nền tảng xuất bản 📱
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {['TikTok', 'Instagram Reel', 'YouTube Short', 'Facebook', 'LinkedIn', 'Blog'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  platform === p
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30 border border-brand-400'
                    : 'bg-dark-bg text-slate-300 border border-dark-border hover:border-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tone & Style Selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            3. Phong cách / Giọng điệu 🎙️
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Educational', label: 'Học thuật / Giáo dục' },
              { id: 'Storytelling', label: 'Kể chuyện (Story)' },
              { id: 'Bold', label: 'Mạnh mẽ / Táo bạo' },
              { id: 'Funny', label: 'Hài hước / Giải trí' },
              { id: 'Professional', label: 'Chuyên gia uy tín' },
              { id: 'Emotional', label: 'Cảm xúc / Đồng cảm' },
              { id: 'Experimental', label: 'Thử nghiệm thực tế' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all ${
                  tone === t.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-dark-bg text-slate-300 border border-dark-border hover:border-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Goal */}
        <div className="mb-5">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            4. Mục tiêu nội dung 🎯
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Engagement (Tương tác)',
              'Followers (Tăng follow)',
              'Views (Lượt xem)',
              'Leads (Thu thập data)',
              'Sales (Bán hàng)',
              'Brand Awareness (Nhận diện)'
            ].map((g) => {
              const val = g.split(' ')[0];
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGoal(val)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all ${
                    goal === val
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-dark-bg text-slate-400 border border-dark-border hover:border-slate-600'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Angle */}
        <div className="mb-6">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            5. Góc tiếp cận riêng biệt / Thử thách cá nhân hóa (Tùy chọn) 💡
          </label>
          <input
            type="text"
            value={customAngle}
            onChange={(e) => setCustomAngle(e.target.value)}
            placeholder="Ví dụ: Thử nghiệm hoàn thành đồ án tốt nghiệp với AI trong 48h..."
            className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Big CTA Create Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-extrabold text-base tracking-tight shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Đang kiến tạo kịch bản...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>✨ TẠO GÓI NỘI DUNG CREATOR (GENERATE ASSET)</span>
            </>
          )}
        </button>

        {/* Pipeline Multi-Agent Animation Status */}
        {isGenerating && pipelineStep && (
          <div className="mt-4 p-3.5 rounded-xl bg-dark-bg/80 border border-brand-500/30 flex items-center gap-3 animate-in fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-semibold text-brand-300">{pipelineStep}</span>
          </div>
        )}
      </div>

      {/* Generated Result Screen */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-dark-card border border-brand-500/30 shadow-2xl">
            <div>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
                Gói Kịch Bản Hoàn Chỉnh • {result.platform}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 leading-snug">
                {result.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-surface border border-dark-border hover:border-slate-500 text-xs font-bold text-slate-200 transition-all"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Đã chép' : 'Sao chép'}
              </button>

              <button
                onClick={handleSaveDraft}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSaved
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-dark-surface text-slate-200 border-dark-border hover:border-slate-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-400 text-brand-400' : ''}`} />
                {isSaved ? 'Đã lưu' : 'Lưu'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </button>
            </div>
          </div>

          {/* Section 1: Hook Engine (5 Hook Types) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-brand-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Hook Engine — 5 Công Thức Thu Hút 3 Giây Đầu
              </h3>
              <span className="text-[11px] text-slate-400">Chọn hook để xem kịch bản mẫu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {result.hook_options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedHookIndex(idx)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedHookIndex === idx
                      ? 'bg-brand-900/30 border-brand-400 text-white shadow-md shadow-brand-500/10'
                      : 'bg-dark-surface border-dark-border/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      {opt.type}
                    </span>
                    {selectedHookIndex === idx && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    "{opt.hook}"
                  </p>
                </div>
              ))}
            </div>

            {/* Currently Active Hook Preview */}
            <div className="p-3.5 rounded-xl bg-dark-bg/90 border border-dark-border/80 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-extrabold text-amber-400 mr-2">HOOK ĐƯỢC CHỌN:</span>
                <span className="text-slate-100 font-medium italic">
                  "{result.hook_options[selectedHookIndex]?.hook || result.selected_hook}"
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.hook_options[selectedHookIndex]?.hook || result.selected_hook);
                  showToast('Đã sao chép Hook!', 'success');
                }}
                className="p-1.5 rounded-lg bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section 2: Structured Script Sections (5 Timestamps) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                Kịch Bản Video Chi Tiết Theo Mốc Thời Gian (0-50s)
              </h3>
            </div>

            <div className="space-y-3">
              {result.script_sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-dark-surface border border-dark-border/80 flex flex-col sm:flex-row sm:items-start gap-3"
                >
                  <div className="sm:w-28 shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-dark-bg text-cyan-300 font-mono text-[11px] font-bold border border-dark-border">
                      {section.time}
                    </span>
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase mt-1">
                      {section.role}
                    </span>
                  </div>

                  <div className="flex-1 text-xs text-slate-100 leading-relaxed font-medium">
                    {section.role === 'HOOK'
                      ? result.hook_options[selectedHookIndex]?.hook || section.text
                      : section.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Caption, CTA & Hashtags Box */}
            <div className="mt-5 p-4 rounded-2xl bg-dark-bg/80 border border-dark-border space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">MÔ TẢ (CAPTION):</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">{result.caption}</p>
              </div>

              <div className="pt-2 border-t border-dark-border/60">
                <span className="text-slate-400 font-bold block mb-1">LỜI KÊU GỌI HÀNH ĐỘNG (CTA):</span>
                <p className="text-emerald-400 font-semibold">{result.cta}</p>
              </div>

              <div className="pt-2 border-t border-dark-border/60 flex flex-wrap gap-1.5">
                {result.hashtags.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 text-[11px] font-mono">
                    #{h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Creator Asset Package (Shot List, B-Roll, On-Screen Text) */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-dark-border">
            <button
              onClick={() => setExpandedSection(expandedSection === 'assets' ? 'script' : 'assets')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                Gói Tài Sản Sản Xuất (Shot List, B-Roll, Style)
              </h3>
              {expandedSection === 'assets' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'assets' && (
              <div className="mt-4 pt-4 border-t border-dark-border space-y-4 animate-in fade-in text-xs">
                {/* Shot List */}
                <div>
                  <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-cyan-400" /> Phân Cảnh Máy Quay (Shot List):
                  </h4>
                  <ul className="space-y-1.5">
                    {result.shot_list.map((shot, idx) => (
                      <li key={idx} className="p-2.5 rounded-xl bg-dark-surface border border-dark-border text-slate-200">
                        • {shot}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* B-Roll & On-Screen Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border">
                    <h5 className="font-bold text-slate-300 mb-2">B-Roll Footage Gợi Ý:</h5>
                    <ul className="space-y-1 text-slate-400">
                      {result.b_roll_ideas.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border">
                    <h5 className="font-bold text-slate-300 mb-2">Chữ Hiện Trên Màn Hình (On-screen text):</h5>
                    <ul className="space-y-1 text-amber-300/90 font-medium">
                      {result.on_screen_text.map((t, i) => (
                        <li key={i}>• "{t}"</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Style Direction */}
                <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-semibold">Phong cách hình ảnh:</span>
                    <span className="text-slate-200">{result.visual_style}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Tông giọng (Voice):</span>
                    <span className="text-slate-200">{result.voice_style}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold flex items-center gap-1">
                      <Music className="w-3 h-3 text-brand-400" /> Hướng dẫn âm nhạc:
                    </span>
                    <span className="text-slate-200">{result.music_direction}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Virality Reality Check & Differentiation Engine */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-dark-border">
            <button
              onClick={() => setExpandedSection(expandedSection === 'virality' ? 'script' : 'virality')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Kiểm Tra Rủi Ro & Độc Bản (Virality Reality Check)
              </h3>
              {expandedSection === 'virality' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'virality' && (
              <div className="mt-4 pt-4 border-t border-dark-border space-y-4 animate-in fade-in text-xs">
                {/* Failure Risks Anti-Hype */}
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
                  <h5 className="font-extrabold text-rose-300 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Điều gì có thể khiến video này thất bại (What could make this fail)?
                  </h5>
                  <p className="whitespace-pre-line leading-relaxed text-[11px] text-rose-200/90">
                    {result.failure_risks}
                  </p>
                </div>

                {/* Share & Comment Triggers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border">
                    <h5 className="font-bold text-cyan-300 mb-1 flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" /> Động cơ chia sẻ (Share Trigger):
                    </h5>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{result.share_trigger}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border">
                    <h5 className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Động cơ bình luận (Comment Trigger):
                    </h5>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{result.comment_trigger}</p>
                  </div>
                </div>

                {/* Differentiation note */}
                <div className="p-3.5 rounded-xl bg-dark-bg border border-brand-500/30">
                  <h5 className="font-bold text-brand-300 mb-1">Chiến lược chống sao chép (Anti-Copying Formula):</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{result.differentiation_note}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Instant Native Repurposing */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-dark-border">
            <button
              onClick={() => setExpandedSection(expandedSection === 'repurpose' ? 'script' : 'repurpose')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Chuyển Đổi Đa Nền Tảng (Instant Native Repurposing)
              </h3>
              {expandedSection === 'repurpose' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'repurpose' && (
              <div className="mt-4 pt-4 border-t border-dark-border space-y-4 animate-in fade-in">
                {/* Platform tabs */}
                <div className="flex flex-wrap gap-2">
                  {Object.keys(result.repurposed_variants).map((pKey) => (
                    <button
                      key={pKey}
                      onClick={() => setActiveRepurposePlatform(pKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeRepurposePlatform === pKey
                          ? 'bg-cyan-500 text-dark-bg font-extrabold shadow-md'
                          : 'bg-dark-surface text-slate-300 border border-dark-border hover:border-slate-600'
                      }`}
                    >
                      {pKey}
                    </button>
                  ))}
                </div>

                {/* Variant display */}
                {result.repurposed_variants[activeRepurposePlatform] && (
                  <div className="p-4 rounded-2xl bg-dark-bg border border-dark-border space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">
                        Định dạng chuẩn: {result.repurposed_variants[activeRepurposePlatform].format}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result.repurposed_variants[activeRepurposePlatform].caption || '');
                          showToast(`Đã sao chép phiên bản cho ${activeRepurposePlatform}!`, 'success');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-surface border border-dark-border text-slate-200 hover:text-white text-[11px]"
                      >
                        <Copy className="w-3 h-3" /> Chép bản này
                      </button>
                    </div>

                    <p className="whitespace-pre-line text-slate-200 leading-relaxed bg-dark-surface/80 p-3.5 rounded-xl border border-dark-border/60">
                      {result.repurposed_variants[activeRepurposePlatform].caption}
                    </p>

                    <p className="text-[11px] text-cyan-400 font-medium">
                      💡 Mẹo hình ảnh: {result.repurposed_variants[activeRepurposePlatform].visual_tip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
