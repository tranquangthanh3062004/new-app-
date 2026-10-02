# 📖 TRENDSPARK AI — BẢN GIẢI THÍCH CHI TIẾT TỪNG FILE TRONG TOÀN BỘ DỰ ÁN

Tài liệu này cung cấp cái nhìn chi tiết và toàn diện ở cấp độ **Principal Architect / Senior Engineer** về cấu trúc, vai trò, dữ liệu đầu vào/đầu ra và mối liên hệ giữa **từng file** trong hệ thống **TrendSpark AI**.

---

## 🏗️ 1. TỔNG QUAN KIẾN TRÚC DỰ ÁN (PROJECT ARCHITECTURE)

TrendSpark AI được xây dựng theo nguyên tắc:
```text
DỮ LIỆU THỰC TẾ (Google Trends & TikTok Signals)
    ↓
PHÁT HIỆN & CHUẨN HÓA XU HƯỚNG (Canonical Clustering)
    ↓
ĐÁNH GIÁ CƠ HỘI NỘI DUNG (Opportunity Engine)
    ↓
CÁ NHÂN HÓA THEO NGÁCH CREATOR (Personalization)
    ↓
PIPELINE ĐA AGENT TẠO KỊCH BẢN (5 Hooks, 5-part Timestamps, Shot List, Anti-Hype)
    ↓
CHUYỂN ĐỔI ĐA KÊNH BẢN ĐỊA (Instant Native Repurposing)
    ↓
LƯU TRỮ, CHIA SẺ & THĂNG CẤP (Growth Engine & Gamification)
```

### Cấu Trúc Cây Thư Mục Toàn Bộ Dự Án:
```text
/home/thanh/project/app new/
├── .env                       # File cấu hình môi trường thực tế (Local/Server)
├── .env.example               # File template mẫu cho biến môi trường
├── .gitignore                 # Bỏ qua node_modules, __pycache__, db, env bí mật
├── README.md                  # Hướng dẫn tổng quan và hướng dẫn chạy nhanh
├── PROJECT_EXPLANATION.md     # Bản giải thích chi tiết toàn bộ từng file
├── start.sh                   # Script khởi động 1-click cho cả Backend & Frontend
├── docker-compose.yml         # File phối hợp container hóa Backend và Frontend
├── tests/
│   ├── test_adapters.py       # Kiểm thử tự động Adapter Google Trends & TikTok
│   └── test_pipeline.py       # Kiểm thử tự động Điểm Cơ Hội & Content Pipeline
├── backend/
│   ├── Dockerfile             # Container image cho FastAPI backend
│   ├── requirements.txt       # Danh sách thư viện Python cần thiết
│   ├── data/
│   │   └── trendspark.db      # SQLite database lưu trữ người dùng, xu hướng, draft
│   └── app/
│       ├── __init__.py
│       ├── main.py            # Entry point của FastAPI, cấu hình CORS, khởi tạo DB
│       ├── config.py          # Quản lý cài đặt & nạp biến môi trường
│       ├── database.py        # Cấu hình kết nối SQLAlchemy và Session Local
│       ├── models.py          # Định nghĩa 6 bảng dữ liệu (User, Trend, Draft, Saved...)
│       ├── schemas.py         # Định nghĩa các schema Pydantic xác thực dữ liệu
│       ├── adapters/
│       │   ├── __init__.py
│       │   ├── base.py        # Abstract Base Class chuẩn hóa các nguồn xu hướng
│       │   ├── google_trends.py # Parser RSS Google Trends thời gian thực không cần API key
│       │   └── tiktok_trends.py # Adapter tín hiệu sáng tạo & định dạng viral TikTok
│       ├── services/
│       │   ├── __init__.py
│       │   ├── trend_service.py # Thu thập, gộp cụm, xếp hạng xu hướng cá nhân hóa
│       │   └── opportunity_service.py # Tính toán điểm cơ hội và hồ sơ quyết định
│       ├── ai/
│       │   ├── __init__.py
│       │   ├── llm_provider.py  # Router tích hợp Gemini, OpenAI, Groq & Fallback
│       │   └── content_pipeline.py # Pipeline đa bước tạo kịch bản 5 nhịp thời gian
│       └── routers/
│           ├── __init__.py
│           ├── trends.py      # REST APIs truy vấn danh sách & chi tiết xu hướng
│           ├── content.py     # REST APIs tạo kịch bản, lịch sử, repurposing
│           ├── preferences.py # REST APIs quản lý ngách và cá nhân hóa
│           ├── saved.py       # REST APIs lưu trữ Bookmark và Drafts
│           └── analytics.py   # REST APIs số liệu North Star, Funnel, Gamification
└── frontend/
    ├── Dockerfile             # Multi-stage container image phục vụ web UI
    ├── package.json           # Khai báo dependencies React, TypeScript, Tailwind
    ├── tailwind.config.js     # Cấu hình màu sắc, dark theme, font Plus Jakarta Sans
    ├── postcss.config.js      # Cấu hình plugin xử lý CSS
    ├── tsconfig.json          # Cấu hình TypeScript root
    ├── tsconfig.app.json      # Cấu hình trình biên dịch TypeScript ứng dụng
    ├── index.html             # HTML entry point, meta tags, font & SEO
    └── src/
        ├── main.tsx           # Entry point khởi tạo React DOM
        ├── App.tsx            # Component gốc điều phối trạng thái, tabs & modals
        ├── index.css          # Định nghĩa Tailwind directives và hiệu ứng Glassmorphism
        ├── types.ts           # Định nghĩa Type Interfaces chuẩn hóa dữ liệu Frontend
        ├── api.ts             # API Client giao tiếp HTTP với FastAPI Backend
        └── components/
            ├── Navbar.tsx             # Header hiển thị Logo, Streak, Level, Nút refresh
            ├── BottomNav.tsx          # Thanh điều hướng Bottom Bar chuẩn Mobile-First
            ├── TrendCard.tsx          # Card xu hướng với 4 thanh tiến trình chỉ số
            ├── TrendDetailModal.tsx   # Modal chuyên sâu tín hiệu & 5 nhóm ý tưởng
            ├── ContentGeneratorView.tsx # Màn hình tạo kịch bản & bộ tài sản Creator
            ├── SavedView.tsx          # Quản lý kho xu hướng đã lưu & lịch sử kịch bản
            ├── GrowthView.tsx         # Dashboard tăng trưởng, Funnel & Gamification
            ├── ProfileView.tsx        # Cài đặt ngách, đối tượng mục tiêu, tông giọng
            └── Toast.tsx              # Hệ thống thông báo nổi (Toast Feedback)
```

---

## 🛠️ 2. GIẢI THÍCH CHI TIẾT TỪNG FILE PHÍA BACKEND

### `backend/app/main.py`
- **Tác dụng**: Là điểm vào chính (entry point) của toàn bộ ứng dụng Backend FastAPI.
- **Chi tiết xử lý**:
  - Khởi tạo đối tượng `FastAPI` với thông tin Swagger Docs.
  - Cài đặt `lifespan`: Khi server khởi động, tự động tạo các bảng SQLite (`Base.metadata.create_all`) và chạy quá trình **Warmup Cache** nạp sẵn xu hướng từ Google Trends và TikTok adapter, giúp người dùng mở app là có dữ liệu ngay lập tức (<100ms).
  - Cấu hình `CORSMiddleware`: Cho phép Frontend (Vite chạy cổng 5173 hoặc domain bất kỳ) gọi API mượt mà không bị chặn CORS.
  - Đăng ký (Mount) 5 Routers con: `/api/trends`, `/api/content`, `/api/preferences`, `/api/saved`, `/api/analytics`.
  - Cung cấp route kiểm tra sức khỏe hệ thống: `GET /api/health`.

### `backend/app/config.py`
- **Tác dụng**: Đọc và quản lý tập trung toàn bộ biến môi trường từ file `.env`.
- **Chi tiết xử lý**:
  - Xác định đường dẫn gốc `BASE_DIR`.
  - Nạp các khóa bảo mật: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`.
  - Thiết lập cổng chạy mặc định `PORT=8000`, đường dẫn CSDL SQLite `trendspark.db`, quốc gia mặc định (`VN`) và thời gian sống của bộ nhớ đệm `TREND_CACHE_TTL_MINUTES=30`.

### `backend/app/database.py`
- **Tác dụng**: Quản lý kết nối Database qua SQLAlchemy.
- **Chi tiết xử lý**:
  - Tạo `engine` kết nối tới SQLite (có cờ `check_same_thread=False` để hỗ trợ đa luồng trong FastAPI).
  - Khởi tạo `SessionLocal` để cấp phát phiên làm việc (session) cho mỗi request HTTP thông qua dependency `get_db()`.
  - Định nghĩa lớp cơ sở `Base = declarative_base()` để các Model kế thừa.

### `backend/app/models.py`
- **Tác dụng**: Định nghĩa cấu trúc Schema của Cơ sở dữ liệu quan hệ (ORM Models).
- **Gồm 6 thực thể chính**:
  1. `User`: Quản lý người dùng, hạng tài khoản (`free`/`pro`), số lượt khám phá/tạo nội dung trong ngày, điểm kinh nghiệm `trend_hunter_points`, số ngày duy trì liên tiếp `streak_days`.
  2. `UserPreference`: Lưu ngách nội dung (`niche`), thị trường (`country`), ngôn ngữ (`language`), định dạng nền tảng ưu tiên, đối tượng mục tiêu (`audience`), tông giọng (`tone`).
  3. `Trend`: Lưu thông tin thực thể xu hướng: `canonical_name`, `source`, `region`, `trend_status` (EMERGING, RISING, PEAK, STABLE, DECLINING), `verification_status` (VERIFIED_TREND, INFERRED_TREND), các chỉ số `search_momentum`, `social_momentum`, `freshness`, `competition`, `opportunity_score`, `why_trending`, `signals_breakdown`.
  4. `TrendOpportunity`: Lưu các cơ hội hành động cụ thể gắn với xu hướng (ai nên tạo, lý do tạo ngay, rủi ro, nền tảng tối ưu).
  5. `ContentDraft`: Lưu gói tài sản kịch bản hoàn chỉnh do AI tạo ra (tiêu đề, 5 hooks, script 5 mốc thời gian, shot list, b-roll, text trên màn hình, rủi ro thất bại, biến thể repurposing).
  6. `SavedItem`: Lưu dấu trang các xu hướng hoặc kịch bản mà người dùng muốn lưu lại.
  7. `AnalyticsEvent`: Bản ghi sự kiện theo vết hành vi người dùng phục vụ tính toán Funnel và North Star Metric.

### `backend/app/schemas.py`
- **Tác dụng**: Định nghĩa cấu trúc dữ liệu Pydantic phục vụ kiểm tra tính hợp lệ (Validation) của Request và định dạng Response API trả về cho Frontend.
- **Các Schemas chính**:
  - `TrendSummarySchema` & `TrendDetailSchema`: Trả về dữ liệu tóm tắt trên Feed và chi tiết khi xem Modal.
  - `GenerateContentRequest`: Kiểm tra tham số người dùng gửi lên khi bấm Tạo Kịch Bản (`trend_id`, `platform`, `tone`, `goal`, `custom_angle`).
  - `ContentPackageSchema`: Chuẩn hóa gói tài sản sáng tạo trả về (hooks, script sections, shot list, failure risks...).
  - `UserPreferenceBase` & `UserPreferenceResponse`: Quản lý cá nhân hóa ngách.
  - `GamificationStats`: Trả về điểm kinh nghiệm, level và giới hạn lượt dùng trong ngày.

### `backend/app/adapters/base.py`
- **Tác dụng**: Định nghĩa Interface trừu tượng `BaseTrendAdapter` với phương thức bắt buộc `fetch_trends()`. Đảm bảo mọi nguồn dữ liệu (Google Trends, TikTok, Twitter/X...) đều tuân thủ cùng một chuẩn kiến trúc.

### `backend/app/adapters/google_trends.py`
- **Tác dụng**: Thu thập dữ liệu xu hướng thực tế từ **Google Trends Daily RSS** (`geo=VN` hoặc `geo=US`).
- **Chi tiết xử lý**:
  - Sử dụng thư viện `feedparser` để đọc RSS feed chính thức từ Google.
  - Trích xuất: tiêu đề tìm kiếm, lưu lượng ước tính (`ht_approx_traffic`), bài báo nổi bật liên quan (`ht_news_item_title`), đơn vị báo chí bảo chứng, thời gian ghi nhận.
  - Hàm `infer_category`: Tự động phân loại từ khóa vào các ngành (Technology, Business, Sports, Entertainment, Education, Food...) dựa trên từ khóa ngữ cảnh.
  - Gắn nhãn chuẩn xác `VERIFIED_TREND` (Dữ liệu thực, không tạo số ảo).

### `backend/app/adapters/tiktok_trends.py`
- **Tác dụng**: Cung cấp dữ liệu các định dạng video ngắn, hashtag và thách thức nhà sáng tạo bùng nổ lấy cảm hứng từ TikTok Creative Center cho thị trường Việt Nam & Global.
- **Chi tiết xử lý**:
  - Cung cấp tín hiệu về tốc độ tăng trưởng video, âm thanh nền (sound signals), tỷ lệ giữ chân (retention).
  - Phục vụ việc gợi ý các format video POV, thử nghiệm thực tế 24h và góc nhìn tranh luận.

### `backend/app/services/trend_service.py`
- **Tác dụng**: Lõi xử lý logic xu hướng (Business Logic Layer).
- **Chi tiết xử lý**:
  - `fetch_and_sync_trends()`: Gọi đồng thời Google Trends & TikTok adapters, gộp cụm chuẩn hóa (Canonical Clustering), đồng bộ vào database và duy trì bộ nhớ đệm (Cache) trong 30 phút.
  - `rank_personalized_trends()`: Áp dụng thuật toán xếp hạng cá nhân hóa:
    $$\text{Score} = \text{Base Opportunity} + \text{Niche Match Boost} + (0.15 \times \text{Freshness}) + (0.20 \times \text{Momentum})$$
    Nhờ đó người làm công nghệ sẽ thấy xu hướng AI lên đầu, người làm tài chính sẽ thấy xu hướng đầu tư lên đầu.
  - `generate_trend_creative_ideas()`: Tự động phân nhánh 5 nhóm ý tưởng (5 Short Video, 5 Post, 3 Carousel, 3 Story, 3 Long-form) cho từng xu hướng.

### `backend/app/services/opportunity_service.py`
- **Tác dụng**: Động cơ tính toán "Điểm Cơ Hội Nội Dung" (Trend Opportunity Engine).
- **Chi tiết xử lý**:
  - Không đồng nhất giữa "lượng tìm kiếm cao" với "cơ hội tốt". Một chủ đề quá bão hòa sẽ bị trừ điểm cạnh tranh.
  - Tính toán các chỉ số quyết định: Động lượng (30%), Độ tươi mới (25%), Nghịch đảo độ bão hòa (20%), Tính thương mại (15%), Độ dễ sản xuất (10%).
  - Tạo 3 kịch bản cơ hội hành động rõ ràng: ai nên làm, tại sao nên làm ngay bây giờ và phân tích rủi ro.

### `backend/app/ai/llm_provider.py`
- **Tác dụng**: Lớp trừu tượng hóa mô hình ngôn ngữ lớn (Model Abstraction Layer).
- **Chi tiết xử lý**:
  - Kiểm tra các khóa API trong môi trường: hỗ trợ Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), Groq.
  - Nếu có API key: gọi trực tiếp qua HTTP Client bất đồng bộ (`httpx`).
  - Nếu không có API key hoặc mạng ngoài gặp sự cố: chuyển hướng tự động sang **Agentic Creative Engine** tích hợp sẵn, đảm bảo hệ thống luôn phản hồi thành công và không bao giờ bị gián đoạn.

### `backend/app/ai/content_pipeline.py`
- **Tác dụng**: Triển khai Pipeline đa bước kiến tạo gói nội dung Creator chuẩn chỉnh.
- **Chi tiết xử lý**:
  - **Hook Engine**: Sinh ra 5 loại Hook chuyên biệt:
    1. *Curiosity* (Kích thích sự tò mò)
    2. *Contradiction* (Nghịch lý phản trực giác)
    3. *Question* (Câu hỏi xoáy trúng nỗi đau)
    4. *Story* (Câu chuyện trải nghiệm thật)
    5. *Challenge* (Thử thách hành động)
  - **Script Engine (5 Mốc Thời Gian Chuẩn Video Ngắn)**:
    - `0-3 sec`: HOOK giữ chân
    - `3-8 sec`: CONTEXT ngữ cảnh bùng nổ
    - `8-25 sec`: CORE VALUE 3 giá trị thực chiến
    - `25-40 sec`: PAYOFF kết quả khác biệt
    - `40-50 sec`: CTA kêu gọi bình luận / lưu video
  - **Creator Production Package**: Tạo Shot List góc quay máy ảnh, B-roll gợi ý, Text hiện trên màn hình, ý tưởng Thumbnail, phong cách giọng đọc và âm nhạc.
  - **Virality Reality Check**: Phân tích lý do "Điều gì có thể khiến video này thất bại?" để người sáng tạo tránh mắc lỗi flop.
  - **Native Repurposing**: Tự động chuyển đổi bản địa hóa nội dung cho Instagram Reel, YouTube Short, Facebook Post, LinkedIn Post và X Thread.

### `backend/app/routers/trends.py`
- **Tác dụng**: Cung cấp API endpoint phục vụ màn hình Khám Phá Xu Hướng.
- **Routes**:
  - `GET /api/trends`: Nhận bộ lọc `region`, `category`, `status`, `search` và trả về danh sách xu hướng đã xếp hạng theo độ ưu tiên của người dùng.
  - `GET /api/trends/{id}`: Trả về phân tích chuyên sâu của 1 xu hướng cụ thể cùng 5 nhóm ý tưởng sáng tạo.
  - `POST /api/trends/refresh`: Kích hoạt việc làm mới dữ liệu từ các nguồn bên ngoài theo yêu cầu.

### `backend/app/routers/content.py`
- **Tác dụng**: Cung cấp API endpoint phục vụ tạo kịch bản, xem lịch sử và chuyển đổi định dạng.
- **Routes**:
  - `POST /api/content/generate`: Chạy pipeline tạo kịch bản, kiểm tra hạn mức gói Free (3-10 lượt/ngày), lưu bản nháp vào DB và cộng điểm thưởng Trend Hunter (+25 XP).
  - `GET /api/content/history`: Lấy toàn bộ danh sách các kịch bản đã tạo kèm đầy đủ timestamps và shot list.
  - `POST /api/content/repurpose`: Lấy bản chuyển đổi bản địa hóa cho nền tảng mạng xã hội mục tiêu.

### `backend/app/routers/preferences.py`
- **Tác dụng**: Quản lý hồ sơ Creator và cá nhân hóa.
- **Routes**:
  - `GET /api/preferences`: Lấy thông tin ngách, đối tượng khán giả và tông giọng hiện tại.
  - `PUT /api/preferences`: Cập nhật cài đặt mới, lập tức kích hoạt tính toán lại độ ưu tiên trên Trend Feed.

### `backend/app/routers/saved.py`
- **Tác dụng**: Quản lý kho lưu trữ dấu trang (Bookmarks).
- **Routes**:
  - `GET /api/saved`: Trả về danh sách các xu hướng và bản nháp kịch bản đã được đánh dấu lưu.
  - `POST /api/saved`: Lưu một xu hướng hoặc bản nháp mới (cộng +10 XP cho người dùng).
  - `DELETE /api/saved/{id}`: Xóa mục đã lưu khỏi danh sách.

### `backend/app/routers/analytics.py`
- **Tác dụng**: Quản lý số liệu tăng trưởng, thói quen hàng ngày và Gamification.
- **Routes**:
  - `POST /api/analytics/event`: Ghi nhận sự kiện hành vi (`app_open`, `trend_view`, `content_copy`, `content_share`).
  - `GET /api/analytics/dashboard`: Tính toán chỉ số Bắc Đẩu (*Weekly Content Opportunities Activated*), tỷ lệ chuyển đổi qua các tầng Funnel và câu chào Daily Habit Loop.
  - `GET /api/analytics/gamification`: Lấy cấp độ Trend Hunter, chuỗi ngày liên tiếp (Streak) và điểm XP.
  - `POST /api/analytics/upgrade`: Chuyển đổi trạng thái demo giữa gói Free và gói Pro.

---

## 💻 3. GIẢI THÍCH CHI TIẾT TỪNG FILE PHÍA FRONTEND

### `frontend/src/main.tsx`
- **Tác dụng**: Điểm khởi đầu của ứng dụng React. Nạp file `index.css` và render component `App` vào phần tử DOM `#root`.

### `frontend/src/App.tsx`
- **Tác dụng**: Component trung tâm (Root Orchestrator) quản lý toàn bộ luồng tương tác của người dùng.
- **Chi tiết xử lý**:
  - Quản lý tab hiện tại thông qua state `currentTab` (`trends`, `create`, `saved`, `growth`, `profile`).
  - Nạp dữ liệu đồng thời khi khởi động: Xu hướng, Cài đặt cá nhân, Mục đã lưu, Lịch sử kịch bản, Dashboard tăng trưởng.
  - Tích hợp Debounce tìm kiếm (250ms) giúp tìm kiếm mượt mà khi người dùng gõ từ khóa.
  - Điều phối chuyển đổi nhanh: khi bấm "Tạo kịch bản" từ một thẻ xu hướng bất kỳ, tự động chuyển sang tab `create` và điền sẵn thông tin xu hướng đó.
  - Quản lý hiển thị Modal chi tiết xu hướng `activeModalTrend` và thông báo nổi Toast.

### `frontend/src/types.ts`
- **Tác dụng**: Chứa toàn bộ các Interface và Type trong TypeScript (`Trend`, `TrendOpportunity`, `ContentPackage`, `ScriptSection`, `HookOption`, `UserPreferences`, `SavedItem`, `GamificationStats`, `AnalyticsDashboard`). Đảm bảo kiểu dữ liệu chặt chẽ (Type Safety) giữa Frontend và Backend.

### `frontend/src/api.ts`
- **Tác dụng**: Đóng gói các hàm gọi API HTTP (Fetch Client) kết nối với Backend tại cổng `8000`. Cung cấp các hàm bất đồng bộ rõ ràng: `fetchTrends`, `fetchTrendDetail`, `generateContent`, `fetchPreferences`, `saveItem`, `trackEvent`, `fetchDashboard`...

### `frontend/src/index.css`
- **Tác dụng**: Định nghĩa nền tảng giao diện:
  - Nạp Google Font: **Plus Jakarta Sans** (hiện đại, năng động, chuẩn thương hiệu Creator).
  - Khai báo các directives `@tailwind base`, `@tailwind components`, `@tailwind utilities`.
  - Định nghĩa thanh cuộn tùy biến (Custom Scrollbar siêu mỏng, tối màu).
  - Định nghĩa các lớp hiệu ứng kính mờ cao cấp (`.glass-panel`, `.glass-panel-hover`) và đổ bóng màu neon (`badge-glow-fire`, `badge-glow-cyan`).

### `frontend/tailwind.config.js`
- **Tác dụng**: Cấu hình Design System cho Tailwind CSS:
  - Bật chế độ `darkMode: 'class'`.
  - Mở rộng bảng màu:
    - Nhóm `brand`: Tím điện tử `#8b5cf6` đến `#4c1d95`, xanh cyan neon `#06b6d4`, cam lửa `#ff5722`, vàng kim `#f59e0b`.
    - Nhóm `dark`: Nền `#090a0f`, bề mặt thẻ `#11131a`, viền `#232736`.
  - Cấu hình keyframes chuyển động ánh sáng glow và hiệu ứng pulse tinh tế.

### `frontend/src/components/Navbar.tsx`
- **Tác dụng**: Thanh tiêu đề trên cùng (Sticky Header).
- **Thành phần**:
  - Logo TrendSpark AI với icon tia sét và badge AI nổi bật.
  - Nút làm mới dữ liệu nhanh (có hiệu ứng xoay khi đang kéo dữ liệu mới từ Google Trends).
  - Huy hiệu Gamification: Hiển thị số ngày Streak liên tiếp (ví dụ: `🔥 2d`) và tổng điểm tích lũy (`85 pts`).
  - Huy hiệu hiển thị Ngách nội dung hiện tại và loại gói tài khoản (`FREE` hoặc `PRO`).

### `frontend/src/components/BottomNav.tsx`
- **Tác dụng**: Thanh điều hướng chuẩn Mobile-First cố định ở đáy màn hình.
- **Gồm 5 nút chuyển tab nhanh**:
  1. `🔥 Xu hướng` (Trends Feed)
  2. `✨ Tạo kịch bản` (Content Generator)
  3. `💾 Đã lưu` (Saved & History - có badge đếm số lượng mục đã lưu)
  4. `📊 Tăng trưởng` (Growth & Gamification)
  5. `👤 Cá nhân` (Profile & Niche)

### `frontend/src/components/TrendCard.tsx`
- **Tác dụng**: Thẻ hiển thị xu hướng trên bảng tin Khám Phá.
- **Thành phần**:
  - Badge trạng thái trực quan: Đang bùng nổ (🔥 RISING), Mới chớm nở (🌱 EMERGING), Đỉnh điểm (⚡ PEAK).
  - Huy hiệu bảo chứng dữ liệu: `Xác thực` (VERIFIED_TREND từ nguồn chính thức).
  - Tên xu hướng chuẩn hóa, kèm nguồn gốc (Google Trends VN, TikTok).
  - Lưu lượng tìm kiếm ước tính thực tế (ví dụ: `500+ lượt tìm kiếm`, `Top 1% Tăng trưởng`).
  - **4 thanh tiến trình chỉ số quyết định**: Độ tươi mới (%), Động lượng (%), Độ cạnh tranh (%), Điểm cơ hội nội dung (%).
  - Đoạn trích dẫn "Tại sao hot?".
  - 2 nút hành động chính: *Chi tiết xu hướng* (Mở modal) và *Tạo kịch bản* (Chuyển nhanh sang bộ tạo).

### `frontend/src/components/TrendDetailModal.tsx`
- **Tác dụng**: Cửa sổ bật lên phân tích chuyên sâu xu hướng.
- **Thành phần**:
  - Trình bày toàn diện lý do xu hướng bùng nổ và các tín hiệu bảo chứng từ báo chí / công cụ tìm kiếm.
  - Link bấm trực tiếp tới nguồn gốc (Google Trends Explore).
  - Lưới 6 chỉ số hỗ trợ quyết định: Động lượng, Độ tươi mới, Độ bão hòa, Điểm cơ hội, Độ khó sản xuất, Chu kỳ sống (24-72h).
  - 3 thẻ cơ hội hành động cụ thể (Ai nên làm, gợi ý hook, phân tích rủi ro).
  - **Bộ gợi ý 5 nhóm định dạng sáng tạo**:
    - 5 Ý tưởng video ngắn (TikTok/Reels)
    - 5 Ý tưởng bài viết (Facebook/LinkedIn)
    - 3 Ý tưởng Carousel
    - 3 Ý tưởng Story tương tác
    - 3 Ý tưởng dài hạn (YouTube 10 phút, Podcast, Case Study)
  - Nút bấm trực tiếp vào bất kỳ góc ý tưởng nào để chuyển sang tạo kịch bản ngay.

### `frontend/src/components/ContentGeneratorView.tsx`
- **Tác dụng**: Trung tâm sáng tạo nội dung của TrendSpark AI.
- **Quy trình tương tác**:
  - Bước 1: Chọn xu hướng mục tiêu (tự động chọn xu hướng đã xem).
  - Bước 2: Chọn nền tảng (TikTok, Instagram Reel, YouTube Short, Facebook, LinkedIn, Blog).
  - Bước 3: Chọn phong cách / tông giọng (Học thuật, Kể chuyện, Mạnh mẽ, Hài hước, Thử nghiệm...).
  - Bước 4: Chọn mục tiêu (Tương tác, Tăng follow, Lượt xem, Bán hàng...).
  - Bước 5: Thêm góc thử nghiệm cá nhân (tùy chọn).
  - Bấm nút lớn: **✨ TẠO GÓI NỘI DUNG CREATOR**.
  - Hiển thị hoạt họa quy trình đa Agent (Phân tích đối tượng → Hook Engine → Cấu trúc 5 nhịp → Kiểm tra rủi ro flop).
- **Kết quả hiển thị sau khi tạo**:
  - Tiêu đề bắt mắt.
  - **Bộ chọn 5 công thức Hook**: Cho phép bấm đổi giữa Tò mò, Nghịch lý, Câu hỏi xoáy, Câu chuyện, Thách thức với bản xem trước cập nhật ngay.
  - **Kịch bản 5 mốc thời gian** (`0-3s`, `3-8s`, `8-25s`, `25-40s`, `40-50s`).
  - Hộp Caption, Lời kêu gọi hành động (CTA) và danh sách Hashtags.
  - Gói phân cảnh máy quay (Shot List), B-roll footage, chữ hiện trên màn hình, ý tưởng thumbnail, hướng dẫn nhạc nền.
  - **Kiểm tra rủi ro thất bại (Anti-Hype)**: Liệt kê rõ các nguyên nhân khiến video có thể bị flop.
  - Động cơ kích thích chia sẻ (Share Trigger) và bình luận (Comment Trigger).
  - Công thức chống sao chép rập khuôn (Anti-Copying Formula).
  - **Bộ chuyển đổi đa kênh (Instant Native Repurposing)**: Chuyển tab xem ngay phiên bản chuẩn hóa riêng cho Instagram, LinkedIn, YouTube, X Thread với 1 nút bấm sao chép.

### `frontend/src/components/SavedView.tsx`
- **Tác dụng**: Kho lưu trữ cá nhân của Creator.
- **Thành phần**:
  - Tab 1: Danh sách các xu hướng đã lưu để theo dõi sau, có nút bấm nhanh "Tạo kịch bản" hoặc xóa khỏi danh sách.
  - Tab 2: Toàn bộ lịch sử các kịch bản đã tạo, lưu giữ đầy đủ cấu trúc 5 mốc thời gian, ngày tạo, nút sao chép nhanh vào clipboard.

### `frontend/src/components/GrowthView.tsx`
- **Tác dụng**: Bảng điều khiển đo lường tăng trưởng và game hóa thói quen sáng tạo.
- **Thành phần**:
  - **Thẻ Daily Habit Loop**: Câu chào buổi sáng thông minh nhắc nhở số cơ hội bùng nổ trong ngày và đề xuất cơ hội tốt nhất để hành động ngay.
  - **Chỉ số Bắc Đẩu (North Star Metric)**: *Weekly Content Opportunities Activated* (Số kịch bản kích hoạt từ xu hướng trong 7 ngày gần nhất).
  - **Cấp độ Trend Hunter**: Thanh tiến trình XP, cấp độ huy hiệu (*Trend Explorer* 🌱, *Trend Scout* 🚀, *Trend Hunter* 🔥, *Trend Master* ⚡) và chuỗi ngày duy trì liên tiếp.
  - **Phễu chuyển đổi sáng tạo (Creator Funnel)**: Đo lường từ lúc mở app → xem xu hướng → tạo kịch bản → lưu/sao chép → chia sẻ.
  - **Mô hình Freemium**: So sánh quyền lợi gói Free và Pro, kèm nút kích hoạt dùng thử gói Pro cho demo.

### `frontend/src/components/ProfileView.tsx`
- **Tác dụng**: Cài đặt cá nhân hóa ngách Creator.
- **Thành phần**:
  - Chọn ngách chính: Công nghệ, AI, Kinh doanh, Tài chính, Giáo dục, Đời sống, Ẩm thực, Du lịch, Thể hình, Giải trí, Thời trang, Gaming.
  - Chọn thị trường quốc gia (`VN` hoặc `US/Global`) và ngôn ngữ kịch bản (`vi` hoặc `en`).
  - Mô tả đối tượng khán giả mục tiêu, tông giọng ưa chuộng và trình độ kinh nghiệm.
  - Bấm "Lưu Cài Đặt Cá Nhân Hóa" sẽ ngay lập tức xếp hạng lại bảng tin xu hướng theo đúng sở thích của Creator.

### `frontend/src/components/Toast.tsx`
- **Tác dụng**: Hiển thị các thông báo nổi tinh tế ở góc màn hình khi người dùng sao chép kịch bản, lưu xu hướng thành công hoặc gặp lỗi kết nối. Tự động biến mất sau 3.5 giây.

---

## 🧪 4. KIỂM THỬ VÀ DEVOPS (TESTING & CONTAINERIZATION)

### `tests/test_adapters.py`
- Kiểm thử tự động tính năng tự động phân loại ngành từ khóa của Google Trends (`infer_category`).
- Kiểm thử cấu trúc dữ liệu trả về từ `TikTokTrendsAdapter` và `GoogleTrendsAdapter`, đảm bảo trường `verification_status` luôn có giá trị hợp lệ.

### `tests/test_pipeline.py`
- Kiểm thử thuật toán tính điểm cơ hội `calculate_opportunity_score` (đảm bảo điểm số luôn nằm trong biên độ 40–99).
- Kiểm thử hàm sinh kịch bản `generate_creator_content_pipeline`, xác thực luôn sinh đủ 5 loại Hook, 5 mốc thời gian kịch bản và đầy đủ biến thể Repurposing.

### `backend/Dockerfile` & `frontend/Dockerfile`
- Đóng gói Backend chạy trên nền Python 3.14 slim siêu nhẹ.
- Đóng gói Frontend với kỹ thuật Multi-stage build (Node 22 build code tĩnh và chạy với `serve` siêu tốc).

### `docker-compose.yml`
- Cho phép chạy toàn bộ hệ sinh thái TrendSpark AI chỉ với một lệnh duy nhất:
  ```bash
  docker-compose up --build
  ```

### `start.sh`
- Script Shell tự động kiểm tra file `.env`, khởi chạy đồng thời Backend FastAPI (cổng 8000) và Frontend Vite (cổng 5173) trong môi trường phát triển local.

---

## 🎯 5. TỔNG KẾT GIÁ TRỊ CỐT LÕI

Hệ thống được thiết kế theo đúng triết lý:
1. **Dữ liệu thật, không số liệu bịa đặt**: Dùng RSS chính thức của Google Trends và tín hiệu sáng tạo của TikTok.
2. **Không hứa hẹn viển vông**: Bổ sung bộ lọc kiểm tra rủi ro thất bại (Anti-Hype Failure Check).
3. **Không sao chép nội dung**: Định hướng góc nhìn thử nghiệm thực tế và độc bản cho từng ngách.
4. **Chuẩn chất lượng Senior**: Code rõ ràng, module hóa cao, xử lý ngoại lệ chu đáo và có sẵn bộ kiểm thử tự động.
