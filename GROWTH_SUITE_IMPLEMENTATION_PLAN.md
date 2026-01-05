# 🚀 GROWTH SUITE IMPLEMENTATION PLAN

**Project**: MediaPlanPro - Growth Suite Integration  
**Date**: October 9, 2025  
**Status**: 📋 **PLANNING PHASE**

---

## 📊 **CURRENT STATUS: MEDIAPLANPRO**

### **✅ Phase 3 Testing Complete**
- **Total Pages**: 41/41 (100%)
- **Design Compliance**: 100%
- **TypeScript Errors**: 0
- **Runtime Errors**: 0
- **Status**: ✅ **PRODUCTION-READY**

### **Documentation Created**
1. ✅ DESIGN_AUDIT_REPORT.md
2. ✅ DESIGN_IMPLEMENTATION_SUMMARY.md
3. ✅ DESIGN_AUDIT_COMPLETION_REPORT.md
4. ✅ PHASE_2_COMPLETION_SUMMARY.md
5. ✅ PHASE_3_COMPLETION_SUMMARY.md
6. ✅ BROWSER_TESTING_CHECKLIST.md
7. ✅ TESTING_SUMMARY.md

---

## 🎯 **GROWTH SUITE OVERVIEW**

### **Purpose**
Integrate a comprehensive "Growth Suite" as a new feature section within MediaPlanPro to provide marketers with advanced tools for experimentation, attribution, SEO, content repurposing, conversion optimization, and competitive analysis.

### **Integration Strategy**
- **Approach**: Add Growth Suite as a new section within existing MediaPlanPro
- **Architecture**: Leverage existing auth, database, and design system
- **Navigation**: Add "Growth Suite" to main navigation
- **Access**: Available to authenticated users (free tier + paid tiers)

---

## 🛠️ **GROWTH SUITE TOOLS (7 TOOLS)**

### **1. Experiment Builder** (Highest Priority)
**Purpose**: A/B testing and experimentation platform

**Features**:
- Visual editor to select DOM elements
- Create experiments with variants and traffic splits
- Real-time stats (conversions, uplift, Bayesian + frequentist)
- GrowthBook integration OR custom flagging engine
- GA4 event integration
- One-click install snippet

**Tech Stack**:
- Frontend: React + TypeScript
- Backend: Serverless functions
- DB: PostgreSQL (experiments table)
- Integration: GrowthBook OSS or custom

**Pages to Create**:
- `/growth-suite/experiments` - List experiments
- `/growth-suite/experiments/create` - Create new experiment
- `/growth-suite/experiments/[id]` - Experiment details & stats
- `/growth-suite/experiments/[id]/edit` - Edit experiment

---

### **2. Attribution Explorer**
**Purpose**: Multi-touch attribution modeling

**Features**:
- Ingest events from GA4, HubSpot, webhooks
- Session stitching with UTM params
- Toggle attribution models (first-touch, last-touch, linear, position-based)
- Sankey visualization
- CSV export with revenue credit
- 90-day data retention (free tier)

**Tech Stack**:
- Frontend: React + Recharts (Sankey)
- Backend: Event ingestion API
- DB: PostgreSQL (events, sessions tables)
- Integrations: GA4 API, HubSpot API

**Pages to Create**:
- `/growth-suite/attribution` - Dashboard
- `/growth-suite/attribution/reports` - Reports list
- `/growth-suite/attribution/reports/[id]` - Report details

---

### **3. SEO Opportunity Engine**
**Purpose**: SEO keyword opportunity discovery and content brief generation

**Features**:
- OAuth connect Google Search Console + Ads API
- Opportunity Score (impressions + CTR + volume)
- LLM-generated content briefs
- Export as Markdown, PPTX, JSON

**Tech Stack**:
- Frontend: React + TypeScript
- Backend: Google APIs + OpenAI
- DB: PostgreSQL (briefs table)
- LLM: OpenAI GPT-4

**Pages to Create**:
- `/growth-suite/seo` - Dashboard
- `/growth-suite/seo/opportunities` - Opportunity list
- `/growth-suite/seo/briefs` - Briefs list
- `/growth-suite/seo/briefs/[id]` - Brief details

---

### **4. AI Content Repurposer**
**Purpose**: Repurpose content for multiple platforms

**Features**:
- Input URL or pasted article
- Generate social captions (X, LinkedIn, Instagram)
- Email subject lines + preview snippets
- Video scripts/hook lines
- Hashtag suggestions
- Thumbnail generator
- Export ZIP

**Tech Stack**:
- Frontend: React + TypeScript
- Backend: OpenAI API + image generation
- DB: PostgreSQL (repurpose_jobs table)
- Storage: S3 for generated assets

**Pages to Create**:
- `/growth-suite/repurposer` - Main page
- `/growth-suite/repurposer/history` - History list
- `/growth-suite/repurposer/[id]` - Results page

---

### **5. Widget Library**
**Purpose**: Conversion optimization widgets

**Features**:
- Exit-intent popup
- Content-upgrade slide-in
- Sticky CTA bar
- Countdown timer
- Social-proof badge
- WYSIWYG editor
- GA4 event integration
- WordPress plugin

**Tech Stack**:
- Frontend: React + TypeScript
- Backend: Widget config API
- DB: PostgreSQL (widgets table)
- Snippet: Vanilla JS SDK

**Pages to Create**:
- `/growth-suite/widgets` - Widget library
- `/growth-suite/widgets/create` - Create widget
- `/growth-suite/widgets/[id]` - Widget details
- `/growth-suite/widgets/[id]/edit` - Edit widget

---

### **6. Heatmaps & Session Sampler**
**Purpose**: User behavior insights

**Features**:
- Click and scroll depth heatmaps
- PII masking
- Session replays (anonymized)
- Capped per month (free tier)
- Integration with Experiment Builder

**Tech Stack**:
- Frontend: React + Canvas API
- Backend: Event capture API
- DB: PostgreSQL (heatmap_data, sessions)
- Storage: S3 for session recordings

**Pages to Create**:
- `/growth-suite/heatmaps` - Dashboard
- `/growth-suite/heatmaps/[page_id]` - Heatmap view
- `/growth-suite/sessions` - Session list
- `/growth-suite/sessions/[id]` - Session replay

---

### **7. Competitor Scanner**
**Purpose**: Competitive intelligence

**Features**:
- Track N competitors (free = 1)
- Weekly SERP snapshots
- Rising/falling keyword signals
- Email alerts for ranking changes
- SerpApi/Serpstack integration

**Tech Stack**:
- Frontend: React + TypeScript
- Backend: SERP API integration
- DB: PostgreSQL (competitor_snapshots)
- Scheduler: Cron jobs

**Pages to Create**:
- `/growth-suite/competitors` - Dashboard
- `/growth-suite/competitors/add` - Add competitor
- `/growth-suite/competitors/[id]` - Competitor details

---

## 🏗️ **ARCHITECTURE INTEGRATION**

### **Database Schema Extensions**

```sql
-- Growth Suite Tables

-- Experiments
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  variants JSONB NOT NULL,
  traffic_split JSONB NOT NULL,
  targeting_rules JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE growth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  event_name VARCHAR(255) NOT NULL,
  properties JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- SEO Briefs
CREATE TABLE seo_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  keyword VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Widgets
CREATE TABLE widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  config JSONB NOT NULL,
  install_snippet TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competitor Snapshots
CREATE TABLE competitor_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  competitor_domain VARCHAR(255) NOT NULL,
  snapshot JSONB NOT NULL,
  snapshot_date DATE DEFAULT CURRENT_DATE
);

-- Repurpose Jobs
CREATE TABLE repurpose_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  source_url TEXT,
  source_content TEXT,
  outputs JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE growth_suite_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  tool VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  quota_used INTEGER DEFAULT 1,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### **API Endpoints**

```
# Experiments
POST   /api/growth-suite/experiments
GET    /api/growth-suite/experiments
GET    /api/growth-suite/experiments/:id
PUT    /api/growth-suite/experiments/:id
DELETE /api/growth-suite/experiments/:id
GET    /api/growth-suite/experiments/:id/report

# Attribution
POST   /api/growth-suite/attribution/events
GET    /api/growth-suite/attribution/reports
GET    /api/growth-suite/attribution/reports/:id
POST   /api/growth-suite/attribution/reports/:id/export

# SEO
GET    /api/growth-suite/seo/opportunities
POST   /api/growth-suite/seo/briefs/generate
GET    /api/growth-suite/seo/briefs/:id
GET    /api/growth-suite/seo/briefs/:id/export

# Repurposer
POST   /api/growth-suite/repurposer/generate
GET    /api/growth-suite/repurposer/jobs
GET    /api/growth-suite/repurposer/jobs/:id

# Widgets
POST   /api/growth-suite/widgets
GET    /api/growth-suite/widgets
GET    /api/growth-suite/widgets/:id
PUT    /api/growth-suite/widgets/:id
DELETE /api/growth-suite/widgets/:id

# Heatmaps
POST   /api/growth-suite/heatmaps/track
GET    /api/growth-suite/heatmaps/:page_id
GET    /api/growth-suite/sessions
GET    /api/growth-suite/sessions/:id

# Competitors
POST   /api/growth-suite/competitors
GET    /api/growth-suite/competitors
GET    /api/growth-suite/competitors/:id
DELETE /api/growth-suite/competitors/:id
```

---

## 📦 **FREE TIER LIMITS**

```javascript
const FREE_TIER_LIMITS = {
  experiments: {
    active: 1,
    pageviews: 10000, // per month
  },
  attribution: {
    events: 50000, // per month
    retention_days: 90,
  },
  seo: {
    briefs: 5, // per month
    keywords_tracked: 10,
  },
  repurposer: {
    generations: 50, // per month
  },
  widgets: {
    active: 2,
    pageviews: 10000, // per month
  },
  heatmaps: {
    sessions: 1000, // per month
    pages: 5,
  },
  competitors: {
    tracked: 1,
    keywords: 10,
  },
};
```

---

## 🎨 **UI/UX INTEGRATION**

### **Navigation Updates**
Add "Growth Suite" to main navigation:
- Dashboard
- My Strategies
- **Growth Suite** ← NEW
  - Experiments
  - Attribution
  - SEO Tools
  - Content Repurposer
  - Widgets
  - Heatmaps
  - Competitors
- Profile
- Settings

### **Design System**
Leverage existing MediaPlanPro design system:
- ✅ Gradient mesh backgrounds
- ✅ Glass card effects
- ✅ Pastel color palette
- ✅ Lucide React icons
- ✅ CSS variables
- ✅ Smooth animations

---

## 📅 **IMPLEMENTATION PHASES**

### **Phase 1: Foundation** (Week 1)
- [ ] Database schema migration
- [ ] API endpoint scaffolding
- [ ] Growth Suite landing page
- [ ] Navigation integration
- [ ] Usage tracking system

### **Phase 2: Experiment Builder** (Week 2-3)
- [ ] Experiment CRUD pages
- [ ] Visual editor
- [ ] GrowthBook integration
- [ ] Stats dashboard
- [ ] Install snippet

### **Phase 3: Attribution Explorer** (Week 4)
- [ ] Event ingestion API
- [ ] Attribution models
- [ ] Sankey visualization
- [ ] Reports & exports

### **Phase 4: SEO & Repurposer** (Week 5)
- [ ] Google Search Console OAuth
- [ ] Opportunity scoring
- [ ] LLM brief generation
- [ ] Content repurposer

### **Phase 5: Widgets & Heatmaps** (Week 6)
- [ ] Widget library
- [ ] WYSIWYG editor
- [ ] Heatmap tracking
- [ ] Session replay

### **Phase 6: Competitor Scanner** (Week 7)
- [ ] SERP API integration
- [ ] Snapshot scheduler
- [ ] Alerts system

### **Phase 7: Testing & Launch** (Week 8)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Production deployment

---

## ✅ **NEXT STEPS**

1. ✅ **MediaPlanPro Testing Complete**
2. ⏭️ **Create Growth Suite Landing Page**
3. ⏭️ **Database Schema Migration**
4. ⏭️ **API Scaffolding**
5. ⏭️ **Implement Experiment Builder** (Priority #1)

---

**Plan Created**: October 9, 2025  
**Estimated Timeline**: 8 weeks  
**Status**: Ready to begin implementation

