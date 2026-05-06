# Samachar Hub - Project TODO

## Phase 1: Schema & Design System
- [x] Design system: CSS variables, fonts (Inter + Tiro Devanagari Nepali), color palette
- [x] Database schema: articles, categories, comments, bookmarks, newsletter_subscribers
- [x] Run migrations

## Phase 2: Backend API
- [x] Articles router: list, get, create, update, delete, featured, breaking, trending
- [x] Categories router: list, get, create, update, delete
- [x] Comments router: list, create, approve, delete
- [x] Bookmarks router: add, remove, list
- [x] Search router: full-text search across articles
- [x] Newsletter router: subscribe, list
- [x] Admin procedures with role-based access control
- [x] Image upload via S3 storage
- [x] AI summary generation via LLM

## Phase 3: Frontend Core
- [x] Global design tokens and CSS (dark mode, light mode)
- [x] Language context (English/Nepali toggle)
- [x] Sticky navigation bar with logo, categories, search, language toggle, dark mode, auth
- [x] Breaking news ticker with auto-scroll
- [x] Homepage hero section (featured article)
- [x] Homepage grid layout (latest news)
- [x] Sidebar (trending + ad placeholders)
- [x] Footer (about, contact, social links, newsletter)

## Phase 4: Article & Category Pages
- [x] Article detail page with full content
- [x] AI summary display on article page
- [x] Related articles section
- [x] Social sharing buttons (Facebook, Twitter/X, WhatsApp, copy link)
- [x] Bookmark/save functionality
- [x] YouTube embed support in articles
- [x] Comment section (view + post)
- [x] Category pages with filtering
- [x] Search results page
- [x] Pagination on listings

## Phase 5: Admin CMS Panel
- [x] Admin layout with sidebar navigation
- [x] Dashboard overview (stats: articles, comments, subscribers, views)
- [x] Article CRUD: create, edit, delete with image upload
- [x] Breaking news tagging from admin
- [x] Scheduled post publishing
- [x] Category management (create, edit, delete)
- [x] Comment moderation (approve, reject, delete)
- [x] Multi-author support (manage users/journalists)
- [x] Sponsored post marking
- [x] Featured article toggle

## Phase 6: Advanced Features
- [x] AI-generated article summary (LLM integration)
- [x] Newsletter subscription (email input + backend)
- [x] SEO meta tags on all pages (OG, Twitter Card, JSON-LD)
- [x] Google AdSense-ready ad placement slots (header, sidebar, in-article)
- [x] Dark mode global toggle (persisted)
- [x] Language toggle (English/Nepali) across entire site (persisted)
- [x] Trending topics section

## Phase 7: Polish & Delivery
- [x] Seed demo articles (12) and categories (8)
- [x] Vitest unit tests (17 tests passing)
- [x] TypeScript errors resolved
- [x] Save checkpoint
