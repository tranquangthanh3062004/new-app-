# TRENDSPARK AI ⚡
> **AI Trend Intelligence + Content Generation + Creator Growth App**

TrendSpark AI transforms raw trend signals into verified content opportunities and production-ready creator assets in under 30 seconds.

```text
REAL DATA (Google Trends & TikTok Signals)
    ↓
TREND DETECTION & VERIFICATION
    ↓
OPPORTUNITY ANALYSIS & DECISION-SUPPORT PROFILE
    ↓
NICHE PERSONALIZATION
    ↓
MULTI-AGENT CONTENT PIPELINE (5 Hooks, 5-part Timestamps, Shot List, Repurposing)
    ↓
SHARING & BOOKMARKING
    ↓
GROWTH ENGINE & GAMIFICATION (Trend Hunter)
```

---

## 🚀 Key Features

### 1. Trend Feed & Discovery Engine
* **Real External Data**: Directly ingests daily rising queries from **Google Trends Daily RSS** (`VN`, `US/Global`) and verified creator format signals from **TikTok Creative Center**.
* **Integrity Guarantee**: Never fabricates search volume or view counts. Clearly labels trends as `VERIFIED_TREND`, `INFERRED_TREND`, or `DATA_UNAVAILABLE`.
* **Decision-Support Progress Indicators**:
  * **Freshness (%)**
  * **Momentum (%)**
  * **Competition / Content Saturation (%)**
  * **Content Opportunity Score (%)**
* **Filters**: Filter by Niche (`Technology`, `Business`, `Finance`, `Education`, `Lifestyle`, etc.), Status (`🔥 Rising Now`, `⚡ Exploding`, `🌱 Emerging`, `📈 Evergreen`), and real-time Search.

### 2. Trend Detail & Deep Intelligence
* **"Why is it trending?"**: Explains genuine underlying signals (Google search spikes, primary news headlines, media sources, creator audio).
* **Trend Lifecycle Assessment**: Evaluates remaining freshness window (24h - 72h).
* **3 Actionable Opportunity Cards**: Who should create this? Why now? Best platform & format? Risk assessment?
* **"What Can You Create?"**:
  * 5 Short Video Ideas (TikTok / Reels / Shorts)
  * 5 Post Ideas (Facebook / LinkedIn)
  * 3 Carousel Ideas
  * 3 Story Ideas
  * 3 Long-Form Ideas

### 3. Multi-Agent AI Content Generator
* **Hook Engine**: 5 distinct hook formulas:
  1. *Curiosity* (Tò mò)
  2. *Contradiction* (Nghịch lý)
  3. *Question* (Câu hỏi xoáy)
  4. *Story* (Câu chuyện thật)
  5. *Challenge* (Thách thức)
* **Structured 5-Timestamp Script**:
  * `0-3 sec`: HOOK
  * `3-8 sec`: CONTEXT
  * `8-25 sec`: CORE VALUE
  * `25-40 sec`: PAYOFF
  * `40-50 sec`: CTA
* **Complete Creator Asset Package**:
  * Camera Shot List
  * B-Roll suggestions
  * On-Screen Text (for sound-off viewers)
  * Thumbnail Concept
  * Visual, Voice, and Music Direction
* **Virality Reality Check**:
  * Decision-support profile (Hook Strength, Novelty, Utility, Platform Fit)
  * **"What could make this fail?"**: Anti-hype reality check preventing common flop mistakes.
  * Share Trigger & Comment Trigger.
  * Creative Differentiation note (anti-copying guarantee).
* **Instant Native Repurposing**: 1-click transformation into dedicated formats for TikTok, Instagram Reel, YouTube Short, Facebook Post, LinkedIn Post, and X Thread.

### 4. Creator Growth & Gamification
* **North Star Metric**: *Weekly Content Opportunities Activated* (Number of trends turned into creator assets over rolling 7 days).
* **Daily Habit Loop**: *"Chào buổi sáng Creator 👋 Hôm nay ngách của bạn có 7 cơ hội tiềm năng..."*
* **Creator Funnel**: App Opens → Trend Views → Content Generations → Saves/Copies → Shares.
* **Trend Hunter Gamification**: Earn XP and level up from *Trend Explorer* 🌱 → *Trend Scout* 🚀 → *Trend Hunter* 🔥 → *Trend Master* ⚡ with daily streaks!

---

## 🛠 Tech Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
* **Backend**: Python 3.14, FastAPI, SQLAlchemy, SQLite, Pydantic, HTTPX, Feedparser.
* **AI & Multi-Agent Architecture**: Provider abstraction supporting Gemini, OpenAI, Groq, or the built-in deterministic creative heuristics engine.

---

## 🏃‍♂️ How to Run Locally

### 1. Start the Backend API:
```bash
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
Backend runs at: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)

### 2. Start the Frontend Application:
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```
Frontend runs at: `http://localhost:5173`

---

## 📁 Project Structure

```text
/home/thanh/project/app new/
├── .env                       # Environment settings & API keys
├── README.md
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point & CORS
│   │   ├── config.py          # App configuration
│   │   ├── database.py        # SQLAlchemy SQLite engine
│   │   ├── models.py          # Data models (Users, Trends, Opportunities, Drafts, Saved, Analytics)
│   │   ├── schemas.py         # Pydantic validation schemas
│   │   ├── adapters/
│   │   │   ├── google_trends.py  # Live Google Trends RSS parser
│   │   │   └── tiktok_trends.py  # TikTok Creative Center signals
│   │   ├── services/
│   │   │   ├── trend_service.py       # Ingestion, normalization, personalized ranking
│   │   │   └── opportunity_service.py # Decision-support calculation
│   │   ├── ai/
│   │   │   ├── llm_provider.py    # LLM abstraction layer
│   │   │   └── content_pipeline.py# 5-stage creator generation pipeline
│   │   └── routers/
│   │       ├── trends.py      # Trend feed & detail APIs
│   │       ├── content.py     # Content generation & history APIs
│   │       ├── preferences.py # Niche personalization APIs
│   │       ├── saved.py       # Bookmarks & saved items APIs
│   │       └── analytics.py   # North star metrics, habit loop, gamification
│   └── data/
│       └── trendspark.db      # SQLite database
└── frontend/
    ├── src/
    │   ├── App.tsx            # Main application layout
    │   ├── api.ts             # API client functions
    │   ├── types.ts           # TypeScript interfaces
    │   ├── index.css          # Tailwind CSS & theme tokens
    │   └── components/
    │       ├── Navbar.tsx             # Header with streak & Trend Hunter badge
    │       ├── BottomNav.tsx          # Mobile bottom navigation
    │       ├── TrendCard.tsx          # Trend card with decision bars
    │       ├── TrendDetailModal.tsx   # Detailed intelligence & 5-tab ideation
    │       ├── ContentGeneratorView.tsx # Creation flow & content asset package
    │       ├── SavedView.tsx          # Saved trends & content history
    │       ├── GrowthView.tsx         # North Star metric, funnel, habit loop
    │       ├── ProfileView.tsx        # Niche & audience personalization
    │       └── Toast.tsx              # Instant feedback notifications
    ├── tailwind.config.js
    └── package.json
```

# new-app-
