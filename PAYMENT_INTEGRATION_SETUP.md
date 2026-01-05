# Payment & Email Integration Setup Guide

**Date:** October 13, 2025  
**Status:** 🚧 **IMPLEMENTATION READY**

---

## 📋 Overview

This guide provides step-by-step instructions for setting up Stripe payment integration and Resend email service for MediaPlanPro.

---

## 🎯 Features Implemented

### **Payment System:**
- ✅ Stripe payment gateway integration
- ✅ Subscription management (Free, Professional, Enterprise)
- ✅ Payment checkout flow
- ✅ Invoice generation
- ✅ Payment history
- ✅ Webhook handlers
- ✅ Database schema for subscriptions, payments, and invoices

### **Email System:**
- ✅ Resend email service integration
- ✅ Transactional email templates
- ✅ Purchase confirmation emails
- ✅ Subscription renewal reminders
- ✅ Payment failure notifications
- ✅ Welcome emails

---

## 🔧 Prerequisites

### **Required Accounts:**
1. **Stripe Account** - https://stripe.com
   - Sign up for a Stripe account
   - Complete business verification
   - Get API keys (test and live)

2. **Resend Account** - https://resend.com
   - Sign up for Resend
   - Verify your domain
   - Get API key

---

## 📦 Step 1: Install Dependencies

```bash
# Install Stripe SDK
npm install stripe @stripe/stripe-js

# Install Resend SDK
npm install resend

# Install additional utilities
npm install react-hot-toast
```

---

## 🔑 Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
# ============================================================================
# STRIPE CONFIGURATION
# ============================================================================

# Stripe API Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...  # Test key (starts with sk_test_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Test key (starts with pk_test_)

# Stripe Webhook Secret (Get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product/Price IDs (Create in Stripe Dashboard)
STRIPE_PROFESSIONAL_PRICE_ID=price_...  # Monthly price ID for Professional plan
STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID=price_...  # Annual price ID (optional)

# ============================================================================
# RESEND CONFIGURATION
# ============================================================================

# Resend API Key (Get from https://resend.com/api-keys)
RESEND_API_KEY=re_...

# Email Configuration
RESEND_FROM_EMAIL=noreply@mediaplanpro.com  # Must be verified domain
RESEND_FROM_NAME=MediaPlanPro

# ============================================================================
# APPLICATION URLS
# ============================================================================

# Base URL for your application
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to production URL in production
```

---

## 🗄️ Step 3: Run Database Migration

```bash
# Generate Prisma client with new models
npx prisma generate

# Run the migration
npx prisma migrate dev --name add_payment_system

# Or apply the migration directly
npx prisma db push
```

---

## 🎨 Step 4: Create Stripe Products and Prices

### **In Stripe Dashboard:**

1. **Go to Products** - https://dashboard.stripe.com/products

2. **Create Professional Plan:**
   - Click "Add product"
   - Name: "MediaPlanPro Professional"
   - Description: "Unlimited strategies, advanced AI, priority support"
   - Pricing model: "Recurring"
   - Price: $49.00 USD
   - Billing period: Monthly
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_`) and add to `.env` as `STRIPE_PROFESSIONAL_PRICE_ID`

3. **Create Annual Plan (Optional):**
   - Add another price to the same product
   - Price: $470.40 USD (20% discount)
   - Billing period: Yearly
   - **Copy the Price ID** and add to `.env` as `STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID`

4. **Enterprise Plan:**
   - Enterprise is custom pricing, handled via contact sales
   - No Stripe product needed

---

## 🔗 Step 5: Configure Stripe Webhooks

### **Create Webhook Endpoint:**

1. **Go to Webhooks** - https://dashboard.stripe.com/webhooks

2. **Click "Add endpoint"**

3. **Endpoint URL:**
   - Development: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
   - Production: `https://www.mediaplanpro.com/api/webhooks/stripe`

4. **Select events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. **Click "Add endpoint"**

6. **Copy the Signing Secret** (starts with `whsec_`) and add to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## 📧 Step 6: Configure Resend Email

### **Verify Your Domain:**

1. **Go to Domains** - https://resend.com/domains

2. **Click "Add Domain"**

3. **Enter your domain:** `mediaplanpro.com`

4. **Add DNS Records:**
   - Copy the provided DNS records
   - Add them to your domain's DNS settings (in your domain registrar)
   - Wait for verification (can take up to 48 hours)

5. **Once verified**, you can send emails from `noreply@mediaplanpro.com`

### **Get API Key:**

1. **Go to API Keys** - https://resend.com/api-keys

2. **Click "Create API Key"**

3. **Name:** "MediaPlanPro Production"

4. **Copy the API key** and add to `.env` as `RESEND_API_KEY`

---

## 🧪 Step 7: Test the Integration

### **Test Stripe Checkout:**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to pricing page:**
   ```
   http://localhost:3000/pricing
   ```

3. **Click "Start Free Trial" on Professional plan**

4. **Use Stripe test card:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

5. **Complete checkout**

6. **Verify:**
   - User is redirected to success page
   - Subscription is created in database
   - Email is sent (check Resend dashboard)
   - Subscription appears in Stripe dashboard

### **Test Webhook Locally:**

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Trigger test events:**
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger invoice.payment_succeeded
   stripe trigger invoice.payment_failed
   ```

5. **Check logs** to verify webhook handling

---

## 📊 Step 8: Monitor and Verify

### **Stripe Dashboard:**
- Monitor payments: https://dashboard.stripe.com/payments
- View subscriptions: https://dashboard.stripe.com/subscriptions
- Check webhooks: https://dashboard.stripe.com/webhooks
- View customers: https://dashboard.stripe.com/customers

### **Resend Dashboard:**
- View sent emails: https://resend.com/emails
- Check delivery status
- View email logs

### **Database:**
```sql
-- Check subscriptions
SELECT * FROM subscriptions;

-- Check payments
SELECT * FROM payments;

-- Check invoices
SELECT * FROM invoices;
```

---

## 🚀 Step 9: Go Live

### **Switch to Production:**

1. **Update `.env` with production keys:**
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...  # From production webhook
   RESEND_API_KEY=re_...  # Production key
   NEXT_PUBLIC_APP_URL=https://www.mediaplanpro.com
   ```

2. **Create production webhook in Stripe:**
   - URL: `https://www.mediaplanpro.com/api/webhooks/stripe`
   - Same events as test webhook

3. **Verify domain in Resend** (if not already done)

4. **Test production checkout** with real card

5. **Monitor for 24 hours** to ensure everything works

---

## 🔒 Security Checklist

- ✅ Never commit `.env` file to git
- ✅ Use environment variables for all secrets
- ✅ Verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on payment endpoints
- ✅ Log all payment events
- ✅ Set up error monitoring (Sentry, etc.)
- ✅ Implement CSRF protection
- ✅ Validate all user inputs
- ✅ Use Stripe's SCA (Strong Customer Authentication)

---

## 📝 Pricing Plans Summary

| Plan | Price | Billing | Stripe Price ID |
|------|-------|---------|-----------------|
| Free | $0 | N/A | N/A (no Stripe) |
| Professional | $49 | Monthly | `STRIPE_PROFESSIONAL_PRICE_ID` |
| Professional | $470.40 | Annually | `STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID` |
| Enterprise | Custom | Custom | Contact Sales |

---

## 🆘 Troubleshooting

### **Webhook not receiving events:**
- Check webhook URL is correct
- Verify webhook secret matches `.env`
- Check Stripe webhook logs for errors
- Ensure endpoint is publicly accessible (use ngrok for local testing)

### **Email not sending:**
- Verify domain is verified in Resend
- Check API key is correct
- Check Resend dashboard for error logs
- Verify `from` email matches verified domain

### **Payment failing:**
- Check Stripe logs for error details
- Verify price IDs are correct
- Ensure customer has valid payment method
- Check for insufficient funds or card declined

### **Subscription not updating:**
- Check webhook is receiving events
- Verify database connection
- Check application logs for errors
- Ensure Prisma client is up to date

---

## 📚 Additional Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Testing:** https://stripe.com/docs/testing
- **Resend Documentation:** https://resend.com/docs
- **Next.js API Routes:** https://nextjs.org/docs/api-routes/introduction
- **Prisma Documentation:** https://www.prisma.io/docs

---

## ✅ Checklist

Before going live, ensure:

- [ ] Stripe account verified
- [ ] Resend domain verified
- [ ] All environment variables set
- [ ] Database migration completed
- [ ] Stripe products/prices created
- [ ] Webhook endpoint configured
- [ ] Test checkout completed successfully
- [ ] Test emails received
- [ ] Webhook events handled correctly
- [ ] Error monitoring set up
- [ ] Security measures implemented
- [ ] Production keys configured
- [ ] Team trained on payment flow
- [ ] Customer support prepared

---

**Setup By:** AI Assistant  
**Date:** October 13, 2025  
**Status:** 🚧 **READY FOR IMPLEMENTATION**

