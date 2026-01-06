# 🔍 Comprehensive Quality Control Testing Plan
## Google QC Head Level - Enterprise-Grade Quality Assurance

**Project:** MediaPlanPro  
**Date:** October 13, 2025  
**QC Level:** Enterprise (Google Standards)  
**Scope:** Complete Application Audit

---

## 📋 Executive Summary

This document provides a comprehensive, enterprise-grade quality control testing plan following Google's quality assurance standards. All tests must be performed manually and results documented with severity levels.

---

## 🎯 Testing Objectives

1. **Functionality:** Verify all features work as intended
2. **Design & UX:** Ensure pixel-perfect implementation
3. **Performance:** Validate fast load times and optimization
4. **Accessibility:** Confirm WCAG AA compliance
5. **Responsiveness:** Test across all device sizes
6. **Cross-browser:** Verify compatibility
7. **Dark Mode:** Validate flawless theme switching
8. **Code Quality:** Check for errors and warnings
9. **Content:** Verify readability and formatting
10. **Security:** Ensure secure implementation

---

## 🔴 CRITICAL: Manual Testing Required

**⚠️ IMPORTANT:** As an AI assistant, I cannot directly interact with the browser to perform these tests. You must manually execute each test and document the results.

**Testing Environment:**
- Local: http://localhost:3000 (currently running)
- Production: https://www.mediaplanpro.com (after deployment)

---

## 📊 Test Categories & Severity Levels

### Severity Levels:
- **🔴 CRITICAL:** Blocks core functionality, must fix immediately
- **🟠 HIGH:** Significant impact on UX, fix before deployment
- **🟡 MEDIUM:** Noticeable issue, fix soon
- **🟢 LOW:** Minor cosmetic issue, fix when possible

---

## 1️⃣ RAZORPAY PAYMENT FLOW TESTING

### Test 1.1: Navigate to Pricing Page
**Steps:**
1. Open http://localhost:3000/pricing
2. Verify page loads without errors
3. Check browser console for errors

**Expected Results:**
- ✅ Page loads in < 2 seconds
- ✅ Three pricing plans visible (Free, Professional, Enterprise)
- ✅ Professional plan shows "Most Popular" badge
- ✅ Prices display correctly
- ✅ No console errors

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL  
**Issues Found:** _[DOCUMENT ANY ISSUES]_

---

### Test 1.2: Click "Start Free Trial" (Not Logged In)
**Steps:**
1. Click "Start Free Trial" on Professional plan
2. Observe redirect behavior

**Expected Results:**
- ✅ Redirects to /auth/signup?plan=professional
- ✅ Sign-up form displays
- ✅ Plan parameter preserved in URL

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.3: Sign In / Create Account
**Steps:**
1. Create a test account or sign in
2. Verify authentication works
3. Check redirect after sign-in

**Expected Results:**
- ✅ Account creation successful
- ✅ Email verification (if required)
- ✅ Redirects to dashboard or pricing page

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.4: Select Payment Gateway
**Steps:**
1. After signing in, click "Start Free Trial" again
2. Verify payment gateway selector appears
3. Select "India Payment (INR)"

**Expected Results:**
- ✅ Payment gateway selector modal opens
- ✅ Two options visible: "International Payment (USD)" and "India Payment (INR)"
- ✅ Can select Razorpay option
- ✅ Modal has proper styling in both light/dark modes

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.5: Choose Billing Cycle - Monthly
**Steps:**
1. Select "Monthly" billing cycle
2. Verify plan details

**Expected Results:**
- ✅ Monthly option selectable
- ✅ Shows ₹3,999/month
- ✅ Plan ID: plan_RSwRRGdjIUFKHF
- ✅ "Proceed to Checkout" button enabled

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.6: Razorpay Checkout Modal - Monthly
**Steps:**
1. Click "Proceed to Checkout"
2. Verify Razorpay modal opens
3. Check plan details in modal

**Expected Results:**
- ✅ Razorpay checkout modal opens
- ✅ Shows plan: "MediaPlanPro Professional Monthly"
- ✅ Shows amount: ₹3,999
- ✅ Shows billing: "Every month"
- ✅ No "plan not configured" error
- ✅ Modal is properly styled

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.7: Test Payment - Monthly (Success)
**Steps:**
1. Enter test card details:
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: 12/34
   - Name: Test User
2. Complete payment

**Expected Results:**
- ✅ Payment processes successfully
- ✅ Redirects to success page
- ✅ Success message displayed
- ✅ Subscription created in database
- ✅ Email notification sent (if configured)

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.8: Verify Database Record - Monthly
**Steps:**
1. Check database for subscription record
2. Verify all fields are correct

**Expected Results:**
- ✅ Subscription record exists
- ✅ Status: ACTIVE
- ✅ Plan: PROFESSIONAL
- ✅ Billing Cycle: MONTHLY
- ✅ razorpaySubscriptionId populated
- ✅ razorpayPlanId: plan_RSwRRGdjIUFKHF
- ✅ currentPeriodStart and currentPeriodEnd set correctly

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.9: Choose Billing Cycle - Annual
**Steps:**
1. Repeat tests 1.4-1.8 with Annual billing
2. Select "Annual" billing cycle

**Expected Results:**
- ✅ Annual option selectable
- ✅ Shows ₹38,390/year
- ✅ Shows "20% discount" or savings message
- ✅ Plan ID: plan_RSwSKydH3762TR

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.10: Razorpay Checkout Modal - Annual
**Steps:**
1. Click "Proceed to Checkout" for annual plan
2. Verify Razorpay modal opens

**Expected Results:**
- ✅ Razorpay checkout modal opens
- ✅ Shows plan: "MediaPlanPro Professional Annual"
- ✅ Shows amount: ₹38,390
- ✅ Shows billing: "Every year"
- ✅ No "plan not configured" error

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.11: Test Payment - Annual (Success)
**Steps:**
1. Complete payment with test card
2. Verify success

**Expected Results:**
- ✅ Payment processes successfully
- ✅ Redirects to success page
- ✅ Subscription created with annual billing

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 1.12: Test Payment Failure
**Steps:**
1. Use failure test card: 4000 0000 0000 0002
2. Attempt payment

**Expected Results:**
- ✅ Payment fails gracefully
- ✅ Error message displayed
- ✅ No subscription created
- ✅ User can retry

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🟠 HIGH

---

### Test 1.13: Console Error Check
**Steps:**
1. Open browser console during entire payment flow
2. Monitor for errors

**Expected Results:**
- ✅ No JavaScript errors
- ✅ No network errors
- ✅ No 404 errors
- ✅ All API calls successful

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

### Test 3.4: Verify Production Blog
**URL:** https://www.mediaplanpro.com/blog

**Steps:**
1. Visit production blog
2. Test dark mode
3. Open a blog post

**Expected Results:**
- ✅ Blog listing page loads
- ✅ Design improvements visible
- ✅ Dark mode works
- ✅ Blog posts open correctly
- ✅ Article content visible in both modes

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

### Test 3.5: Verify Production Pricing
**URL:** https://www.mediaplanpro.com/pricing

**Steps:**
1. Visit production pricing page
2. Test payment flow

**Expected Results:**
- ✅ Pricing page loads
- ✅ Design improvements visible
- ✅ "Start Free Trial" button works
- ✅ Payment gateway selector appears
- ✅ Razorpay checkout works
- ✅ No "plan not configured" error

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

### Test 3.6: Production Payment Test
**Steps:**
1. Complete full payment flow in production
2. Use test card (if in test mode) or real card (if live mode)

**Expected Results:**
- ✅ Payment processes successfully
- ✅ Subscription created
- ✅ Email sent (if configured)
- ✅ User redirected to success page

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

## 4️⃣ COMPREHENSIVE QUALITY CONTROL

### Category 1: Functionality Testing

#### Test 4.1.1: All Navigation Links
**Steps:**
1. Click every navigation link in header
2. Click every link in footer
3. Verify all links work

**Expected Results:**
- ✅ All links navigate correctly
- ✅ No 404 errors
- ✅ No broken links

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

#### Test 4.1.2: Authentication Flow
**Steps:**
1. Test sign up
2. Test sign in
3. Test sign out
4. Test Google OAuth (if configured)

**Expected Results:**
- ✅ Sign up works
- ✅ Email verification works (if enabled)
- ✅ Sign in works
- ✅ Sign out works
- ✅ Google OAuth works (if configured)
- ✅ Proper redirects after auth

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.1.3: Dashboard Access
**Steps:**
1. Sign in as USER
2. Access dashboard
3. Test all dashboard features

**Expected Results:**
- ✅ Dashboard loads
- ✅ User can create strategies
- ✅ User can view strategies
- ✅ User can edit strategies
- ✅ User can delete strategies

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.1.4: Admin Panel Access
**Steps:**
1. Sign in as ADMIN
2. Access admin panel
3. Test admin features

**Expected Results:**
- ✅ Admin panel accessible
- ✅ User management works
- ✅ Blog management works
- ✅ Tracking codes management works

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

### Category 2: Design & UX Testing

#### Test 4.2.1: Visual Hierarchy
**Steps:**
1. Review all pages for visual hierarchy
2. Check font sizes, weights, colors

**Expected Results:**
- ✅ Clear visual hierarchy on all pages
- ✅ Headings stand out
- ✅ Body text readable
- ✅ Proper use of font weights
- ✅ Consistent spacing

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

#### Test 4.2.2: Color Consistency
**Steps:**
1. Check color usage across all pages
2. Verify brand colors used consistently

**Expected Results:**
- ✅ Consistent color palette
- ✅ Primary blue used for CTAs
- ✅ Gray scale consistent
- ✅ Accent colors used appropriately

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

#### Test 4.2.3: Spacing & Alignment
**Steps:**
1. Check spacing between elements
2. Verify alignment of components

**Expected Results:**
- ✅ Consistent spacing (padding, margins)
- ✅ Proper alignment
- ✅ No overlapping elements
- ✅ Grid system followed

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

#### Test 4.2.4: Hover & Focus States
**Steps:**
1. Hover over all interactive elements
2. Tab through page with keyboard

**Expected Results:**
- ✅ Hover states visible
- ✅ Focus states visible
- ✅ Smooth transitions
- ✅ Cursor changes appropriately

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

### Category 3: Performance Testing

#### Test 4.3.1: PageSpeed Insights
**Steps:**
1. Go to https://pagespeed.web.dev/
2. Test homepage
3. Test blog page
4. Test pricing page

**Expected Results:**
- ✅ Performance score > 85
- ✅ First Contentful Paint < 1.5s
- ✅ Largest Contentful Paint < 2.5s
- ✅ Time to Interactive < 3.5s
- ✅ Cumulative Layout Shift < 0.1

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

#### Test 4.3.2: Load Time Testing
**Steps:**
1. Use browser DevTools Network tab
2. Measure page load times
3. Test on slow 3G connection

**Expected Results:**
- ✅ Homepage loads < 3s on fast connection
- ✅ Homepage loads < 10s on slow 3G
- ✅ Images lazy load
- ✅ No render-blocking resources

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

### Category 4: Accessibility Testing

#### Test 4.4.1: WCAG AA Contrast Ratios
**Steps:**
1. Use browser extension (e.g., axe DevTools)
2. Check contrast ratios on all pages

**Expected Results:**
- ✅ All text meets 4.5:1 ratio (normal text)
- ✅ Large text meets 3:1 ratio
- ✅ No contrast violations

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

#### Test 4.4.2: Keyboard Navigation
**Steps:**
1. Navigate entire site using only keyboard
2. Tab through all interactive elements

**Expected Results:**
- ✅ All interactive elements reachable
- ✅ Focus indicators visible
- ✅ Logical tab order
- ✅ Can activate buttons with Enter/Space

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

#### Test 4.4.3: Screen Reader Testing
**Steps:**
1. Use screen reader (VoiceOver on Mac, NVDA on Windows)
2. Navigate through key pages

**Expected Results:**
- ✅ All content announced correctly
- ✅ ARIA labels present
- ✅ Semantic HTML used
- ✅ Images have alt text

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

### Category 5: Responsiveness Testing

#### Test 4.5.1: Mobile (320px - 767px)
**Steps:**
1. Test on iPhone SE (375px)
2. Test on small Android (360px)
3. Test at 320px (minimum)

**Expected Results:**
- ✅ All content visible
- ✅ No horizontal scroll
- ✅ Touch targets > 44px
- ✅ Text readable without zoom
- ✅ Images scale properly

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.5.2: Tablet (768px - 1023px)
**Steps:**
1. Test on iPad (768px)
2. Test on iPad Pro (1024px)

**Expected Results:**
- ✅ Layout adapts properly
- ✅ Navigation works
- ✅ Content readable
- ✅ Images scale properly

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

#### Test 4.5.3: Desktop (1024px+)
**Steps:**
1. Test at 1024px
2. Test at 1440px
3. Test at 1920px
4. Test at 2560px (4K)

**Expected Results:**
- ✅ Layout scales properly
- ✅ Max-width containers work
- ✅ No excessive whitespace
- ✅ Content centered appropriately

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

### Category 6: Cross-Browser Testing

#### Test 4.6.1: Chrome (Latest)
**Steps:**
1. Test all features in Chrome
2. Check console for errors

**Expected Results:**
- ✅ All features work
- ✅ No console errors
- ✅ Proper rendering

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.6.2: Safari (Latest)
**Steps:**
1. Test all features in Safari
2. Check for Safari-specific issues

**Expected Results:**
- ✅ All features work
- ✅ No console errors
- ✅ Proper rendering
- ✅ Dark mode works

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

#### Test 4.6.3: Firefox (Latest)
**Steps:**
1. Test all features in Firefox
2. Check for Firefox-specific issues

**Expected Results:**
- ✅ All features work
- ✅ No console errors
- ✅ Proper rendering

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

#### Test 4.6.4: Edge (Latest)
**Steps:**
1. Test all features in Edge
2. Check for Edge-specific issues

**Expected Results:**
- ✅ All features work
- ✅ No console errors
- ✅ Proper rendering

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

### Category 7: Dark Mode Testing

#### Test 4.7.1: Theme Toggle Functionality
**Steps:**
1. Click theme toggle
2. Verify theme changes
3. Refresh page
4. Verify theme persists

**Expected Results:**
- ✅ Theme toggles instantly
- ✅ No flash of wrong theme
- ✅ Theme persists after refresh
- ✅ System theme detection works

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

#### Test 4.7.2: Dark Mode Coverage
**Steps:**
1. Toggle dark mode on every page
2. Check for any white backgrounds or dark text

**Expected Results:**
- ✅ All pages support dark mode
- ✅ No white backgrounds in dark mode
- ✅ No dark text on dark backgrounds
- ✅ All components themed

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.7.3: Dark Mode Contrast
**Steps:**
1. Check contrast ratios in dark mode
2. Verify readability

**Expected Results:**
- ✅ All text meets WCAG AA in dark mode
- ✅ Proper contrast for all elements
- ✅ No visibility issues

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟠 HIGH

---

### Category 8: Code Quality Testing

#### Test 4.8.1: Console Errors
**Steps:**
1. Open browser console on every page
2. Check for errors, warnings

**Expected Results:**
- ✅ No JavaScript errors
- ✅ No React warnings
- ✅ No network errors
- ✅ No 404 errors

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.8.2: Network Requests
**Steps:**
1. Open Network tab
2. Monitor all requests

**Expected Results:**
- ✅ All requests successful (200 status)
- ✅ No failed requests
- ✅ Reasonable request sizes
- ✅ Proper caching headers

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

### Category 9: Content Testing

#### Test 4.9.1: Text Readability
**Steps:**
1. Read through all content
2. Check for typos, grammar errors

**Expected Results:**
- ✅ No typos
- ✅ Proper grammar
- ✅ Consistent tone
- ✅ Professional language

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

#### Test 4.9.2: Image Quality
**Steps:**
1. Check all images
2. Verify proper sizing and quality

**Expected Results:**
- ✅ Images load correctly
- ✅ Proper resolution
- ✅ No pixelation
- ✅ Appropriate file sizes

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🟡 MEDIUM

---

### Category 10: Security Testing

#### Test 4.10.1: Environment Variables
**Steps:**
1. Check browser console
2. Check page source
3. Verify no secrets exposed

**Expected Results:**
- ✅ No API keys in client code
- ✅ No secrets in console
- ✅ No sensitive data exposed

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.10.2: Authentication Security
**Steps:**
1. Test protected routes without auth
2. Verify proper redirects

**Expected Results:**
- ✅ Protected routes require auth
- ✅ Proper redirects to sign-in
- ✅ No unauthorized access

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

#### Test 4.10.3: Payment Security
**Steps:**
1. Verify Razorpay integration
2. Check webhook signature verification

**Expected Results:**
- ✅ Webhook signatures verified
- ✅ Payment data encrypted
- ✅ Secure checkout flow

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail
**Severity:** 🔴 CRITICAL

---

## 📊 QC REPORT TEMPLATE

### Overall Quality Score: ___ / 100

**Scoring:**
- Functionality: ___ / 20
- Design & UX: ___ / 15
- Performance: ___ / 10
- Accessibility: ___ / 15
- Responsiveness: ___ / 10
- Cross-browser: ___ / 10
- Dark Mode: ___ / 10
- Code Quality: ___ / 5
- Content: ___ / 3
- Security: ___ / 2

### Critical Issues Found: ___
### High Priority Issues: ___
### Medium Priority Issues: ___
### Low Priority Issues: ___

### Deployment Recommendation:
⬜ **APPROVED** - Ready for production deployment
⬜ **APPROVED WITH MINOR FIXES** - Deploy with non-critical fixes to follow
⬜ **CONDITIONAL** - Fix high-priority issues before deployment
⬜ **REJECTED** - Fix critical issues before deployment

### Executive Summary:
_[Provide 2-3 paragraph summary of overall quality, major findings, and recommendations]_

---

## 📝 Issue Tracking Template

For each issue found, document as follows:

**Issue #:** ___
**Severity:** 🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW
**Category:** Functionality / Design / Performance / etc.
**Page/Component:** ___
**Description:** ___
**Steps to Reproduce:**
1. ___
2. ___
3. ___

**Expected Behavior:** ___
**Actual Behavior:** ___
**Screenshot:** [Attach if applicable]
**Recommended Fix:** ___
**Priority:** Immediate / Before Deployment / Post-Deployment

---

## ✅ Final Checklist

Before marking QC as complete:

- [ ] All critical tests performed
- [ ] All issues documented
- [ ] Screenshots captured for visual issues
- [ ] QC report completed
- [ ] Overall quality score calculated
- [ ] Deployment recommendation provided
- [ ] Stakeholders notified of findings

---

**QC Performed By:** ___
**Date:** ___
**Time Spent:** ___ hours
**Sign-off:** ___

## 2️⃣ DESIGN & DARK MODE TESTING

### Test 2.1: Blog Listing Page - Light Mode
**URL:** http://localhost:3000/blog

**Steps:**
1. Navigate to blog listing page
2. Verify all elements visible and styled correctly

**Expected Results:**
- ✅ Hero section has gradient background (blue → purple)
- ✅ Category badges are blue with proper styling
- ✅ Blog cards have white background with gray borders
- ✅ Card shadows visible
- ✅ Images display correctly
- ✅ Titles are gray-900, readable
- ✅ Excerpts are gray-600, readable
- ✅ Meta information (author, date) visible
- ✅ Tags have gray-100 background
- ✅ "Read More" links are blue-600
- ✅ Hover effects work (card lift, image scale)

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🟠 HIGH

---

### Test 2.2: Blog Listing Page - Dark Mode
**Steps:**
1. Toggle dark mode
2. Verify all elements adapt correctly

**Expected Results:**
- ✅ Hero section has dark gradient (gray-900 → indigo-950)
- ✅ Category badges are blue-900 with proper contrast
- ✅ Blog cards have gray-800 background with gray-700 borders
- ✅ Titles are gray-100, readable
- ✅ Excerpts are gray-400, readable
- ✅ Meta information visible with proper contrast
- ✅ Tags have gray-700 background
- ✅ "Read More" links are blue-400
- ✅ All text meets WCAG AA contrast ratios
- ✅ No white backgrounds visible

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 2.3: Blog Post Page - Light Mode
**URL:** http://localhost:3000/blog/future-of-ai-powered-marketing

**Steps:**
1. Open a blog post
2. Verify article content styling

**Expected Results:**
- ✅ H1 heading visible and styled (gray-900)
- ✅ H2 headings visible (gray-900)
- ✅ H3 headings visible (gray-800)
- ✅ H4 headings visible (gray-800)
- ✅ Paragraphs readable (gray-700)
- ✅ Links are blue and underlined on hover
- ✅ Code blocks have dark background
- ✅ Blockquotes have background color and border
- ✅ Lists are properly styled
- ✅ Tables are styled (if present)
- ✅ Images have rounded corners and shadows

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 2.4: Blog Post Page - Dark Mode
**Steps:**
1. Toggle dark mode on blog post page
2. Verify all content is visible

**Expected Results:**
- ✅ H1 heading visible (gray-100)
- ✅ H2 headings visible (gray-100)
- ✅ H3 headings visible (gray-200)
- ✅ H4 headings visible (gray-200)
- ✅ Paragraphs readable (gray-300)
- ✅ Links are blue-400
- ✅ Code blocks have darker background
- ✅ Blockquotes have dark background
- ✅ All text meets WCAG AA contrast
- ✅ No large black areas with invisible text

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 2.5: Header Navigation - Both Modes
**Steps:**
1. Test header in light mode
2. Toggle to dark mode and retest

**Expected Results:**
- ✅ Logo visible in both modes
- ✅ Navigation links readable
- ✅ Hover states work (gray background)
- ✅ Theme toggle button visible and prominent
- ✅ Theme toggle has border and shadow
- ✅ User menu works in both modes
- ✅ Mobile menu works in both modes

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🟠 HIGH

---

### Test 2.6: Pricing Page - Both Modes
**URL:** http://localhost:3000/pricing

**Steps:**
1. Test pricing page in light mode
2. Toggle to dark mode

**Expected Results:**
- ✅ Hero section gradient visible in both modes
- ✅ Pricing cards have proper backgrounds
- ✅ "Most Popular" badge is gradient blue
- ✅ Card borders visible (blue for popular, gray for others)
- ✅ Feature list icons colored correctly (green check, gray X)
- ✅ Hover effects work (card lifts)
- ✅ All text readable in both modes
- ✅ CTA buttons styled correctly

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🟠 HIGH

---

## 3️⃣ VERCEL DEPLOYMENT TESTING

### Test 3.1: Add Environment Variables to Vercel
**Steps:**
1. Go to https://vercel.com/dashboard
2. Select MediaPlanPro project
3. Go to Settings → Environment Variables
4. Add the following variables:

```
RAZORPAY_PROFESSIONAL_PLAN_ID=plan_RSwRRGdjIUFKHF
RAZORPAY_PROFESSIONAL_ANNUAL_PLAN_ID=plan_RSwSKydH3762TR
```

5. Select all environments (Production, Preview, Development)
6. Click Save

**Expected Results:**
- ✅ Variables added successfully
- ✅ No errors during save

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 3.2: Trigger Deployment
**Steps:**
1. Wait for automatic deployment (changes already pushed)
2. OR manually trigger: `npx vercel --prod`

**Expected Results:**
- ✅ Deployment starts
- ✅ Build completes successfully
- ✅ No build errors
- ✅ Deployment URL provided

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---

### Test 3.3: Verify Production Homepage
**URL:** https://www.mediaplanpro.com

**Steps:**
1. Visit production homepage
2. Check for errors

**Expected Results:**
- ✅ Page loads successfully
- ✅ No console errors
- ✅ Theme toggle works
- ✅ Navigation works
- ✅ All images load

**Actual Results:** _[TO BE FILLED BY TESTER]_

**Status:** ⬜ Pass ⬜ Fail  
**Severity:** 🔴 CRITICAL

---


