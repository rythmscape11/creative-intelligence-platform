# Razorpay Pricing Mismatch Fix Instructions

## Issue Summary
The Razorpay payment popup is showing **₹3,200** instead of **₹2,999** for the Pro Monthly plan. This pricing mismatch affects customer trust and revenue.

## Root Cause
When using Razorpay subscriptions, the **actual charge amount comes from the plan configuration in the Razorpay Dashboard**, NOT from the amount passed in the API code. The amount in the code is only used for display purposes in the checkout popup.

**Current State:**
- Code expects: ₹2,999 (299900 paise)
- Razorpay Dashboard plan configured with: ₹3,200 (320000 paise)
- Result: Popup shows ₹3,200 (incorrect)

## Solution: Update Razorpay Dashboard Plans

You need to log into your Razorpay Dashboard and update the plan amounts to match the pricing shown on your website.

### Step-by-Step Fix

#### 1. Log into Razorpay Dashboard
- Go to https://dashboard.razorpay.com/
- Sign in with your credentials

#### 2. Navigate to Subscriptions > Plans
- Click on "Subscriptions" in the left sidebar
- Click on "Plans"

#### 3. Update Each Plan Amount

You need to update the following plans:

| Plan Name | Current Amount (Wrong) | Correct Amount | Amount in Paise |
|-----------|------------------------|----------------|-----------------|
| Pro Monthly | ₹3,200 | ₹2,999 | 299900 |
| Pro Yearly | (Check dashboard) | ₹29,990 | 2999000 |
| Team Monthly | (Check dashboard) | ₹4,999 | 499900 |
| Team Yearly | (Check dashboard) | ₹49,990 | 4999000 |

#### 4. For Each Plan:
1. Click on the plan name to edit it
2. Update the "Amount" field to the correct value in paise
   - Pro Monthly: 299900 paise (₹2,999)
   - Pro Yearly: 2999000 paise (₹29,990)
   - Team Monthly: 499900 paise (₹4,999)
   - Team Yearly: 4999000 paise (₹49,990)
3. Save the changes

#### 5. Verify the Fix
After updating the plans:
1. Go to your website's pricing page
2. Click "Start Free Trial" or "Upgrade Now" for the Pro plan
3. Complete the checkout flow until the Razorpay popup appears
4. Verify the popup shows ₹2,999 (not ₹3,200)

### Alternative Solution: Create New Plans

If you cannot edit existing plans (some Razorpay accounts don't allow editing active plans), you'll need to:

1. **Create new plans** with the correct amounts:
   - Pro Monthly: 299900 paise
   - Pro Yearly: 2999000 paise
   - Team Monthly: 499900 paise
   - Team Yearly: 4999000 paise

2. **Copy the new plan IDs** from the Razorpay dashboard

3. **Update environment variables** in your Vercel project:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Update these variables with the new plan IDs:
     - `RAZORPAY_PRO_MONTHLY_PLAN_ID`
     - `RAZORPAY_PRO_YEARLY_PLAN_ID`
     - `RAZORPAY_TEAM_MONTHLY_PLAN_ID`
     - `RAZORPAY_TEAM_YEARLY_PLAN_ID`

4. **Redeploy your application** to apply the new environment variables

## Pricing Reference

The correct pricing (as shown on your website) is:

### Pro Plan
- Monthly: ₹2,999/month ($35/month)
- Yearly: ₹29,990/year (17% discount)

### Team Plan
- Monthly: ₹4,999/month ($59/month)
- Yearly: ₹49,990/year (17% discount)

## Technical Details

### Code Configuration
The pricing is correctly configured in the code at `src/lib/razorpay.ts`:

```typescript
export const RAZORPAY_PLANS = {
  PRO_MONTHLY: {
    id: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || 'plan_placeholder',
    name: 'Pro Monthly',
    amount: 299900, // ₹2,999 in paise ✅ CORRECT
    currency: 'INR',
    period: 'monthly',
    interval: 1,
  },
  // ... other plans
}
```

### Why This Happens
Razorpay subscriptions work differently from one-time payments:
- **One-time payments**: Amount is set in the API call
- **Subscriptions**: Amount is set in the Razorpay Dashboard plan configuration

When you create a subscription using a plan ID, Razorpay uses the amount configured in the dashboard for that plan, regardless of what amount you pass in the API.

## Verification Checklist

After applying the fix, verify:

- [ ] Pro Monthly plan shows ₹2,999 in Razorpay popup
- [ ] Pro Yearly plan shows ₹29,990 in Razorpay popup
- [ ] Team Monthly plan shows ₹4,999 in Razorpay popup
- [ ] Team Yearly plan shows ₹49,990 in Razorpay popup
- [ ] Test payment flow completes successfully
- [ ] Webhook receives correct amount in payment confirmation

## Support

If you encounter any issues:
1. Check Razorpay Dashboard > Subscriptions > Plans to verify amounts
2. Check Vercel environment variables are set correctly
3. Check browser console for any API errors
4. Contact Razorpay support if you cannot edit plan amounts

## Status
- [x] Issue identified
- [x] Root cause determined
- [x] Solution documented
- [ ] Razorpay Dashboard plans updated (requires manual action)
- [ ] Fix verified in production

