# Quick Setup Reference - Google OAuth & Stripe

**Date:** October 13, 2025  
**Application:** MediaPlanPro

---

## 🚀 Quick Links

- **Detailed Google OAuth Guide:** [GOOGLE_OAUTH_SETUP_GUIDE.md](./GOOGLE_OAUTH_SETUP_GUIDE.md)
- **Detailed Stripe Guide:** [STRIPE_SETUP_GUIDE.md](./STRIPE_SETUP_GUIDE.md)
- **Environment Variables Guide:** [ENVIRONMENT_VARIABLES_GUIDE.md](./ENVIRONMENT_VARIABLES_GUIDE.md)

---

## 📋 Google OAuth - Quick Steps

### **1. Google Cloud Console Setup (15 minutes)**

1. Go to: https://console.cloud.google.com
2. Create project: "MediaPlanPro"
3. Enable API: "Google+ API"
4. Configure OAuth consent screen:
   - User type: External
   - App name: MediaPlanPro
   - Authorized domains: `mediaplanpro.com`, `localhost`
5. Create OAuth 2.0 Client ID:
   - Type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://www.mediaplanpro.com/api/auth/callback/google`
6. Copy Client ID and Client Secret

### **2. Add to .env (Development)**

```env
GOOGLE_CLIENT_ID="123456789-abc...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
```

### **3. Add to Vercel (Production)**

1. Vercel Dashboard → Settings → Environment Variables
2. Add `GOOGLE_CLIENT_ID` (all environments)
3. Add `GOOGLE_CLIENT_SECRET` (all environments)
4. Redeploy

### **4. Test**

- Development: http://localhost:3000/auth/signin
- Production: https://www.mediaplanpro.com/auth/signin
- Click "Sign in with Google"

---

## 💳 Stripe - Quick Steps

### **1. Stripe Account Setup (30 minutes)**

1. Go to: https://stripe.com
2. Create account with business email
3. Complete business profile
4. Add bank account for payouts

### **2. Test Mode Setup**

1. Switch to Test Mode (toggle in top-left)
2. Get API keys: Developers → API keys
   - Copy Publishable key (`pk_test_...`)
   - Copy Secret key (`sk_test_...`)
3. Create products: Products → Add product
   - Professional Monthly: $49/month
   - Professional Annual: $470/year
   - Copy both Price IDs
4. Create webhook: Developers → Webhooks
   - URL: `https://www.mediaplanpro.com/api/webhooks/stripe`
   - Events: All subscription and payment events
   - Copy Webhook Secret

### **3. Add to .env (Development - Test Mode)**

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_..."
STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID="price_..."
```

### **4. Test in Development**

1. Go to: http://localhost:3000/pricing
2. Click "Start Free Trial"
3. Select "International Payment (USD)"
4. Use test card: `4242 4242 4242 4242`
5. Verify payment success

### **5. Live Mode Setup (When Ready)**

1. Complete account activation in Stripe
2. Switch to Live Mode
3. Get live API keys
4. Create live products (same as test)
5. Create live webhook
6. Copy all live credentials

### **6. Add to Vercel (Production - Live Mode)**

1. Vercel Dashboard → Settings → Environment Variables
2. Add all 5 Stripe variables (Production only)
3. Redeploy

### **7. Test in Production**

1. Go to: https://www.mediaplanpro.com/pricing
2. Use real credit card
3. Verify payment success
4. Cancel test subscription

---

## 🔑 Environment Variables Summary

### **Google OAuth (Optional)**

```env
# Development & Production
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### **Stripe (Optional)**

```env
# Development (Test Mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_test_..."
STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID="price_test_..."

# Production (Live Mode)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_live_..."
STRIPE_PROFESSIONAL_PRICE_ID="price_live_..."
STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID="price_live_..."
```

### **Already Configured**

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"  # or production URL
NEXTAUTH_SECRET="your-secret"
JWT_SECRET="your-jwt-secret"

# Resend Email
RESEND_API_KEY="re_Y3Pxb1xN_8P3SUDNRzjDAnqmkUjUKreKj"

# Razorpay (India)
RAZORPAY_KEY_ID="rzp_live_RSvnlDEsMDR3JV"
RAZORPAY_KEY_SECRET="4lmxhYNeZza4INjSvh5dOMuT"
RAZORPAY_WEBHOOK_SECRET="B4wRFrRr4Y_HM4u"
RAZORPAY_PROFESSIONAL_PLAN_ID="plan_RSwSKydH3762TR"
RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID="plan_RSwRRGdjIUFKHF"
```

---

## 🧪 Test Cards & Credentials

### **Stripe Test Cards**

| Purpose | Card Number | Expiry | CVC | ZIP |
|---------|-------------|--------|-----|-----|
| Success | 4242 4242 4242 4242 | 12/34 | 123 | 12345 |
| 3D Secure | 4000 0025 0000 3155 | 12/34 | 123 | 12345 |
| Declined | 4000 0000 0000 9995 | 12/34 | 123 | 12345 |

### **Razorpay Test Cards**

| Purpose | Card Number | CVV | Expiry |
|---------|-------------|-----|--------|
| Success | 4111 1111 1111 1111 | 123 | 12/34 |
| Failure | 4000 0000 0000 0002 | 123 | 12/34 |

### **Razorpay Test UPI**

- UPI ID: `success@razorpay`

---

## ✅ Verification Checklist

### **Google OAuth**

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URIs added (dev & prod)
- [ ] Credentials added to .env
- [ ] Credentials added to Vercel
- [ ] Tested in development
- [ ] Tested in production

### **Stripe**

- [ ] Stripe account created
- [ ] Business profile completed
- [ ] Test API keys obtained
- [ ] Test products created
- [ ] Test webhook created
- [ ] Test credentials added to .env
- [ ] Tested in development
- [ ] Account activated for live mode
- [ ] Live API keys obtained
- [ ] Live products created
- [ ] Live webhook created
- [ ] Live credentials added to Vercel
- [ ] Tested in production

---

## 🔍 Troubleshooting Quick Fixes

### **Google OAuth Issues**

| Error | Quick Fix |
|-------|-----------|
| redirect_uri_mismatch | Check redirect URIs in Google Console |
| Access blocked | Add email to test users in OAuth consent screen |
| Button not showing | Check credentials in .env, restart server |

### **Stripe Issues**

| Error | Quick Fix |
|-------|-----------|
| No such price | Check Price ID, verify correct mode (test/live) |
| Invalid API key | Verify key is correct, check mode matches |
| Webhook failed | Check webhook secret, verify endpoint URL |

---

## 📞 Support Resources

### **Google OAuth**

- **Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Console:** https://console.cloud.google.com
- **Support:** https://support.google.com/cloud

### **Stripe**

- **Documentation:** https://stripe.com/docs
- **Dashboard:** https://dashboard.stripe.com
- **Support:** Available in Stripe Dashboard (chat/email)

### **MediaPlanPro**

- **Codebase:** Check `src/lib/auth.ts` and `src/lib/stripe.ts`
- **Documentation:** See detailed guides in project root
- **Environment Variables:** See `ENVIRONMENT_VARIABLES_GUIDE.md`

---

## 🎯 Priority Setup Order

### **Recommended Order:**

1. **✅ Already Done:**
   - Database (PostgreSQL)
   - NextAuth configuration
   - Resend email service
   - Razorpay payment gateway

2. **Optional - High Priority:**
   - **Stripe** (for international customers)
   - Enables payment from 135+ countries
   - Recommended if targeting global market

3. **Optional - Medium Priority:**
   - **Google OAuth** (for easier sign-up)
   - Improves conversion rates
   - Reduces friction for users

4. **Optional - Low Priority:**
   - AWS S3 (file storage)
   - Redis (caching)
   - Sentry (error tracking)

---

## 💡 Pro Tips

### **Google OAuth**

1. **Test with multiple Google accounts** to ensure it works for everyone
2. **Add your team members as test users** during development
3. **Monitor OAuth consent screen** for user feedback
4. **Consider adding other providers** (GitHub, Microsoft) later

### **Stripe**

1. **Start with test mode** and thoroughly test before going live
2. **Enable Stripe Radar** for fraud prevention (free)
3. **Set up email notifications** for failed payments
4. **Monitor webhook delivery** to catch issues early
5. **Use Stripe Checkout** (already implemented) for best conversion

### **General**

1. **Keep test and live credentials separate**
2. **Never commit secrets to Git** (.env is in .gitignore)
3. **Use environment-specific values** in Vercel
4. **Test thoroughly** before launching to production
5. **Monitor logs** for the first few days after launch

---

## 🎉 What's Next?

### **After Setup:**

1. **Test all features:**
   - Sign in with Google
   - Sign up with Google
   - Stripe checkout
   - Payment success/failure
   - Email notifications

2. **Monitor metrics:**
   - Sign-up conversion rate
   - Payment success rate
   - Webhook delivery rate
   - User feedback

3. **Optimize:**
   - A/B test pricing
   - Improve checkout flow
   - Add more payment methods
   - Expand to new markets

---

**Last Updated:** October 13, 2025  
**Status:** ✅ **READY TO USE**

**Need help?** Check the detailed guides or contact support!

