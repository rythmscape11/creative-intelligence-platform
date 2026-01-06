# 🚀 Deployment Steps - Updated for Latest Changes

## Current Status

✅ **All Code Changes Committed:**
- Commit `6ab06f5`: Design improvements (Blog, Header, Pricing)
- Commit `f70bb29`: Article content styling and dark mode fixes
- Commit `45d4a2e`: Google OAuth and sample blog posts

✅ **Razorpay Plan IDs Updated:**
- Monthly: `plan_RSwRRGdjIUFKHF` (₹3,999/month)
- Annual: `plan_RSwSKydH3762TR` (₹38,390/year)

✅ **Development Server Running:**
- URL: http://localhost:3000
- Status: Active and tested

---

## 🎯 Quick Deployment Steps

### Step 1: Add Razorpay Plan IDs to Vercel

**CRITICAL: These are NEW plan IDs that MUST be added to Vercel**

1. Go to https://vercel.com/dashboard
2. Select **MediaPlanPro** project
3. Click **Settings** → **Environment Variables**
4. Add/Update these variables:

```
Variable: RAZORPAY_PROFESSIONAL_PLAN_ID
Value: plan_RSwRRGdjIUFKHF
Environment: Production ✓ Preview ✓ Development ✓
```

```
Variable: RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID
Value: plan_RSwSKydH3762TR
Environment: Production ✓ Preview ✓ Development ✓
```

5. Click **Save** for each

---

### Step 2: Trigger Deployment

**Option A: Automatic (Recommended)**

Vercel will automatically deploy since changes are pushed to main branch.

1. Go to https://vercel.com/dashboard
2. Select **MediaPlanPro**
3. Go to **Deployments** tab
4. Wait for deployment to complete (5-10 minutes)

**Option B: Manual via CLI**

```bash
npx vercel --prod
```

---

### Step 3: Verify Deployment

**Check These URLs:**

1. **Homepage:** https://www.mediaplanpro.com
   - Should load without errors
   - Check theme toggle works

2. **Blog:** https://www.mediaplanpro.com/blog
   - New design visible
   - Hero section with gradient
   - Improved card design
   - Dark mode works

3. **Pricing:** https://www.mediaplanpro.com/pricing
   - New design visible
   - Enhanced cards
   - "Most Popular" badge styled

4. **Blog Post:** https://www.mediaplanpro.com/blog/future-of-ai-powered-marketing
   - Article content visible
   - All headings readable
   - Code blocks styled
   - Dark mode works

---

### Step 4: Test Razorpay Payment

1. Go to https://www.mediaplanpro.com/pricing
2. Click "Start Free Trial"
3. Sign in (or create account)
4. Select "India Payment (INR)"
5. Choose Monthly or Annual
6. Verify: NO "plan not configured" error
7. Test with card: `4111 1111 1111 1111`

**Expected:** Payment should process successfully

---

## 📋 Complete Verification Checklist

### Design Improvements:
- [ ] Blog hero section has gradient background
- [ ] Blog cards have new design with borders
- [ ] Category badges are blue with hover effects
- [ ] Tags have improved styling
- [ ] "Read More" link has arrow animation
- [ ] Header navigation has better hover states
- [ ] Pricing cards have enhanced design
- [ ] "Most Popular" badge is gradient blue
- [ ] All pages support dark mode
- [ ] Theme toggle is visible and works

### Article Content:
- [ ] Blog post content is visible
- [ ] H1, H2, H3, H4 headings styled correctly
- [ ] Paragraphs have proper color and spacing
- [ ] Links are blue and underlined on hover
- [ ] Code blocks have dark background
- [ ] Blockquotes have background color
- [ ] Tables are styled (if any)
- [ ] Images have rounded corners and shadows
- [ ] All content readable in dark mode
- [ ] WCAG AA contrast ratios met

### Razorpay Integration:
- [ ] Pricing page loads without errors
- [ ] Payment gateway selector appears
- [ ] "India Payment (INR)" option available
- [ ] Monthly plan shows ₹3,999
- [ ] Annual plan shows ₹38,390
- [ ] Razorpay modal opens
- [ ] Plan details are correct
- [ ] Test payment works
- [ ] No "plan not configured" error
- [ ] Redirect to success page works

### General Functionality:
- [ ] All pages load without errors
- [ ] No console errors
- [ ] Google OAuth works
- [ ] Sign in/Sign up works
- [ ] Dashboard accessible
- [ ] Mobile responsive
- [ ] Performance score > 85
- [ ] Analytics tracking works

---

## 🔧 Troubleshooting

### If "Plan not configured" error appears:

1. **Check Vercel Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `RAZORPAY_PROFESSIONAL_PLAN_ID` = `plan_RSwRRGdjIUFKHF`
   - Verify `RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID` = `plan_RSwSKydH3762TR`

2. **Redeploy:**
   - Go to Deployments tab
   - Click latest deployment → ... → Redeploy
   - Wait for completion

3. **Check Razorpay Dashboard:**
   - Go to https://dashboard.razorpay.com
   - Navigate to Subscriptions → Plans
   - Verify plan IDs match

### If design doesn't update:

1. **Clear Browser Cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or clear cache in browser settings

2. **Check Deployment:**
   - Verify latest commit is deployed
   - Check build logs for errors

3. **Verify CSS:**
   - Check browser console for CSS errors
   - Verify Tailwind classes are working

### If dark mode doesn't work:

1. **Clear localStorage:**
   - Open browser console
   - Run: `localStorage.clear()`
   - Refresh page

2. **Check Theme Toggle:**
   - Verify button is visible
   - Check console for errors
   - Test in different browsers

---

## 📊 Expected Results

### Performance:
- PageSpeed Insights: 85-90/100
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

### Design:
- Professional appearance
- Consistent color scheme
- Smooth transitions
- WCAG AA compliant
- Mobile responsive

### Functionality:
- All features working
- No console errors
- Fast page loads
- Smooth navigation

---

## 🎉 Success Criteria

Deployment is successful when:

✅ All pages load without errors  
✅ Design improvements are visible  
✅ Dark mode works correctly  
✅ Razorpay payment flow works  
✅ No "plan not configured" error  
✅ Article content is readable  
✅ Performance score > 85  
✅ No console errors  
✅ Mobile responsive  
✅ WCAG AA compliant  

---

## 📝 Post-Deployment Tasks

1. **Monitor Logs:**
   ```bash
   vercel logs --follow
   ```

2. **Test User Flows:**
   - Sign up → Dashboard
   - Create strategy
   - Subscribe to plan
   - View blog posts

3. **Check Analytics:**
   - Google Analytics
   - Vercel Analytics
   - Razorpay Dashboard

4. **Update Documentation:**
   - Mark deployment as complete
   - Document any issues
   - Update README if needed

---

## 🚀 Deployment Command (If Manual)

```bash
# Navigate to project
cd /Users/anustupmukherjee/Documents/augment-projects/Project\ 1

# Deploy to production
npx vercel --prod

# Or redeploy latest
npx vercel ls --prod
npx vercel inspect [deployment-url]
```

---

**Status:** Ready for deployment ✅  
**Estimated Time:** 5-10 minutes  
**Risk Level:** Low (all changes tested locally)  
**Rollback Plan:** Revert to previous deployment if needed

---

## 📞 Support

If you encounter any issues:

1. Check Vercel build logs
2. Review browser console
3. Check Razorpay Dashboard
4. Review this guide
5. Check environment variables

---

**Last Updated:** October 13, 2025  
**Version:** 2.0 (Updated with latest changes)

