# Stripe Removal & Razorpay Consolidation Guide

## Overview

This guide documents the steps needed to remove Stripe payment integration and consolidate all payment flows to use Razorpay exclusively.

## Current State

MediaPlanPro currently has BOTH Stripe and Razorpay payment gateways active:

### Stripe Files (To Be Disabled/Removed)
1. `src/lib/stripe.ts` - Stripe client initialization
2. `src/app/api/stripe/create-checkout/route.ts` - Stripe checkout session creation
3. `src/app/api/webhooks/stripe/route.ts` - Stripe webhook handler
4. `src/app/api/checkout/route.ts` - Uses Stripe for checkout
5. `src/app/api/subscriptions/route.ts` - Stripe subscription management
6. `src/app/api/payments/route.ts` - Stripe payment history
7. `src/app/api/invoices/route.ts` - Stripe invoice management
8. `src/components/payment/checkout-button.tsx` - Stripe checkout button
9. `src/components/payment/payment-gateway-selector.tsx` - Shows both Stripe and Razorpay
10. `src/app/checkout/success/page.tsx` - Stripe success page
11. `src/app/checkout/cancel/page.tsx` - Stripe cancel page

### Razorpay Files (To Keep & Enhance)
1. `src/lib/razorpay.ts` - Razorpay client and configuration ✅
2. `src/app/api/webhooks/razorpay/route.ts` - Razorpay webhook handler ✅
3. `src/components/payment/razorpay-checkout-button.tsx` - Razorpay checkout button ✅
4. `src/app/api/services/purchase/route.ts` - Uses Razorpay for service purchases ✅

## Action Plan

### Phase 1: Disable Stripe Files (Recommended Approach)

Instead of deleting Stripe files (which could break the build), we'll disable them by:

1. **Comment out Stripe initialization in `src/lib/stripe.ts`:**
   - Add a warning comment at the top
   - Export placeholder functions to prevent import errors

2. **Disable Stripe API routes:**
   - Add early return with "Payment method not available" error
   - Keep the file structure intact for potential future use

3. **Update payment components:**
   - Remove Stripe options from payment gateway selector
   - Hide Stripe checkout buttons
   - Show only Razorpay payment options

### Phase 2: Update Pricing Page

**File:** `src/app/pricing/page.tsx`

**Changes Needed:**
- Remove Stripe checkout button imports
- Use only Razorpay checkout buttons
- Update success/cancel URLs to Razorpay endpoints
- Remove Stripe-specific metadata

### Phase 3: Update Subscription Management

**Current Issue:** Subscription management likely uses Stripe APIs

**Solution:**
1. Create Razorpay subscription management endpoints
2. Update `src/app/dashboard/billing/page.tsx` to use Razorpay
3. Implement Razorpay subscription plans (PRO, TEAM, ENTERPRISE)
4. Create Razorpay subscription webhooks for lifecycle events

### Phase 4: Environment Variables

**Remove from `.env`:**
```bash
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PROFESSIONAL_PRICE_ID=
STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID=
```

**Keep/Add for Razorpay:**
```bash
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Razorpay Plan IDs
RAZORPAY_PRO_MONTHLY_PLAN_ID=
RAZORPAY_PRO_ANNUAL_PLAN_ID=
RAZORPAY_TEAM_MONTHLY_PLAN_ID=
RAZORPAY_TEAM_ANNUAL_PLAN_ID=
RAZORPAY_ENTERPRISE_PLAN_ID=
```

### Phase 5: Database Considerations

**Current Schema:**
- `Subscription` model likely has Stripe-specific fields
- `Payment` model may reference Stripe payment IDs

**Recommended Changes:**
- Add `paymentGateway` field to track which gateway was used
- Keep Stripe data for historical records
- New subscriptions/payments use Razorpay exclusively

## Implementation Steps

### Step 1: Disable Stripe Library

**File:** `src/lib/stripe.ts`

Add at the top:
```typescript
/**
 * STRIPE INTEGRATION DISABLED
 * 
 * This file is kept for reference but Stripe integration is disabled.
 * All payment processing now uses Razorpay exclusively.
 * 
 * To re-enable Stripe, uncomment the code below and configure environment variables.
 */

// Placeholder exports to prevent import errors
export const stripe = null;
export const STRIPE_PRICES = {};
export const SUBSCRIPTION_PLANS = {};
export function formatPrice() { return '$0'; }
export function getPlanFromPriceId() { return null; }
```

### Step 2: Disable Stripe API Routes

Add to each Stripe API route:
```typescript
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Stripe payment method is no longer available. Please use Razorpay.' 
    },
    { status: 410 } // 410 Gone
  );
}
```

### Step 3: Update Payment Gateway Selector

**File:** `src/components/payment/payment-gateway-selector.tsx`

Remove Stripe option, show only Razorpay:
```typescript
const paymentGateways = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Credit/Debit Cards, UPI, Net Banking, Wallets',
    icon: '💳',
    available: true,
  },
  // Stripe option removed
];
```

### Step 4: Update Pricing Page

**File:** `src/app/pricing/page.tsx`

Replace Stripe checkout buttons with Razorpay:
```typescript
import { RazorpayCheckoutButton } from '@/components/payment/razorpay-checkout-button';

// In the pricing cards:
<RazorpayCheckoutButton
  planId={plan.razorpayPlanId}
  planName={plan.name}
  amount={plan.price}
  currency="INR"
  billingCycle={billingCycle}
/>
```

### Step 5: Create Razorpay Subscription Endpoints

**New File:** `src/app/api/razorpay/create-subscription/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planId, billingCycle } = await request.json();

  // Create Razorpay subscription
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: billingCycle === 'annual' ? 1 : 12,
    notes: {
      userId: session.user.id,
      billingCycle,
    },
  });

  // Save to database
  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      razorpaySubscriptionId: subscription.id,
      plan: 'PRO', // or TEAM, ENTERPRISE
      status: 'PENDING',
      billingCycle,
    },
  });

  return NextResponse.json({
    success: true,
    subscriptionId: subscription.id,
    shortUrl: subscription.short_url,
  });
}
```

## Testing Checklist

After implementing changes:

- [ ] Verify Stripe API routes return 410 Gone error
- [ ] Confirm pricing page shows only Razorpay options
- [ ] Test Razorpay subscription creation flow
- [ ] Test Razorpay service purchase flow
- [ ] Verify Razorpay webhooks are working
- [ ] Check dashboard billing page uses Razorpay
- [ ] Ensure no Stripe imports cause build errors
- [ ] Test payment success/failure flows
- [ ] Verify subscription management (cancel, resume)
- [ ] Check payment history displays correctly

## Rollback Plan

If issues arise:

1. Stripe files are commented out, not deleted
2. Uncomment Stripe code in `src/lib/stripe.ts`
3. Re-enable Stripe API routes
4. Add Stripe options back to payment gateway selector
5. Restore Stripe environment variables

## Benefits of Razorpay-Only Approach

1. **Simplified Codebase:** Single payment gateway reduces complexity
2. **Better for Indian Market:** Razorpay supports UPI, Net Banking, Wallets
3. **Lower Fees:** Razorpay typically has lower fees for Indian transactions
4. **Easier Maintenance:** One integration to maintain and update
5. **Consistent UX:** Single checkout experience for all users

## Notes

- Keep Stripe data in database for historical records
- Add `paymentGateway: 'RAZORPAY'` field to new records
- Update email templates to reference Razorpay instead of Stripe
- Update documentation and help articles
- Inform existing Stripe subscribers about the change

## Status

**Current Status:** Stripe and Razorpay both active (dual gateway setup)

**Target Status:** Razorpay only (Stripe disabled but code preserved)

**Estimated Effort:** 4-6 hours for full implementation and testing

---

**Last Updated:** 2025-10-27
**Author:** MediaPlanPro Development Team

