import {
  Trend,
  ContentPackage,
  UserPreferences,
  SavedItem,
  AnalyticsDashboard,
  GamificationStats
} from './types';

const API_BASE = 'http://localhost:8000/api';

export async function fetchTrends(params: {
  region?: string;
  category?: string;
  status?: string;
  search?: string;
  forceRefresh?: boolean;
}): Promise<Trend[]> {
  const query = new URLSearchParams();
  if (params.region) query.append('region', params.region);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.search) query.append('search', params.search);
  if (params.forceRefresh) query.append('force_refresh', 'true');

  const res = await fetch(`${API_BASE}/trends?${query.toString()}`);
  if (!res.ok) throw new Error('Không thể tải danh sách xu hướng');
  return res.json();
}

export async function fetchTrendDetail(trendId: string): Promise<Trend> {
  const res = await fetch(`${API_BASE}/trends/${trendId}`);
  if (!res.ok) throw new Error('Không thể tải thông tin chi tiết xu hướng');
  return res.json();
}

export async function generateContent(payload: {
  trend_id: string;
  platform: string;
  tone: string;
  goal: string;
  custom_angle?: string;
}): Promise<ContentPackage> {
  const res = await fetch(`${API_BASE}/content/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Lỗi khi tạo kịch bản nội dung');
  }
  return res.json();
}

export async function fetchContentHistory(): Promise<ContentPackage[]> {
  const res = await fetch(`${API_BASE}/content/history`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPreferences(): Promise<UserPreferences> {
  const res = await fetch(`${API_BASE}/preferences`);
  if (!res.ok) throw new Error('Không thể tải cài đặt cá nhân');
  return res.json();
}

export async function updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
  const res = await fetch(`${API_BASE}/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Không thể lưu cài đặt cá nhân');
  return res.json();
}

export async function fetchSavedItems(): Promise<SavedItem[]> {
  const res = await fetch(`${API_BASE}/saved`);
  if (!res.ok) return [];
  return res.json();
}

export async function saveItem(payload: {
  item_type: 'trend' | 'draft';
  trend_id?: string;
  draft_id?: string;
  notes?: string;
}): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Không thể lưu mục này');
  return res.json();
}

export async function deleteSavedItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/saved/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Không thể xóa mục đã lưu');
}

export async function trackEvent(eventName: string, properties: Record<string, any> = {}): Promise<void> {
  try {
    await fetch(`${API_BASE}/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: eventName, properties })
    });
  } catch (e) {
    // Non-blocking telemetry
  }
}

export async function fetchDashboard(): Promise<AnalyticsDashboard> {
  const res = await fetch(`${API_BASE}/analytics/dashboard`);
  if (!res.ok) throw new Error('Không thể tải dữ liệu tăng trưởng');
  return res.json();
}

export async function fetchGamification(): Promise<GamificationStats> {
  const res = await fetch(`${API_BASE}/analytics/gamification`);
  if (!res.ok) throw new Error('Không thể tải điểm Trend Hunter');
  return res.json();
}

export async function upgradeTier(tier: string = 'pro'): Promise<{ message: string; tier: string }> {
  const res = await fetch(`${API_BASE}/analytics/upgrade?tier=${tier}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Không thể cập nhật gói Pro');
  return res.json();
}
