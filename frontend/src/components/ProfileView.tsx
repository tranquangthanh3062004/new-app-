import React, { useState } from 'react';
import { UserPreferences, GamificationStats } from '../types';
import { updatePreferences } from '../api';
import { User, Check, Globe, Sparkles, Sliders, Shield, Award } from 'lucide-react';

interface ProfileViewProps {
  preferences: UserPreferences | null;
  gamification: GamificationStats | null;
  onPreferencesUpdated: (newPref: UserPreferences) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  preferences,
  gamification,
  onPreferencesUpdated,
  showToast
}) => {
  const [niche, setNiche] = useState<string>(preferences?.niche || 'Technology');
  const [country, setCountry] = useState<string>(preferences?.country || 'VN');
  const [language, setLanguage] = useState<string>(preferences?.language || 'vi');
  const [audience, setAudience] = useState<string>(preferences?.audience || 'Gen Z & Tech Enthusiasts in Vietnam');
  const [tone, setTone] = useState<string>(preferences?.tone || 'Educational & Bold');
  const [contentGoal, setContentGoal] = useState<string>(preferences?.content_goal || 'Engagement & Followers');
  const [experienceLevel, setExperienceLevel] = useState<string>(preferences?.experience_level || 'Intermediate');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const niches = [
    'Technology',
    'AI',
    'Business',
    'Finance',
    'Education',
    'Lifestyle',
    'Food',
    'Travel',
    'Fitness',
    'Entertainment',
    'Fashion',
    'Gaming'
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updatePreferences({
        niche,
        country,
        language,
        audience,
        tone,
        content_goal: contentGoal,
        experience_level: experienceLevel
      });
      onPreferencesUpdated(updated);
      showToast('Đã lưu thông tin ngách! Bảng xu hướng đã được cá nhân hóa.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu cài đặt', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-brand-400" />
          Hồ Sơ Creator & Cá Nhân Hóa Xu Hướng
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Hệ thống sẽ dựa trên ngách và phong cách của bạn để lọc ra bảng tin "Xu Hướng Của Bạn" (Your Trends).
        </p>
      </div>

      {/* Gamification Badge Card */}
      <div className="p-5 rounded-3xl bg-dark-card border border-dark-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              {gamification?.level_title || 'Trend Hunter 🔥'}
            </h3>
            <p className="text-xs text-slate-400">
              Gói tài khoản: <span className="font-bold uppercase text-brand-300">{gamification?.tier || 'Free'}</span> • {gamification?.points || 85} XP tích lũy
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">Chuỗi hoạt động</span>
          <span className="text-lg font-black text-amber-400">🔥 {gamification?.streak_days || 1} Ngày</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl p-5 sm:p-7 border border-dark-border space-y-6">
        {/* Niche Selector */}
        <div>
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Ngách Nội Dung Chính (Primary Niche)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {niches.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNiche(n)}
                className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  niche === n
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 border border-brand-400'
                    : 'bg-dark-bg text-slate-300 border border-dark-border hover:border-slate-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Region & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
              Quốc gia thị trường
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="VN">Việt Nam (VN)</option>
              <option value="US">Hoa Kỳ (US / Global)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
              Ngôn ngữ kịch bản
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="vi">Tiếng Việt (Vietnamese)</option>
              <option value="en">English (Toàn cầu)</option>
            </select>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Đối tượng khán giả mục tiêu (Target Audience)
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Ví dụ: Sinh viên, Gen Z, Lập trình viên, Người đi làm tại VN..."
            className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Tone and Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
              Tông giọng ưa chuộng
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Educational, Bold, Funny..."
              className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
              Trình độ kinh nghiệm sáng tạo
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-dark-bg border border-dark-border text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="Beginner">Mới bắt đầu (Beginner)</option>
              <option value="Intermediate">Đã có kinh nghiệm (Intermediate)</option>
              <option value="Pro Creator">KOL / Chuyên nghiệp (Pro)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-extrabold text-sm tracking-tight shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Check className="w-4 h-4" />
          {isSaving ? 'Đang lưu cài đặt...' : 'Lưu Cài Đặt Cá Nhân Hóa'}
        </button>
      </form>
    </div>
  );
};
