# MediaPlanPro - Technical Blueprint & Feature Documentation

**Version:** 1.0  
**Last Updated:** December 7, 2025  
**Platform:** https://www.mediaplanpro.com

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Technical Stack](#technical-stack)
3. [User Levels & Pricing](#user-levels--pricing)
4. [Core Features](#core-features)
5. [Admin Features](#admin-features)
6. [Agency OS Platform](#agency-os-platform)
7. [API Documentation](#api-documentation)
8. [Third-Party Integrations](#third-party-integrations)
9. [Database Schema Overview](#database-schema-overview)
10. [SEO & Analytics](#seo--analytics)

---

## Platform Overview

MediaPlanPro is an AI-powered marketing strategy platform designed for freelancers, marketing agencies, and enterprises. The platform provides:

- **AI Strategy Generation** - GPT-4 powered marketing strategy creation
- **50+ Marketing Tools** - Calculators, generators, and analyzers
- **Agency OS** - White-label solution for marketing agencies
- **Lead Generation** - Built-in lead capture and nurturing
- **Blog Engine** - Automated blog content generation

### Key Differentiators:
- Director-level marketing strategies (not generic templates)
- Full white-label capabilities for agencies
- Comprehensive tool suite for all marketing needs
- AI-powered automation (blog generation, ad optimization, lead nurturing)

---

## Technical Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Shadcn/UI | Latest | Component library |
| Framer Motion | Latest | Animations |
| Recharts | Latest | Data visualization |
| Three.js | Latest | 3D visualizations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 14.x | Serverless API endpoints |
| Prisma | Latest | ORM for database |
| PostgreSQL | 15+ | Primary database |
| Redis/Bull | Latest | Job queues |
| Winston | Latest | Logging |

### Authentication & Security
| Technology | Purpose |
|------------|---------|
| Clerk | Authentication & user management |
| Arcjet | Bot protection & rate limiting |
| CSRF Tokens | Cross-site request forgery protection |
| Zod | Input validation |

### AI & Machine Learning
| Technology | Purpose |
|------------|---------|
| OpenAI GPT-4 | Strategy generation, content creation |
| OpenAI DALL-E 3 | Image generation for blogs |
| Vercel AI SDK | AI streaming responses |
| Google Vertex AI | Alternative AI capabilities |

### Payments & Subscriptions
| Technology | Purpose |
|------------|---------|
| Razorpay | Primary payment gateway (INR) |
| Stripe | International payments (USD) |

### Email & Marketing
| Technology | Purpose |
|------------|---------|
| Resend | Transactional emails |
| Mailchimp | Email marketing integration |
| Lead Chaser | Automated nurturing sequences |

### Storage & CDN
| Technology | Purpose |
|------------|---------|
| AWS S3 | File storage (images, exports) |
| Google Cloud Storage | Backup storage |
| Vercel Edge | CDN & hosting |

### Analytics & Monitoring
| Technology | Purpose |
|------------|---------|
| Google Analytics 4 | User analytics |
| Sentry | Error tracking |
| Custom logging | Performance monitoring |

### Testing
| Technology | Purpose |
|------------|---------|
| Playwright | E2E testing |
| Vitest | Unit testing |
| Jest | Component testing |

---

## User Levels & Pricing

### Plan Comparison Matrix

| Feature | FREE | PRO ($49/mo) | AGENCY ($299/mo) | ENTERPRISE |
|---------|------|--------------|------------------|------------|
| **AI Strategies** | 5/month | Unlimited | Unlimited | Unlimited |
| **Saved Results** | 3 | Unlimited | Unlimited | Unlimited |
| **PDF Exports** | 5 (watermarked) | Unlimited (clean) | Unlimited (branded) | Unlimited |
| **AI Recommendations** | 10 | Unlimited | Unlimited | Unlimited |
| **Team Members** | 1 | 1 | 10 | Unlimited |
| **API Access** | ❌ | ❌ | 10,000 calls/mo | Unlimited |
| **White Label** | ❌ | ❌ | ✅ | ✅ |
| **Custom Domain** | ❌ | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ (4h) | ✅ (1h) |
| **Ad Integration** | ❌ | ❌ | ✅ | ✅ |
| **Custom AI Training** | ❌ | ❌ | ❌ | ✅ |

### Pricing (INR)

| Plan | Monthly | Yearly (2 months free) |
|------|---------|------------------------|
| FREE | ₹0 | ₹0 |
| PRO | ₹4,099 | ₹40,990 |
| AGENCY | ₹24,999 | ₹249,990 |
| ENTERPRISE | Custom | Custom |

### Target Audiences

- **FREE**: Students, hobbyists, marketers exploring tools
- **PRO**: Freelancers, small businesses, solo marketers
- **AGENCY**: Marketing agencies, consultants with clients
- **ENTERPRISE**: Large corporations, SaaS platforms needing custom integration

---

## Core Features

### 1. AI Strategy Generator
**Route:** `/dashboard/strategies/create`  
**Access:** All plans (limited for FREE)

Generates comprehensive marketing strategies including:
- Executive Summary
- Target Audience Analysis
- Channel Mix Recommendations
- Budget Allocation
- Timeline & Milestones
- KPI Tracking

**AI Model:** GPT-4 Turbo Preview  
**Output Formats:** PDF, DOCX, PPTX

---

### 2. Marketing Tools Suite (50+ Tools)

#### Advertising Tools
| Tool | Route | Description |
|------|-------|-------------|
| ROI Calculator | `/tools/advertising/roi-calculator` | Calculate marketing ROI |
| Budget Allocator | `/tools/advertising/budget-allocator` | Optimize budget distribution |
| CPC/CPM Calculator | `/tools/advertising/cpc-cpm-calculator` | Cost per click/impression |
| Ad Copy Generator | `/tools/advertising/ad-copy-generator` | AI-powered ad copy |
| Landing Page Analyzer | `/tools/advertising/landing-page-analyzer` | Analyze landing pages |

#### Content Tools
| Tool | Route | Description |
|------|-------|-------------|
| Headline Analyzer | `/tools/content/headline-analyzer` | Score headline effectiveness |
| Email Subject Tester | `/tools/content/email-subject-tester` | Test email subjects |
| Meta Description Generator | `/tools/content/meta-description-generator` | Generate meta descriptions |
| Blog Outline Generator | `/tools/content/blog-outline-generator` | Create blog outlines |
| Readability Scorer | `/tools/content/readability-scorer` | Check content readability |
| Content Calendar | `/tools/content/content-calendar-generator` | Plan content schedule |

#### SEO Tools
| Tool | Route | Description |
|------|-------|-------------|
| Keyword Research | `/tools/seo/keyword-research` | Find keywords |
| SERP Preview | `/tools/seo/serp-preview` | Preview search results |
| Page Speed Analyzer | `/tools/seo/page-speed-analyzer` | Check page performance |
| Schema Generator | `/tools/seo/schema-generator` | Generate structured data |
| Robots.txt Generator | `/tools/seo/robots-txt-generator` | Create robots.txt |
| XML Sitemap Generator | `/tools/seo/xml-sitemap-generator` | Generate sitemaps |

#### Social Media Tools
| Tool | Route | Description |
|------|-------|-------------|
| Engagement Calculator | `/tools/social/engagement-calculator` | Calculate engagement rates |
| Hashtag Generator | `/tools/social/hashtag-generator` | Generate hashtags |
| Best Time to Post | `/tools/social/best-time-to-post` | Optimal posting times |
| UTM Builder | `/tools/social/utm-builder` | Create UTM parameters |
| Image Resizer | `/tools/social/image-resizer` | Resize for platforms |

#### Email Tools
| Tool | Route | Description |
|------|-------|-------------|
| Email Preview | `/tools/email/email-preview` | Preview email rendering |
| Spam Score Checker | `/tools/email/spam-score-checker` | Check spam likelihood |
| Signature Generator | `/tools/email/signature-generator` | Create email signatures |

---

### 3. Competition Analysis
**Route:** `/dashboard/competition`  
**Access:** PRO+

Analyze competitors with:
- Industry benchmarking
- Geographic analysis
- Target audience comparison
- Focus area insights

---

### 4. Growth Suite
**Route:** `/growth-suite`  
**Access:** PRO+

Advanced marketing analytics:
- Attribution tracking
- Heatmaps
- A/B experiments
- SEO auditing
- Content repurposing
- Widget library

---

## Admin Features

### Admin-Only Tools

| Tool | Route | Description |
|------|-------|-------------|
| Auto Blog Generator | `/dashboard/blog-automation` | AI blog generation & scheduling |
| Lead Chaser | `/dashboard/lead-chaser` | Automated email sequences |
| MLOps Dashboard | `/dashboard/mlops` | AI model monitoring |
| Lead Management | `/dashboard/admin/leads` | View & manage leads |
| Strategy Metrics | `/dashboard/admin/strategy-metrics` | Generation analytics |
| User Management | `/dashboard/admin/users` | User administration |
| Integrations | `/dashboard/admin/integrations` | API key management |
| Blog Management | `/dashboard/admin/blog` | Content management |

### Admin Identification
Admins are identified by email in `/src/config/tool-access.ts`:
```typescript
export const ADMIN_EMAILS = [
    'mukherjeeanustup@gmail.com',
    process.env.ADMIN_EMAIL,
];
```

### Admin Capabilities
- Full access to all tools regardless of plan
- View all user data and analytics
- Manage blog content and scheduling
- Configure integrations and API keys
- Access AI cost monitoring (MLOps)
- Manage lead nurturing sequences

---

## Agency OS Platform

### Overview
Agency OS is the white-label solution for marketing agencies, allowing them to:
1. Customize branding (logos, colors, fonts)
2. Create client workspaces
3. Export branded reports
4. Manage team members
5. Access API for integrations

### Setup Flow

#### Step 1: Subscribe to Agency Plan
- Route to `/pricing`
- Select AGENCY plan ($299/mo)
- Complete payment via Razorpay

#### Step 2: Configure Branding
**Route:** `/dashboard/agency-branding`

Settings available:
| Setting | Description |
|---------|-------------|
| Agency Logo | Primary logo for reports |
| Logo (Light) | Logo for dark backgrounds |
| Favicon | Browser favicon |
| Primary Color | Main brand color (hex) |
| Secondary Color | Accent color (hex) |
| Accent Color | Highlight color (hex) |
| Heading Font | Typography for headings |
| Body Font | Typography for body text |
| Custom Domain | Your agency domain (coming soon) |
| Hide MediaPlanPro | Remove platform branding |
| Custom Footer | Footer text for reports |
| PDF Header/Footer | Custom HTML for exports |

#### Step 3: Create Client Workspaces
**Route:** `/dashboard/client-workspaces`

Each workspace contains:
- Client name and company
- Client logo
- Custom color scheme
- Assigned team members
- Strategy history

#### Step 4: Generate White-Label Reports
**API:** `POST /api/strategies/[id]/export/whitelabel`

Reports include:
- Agency branding applied
- Client workspace branding (optional)
- Custom cover pages
- Branded headers/footers

### API Endpoints for Agency

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agency/branding` | GET | Fetch branding settings |
| `/api/agency/branding` | POST | Update branding settings |
| `/api/agency/workspaces` | GET | List client workspaces |
| `/api/agency/workspaces` | POST | Create workspace |
| `/api/agency/workspaces/[id]` | PUT | Update workspace |
| `/api/strategies/[id]/export/whitelabel` | POST | Export with branding |

---

## API Documentation

### Authentication
All API requests require authentication via Clerk session or API key.

### Base URL
```
https://www.mediaplanpro.com/api
```

### Core Endpoints

#### Strategy Generation
```http
POST /api/strategies
Content-Type: application/json

{
  "input": {
    "businessName": "string",
    "industry": "string",
    "goals": ["string"],
    "budget": number,
    "timeline": "string"
  }
}
```

#### Strategy Export
```http
POST /api/strategies/[id]/export
Content-Type: application/json

{
  "format": "pdf" | "docx" | "pptx",
  "includeAppendix": boolean
}
```

#### Blog Posts
```http
GET /api/blog/posts
GET /api/blog/posts/[slug]
POST /api/admin/blog/posts (Admin only)
```

#### Lead Capture
```http
POST /api/lead-capture
Content-Type: application/json

{
  "email": "string",
  "name": "string",
  "source": "string",
  "toolId": "string"
}
```

### Rate Limits
| Plan | Requests/Month |
|------|----------------|
| FREE | 100 |
| PRO | 1,000 |
| AGENCY | 10,000 |
| ENTERPRISE | Unlimited |

---

## Third-Party Integrations

### Currently Integrated

| Service | Purpose | Config Location |
|---------|---------|-----------------|
| Clerk | Authentication | `NEXT_PUBLIC_CLERK_*` |
| OpenAI | AI generation | `OPENAI_API_KEY` |
| Razorpay | Payments (INR) | `RAZORPAY_*` |
| Stripe | Payments (USD) | `STRIPE_*` |
| Resend | Emails | `RESEND_API_KEY` |
| Mailchimp | Email marketing | `MAILCHIMP_*` |
| AWS S3 | File storage | `AWS_*` |
| Google Analytics | Analytics | `NEXT_PUBLIC_GA_*` |
| Sentry | Error tracking | `SENTRY_*` |
| Google Sheets | Lead sync | `GOOGLE_SHEETS_*` |

### Available Integrations (Admin Panel)

| Integration | Status | Description |
|-------------|--------|-------------|
| Google Ads | Ready | Ad campaign management |
| Meta Ads | Ready | Facebook/Instagram ads |
| LinkedIn Ads | Coming Soon | LinkedIn advertising |
| Google Analytics | Ready | Analytics data |
| Google Search Console | Coming Soon | Search data |
| HubSpot | Coming Soon | CRM integration |
| Salesforce | Coming Soon | CRM integration |

---

## Database Schema Overview

### Core Tables

```
User
├── id (string)
├── email (string)
├── name (string)
├── role (ADMIN | USER | EDITOR)
├── subscription → Subscription
├── strategies → Strategy[]
└── activities → UserActivity[]

Subscription
├── id (string)
├── userId (string)
├── plan (FREE | PRO | AGENCY | ENTERPRISE)
├── status (ACTIVE | CANCELLED | EXPIRED)
├── razorpaySubscriptionId
└── expiresAt (datetime)

Strategy
├── id (string)
├── userId (string)
├── title (string)
├── input (JSON)
├── output (JSON)
├── status (DRAFT | GENERATED | EXPORTED)
└── exports → StrategyExport[]

BlogPost
├── id (string)
├── title (string)
├── slug (string)
├── content (text)
├── excerpt (string)
├── featuredImage (string)
├── status (DRAFT | PUBLISHED | ARCHIVED)
├── authorId → User
├── categoryId → BlogCategory
├── tags → BlogTag[]
└── publishedAt (datetime)

LeadCapture
├── id (string)
├── email (string)
├── name (string)
├── source (string)
├── toolId (string)
├── utmSource, utmMedium, utmCampaign
└── leadSequence → LeadSequence

AgencyBranding
├── id (string)
├── userId (string)
├── logoUrl, logoLightUrl, faviconUrl
├── primaryColor, secondaryColor, accentColor
├── headingFont, bodyFont
├── customDomain, domainVerified
├── hideMediaPlanPro
└── pdfHeaderHtml, pdfFooterHtml

ClientWorkspace
├── id (string)
├── userId (string)
├── clientName, clientCompany
├── clientLogoUrl
├── primaryColor, secondaryColor
└── strategies → Strategy[]
```

---

## SEO & Analytics

### SEO Configuration

#### Sitemap
**Route:** `/sitemap.xml` (generated via `/src/app/sitemap.ts`)

Includes:
- All public pages
- All tool pages (50+)
- All service pages
- All blog posts
- Growth suite pages
- Resource pages

#### Robots.txt
**Route:** `/robots.txt` (generated via `/src/app/robots.ts`)

Configuration:
- Allows all public pages
- Blocks `/api/`, `/admin/`, `/dashboard/`
- Explicit Googlebot/Bingbot rules
- Blocks AI crawlers (GPTBot, CCBot, anthropic-ai)
- References sitemap.xml

#### Meta Tags
All pages include:
- Title (unique per page)
- Description (150-160 chars)
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data

### Analytics Tracking

#### Google Analytics 4
**Tracking ID:** `NEXT_PUBLIC_GA_TRACKING_ID`

Events tracked:
- Page views
- Strategy generations
- Tool usage
- Lead captures
- Subscription conversions

#### Custom Analytics
**Route:** `/dashboard/analytics` (Coming Soon)

Planned metrics:
- Strategy generation trends
- Tool usage heatmaps
- Conversion funnels
- User engagement scores

---

## Appendix

### Environment Variables

#### Required
```
DATABASE_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
OPENAI_API_KEY
RESEND_API_KEY
```

#### Payment
```
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

#### Storage
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
```

#### Optional
```
GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_GA_TRACKING_ID
SENTRY_DSN
MAILCHIMP_API_KEY
MAILCHIMP_AUDIENCE_ID
```

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API endpoints
│   ├── blog/              # Blog pages
│   ├── tools/             # Marketing tools
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── access/            # Access control
│   ├── blog/              # Blog components
│   ├── dashboard/         # Dashboard UI
│   ├── seo/               # SEO components
│   └── ui/                # Shadcn UI
├── config/                # Configuration
│   ├── pricing.ts         # Pricing plans
│   └── tool-access.ts     # Tool permissions
├── lib/                   # Utilities
│   ├── services/          # Business logic
│   ├── prisma.ts          # Database client
│   └── utils.ts           # Helpers
└── data/                  # Static data
    └── tools/             # Tool content
```

---

*Document generated by Antigravity AI Agent*  
*MediaPlanPro © 2025*
