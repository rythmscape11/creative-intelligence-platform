# 🧪 RAZORPAY PAYMENT TESTING GUIDE

## 🎯 Quick Start

### Step 1: Wait for Deployment
Vercel is deploying your changes. Check status at:
https://vercel.com/anustups-projects-438c3483/mediaplanpro

### Step 2: Test the Pricing Page
Once deployed, go to: **https://www.mediaplanpro.com/pricing**

### Step 3: Test Razorpay Checkout
1. Sign in to your account
2. Click "Upgrade Now" on PRO plan
3. Select "Razorpay" payment gateway
4. Use Razorpay test card for recurring payments:
   - **Card Number:** `5104 0600 0000 0008` (Mastercard - Supports Recurring) ✅ **RECOMMENDED**
   - **Expiry:** `12/25` (or any future date)
   - **CVV:** `123` (or any 3 digits)
   - **Name:** Any name

   **Alternative Test Cards:**
   - `4111 1111 1111 1111` - Visa (Basic - May not support recurring payments)
   - `6073 8210 0000 0007` - RuPay (Supports Recurring)

5. Complete payment

### Step 4: Verify Success
- Check dashboard for active subscription
- Check Razorpay Dashboard for webhook events

---

## ✅ TEST CHECKLIST

- [ ] Pricing page loads correctly
- [ ] Payment gateway selector appears
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Subscription created in dashboard
- [ ] Webhooks fire correctly

---

## 🔗 USEFUL LINKS

- **Pricing Page**: https://www.mediaplanpro.com/pricing
- **Razorpay Dashboard**: https://dashboard.razorpay.com/
- **Razorpay Subscriptions**: https://dashboard.razorpay.com/app/subscriptions
- **Razorpay Webhooks**: https://dashboard.razorpay.com/app/webhooks

---

**Ready to test!** 🚀
