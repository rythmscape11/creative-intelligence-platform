# Developer Onboarding Guide

## Quick Start

```bash
# Clone and install
git clone https://github.com/rythmscape11/mediaplanpro.git
cd mediaplanpro
npm install

# Setup environment
cp .env.example .env.local
# Fill in required values

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

---

## Project Structure

```
src/
├── app/                    # Next.js 15 app router
│   ├── (dashboard)/        # Authenticated dashboard routes
│   ├── admin/              # Admin-only routes
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── products/           # Product landing pages
│   └── pricing/            # Pricing page
├── components/             # React components
├── config/                 # Configuration files
│   └── product-plans.ts    # ⭐ Product pricing config
├── lib/                    # Utility libraries
│   ├── prisma.ts           # Prisma client
│   ├── razorpay.ts         # Razorpay integration
│   ├── product-access.ts   # Feature gating
│   └── usage-tracking.ts   # Usage analytics
└── types/                  # TypeScript types
```

---

## Key Files

### product-plans.ts
Central source of truth for all product pricing:
```typescript
import { PRODUCTS, getProductPlan, formatPrice } from '@/config/product-plans';

// Get a specific plan
const agencyPro = getProductPlan('AGENCY_OS', 'PRO');

// Format price for display
formatPrice(99, 'usd'); // "$99"
formatPrice(8199, 'inr'); // "₹8,199"
```

### product-access.ts
Feature gating and usage limits:
```typescript
import { hasProductAccess, hasTierAccess, requireProductAccess } from '@/lib/product-access';

// In API route
const access = await requireProductAccess(userId, 'AGENCY_OS', 'PRO');
if (!access.allowed) {
  return NextResponse.json({ error: access.message }, { status: 403 });
}

// Check feature access
const canExport = await hasTierAccess(userId, 'AGENCY_OS', 'PRO');
```

---

## API Routes

### Authentication
All API routes use Clerk for auth:
```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkout/product` | Create product subscription |
| PUT | `/api/subscriptions/manage` | Upgrade/downgrade |
| DELETE | `/api/subscriptions/manage` | Cancel subscription |
| GET | `/api/admin/analytics` | Admin KPIs |
| GET | `/api/admin/users` | Admin user list |
| POST | `/api/webhooks/razorpay` | Razorpay webhooks |

---

## Database

### Prisma Commands
```bash
# Generate client
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name your_migration

# View database
npx prisma studio
```

### Key Models
- `User` - User accounts
- `ProductSubscription` - Per-product subscriptions
- `AdminMetric` - Revenue and business metrics
- `UserProductUsage` - Feature usage tracking
- `UserSessionEvent` - Session analytics

---

## Environment Variables

```env
# Database
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Testing

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test e2e/pricing.spec.ts

# Run with UI
npx playwright test --ui
```

---

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

For detailed architecture, see [PLATFORM_BLUEPRINT.md](./PLATFORM_BLUEPRINT.md).
