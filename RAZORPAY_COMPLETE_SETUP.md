# 🇮🇳 RAZORPAY INTEGRATION - COMPLETE SETUP GUIDE

## 🎉 Razorpay for Indian Users

Since Stripe is not available for Indian businesses, MediaPlanPro has **full Razorpay integration** already built-in!

---

## ✅ What's Already Implemented

Your codebase already has complete Razorpay integration:

1. ✅ **Razorpay Library** (`src/lib/razorpay.ts`) - Complete implementation
2. ✅ **API Routes** (`/api/checkout/razorpay`) - Subscription creation
3. ✅ **Webhook Handler** (`/api/webhooks/razorpay`) - Event processing
4. ✅ **Checkout Component** (`RazorpayCheckoutButton`) - Client-side integration
5. ✅ **Subscription Management** - Full lifecycle handling

---

## 🚀 STEP 1: CREATE RAZORPAY ACCOUNT

### 1.1 Sign Up for Razorpay

1. Go to: **https://dashboard.razorpay.com/signup**
2. Sign up with your business details
3. Complete KYC verification (required for live mode)
4. For now, you can use **Test Mode** to set everything up

### 1.2 Get API Keys

1. Go to: **https://dashboard.razorpay.com/app/keys**
2. Switch to **Test Mode** (toggle at top)
3. Copy your **Key ID** (starts with `rzp_test_`)
4. Copy your **Key Secret** (click "Generate Test Key" if needed)

**⚠️ IMPORTANT:** Keep your Key Secret secure! Never commit it to git.

---

## 🚀 STEP 2: CREATE SUBSCRIPTION PLANS

### Option A: Automated Setup (Recommended)

I've created an automated script that will create all plans for you:

```bash
# Set your Razorpay credentials
export RAZORPAY_KEY_ID="rzp_test_xxxxx"
export RAZORPAY_KEY_SECRET="your_secret_key"

# Run the setup script
node scripts/setup-razorpay-plans.js
```

This will create:
- **Pro Plan (Monthly)**: ₹3,200/month with 14-day trial
- **Pro Plan (Yearly)**: ₹32,000/year with 14-day trial (save ₹6,400)
- **Team Plan (Monthly)**: ₹8,000/month with 14-day trial
- **Team Plan (Yearly)**: ₹80,000/year with 14-day trial (save ₹16,000)

### Option B: Manual Setup

If you prefer to create plans manually:

1. Go to: **https://dashboard.razorpay.com/app/subscriptions/plans**
2. Click "Create Plan"
3. Create each plan with these details:

**Pro Plan (Monthly)**
- Plan Name: `MediaPlanPro - Pro Plan (Monthly)`
- Billing Amount: `₹3,200`
- Billing Cycle: `Monthly`
- Trial Period: `14 days`
- Description: `Pro Plan - Monthly subscription with 14-day free trial`

**Pro Plan (Yearly)**
- Plan Name: `MediaPlanPro - Pro Plan (Yearly)`
- Billing Amount: `₹32,000`
- Billing Cycle: `Yearly`
- Trial Period: `14 days`
- Description: `Pro Plan - Yearly subscription with 14-day free trial (Save ₹6,400/year)`

**Team Plan (Monthly)**
- Plan Name: `MediaPlanPro - Team Plan (Monthly)`
- Billing Amount: `₹8,000`
- Billing Cycle: `Monthly`
- Trial Period: `14 days`
- Description: `Team Plan - Monthly subscription with 14-day free trial (Up to 10 members)`

**Team Plan (Yearly)**
- Plan Name: `MediaPlanPro - Team Plan (Yearly)`
- Billing Amount: `₹80,000`
- Billing Cycle: `Yearly`
- Trial Period: `14 days`
- Description: `Team Plan - Yearly subscription with 14-day free trial (Up to 10 members, Save ₹16,000/year)`

4. Copy each Plan ID (starts with `plan_`)

---

## 🚀 STEP 3: SET UP WEBHOOK

### Option A: Automated Setup (Recommended)

```bash
# Make sure credentials are set
export RAZORPAY_KEY_ID="rzp_test_xxxxx"
export RAZORPAY_KEY_SECRET="your_secret_key"

# Run the webhook setup script
node scripts/setup-razorpay-webhook.js
```

### Option B: Manual Setup

1. Go to: **https://dashboard.razorpay.com/app/webhooks**
2. Click "Create Webhook"
3. Enter webhook URL: `https://www.mediaplanpro.com/api/webhooks/razorpay`
4. Select these events:
   - ✅ `subscription.activated`
   - ✅ `subscription.charged`
   - ✅ `subscription.completed`
   - ✅ `subscription.cancelled`
   - ✅ `subscription.paused`
   - ✅ `subscription.resumed`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `invoice.paid`
5. Set a webhook secret (generate a random 32-character string)
6. Save the webhook
7. Copy the webhook secret

---

## 🚀 STEP 4: UPDATE ENVIRONMENT VARIABLES

### 4.1 Update Local `.env` File

Add these variables to your `.env` file:

```bash
# Razorpay Payment Gateway (for Indian users)
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your_secret_key"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Razorpay Plan IDs
RAZORPAY_PRO_MONTHLY_PLAN_ID="plan_xxxxx"
RAZORPAY_PRO_YEARLY_PLAN_ID="plan_xxxxx"
RAZORPAY_TEAM_MONTHLY_PLAN_ID="plan_xxxxx"
RAZORPAY_TEAM_YEARLY_PLAN_ID="plan_xxxxx"
```

### 4.2 Add to Vercel

Go to: **https://vercel.com/anustups-projects-438c3483/mediaplanpro/settings/environment-variables**

Add these 7 variables (select Production, Preview, Development for each):

1. **RAZORPAY_KEY_ID** = `rzp_test_xxxxx`
2. **RAZORPAY_KEY_SECRET** = `your_secret_key`
3. **RAZORPAY_WEBHOOK_SECRET** = `your_webhook_secret`
4. **RAZORPAY_PRO_MONTHLY_PLAN_ID** = `plan_xxxxx`
5. **RAZORPAY_PRO_YEARLY_PLAN_ID** = `plan_xxxxx`
6. **RAZORPAY_TEAM_MONTHLY_PLAN_ID** = `plan_xxxxx`
7. **RAZORPAY_TEAM_YEARLY_PLAN_ID** = `plan_xxxxx`

---

## 🚀 STEP 5: UPDATE PRICING CONFIGURATION

The pricing configuration needs to be updated with your new amounts. I'll do this automatically.

---

## 🚀 STEP 6: TEST THE INTEGRATION

### 6.1 Redeploy on Vercel

After adding environment variables:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Click "Redeploy" on latest deployment
4. Wait 2-3 minutes

### 6.2 Test Checkout Flow

1. Go to: **https://www.mediaplanpro.com/pricing**
2. Click "Upgrade to Pro" or "Start Free Trial"
3. Razorpay checkout should open
4. Use test card details:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Name**: Any name
5. Complete checkout
6. Verify redirect to dashboard
7. Check subscription is active

### 6.3 Verify in Razorpay Dashboard

1. **Subscriptions**: https://dashboard.razorpay.com/app/subscriptions
   - You should see the new subscription

2. **Payments**: https://dashboard.razorpay.com/app/payments
   - You should see the test payment

3. **Webhooks**: https://dashboard.razorpay.com/app/webhooks
   - Click on your webhook
   - Check "Events" tab - you should see events being received
   - Verify no errors

---

## 📊 PRICING SUMMARY

### Pro Plan
- **Monthly**: ₹3,200/month (14-day free trial)
- **Yearly**: ₹32,000/year (14-day free trial, save ₹6,400/year - 17% discount)

**Features:**
- All 30 marketing tools
- Save unlimited results
- Premium PDF exports
- AI-powered recommendations
- Save strategies
- Priority support

### Team Plan
- **Monthly**: ₹8,000/month (14-day free trial)
- **Yearly**: ₹80,000/year (14-day free trial, save ₹16,000/year - 17% discount)

**Features:**
- Everything in Pro
- Team collaboration
- Up to 10 team members
- Shared workspace
- Advanced analytics
- Team management

---

## 🧪 TEST CARDS

Razorpay provides these test cards:

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **3D Secure**: `5104 0600 0000 0008`

More test cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

## 🆘 TROUBLESHOOTING

### Issue: "Payment gateway not configured"
**Solution:**
- Verify all 7 environment variables are added to Vercel
- Redeploy the application
- Wait 2-3 minutes for deployment to complete
- Clear browser cache and try again

### Issue: Checkout button not working
**Solution:**
- Check browser console for errors (F12)
- Verify `RAZORPAY_KEY_ID` is set
- Ensure Plan IDs are correct (start with `plan_`)
- Check that billing cycle matches (monthly/yearly)

### Issue: Webhooks not firing
**Solution:**
- Verify webhook endpoint is accessible
- Check webhook secret is correct in Vercel
- Go to Razorpay Dashboard > Webhooks > Click your webhook
- Check "Events" tab for errors
- Verify all 9 events are selected

### Issue: Subscription not showing in dashboard
**Solution:**
- Check webhook events are being received
- Check Vercel function logs for errors
- Verify database connection is working
- Check Prisma schema is up to date

---

## 📞 SUPPORT RESOURCES

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Support**: https://razorpay.com/support/
- **Razorpay Dashboard**: https://dashboard.razorpay.com/
- **Test Mode**: https://razorpay.com/docs/payments/payments/test-mode/

---

## 🎯 SUMMARY

**What You Need to Do:**
1. ⏱️ Create Razorpay account (5 minutes)
2. ⏱️ Get API keys (2 minutes)
3. ⏱️ Run automated setup scripts (3 minutes)
4. ⏱️ Add 7 environment variables to Vercel (5 minutes)
5. ⏱️ Redeploy on Vercel (3 minutes)
6. ⏱️ Test checkout flow (2 minutes)

**Total Time**: 20 minutes

**Result**: Fully functional Razorpay payments for Indian users! 🇮🇳💰

---

**Ready to accept payments from Indian customers? Let's get started!**

