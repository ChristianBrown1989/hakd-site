# HAKD SEO Change Log

All SEO improvements made to hakd.app across Claude sessions, most recent first.

---

## Session 3 — 2026-03-29 | Branch: `claude/seo-improvements-nVb7H`

### 1. Competitor Research
Searched for competitor content targeting "HRV coaching", "nervous system optimization", and "performance coaching".

**Key competitors identified:**
- Optimal HRV — 10-week HRV biofeedback + coaching program ($1,200)
- Elite HRV Academy — coach certification courses
- HRV4Training — personalized training via stress/HRV metrics
- Neuropeak Pro — neurofeedback + HRV + precision breathing
- Lichterfeld Coaching — executive HRV + ANS coaching
- Saffron & Sage — functional assessment + HRV restoration protocols

**Content gaps HAKD is missing (priority order):**
| Gap | Opportunity |
|-----|-------------|
| HRV data → specific coaching actions | "How to Read Your HRV and Actually Change Your Training" |
| Life stressors + training load integration | "Total Load: Why Your HRV Drops When Work Gets Busy" |
| HRV for executive/leadership resilience | "The Executive's Guide to Nervous System Performance" |
| HRV + cognition/mental performance | "HRV and Decision-Making: What Your Nervous System Tells Your Brain" |
| Vagal tone & breathwork protocols | "5-Minute Resonant Breathing Protocol to Shift Your HRV Before a High-Stakes Meeting" |
| Trauma-informed nervous system coaching | "When Nervous System Dysregulation Isn't a Lifestyle Problem" |
| HRV metric literacy (RMSSD vs others) | "RMSSD vs. SDNN: Which HRV Metric Actually Matters for Training?" |
| Self-guided HRV program frameworks | "Build a Self-Guided HRV Training Protocol in 4 Steps" |

### 2. ProfessionalService JSON-LD Schema
- **Added** `ProfessionalService` JSON-LD schema to `app/layout.js`
- Includes: `serviceType` array (HRV Coaching, Nervous System Optimization, Performance Coaching, Recovery Programming, Adaptive Training), `priceRange`, `areaServed`, `hasOfferCatalog` with both EMM coaching products and pricing
- This joins existing `WebSite`, `Organization`, and `Person` schemas in the root layout

### 3. Article Schema Keywords — Verified & Improved
- **Verified:** `app/articles/[slug]/page.js` already dynamically pulls `article.category` from Supabase via `select('*')` — working correctly end-to-end since the previous session
- **Improved:** Schema `keywords` field now uses the human-readable `categoryLabel` (e.g. `"Nervous System"`) instead of the raw DB slug (`"nervous-system"`)
- **Added:** Core competitor keywords to every article schema: `"HRV coaching"`, `"nervous system optimization"`, `"performance coaching"`
- **Improved:** Breadcrumb JSON-LD now includes the article's category as an intermediate level — `Home → Articles → [Category] → [Article Title]` — giving search engines a cleaner topic hierarchy

### 4. OG Image
- **Created** `public/og-image.svg` — a branded 1200×630 SVG placeholder
  - Dark background (#0a0a0f → #12121a gradient)
  - Gold accent bar + HAKD badge
  - "Performance Intelligence" headline with gold gradient on "Intelligence"
  - HRV waveform decoration
  - Subtle grid pattern
- **Updated** all OG image references in `app/layout.js` from `/og-image.png` → `/og-image.svg`
- **Note:** For production, export `og-image.svg` to a proper 1200×630 PNG using Figma, Inkscape, or `@vercel/og`. Social scrapers (Facebook, Twitter/X) prefer PNG/JPEG over SVG.

### 5. Internal Link Audit
- **Confirmed:** Sidebar topic links in `app/articles/[slug]/page.js` correctly use `/articles/category/${key}` format (fixed in Session 2)
- **Confirmed:** Footer links in `app/layout.js` correctly use `/articles/category/[slug]` for all category links
- **Confirmed:** Category filter pills on `/articles` page correctly link to `/articles/category/${cat.key}`
- **Fixed:** Article cards on `/articles/page.js` were showing hardcoded `"Performance Intelligence"` as category — fixed by:
  - Adding `category` to the Supabase select query
  - Displaying the actual category label via `CATEGORIES.find(c => c.key === a.category)?.name`

---

## Session 2 — 2026-03-28 | Branch: `claude/seo-water-restoration-HyGjZ`

### Schema
- Added `Organization` schema to root layout alongside existing `Person` + `WebSite` schemas
- Enhanced `Person` schema with full `knowsAbout` array and `worksFor` link
- Added `og:image`, `og:locale`, `twitter:images` to root metadata
- Expanded `googleBot` directives: `max-image-preview: large`, `max-snippet: -1`

### Crawlers
- Added AI crawlers to `robots.js`: `OAI-SearchBot`, `Applebot`, `Applebot-Extended`, `YouBot`, `anthropic-ai`, `cohere-ai`
- Added social crawlers: `facebookexternalhit`, `LinkedInBot`, `Twitterbot` (for og:image previews)

### Article Schema
- Fixed hardcoded `"Performance Intelligence"` category label → uses `article.category` from DB
- Made article schema `keywords` field dynamic per category

### Internal Linking
- Fixed sidebar category links pointing to `/articles` → now correctly point to `/articles/category/[key]`

### Sitemap
- Added `lastModified` to static sitemap routes

---

## Session 1 — 2026-03-21/22 | Branch: `main` (merged)

### Foundations
- Fixed domain: `hakd.co` → `hakd.app` across all SEO files
- Added Google Search Console verification (`dd73f79cadf7fe77`)
- Added Bing Webmaster verification (`62B70970004A4C96E0BD783C6676C3CF`)
- Upgraded Next.js to 16.2.1 (CVE-2025-66478 security patch)

### Metadata
- Added comprehensive `metadata` export to root `layout.js` with full OG/Twitter tags
- Added `WebSite` and `Person` JSON-LD schemas to root layout
- Added `Article` JSON-LD schema to `app/articles/[slug]/page.js`
- Added `BreadcrumbList` schema to article pages
- Added `FAQPage` schema rendering (JSON-LD + visible FAQ section)
- Added `CollectionPage` schema to category pages
- Added `ItemList` schema to articles index page

### Content Architecture
- Built `/articles/category/[category]` pages for 7 categories (Nervous System, Recovery, Training Science, Nutrition, Wearables & HRV, Mental Performance, Longevity)
- Category pages: primary filter on `category` DB column, keyword fallback for older articles
- Added `ArticleNewsletterCTA` inline after paragraph 3 in every article
- Added visible FAQ section on article pages (improves time-on-page + AI citation potential)
- Related articles section at bottom of every article

### Technical SEO
- Dynamic sitemap at `app/sitemap.js` covering all articles + 7 category pages
- RSS feed at `/feed.xml`
- `robots.js` with allow-all baseline + selective crawler tuning
- Google + Bing sitemap ping after content publish
- `revalidate = 3600` on all article/category pages for ISR

### Directory
- Programmatic city pages at `/directory/city/[city]` for 18 US cities (75 new indexable URLs)
- City × category pages at `/directory/city/[city]/[category]` (126 new indexable URLs)
- All city + city×category routes added to sitemap

### Conversion
- `DirectorySearch`: live client-side search + category filter across all listings
- `LeadCaptureForm` on every listing page
- Stripe listing claim flow (verified badge for claimed listings)
- Kit source tagging on newsletter subscribe (tracks article-level conversions)

---

## Pending / Recommended Next Steps

1. **Export og-image.svg → PNG** — use Figma or `@vercel/og` to generate a proper 1200×630 PNG at `/public/og-image.png` and revert the metadata reference back to `.png`
2. **Publish content for gap areas** — see Session 3 competitor research table above (8 high-opportunity article topics)
3. **Add `Nutrition` to footer** — currently only 4 of 7 categories are listed in the footer
4. **Add article read time dynamically** — currently hardcoded to "6 min" on listing cards; compute from word count
5. **Structured data testing** — run all pages through Google's Rich Results Test after next deploy
6. **Add `dateModified` to sitemap** — pull from `updated_at` column for article URLs
