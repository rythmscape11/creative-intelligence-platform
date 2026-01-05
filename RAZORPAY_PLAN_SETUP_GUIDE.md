# Razorpay Subscription Plans Setup Guide

**Date:** October 13, 2025  
**Issue:** "Razorpay plan not configured. Please contact support."  
**Solution:** Create subscription plans in Razorpay Dashboard

---

## 🚨 Problem

You're seeing this error because the Razorpay plan IDs in your `.env` file don't exist yet in your Razorpay Dashboard. The plan IDs need to be created first before they can be used.

**Current Plan IDs in .env:**
```env
RAZORPAY_PROFESSIONAL_PLAN_ID="plan_RSwSKydH3762TR"
RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID="plan_RSwRRGdjIUFKHF"
```

These are placeholder IDs that need to be replaced with actual plan IDs from your Razorpay account.

---

## ✅ Solution: Create Razorpay Subscription Plans

Follow these steps to create the subscription plans in your Razorpay Dashboard.

---

## 📋 Step-by-Step Instructions

### **Step 1: Log in to Razorpay Dashboard**

1. **Go to Razorpay Dashboard:**
   ```
   https://dashboard.razorpay.com
   ```

2. **Sign in** with your credentials:
   - Email/Phone
   - Password
   - 2FA code (if enabled)

3. **Make sure you're in LIVE mode:**
   - Look at the top-right corner
   - You should see "LIVE" mode indicator
   - If you see "TEST", toggle to LIVE mode

---

### **Step 2: Navigate to Subscriptions**

1. **Click on "Subscriptions"** in the left sidebar menu
   - Or go to: https://dashboard.razorpay.com/app/subscriptions

2. **Click on "Plans"** tab at the top
   - You'll see a list of existing plans (if any)

---

### **Step 3: Create Professional Monthly Plan**

1. **Click "+ Create Plan" button** (top-right)

2. **Fill in the plan details:**

   **Plan Name:**
   ```
   MediaPlanPro Professional Monthly
   ```

   **Plan Description:**
   ```
   Unlimited strategies, advanced AI, priority support, all export formats - Monthly billing
   ```

   **Billing Amount:**
   ```
   3999
   ```
   (This is ₹3,999 in paise - Razorpay uses paise, not rupees)

   **Billing Currency:**
   ```
   INR
   ```

   **Billing Interval:**
   - **Every:** `1`
   - **Period:** Select `month` from dropdown

   **Additional Settings:**
   - **Item Name:** `MediaPlanPro Professional Subscription`
   - **Item Description:** `Monthly subscription to MediaPlanPro Professional plan`
   - **Notes:** (Optional) Leave blank or add internal notes

3. **Click "Create Plan" button**

4. **Copy the Plan ID:**
   - After creation, you'll see the plan details
   - Look for **"Plan ID"** - it will look like: `plan_XXXXXXXXXXXXX`
   - Click the **copy icon** next to the Plan ID
   - Save it temporarily in a text file

---

### **Step 4: Create Professional Annual Plan**

1. **Click "+ Create Plan" button** again

2. **Fill in the plan details:**

   **Plan Name:**
   ```
   MediaPlanPro Professional Annual
   ```

   **Plan Description:**
   ```
   Unlimited strategies, advanced AI, priority support, all export formats - Annual billing (20% discount)
   ```

   **Billing Amount:**
   ```
   3839040
   ```
   (This is ₹38,390.40 in paise - 20% discount from ₹47,988)

   **Billing Currency:**
   ```
   INR
   ```

   **Billing Interval:**
   - **Every:** `1`
   - **Period:** Select `year` from dropdown

   **Additional Settings:**
   - **Item Name:** `MediaPlanPro Professional Annual Subscription`
   - **Item Description:** `Annual subscription to MediaPlanPro Professional plan (20% discount)`
   - **Notes:** (Optional) `20% discount - saves ₹9,597.60 per year`

3. **Click "Create Plan" button**

4. **Copy the Plan ID:**
   - Look for **"Plan ID"** - it will look like: `plan_XXXXXXXXXXXXX`
   - Click the **copy icon** next to the Plan ID
   - Save it temporarily in a text file

---

### **Step 5: Update Environment Variables**

Now you need to update your `.env` file with the actual plan IDs.

1. **Open your `.env` file** in the project root

2. **Find these lines:**
   ```env
   RAZORPAY_PROFESSIONAL_PLAN_ID="plan_RSwSKydH3762TR"
   RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID="plan_RSwRRGdjIUFKHF"
   ```

3. **Replace with your actual plan IDs:**
   ```env
   RAZORPAY_PROFESSIONAL_PLAN_ID="plan_XXXXXXXXXXXXX"  # Your monthly plan ID
   RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID="plan_YYYYYYYYYYYYY"  # Your annual plan ID
   ```

4. **Save the file**

---

### **Step 6: Update Vercel Environment Variables**

If you're deploying to production, you also need to update Vercel.

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Select your project** (MediaPlanPro)

3. **Go to Settings → Environment Variables**

4. **Find and update these variables:**

   **RAZORPAY_PROFESSIONAL_PLAN_ID:**
   - Click the **"..."** menu next to the variable
   - Click **"Edit"**
   - Replace with your actual monthly plan ID
   - Click **"Save"**

   **RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID:**
   - Click the **"..."** menu next to the variable
   - Click **"Edit"**
   - Replace with your actual annual plan ID
   - Click **"Save"**

5. **Redeploy your application:**
   - Go to **"Deployments"** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete

---

### **Step 7: Restart Development Server**

If you're testing locally:

1. **Stop your development server:**
   - Press `Ctrl+C` in the terminal

2. **Start it again:**
   ```bash
   npm run dev
   ```

---

### **Step 8: Test the Payment Flow**

1. **Go to your pricing page:**
   - Development: `http://localhost:3000/pricing`
   - Production: `https://www.mediaplanpro.com/pricing`

2. **Click "Start Free Trial" on Professional plan**

3. **Select "India Payment (INR)"**

4. **Click the checkout button**

5. **You should now see the Razorpay checkout modal** (no error!)

6. **Test with Razorpay test card:**
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/34`
   - Name: Any name

7. **Complete the payment**

8. **Verify:**
   - Payment successful
   - Redirected to success page
   - Subscription shows in dashboard

---

## 🔍 Verification

### **Check Plan IDs are Correct:**

1. **In Razorpay Dashboard:**
   - Go to Subscriptions → Plans
   - You should see both plans listed
   - Click on each plan to verify details

2. **In your `.env` file:**
   - Plan IDs should match exactly
   - No extra spaces or quotes
   - Format: `plan_XXXXXXXXXXXXX`

3. **In Vercel (if deployed):**
   - Environment variables should match
   - Both Production and Preview environments

---

## 🧪 Test Cards for Razorpay

### **Successful Payment:**
- **Card Number:** `4111 1111 1111 1111`
- **CVV:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/34`)
- **Name:** Any name

### **Failed Payment:**
- **Card Number:** `4000 0000 0000 0002`
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### **UPI (Test):**
- **UPI ID:** `success@razorpay`

---

## 🔧 Troubleshooting

### **Error: "Plan not found"**

**Cause:** Plan ID doesn't exist in Razorpay Dashboard.

**Solution:**
1. Verify plan was created successfully
2. Check plan ID is copied correctly
3. Make sure you're in LIVE mode (not TEST mode)
4. Restart development server

### **Error: "Invalid plan ID"**

**Cause:** Plan ID format is incorrect.

**Solution:**
1. Plan ID should start with `plan_`
2. No extra spaces or quotes in .env file
3. Copy the entire ID from Razorpay Dashboard

### **Error: "Plan is inactive"**

**Cause:** Plan was deactivated in Razorpay Dashboard.

**Solution:**
1. Go to Razorpay Dashboard → Subscriptions → Plans
2. Find the plan
3. Click "Activate" if it's inactive

### **Still seeing the error?**

**Check these:**
1. ✅ Plans created in Razorpay Dashboard
2. ✅ Plan IDs copied correctly
3. ✅ `.env` file updated
4. ✅ Development server restarted
5. ✅ Vercel environment variables updated (if deployed)
6. ✅ Vercel redeployed (if deployed)

---

## 📊 Plan Details Summary

### **Professional Monthly Plan**

| Field | Value |
|-------|-------|
| **Name** | MediaPlanPro Professional Monthly |
| **Amount** | ₹3,999 (399900 paise) |
| **Currency** | INR |
| **Interval** | 1 month |
| **Features** | Unlimited strategies, advanced AI, priority support, all exports |

### **Professional Annual Plan**

| Field | Value |
|-------|-------|
| **Name** | MediaPlanPro Professional Annual |
| **Amount** | ₹38,390.40 (3839040 paise) |
| **Currency** | INR |
| **Interval** | 1 year |
| **Discount** | 20% off (saves ₹9,597.60/year) |
| **Features** | Unlimited strategies, advanced AI, priority support, all exports |

---

## 💡 Pro Tips

1. **Use descriptive plan names** so you can easily identify them in the dashboard

2. **Add notes** to plans for internal reference (e.g., "20% annual discount")

3. **Test plans thoroughly** before going live with real customers

4. **Monitor plan usage** in Razorpay Dashboard → Analytics

5. **Set up email notifications** for new subscriptions in Razorpay settings

---

## ✅ Verification Checklist

- [ ] Logged in to Razorpay Dashboard
- [ ] Switched to LIVE mode
- [ ] Created Professional Monthly plan (₹3,999/month)
- [ ] Copied monthly plan ID
- [ ] Created Professional Annual plan (₹38,390/year)
- [ ] Copied annual plan ID
- [ ] Updated `.env` file with both plan IDs
- [ ] Restarted development server
- [ ] Updated Vercel environment variables (if deployed)
- [ ] Redeployed Vercel (if deployed)
- [ ] Tested payment flow
- [ ] Verified no errors
- [ ] Completed test payment successfully

---

## 🎉 Success!

Once you've completed all steps, the error should be gone and you should be able to:

✅ See Razorpay checkout modal  
✅ Complete test payments  
✅ Create subscriptions  
✅ Receive webhook events  
✅ See subscriptions in dashboard  

---

## 📞 Need Help?

**Razorpay Support:**
- **Dashboard:** https://dashboard.razorpay.com
- **Docs:** https://razorpay.com/docs/subscriptions
- **Support:** Available in Razorpay Dashboard (chat/email)

**MediaPlanPro Integration:**
- **Code:** `src/lib/razorpay.ts`
- **Checkout API:** `src/app/api/checkout/razorpay/route.ts`
- **Documentation:** `RAZORPAY_INTEGRATION_GUIDE.md`

---

**Last Updated:** October 13, 2025  
**Status:** ✅ **READY TO FIX THE ERROR**

