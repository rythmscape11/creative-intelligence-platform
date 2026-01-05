# Feature Documentation

## Agency OS

### Client Management
**What it does:** Central hub for managing all client relationships.

**Inputs:**
- Client company name, contact info
- Logo and branding assets
- Billing preferences

**Processing:**
- Creates client record in database
- Generates client portal URL
- Links to projects and team members

**Outputs:**
- Client dashboard with all associated projects
- Activity timeline
- Quick actions (new project, send report)

**Key Files:**
- `src/app/agency/clients/page.tsx` - Client list
- `src/components/agency/ClientCard.tsx` - Client display
- `prisma/schema.prisma` - Client model

---

### Project Management
**What it does:** Track projects from brief to delivery.

**Features:**
- Project timeline with milestones
- Task assignments
- Budget tracking
- File attachments

**Key Files:**
- `src/app/agency/projects/page.tsx`
- `src/components/agency/ProjectBoard.tsx`

---

### Task Boards
**What it does:** Kanban and list views for task management.

**Inputs:**
- Task title, description, due date
- Assignee, priority, labels

**Processing:**
- Real-time updates via optimistic UI
- Drag-and-drop state management

**Key Files:**
- `src/app/agency/tasks/page.tsx`
- `src/components/agency/TaskKanban.tsx`

---

### Content Calendar
**What it does:** Plan and schedule content across channels.

**Features:**
- Calendar view (month/week/day)
- Drag-to-reschedule
- Multi-channel support

---

## The Optimiser

### Campaign Dashboard
**What it does:** Unified view of all ad campaigns.

**Integrations:**
- Meta Ads (Facebook/Instagram)
- Google Ads
- LinkedIn Ads

**Metrics Displayed:**
- Spend, impressions, clicks
- CTR, CPC, ROAS
- Conversion tracking

**Key Files:**
- `src/app/optimizer/dashboard/page.tsx`
- `src/components/optimizer/CampaignTable.tsx`

---

### AI Recommendations
**What it does:** AI-powered suggestions for optimization.

**Processing:**
1. Ingests campaign performance data
2. Analyzes trends and anomalies
3. Generates actionable recommendations
4. Prioritizes by impact score

**Types of Recommendations:**
- Budget reallocation
- Bid adjustments
- Audience refinements
- Creative fatigue alerts

---

### Performance Copilot
**What it does:** Chat interface for campaign insights.

**Technologies:**
- OpenAI GPT-4 integration
- Context-aware prompts
- Campaign data injection

**Key Files:**
- `src/app/optimizer/copilot/page.tsx`
- `src/lib/ai/optimizer-copilot.ts`

---

## The Analyser

### Domain Overview
**What it does:** SEO health check for any domain.

**Metrics:**
- Domain authority estimate
- Organic traffic trends
- Top pages by traffic
- Technical SEO issues

---

### Keyword Research
**What it does:** Discover and analyze keywords.

**Features:**
- Search volume data
- Keyword difficulty scores
- Related keywords
- SERP features

**Data Sources:**
- Proprietary estimation algorithms
- Search trend analysis

---

### Competitor Analysis
**What it does:** Compare your site against competitors.

**Outputs:**
- Traffic comparison charts
- Keyword overlap analysis
- Content gap identification
- Backlink comparison

---

### Site Audit
**What it does:** Technical SEO crawl and analysis.

**Checks:**
- Broken links
- Missing meta tags
- Page speed issues
- Mobile compatibility
- Schema markup

---

## The Strategiser

### AI Strategy Generator
**What it does:** Generate complete marketing strategies.

**Inputs:**
- Business name and description
- Target audience
- Budget range
- Goals and KPIs
- Competitors

**Processing:**
1. Analyzes inputs against industry benchmarks
2. Generates channel recommendations
3. Creates budget allocation
4. Produces timeline and milestones
5. Outputs full strategy document

**Technologies:**
- OpenAI GPT-4
- Custom prompt engineering
- Strategy templates

**Key Files:**
- `src/app/strategy/generate/page.tsx`
- `src/lib/strategy/EnhancedStrategyGenerator.ts`

---

### Channel Mix Optimization
**What it does:** Recommends optimal channel allocation.

**Factors Considered:**
- Budget constraints
- Target audience behavior
- Industry benchmarks
- Historical performance

---

### Export Functionality
**What it does:** Export strategies to various formats.

**Formats:**
- PDF (presentation-ready)
- PowerPoint (editable)
- DOCX (Word document)
- CSV (data export)

**Key Files:**
- `src/lib/export/pptx-generator.ts`
- `src/app/api/export/[format]/route.ts`

---

## Shared Infrastructure

### Authentication
**Provider:** Clerk
**Features:** SSO, MFA, session management

### Database
**Provider:** PostgreSQL via Prisma
**Key Models:** User, Subscription, ProductSubscription

### Payments
**Provider:** Razorpay
**Features:** Subscriptions, webhooks, multi-currency

### Feature Gating
**File:** `src/lib/product-access.ts`
**Functions:** hasProductAccess, hasTierAccess, requireProductAccess
