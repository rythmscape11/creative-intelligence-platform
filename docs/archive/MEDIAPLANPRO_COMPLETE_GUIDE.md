# MediaPlanPro Complete Platform Guide

> Comprehensive documentation merging: Platform Blueprint, Developer Guide, API Reference, Error Playbook, Feature Documentation, and Website Audit

**Version:** 1.0  
**Last Updated:** December 9, 2024

---

# Part 1: Platform Overview

## What is MediaPlanPro?

MediaPlanPro is an **all-in-one marketing intelligence platform** with 4 distinct products:

| Product | Purpose | Target User |
|---------|---------|-------------|
| **Agency OS** | Client/project management | Agency teams |
| **The Optimiser** | AI campaign optimization | Media buyers |
| **The Analyser** | SEO/competitive intelligence | SEO specialists |
| **The Strategiser** | AI strategy generation | Strategists |

**Brand Promise:** "The All-in-One Marketing Intelligence Platform"

---

## Technical Stack

```
Frontend: Next.js 15 + React 18 + TypeScript
Styling:  Tailwind CSS
Backend:  Next.js API Routes
Database: PostgreSQL (Neon)
ORM:      Prisma
Auth:     Clerk
Payments: Razorpay
Hosting:  Vercel
```

---

# Part 2: Developer Guide

## Quick Start

```bash
git clone https://github.com/rythmscape11/mediaplanpro.git
cd mediaplanpro
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js 15 app router
│   ├── (dashboard)/        # Authenticated routes
│   ├── admin/              # Admin-only routes
│   ├── api/                # API routes
│   ├── products/           # Product landing pages
│   └── pricing/            # Pricing page
├── config/
│   └── product-plans.ts    # ⭐ Central pricing config
├── lib/
│   ├── prisma.ts           # Database client
│   ├── razorpay.ts         # Payment integration
│   ├── product-access.ts   # Feature gating
│   └── usage-tracking.ts   # Analytics
└── components/             # Shared components
```

## Key Files

| Purpose | Path |
|---------|------|
| Product pricing | `src/config/product-plans.ts` |
| Feature gating | `src/lib/product-access.ts` |
| Razorpay utils | `src/lib/razorpay.ts` |
| Prisma schema | `prisma/schema.prisma` |

## Environment Variables

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

## Commands

```bash
npx prisma generate      # Generate client
npx prisma db push       # Push schema changes
npx prisma studio        # View database
npm run build            # Build for production
npx playwright test      # Run tests
```

---

# Part 3: API Reference

## Authentication

All authenticated endpoints require Clerk session tokens.

```typescript
import { auth } from '@clerk/nextjs/server';
const { userId } = await auth();
```

## Endpoints

### Checkout & Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkout/product` | Create subscription |
| GET | `/api/checkout/product` | Get subscriptions |
| PUT | `/api/subscriptions/manage` | Upgrade/downgrade |
| DELETE | `/api/subscriptions/manage?product=X` | Cancel |

**Create Subscription Request:**
```json
{
  "product": "AGENCY_OS",
  "tier": "PRO",
  "interval": "monthly",
  "currency": "usd"
}
```

### Admin APIs (ADMIN role required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | Get KPIs |
| GET | `/api/admin/users` | Get user list |

### Tracking APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tracking/event` | Track page views |
| POST | `/api/tracking/feature` | Track feature usage |
| POST | `/api/tracking/session` | Track login/logout |

### Webhooks

```
POST /api/webhooks/razorpay
```

Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.captured`, `payment.failed`

## Error Responses

```json
{ "error": "Error message" }
```

Status codes: 400 (Bad request), 401 (Unauthorized), 403 (Forbidden), 404 (Not found), 500 (Server error)

---

# Part 4: Feature Documentation

## Agency OS

### Client Management
- Central hub for all client relationships
- Client dashboards with projects and activity
- Key files: `src/app/agency/clients/page.tsx`

### Project Management
- Timeline with milestones, task assignments, budget tracking
- Key files: `src/app/agency/projects/page.tsx`

### Task Boards
- Kanban and list views with drag-and-drop
- Key files: `src/app/agency/tasks/page.tsx`

---

## The Optimiser

### Campaign Dashboard
- Unified view of Meta Ads, Google Ads, LinkedIn Ads
- Metrics: Spend, CTR, CPC, ROAS, conversions
- Key files: `src/app/optimizer/dashboard/page.tsx`

### AI Recommendations
- Budget reallocation, bid adjustments, creative fatigue alerts
- Prioritized by impact score

### Performance Copilot
- Chat interface for insights (GPT-4 powered)
- Key files: `src/app/optimizer/copilot/page.tsx`

---

## The Analyser

### Domain Overview
- SEO health, organic traffic, top pages

### Keyword Research
- Search volume, difficulty, related keywords

### Competitor Analysis
- Traffic comparison, keyword overlap, content gaps

### Site Audit
- Broken links, meta tags, page speed, mobile, schema

---

## The Strategiser

### AI Strategy Generator
- Full marketing strategy from inputs (GPT-4)
- Key files: `src/lib/strategy/EnhancedStrategyGenerator.ts`

### Channel Mix Optimization
- Budget allocation based on audience and benchmarks

### Export Functionality
- PDF, PowerPoint, DOCX, CSV
- Key files: `src/lib/export/pptx-generator.ts`

---

# Part 5: Error Handling Playbook

## Payment Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Payment system not configured" | Missing env vars | Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| "Invalid signature" | Webhook secret wrong | Update `RAZORPAY_WEBHOOK_SECRET` |
| Subscription fails | Invalid plan ID | Create plan in Razorpay Dashboard |

## Auth Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Not logged in | Redirect to `/auth/signin` |
| 403 Forbidden | Missing subscription | Check `ProductSubscription` table |

## Database Errors

| Code | Meaning |
|------|---------|
| P2002 | Unique constraint violation |
| P2025 | Record not found |
| P2003 | Foreign key constraint |

## Debugging

```typescript
console.log('Environment:', {
  hasRazorpay: !!process.env.RAZORPAY_KEY_ID,
  hasClerk: !!process.env.CLERK_SECRET_KEY,
});
```

---

# Part 6: Website Audit Report

**Date:** December 9, 2024  
**Overall Score:** 91%

## Page Status

| Page | Status |
|------|--------|
| `/` (Home) | ✅ |
| `/products` | ✅ |
| `/products/agency-os` | ✅ |
| `/products/the-optimiser` | ✅ |
| `/products/the-analyser` | ✅ |
| `/products/the-strategiser` | ✅ |
| `/pricing` | ✅ |
| `/billing` | ✅ |
| `/admin/analytics` | ✅ |
| `/admin/users` | ✅ |

## Category Scores

| Category | Score |
|----------|-------|
| Public Pages | 95% |
| Authenticated Pages | 95% |
| Payment Flows | 90% |
| Error Handling | 95% |
| SEO | 80% |

## Issues Found

| Severity | Issue |
|----------|-------|
| Major | No cancel confirmation modal |
| Major | Missing OG images |
| Minor | Some footer placeholder links |

## Recommendations

1. Add cancel confirmation modal
2. Generate OG images for social sharing
3. Safari testing
4. Improve error toast messages

---

# Part 7: Key Routes

| Page | Route |
|------|-------|
| Products Index | `/products` |
| Agency OS | `/products/agency-os` |
| The Optimiser | `/products/the-optimiser` |
| The Analyser | `/products/the-analyser` |
| The Strategiser | `/products/the-strategiser` |
| Pricing | `/pricing` |
| Billing | `/billing` |
| Admin Analytics | `/admin/analytics` |
| Admin Users | `/admin/users` |

---

# Part 8: Database Models

```prisma
model ProductSubscription {
  userId              String
  product             ProductType
  planTier            ProductPlanTier
  status              ProductSubscriptionStatus
  razorpaySubscriptionId String?
  currentPeriodStart  DateTime
  currentPeriodEnd    DateTime
}

model AdminMetric {
  product     ProductType
  metric      String
  value       Float
}

model UserProductUsage {
  userId      String
  product     ProductType
  feature     String
  count       Int
  date        DateTime
}
```

---

# Part 9: Razorpay Integration Flow

```
1. User clicks "Subscribe"
2. Frontend calls /api/checkout/product
3. Backend creates Razorpay subscription
4. Razorpay checkout opens
5. User completes payment
6. Razorpay sends webhook
7. Webhook updates ProductSubscription
```

---

# Part 10: Future Enhancements

**Short-Term:**
- Stripe + Razorpay dual gateway
- Usage-based billing
- Team/seat management

**Medium-Term:**
- Advanced AI copilots
- Cross-product insights
- Churn prediction

**Long-Term:**
- White-label option
- Enterprise self-hosted
- Integration marketplace

---

*This document merges: PLATFORM_BLUEPRINT.md, DEVELOPER_GUIDE.md, API_REFERENCE.md, ERROR_PLAYBOOK.md, FEATURE_DOCUMENTATION.md, WEBSITE_AUDIT.md*
