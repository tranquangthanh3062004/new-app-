export interface TrendOpportunity {
  id?: string;
  who_should_create: string;
  why_now: string;
  best_platform: string;
  best_format: string;
  best_hook_angle: string;
  production_difficulty: string;
  commercial_relevance: string;
  risk_assessment: string;
}

export interface CreativeIdeaGroup {
  short_video_ideas: string[];
  post_ideas: string[];
  carousel_ideas: string[];
  story_ideas: string[];
  long_form_ideas: string[];
}

export interface Trend {
  trend_id: string;
  canonical_name: string;
  source: string;
  source_url?: string;
  region: string;
  category: string;
  detected_at: string;
  trend_status: 'EMERGING' | 'RISING' | 'PEAK' | 'STABLE' | 'DECLINING' | 'EXPIRED';
  verification_status: 'VERIFIED_TREND' | 'INFERRED_TREND' | 'DATA_UNAVAILABLE';
  search_momentum?: number;
  social_momentum?: number;
  freshness: number;
  competition: number;
  confidence: number;
  opportunity_score: number;
  traffic_estimate?: string;
  why_trending: string;
  signals_breakdown?: Record<string, any>;
  related_topics?: string[];
  target_audience?: string[];
  lifecycle_note?: string;
  opportunities?: TrendOpportunity[];
  creative_ideas?: CreativeIdeaGroup;
}

export interface ScriptSection {
  time: string;
  role: string;
  text: string;
}

export interface HookOption {
  type: string;
  hook: string;
}

export interface RepurposedVariant {
  format?: string;
  caption?: string;
  visual_tip?: string;
}

export interface ContentPackage {
  id?: string;
  trend_id: string;
  user_id?: string;
  platform: string;
  tone: string;
  goal: string;
  title: string;
  hook_options: HookOption[];
  selected_hook: string;
  script_sections: ScriptSection[];
  full_script: string;
  caption: string;
  cta: string;
  hashtags: string[];
  shot_list: string[];
  b_roll_ideas: string[];
  on_screen_text: string[];
  thumbnail_idea: string;
  visual_style: string;
  voice_style: string;
  music_direction: string;
  opportunity_profile: Record<string, string>;
  failure_risks: string;
  share_trigger: string;
  comment_trigger: string;
  differentiation_note: string;
  repurposed_variants: Record<string, RepurposedVariant>;
  created_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  niche: string;
  country: string;
  language: string;
  platforms: string[];
  audience: string;
  tone: string;
  content_goal: string;
  experience_level: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: 'trend' | 'draft';
  trend_id?: string;
  draft_id?: string;
  notes?: string;
  created_at: string;
  trend?: Partial<Trend>;
  draft?: Partial<ContentPackage>;
}

export interface GamificationStats {
  user_id: string;
  tier: string;
  points: number;
  streak_days: number;
  daily_discoveries_count: number;
  daily_generations_count: number;
  max_free_discoveries: number;
  max_free_generations: number;
  level_title: string;
}

export interface AnalyticsDashboard {
  north_star_metric: {
    name: string;
    value: number;
    unit: string;
    trend_delta: string;
  };
  funnel: {
    app_opens: number;
    trend_views: number;
    content_generations: number;
    content_copies_saves: number;
    content_shares: number;
  };
  creator_growth: {
    total_drafts: number;
    streak_days: number;
    trend_hunter_points: number;
    level: string;
  };
  habit_loop: {
    greeting: string;
    headline: string;
    stats_breakdown: {
      rising: number;
      emerging: number;
      evergreen: number;
    };
    best_opportunity: string;
    action_cta: string;
  };
}
