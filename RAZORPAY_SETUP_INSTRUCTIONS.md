# Razorpay Payment Gateway Setup Instructions

## 📋 Overview

This guide will help you set up Razorpay payment gateway for MediaPlanPro to enable Pro and Team plan subscriptions.

---

## 🔑 Step 1: Get Razorpay API Credentials

1. **Create/Login to Razorpay Account**
   - Go to: https://dashboard.razorpay.com/signup
   - Complete the signup process or login if you already have an account

2. **Get API Keys**
   - Navigate to: https://dashboard.razorpay.com/app/keys
   - You'll see two keys:
     - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for production)
     - **Key Secret** (click "Generate Secret" if not already generated)
   - **IMPORTANT**: Keep these credentials secure and never commit them to Git

3. **Choose Mode**
   - **Test Mode**: Use for development and testing (no real money)
   - **Live Mode**: Use for production (real transactions)
   - Start with Test Mode, then switch to Live Mode when ready

---

## 🚀 Step 2: Create Subscription Plans

1. **Set Environment Variables** (in your terminal):
   ```bash
   export RAZORPAY_KEY_ID="rzp_test_xxxxx"
   export RAZORPAY_KEY_SECRET="xxxxx"
   ```

2. **Run the Setup Script**:
   ```bash
   node scripts/setup-razorpay-plans.js
   ```

3. **Save the Plan IDs**:
   The script will output 4 Plan IDs. Copy them - you'll need them in the next step.
   
   Example output:
   ```
   RAZORPAY_PRO_MONTHLY_PLAN_ID="plan_xxxxx"
   RAZORPAY_PRO_YEARLY_PLAN_ID="plan_xxxxx"
   RAZORPAY_TEAM_MONTHLY_PLAN_ID="plan_xxxxx"
   RAZORPAY_TEAM_YEARLY_PLAN_ID="plan_xxxxx"
   ```

---

## 🔧 Step 3: Update Environment Variables

### Local Development (.env.local)

Add these variables to your `.env.local` file:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="xxxxx"

# Razorpay Plan IDs (from Step 2)
RAZORPAY_PRO_MONTHLY_PLAN_ID="plan_xxxxx"
RAZORPAY_PRO_YEARLY_PLAN_ID="plan_xxxxx"
RAZORPAY_TEAM_MONTHLY_PLAN_ID="plan_xxxxx"
RAZORPAY_TEAM_YEARLY_PLAN_ID="plan_xxxxx"

# Razorpay Webhook Secret (from Step 4)
RAZORPAY_WEBHOOK_SECRET="xxxxx"
```

### Vercel Production

1. **Go to Vercel Dashboard**:
   - Navigate to: https://vercel.com/anustups-projects-438c3483/mediaplanpro/settings/environment-variables

2. **Add Each Environment Variable**:
   - Click "Add New"
   - Enter variable name (e.g., `RAZORPAY_KEY_ID`)
   - Enter variable value
   - Select environment: **Production**, **Preview**, and **Development**
   - Click "Save"

3. **Add All Variables**:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_PRO_MONTHLY_PLAN_ID`
   - `RAZORPAY_PRO_YEARLY_PLAN_ID`
   - `RAZORPAY_TEAM_MONTHLY_PLAN_ID`
   - `RAZORPAY_TEAM_YEARLY_PLAN_ID`
   - `RAZORPAY_WEBHOOK_SECRET` (after Step 4)

---

## 🔔 Step 4: Setup Webhook (Optional but Recommended)

Webhooks notify your app when payment events occur (successful payment, failed payment, subscription cancelled, etc.)

1. **Run the Webhook Setup Script**:
   ```bash
   node scripts/setup-razorpay-webhook.js
   ```

2. **Get Webhook Secret**:
   - Go to: https://dashboard.razorpay.com/app/webhooks
   - Click on the webhook that was created
   - Copy the **Webhook Secret**
   - Add it to your environment variables as `RAZORPAY_WEBHOOK_SECRET`

3. **Webhook URL**:
   - Production: `https://mediaplanpro.com/api/webhooks/razorpay`
   - The webhook will handle these events:
     - `subscription.activated`
     - `subscription.charged`
     - `subscription.cancelled`
     - `subscription.paused`
     - `subscription.resumed`
     - `payment.failed`

---

## 🧪 Step 5: Test the Payment Flow

1. **Redeploy Application**:
   ```bash
   npx vercel --prod
   ```

2. **Test in Browser**:
   - Go to: https://mediaplanpro.com/pricing
   - Click "Upgrade to Pro" or "Upgrade to Team"
   - Use Razorpay test card details:
     - **Card Number**: 4111 1111 1111 1111
     - **CVV**: Any 3 digits
     - **Expiry**: Any future date
     - **Name**: Any name

3. **Verify in Razorpay Dashboard**:
   - Go to: https://dashboard.razorpay.com/app/subscriptions
   - You should see the test subscription

4. **Check Database**:
   - Verify the user's subscription status was updated
   - Check the `subscriptions` table in your database

---

## 📊 Subscription Plans Summary

| Plan | Monthly | Yearly | Savings | Trial |
|------|---------|--------|---------|-------|
| **Pro** | ₹2,999/month | ₹29,990/year | ₹5,998/year (17%) | 14 days |
| **Team** | ₹4,999/month | ₹49,990/year | ₹9,998/year (17%) | 14 days |

**Team Plan Features**:
- Up to 10 team members
- All Pro features
- Collaborative workspace
- Priority support

---

## 🔒 Security Best Practices

1. **Never Commit Credentials**:
   - Add `.env.local` to `.gitignore`
   - Never hardcode API keys in code

2. **Use Environment Variables**:
   - Always use `process.env.RAZORPAY_KEY_ID`
   - Never expose secrets in client-side code

3. **Verify Webhook Signatures**:
   - Always verify webhook signatures to prevent fraud
   - The webhook handler already does this

4. **Use HTTPS**:
   - Razorpay requires HTTPS for webhooks
   - Vercel provides HTTPS by default

5. **Switch to Live Mode Carefully**:
   - Test thoroughly in Test Mode first
   - Update all environment variables when switching to Live Mode
   - Complete Razorpay KYC verification for Live Mode

---

## 🐛 Troubleshooting

### Issue: "Razorpay credentials not found"
**Solution**: Make sure you've exported the environment variables in your terminal before running the script.

### Issue: "Invalid API key"
**Solution**: 
- Check that you copied the full key (including `rzp_test_` or `rzp_live_` prefix)
- Make sure you're using the correct mode (Test vs Live)

### Issue: "Plan already exists"
**Solution**: 
- Check your Razorpay dashboard for existing plans
- You can reuse existing plan IDs instead of creating new ones

### Issue: Webhook not receiving events
**Solution**:
- Verify webhook URL is correct and accessible
- Check webhook secret is correct
- Ensure your app is deployed and running
- Check Razorpay webhook logs in dashboard

### Issue: Payment succeeds but subscription not activated
**Solution**:
- Check webhook is configured correctly
- Verify webhook secret matches
- Check application logs for errors
- Ensure database connection is working

---

## 📞 Support

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Support**: https://razorpay.com/support/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/

---

## ✅ Checklist

- [ ] Created Razorpay account
- [ ] Got API keys (Key ID and Key Secret)
- [ ] Ran `setup-razorpay-plans.js` script
- [ ] Saved all 4 Plan IDs
- [ ] Added environment variables to `.env.local`
- [ ] Added environment variables to Vercel
- [ ] Ran `setup-razorpay-webhook.js` script
- [ ] Added webhook secret to environment variables
- [ ] Redeployed application
- [ ] Tested payment flow with test card
- [ ] Verified subscription in Razorpay dashboard
- [ ] Verified subscription in database
- [ ] Ready to switch to Live Mode (when ready for production)

---

**Status**: ⏳ **REQUIRES MANUAL ACTION**

This setup requires you to:
1. Access Razorpay dashboard to get API credentials
2. Run the setup scripts with your credentials
3. Access Vercel dashboard to update environment variables
4. Redeploy the application

Once completed, the payment gateway will be fully operational and users can subscribe to Pro/Team plans!

