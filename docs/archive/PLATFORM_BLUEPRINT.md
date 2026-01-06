# MediaPlanPro Platform Blueprint

> Comprehensive documentation for developers and non-technical owners

---

## 1. Platform Overview

### What is MediaPlanPro?
MediaPlanPro is an **all-in-one marketing intelligence platform** consisting of 6 distinct products:

| Product | Purpose | Target User | Status |
|---------|---------|-------------|--------|
| **Forge** | AI content generation (images, videos, text) | Creative teams | ✅ Functional |
| **Strategiser** | AI strategy generation | Strategists | ✅ Functional |
| **Agency OS** | Client/project management | Agency teams | ✅ Functional |
| **Growth Suite** | A/B testing, analytics, SEO | Growth marketers | ✅ Functional |
| **The Optimiser** | AI campaign optimization | Media buyers | ✅ Functional |
| **The Analyser** | SEO/competitive intelligence | SEO specialists | ✅ Functional |

### Brand Promise
> "The All-in-One Marketing Intelligence Platform"

---

## 2. Technical Architecture

### Stack
```
Frontend: Next.js 15 + React 18 + TypeScript
Styling:  Tailwind CSS
Backend:  Next.js API Routes
Database: PostgreSQL (Neon)
ORM:      Prisma
Auth:     Clerk
Payments: Razorpay (subscription + one-time)
Hosting:  Vercel
```

### Directory Structure
```
src/
├── app/
│   ├── forge/           # Forge AI Studio
│   ├── strategiser/     # The Strategiser module  
│   ├── agency/          # Agency OS module
│   ├── growth-suite/    # Growth Suite module
│   ├── optimizer/       # The Optimiser module
│   ├── analyser/        # The Analyser module
│   ├── products/        # Product landing pages
│   ├── admin/           # Admin dashboard
│   │   ├── analytics/   # Analytics dashboard
│   │   └── api-config/  # API key management [NEW]
│   ├── pricing/         # Pricing page
│   └── api/             # API routes
│       ├── forge/
│       ├── agency/
│       ├── growth-suite/
│       ├── optimizer/
│       ├── analyser/
│       └── admin/
│           └── api-config/  # API configuration [NEW]
├── config/
│   ├── product-plans.ts # Central pricing config
│   └── pricing.ts       # Legacy pricing
├── lib/
│   ├── services/
│   │   ├── api-config.service.ts  # API key management [NEW]
│   │   ├── encryption.service.ts  # Key encryption [NEW]
│   │   ├── forge/       # Forge AI providers
│   │   └── ...          # Other services
│   ├── product-access.ts # Feature gating
│   ├── razorpay.ts      # Payment integration
│   └── prisma.ts        # Database client
└── components/          # Shared components
```

---

## 3. Product Configuration

### Central Config: `src/config/product-plans.ts`

This file is the **SINGLE SOURCE OF TRUTH** for all product pricing.

```typescript
// Example structure
PRODUCTS.AGENCY_OS.plans.PRO = {
  price: { usd: { monthly: 99, yearly: 990 }, inr: { monthly: 8199, yearly: 81990 } },
  razorpayPlanId: { monthly: 'plan_xxx', yearly: 'plan_yyy' },
  features: [...],
  limits: { clients: -1, projects: -1, teamMembers: 5 },
};
```

### Key Functions
| Function | Purpose |
|----------|---------|
| `getProduct(type)` | Get product definition |
| `getProductPlan(type, tier)` | Get specific plan |
| `getRazorpayPlanId(type, tier, interval)` | Get Razorpay ID |
| `formatPrice(amount, currency)` | Format for display |

---

## 4. Database Schema

### Key Models

```prisma
model ProductSubscription {
  userId              String
  product             ProductType      // AGENCY_OS, OPTIMISER, etc.
  planTier            ProductPlanTier  // STARTER, PRO, AGENCY
  status              ProductSubscriptionStatus
  razorpaySubscriptionId String?
  currentPeriodStart  DateTime
  currentPeriodEnd    DateTime
}

model AdminMetric {
  product     ProductType
  metric      String  // mrr, arr, active_subs, churn
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

## 5. Razorpay Integration

### Flow
```
1. User clicks "Subscribe"
2. Frontend calls /api/checkout/razorpay with product + tier
3. Backend creates Razorpay subscription
4. Razorpay checkout opens
5. User completes payment
6. Razorpay sends webhook to /api/webhooks/razorpay
7. Webhook updates ProductSubscription in DB
```

### Environment Variables
```env
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Per-product plan IDs (create in Razorpay Dashboard)
RAZORPAY_AGENCY_OS_STARTER_MONTHLY=plan_xxx
RAZORPAY_AGENCY_OS_PRO_MONTHLY=plan_xxx
# ... (16 plans total for 4 products × 2 tiers × 2 intervals)
```

---

## 5.1 Admin API Configuration (NEW)

### Purpose
Admin-only interface for managing product-specific API keys dynamically without redeployment.

### Location
- **Admin UI**: `/admin/api-config`
- **API Endpoint**: `/api/admin/api-config`

### Supported API Keys
| Key | Product | Required |
|-----|---------|----------|
| `OPENAI_API_KEY` | Strategy/Agency/Growth | Yes |
| `FAL_API_KEY` | Forge (Image Gen) | No |
| `RUNWAY_API_KEY` | Forge (Video) | No |
| `KLING_API_KEY` | Forge (Video) | No |
| `GOOGLE_AI_API_KEY` | Forge (LLM) | No |
| `RESEND_API_KEY` | Email | Yes |
| `SENDGRID_API_KEY` | Email Fallback | No |
| `GOOGLE_PAGESPEED_API_KEY` | Analytics | No |

### Key Features
- **Encryption**: AES-256-GCM encryption for stored keys
- **Fallback**: Environment variables used if DB key not set
- **Caching**: 5-minute TTL for performance
- **Testing**: Built-in API key validation

### Usage in Services
```typescript
import { ApiConfigService } from '@/lib/services/api-config.service';

// Get API key (returns DB value or env fallback)
const apiKey = await ApiConfigService.getApiKey('OPENAI_API_KEY');

// Set API key (encrypted in database)
await ApiConfigService.setApiKey('OPENAI_API_KEY', 'sk-...');

// Test API key validity
const result = await ApiConfigService.testApiKey('OPENAI_API_KEY');
```

### Webhook Events Handled
- `subscription.activated` → Status = ACTIVE
- `subscription.charged` → Update period dates
- `subscription.cancelled` → Status = CANCELED
- `payment.failed` → Status = PAST_DUE

---

## 6. Feature Gating

### Access Control: `src/lib/product-access.ts`

```typescript
// Check product access
await hasProductAccess(userId, 'AGENCY_OS');

// Check tier access
await hasTierAccess(userId, 'AGENCY_OS', 'PRO');

// Check usage limits
await isWithinUsageLimit(userId, 'STRATEGISER', 'strategies');

// Track usage
await trackUsage(userId, 'STRATEGISER', 'strategy_created');
```

### In API Routes
```typescript
import { requireProductAccess } from '@/lib/product-access';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  await requireProductAccess(userId, 'ANALYSER', 'PRO');
  // ... rest of handler
}
```

---

## 7. Admin Dashboard

### Location
`/admin/analytics` (requires ADMIN role)

### KPIs Displayed
| Metric | Description |
|--------|-------------|
| Total MRR | Sum of all product MRR |
| Total ARR | MRR × 12 |
| Active Subscriptions | Count by product |
| ARPU | MRR / Active Subs |
| Churn Rate | Churned / Total % |
| MRR Growth | Month-over-month % |

### Per-Product Metrics
- Subscriptions by tier (Starter/Pro/Agency)
- New signups, churned, upgrades, downgrades
- Revenue distribution chart

---

## 8. Common Error Handling

### Payment Issues

| Error | Symptom | Fix |
|-------|---------|-----|
| Razorpay config missing | Checkout fails silently | Check env vars |
| Plan ID mismatch | Wrong tier activated | Update product-plans.ts and Razorpay dashboard |
| Webhook not processing | Subscription stuck in INCOMPLETE | Check webhook secret, logs |
| User has no access | 403 on feature pages | Verify ProductSubscription record |

### Debugging Steps
1. Check `/admin/analytics` for subscription state
2. Verify Razorpay Dashboard for plan IDs
3. Check server logs for webhook errors
4. Query `ProductSubscription` table directly

---

## 9. Deployment Checklist

### Pre-Deploy
- [ ] All Razorpay plan IDs created and in env vars
- [ ] Database migrated (`npx prisma db push`)
- [ ] Build passes (`npm run build`)
- [ ] Webhook URL configured in Razorpay Dashboard

### Post-Deploy
- [ ] Test subscription flow end-to-end
- [ ] Verify webhooks are received
- [ ] Check admin dashboard loads with real data
- [ ] Confirm feature gating works per tier

---

## 10. Future Enhancements

### Short-Term
- [ ] Stripe + Razorpay dual gateway support
- [ ] Usage-based billing for API calls
- [ ] Team/seat management per product

### Medium-Term
- [ ] Advanced AI copilots per product
- [ ] Cross-product insights
- [ ] Automated churn prediction

### Long-Term
- [ ] White-label platform option
- [ ] Enterprise self-hosted deployment
- [ ] Marketplace for integrations

---

## 11. Quick Reference

### URLs
| Page | Route |
|------|-------|
| Products Index | `/products` |
| Forge Studio | `/forge` |
| Strategiser | `/strategiser` |
| Agency OS | `/agency` |
| Growth Suite | `/growth-suite` |
| The Optimiser | `/optimizer` |
| The Analyser | `/analyser` |
| Pricing | `/pricing` |
| Admin Analytics | `/admin/analytics` |
| Admin API Config | `/admin/api-config` |

### Key Files
| Purpose | Path |
|---------|------|
| Product pricing | `src/config/product-plans.ts` |
| Feature gating | `src/lib/product-access.ts` |
| Razorpay utils | `src/lib/razorpay.ts` |
| API key management | `src/lib/services/api-config.service.ts` |
| Key encryption | `src/lib/services/encryption.service.ts` |
| Prisma schema | `prisma/schema.prisma` |
| Admin analytics | `src/app/admin/analytics/page.tsx` |
| Admin API config | `src/app/admin/api-config/page.tsx` |
| Forge providers | `src/lib/services/forge/forge-providers.ts` |
| OpenAI client | `src/lib/services/openai-client.ts` |

---

## 12. Product Functionality Status

*Last tested: December 12, 2024*

| Product | Page Load | API Integration | Notes |
|---------|-----------|----------------|-------|
| Home | ✅ 200 | N/A | Landing page |
| Forge | ✅ 200 | Dynamic API Config | Image/Video/Text generation |
| Strategiser | ✅ 200 | OpenAI GPT-4 | Strategy generation |
| Agency | ✅ 200 | OpenAI | Client management |
| Growth Suite | ✅ 200 | OpenAI | A/B testing, analytics |
| Analyser | ✅ 200 | OpenAI | SEO analysis |
| Admin API Config | ✅ 200 | N/A | API key management |

### API Dependencies Resolved
All products now use centralized API configuration with:
- Database-stored encrypted API keys
- Environment variable fallback
- Admin UI for key management
- Built-in key validation

---

*Last updated: December 12, 2024*
