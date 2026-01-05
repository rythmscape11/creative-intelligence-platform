# Analytics Testing Checklist
## MediaPlanPro - Comprehensive Testing Guide

**Version:** 1.0  
**Last Updated:** October 13, 2025  
**Status:** Ready for Testing

---

## 📋 Pre-Testing Setup

### **1. Environment Variables**
- [ ] `NEXT_PUBLIC_GA_TRACKING_ID` is set to `G-KW67PBLSR7`
- [ ] `NEXT_PUBLIC_GTM_ID` is set to `GTM-NQRV6DDM`
- [ ] `NEXT_PUBLIC_FB_PIXEL_ID` is set (if using Facebook Pixel)
- [ ] Environment variables are deployed to production

### **2. Browser Setup**
- [ ] Clear browser cache and cookies
- [ ] Disable ad blockers for testing
- [ ] Open browser DevTools (F12)
- [ ] Open Network tab
- [ ] Open Console tab

### **3. GA4 Setup**
- [ ] Access to GA4 property (`G-KW67PBLSR7`)
- [ ] Real-time reports enabled
- [ ] Debug mode enabled (optional)

---

## 🧪 Core Tracking Tests

### **Test 1: Script Loading**

**Objective:** Verify all tracking scripts load correctly

**Steps:**
1. Open homepage in browser
2. Open DevTools → Network tab
3. Filter by "gtag" or "analytics"
4. Refresh page

**Expected Results:**
- [ ] `gtag/js?id=G-KW67PBLSR7` loads successfully (200 status)
- [ ] `gtm.js?id=GTM-NQRV6DDM` loads successfully (200 status)
- [ ] `fbevents.js` loads successfully (if FB Pixel configured)
- [ ] No 404 or 500 errors
- [ ] Scripts load with `lazyOnload` strategy (after page interactive)

**Verification:**
```javascript
// In browser console
console.log(typeof window.gtag); // Should be 'function'
console.log(typeof window.dataLayer); // Should be 'object'
console.log(window.dataLayer); // Should show array with events
```

---

### **Test 2: Page View Tracking**

**Objective:** Verify page views are tracked correctly

**Steps:**
1. Navigate to homepage
2. Wait 5 seconds
3. Check GA4 Real-time reports
4. Navigate to /about page
5. Check GA4 Real-time reports again

**Expected Results:**
- [ ] Homepage page view appears in GA4 Real-time
- [ ] About page view appears in GA4 Real-time
- [ ] Page titles are correct
- [ ] Page paths are correct
- [ ] Events appear within 30 seconds

**Verification:**
```javascript
// In browser console
window.dataLayer.filter(item => item.event === 'pageview');
```

---

### **Test 3: Custom Event Tracking**

**Objective:** Verify custom events fire correctly

**Test 3a: Strategy Creation**
```javascript
// In browser console
trackStrategyCreation('test-123', 'comprehensive');
```

**Expected Results:**
- [ ] Event appears in GA4 Real-time
- [ ] Event name is `strategy_created`
- [ ] Parameters include `strategy_id` and `strategy_type`
- [ ] Event appears in GTM dataLayer

**Test 3b: Blog View**
```javascript
// In browser console
trackBlogView('post-123', 'Test Post', 'Marketing');
```

**Expected Results:**
- [ ] Event appears in GA4 Real-time
- [ ] Event name is `blog_view`
- [ ] Parameters include `post_id`, `post_title`, `category`

**Test 3c: User Login**
```javascript
// In browser console
trackUserLogin('user-123', 'email');
```

**Expected Results:**
- [ ] Event appears in GA4 Real-time
- [ ] Event name is `user_login`
- [ ] Parameters include `user_id` and `login_method`

---

### **Test 4: User ID Tracking**

**Objective:** Verify user ID is set correctly

**Steps:**
1. Log in to the application
2. Check if `setUserId()` is called
3. Verify in GA4 Real-time reports

**Expected Results:**
- [ ] User ID is set in GA4
- [ ] User ID appears in dataLayer
- [ ] User ID persists across page views

**Verification:**
```javascript
// In browser console
window.dataLayer.find(item => item.user_id);
```

---

### **Test 5: Web Vitals Tracking**

**Objective:** Verify Core Web Vitals are tracked

**Steps:**
1. Open homepage
2. Wait for page to fully load
3. Check Network tab for `/api/analytics/web-vitals` requests
4. Check GA4 Real-time for Web Vitals events

**Expected Results:**
- [ ] LCP event tracked
- [ ] FCP event tracked
- [ ] CLS event tracked
- [ ] INP event tracked
- [ ] TTFB event tracked
- [ ] Events include rating (good/needs-improvement/poor)

**Verification:**
```javascript
// In browser console
window.dataLayer.filter(item => 
  ['LCP', 'FCP', 'CLS', 'INP', 'TTFB'].includes(item.event)
);
```

---

## 📄 Page-Specific Tests

### **Test 6: Homepage**
- [ ] Page view tracked
- [ ] CTA clicks tracked
- [ ] Scroll depth tracked
- [ ] Time on page tracked

### **Test 7: Blog Pages**
- [ ] Blog post view tracked
- [ ] Post ID, title, category tracked
- [ ] Scroll depth tracked (25%, 50%, 75%, 100%)
- [ ] Reading time tracked
- [ ] Share button clicks tracked
- [ ] Comment submissions tracked

### **Test 8: Strategy Builder**
- [ ] Strategy creation tracked
- [ ] Strategy type tracked
- [ ] Strategy export tracked
- [ ] Export format tracked
- [ ] Form interactions tracked

### **Test 9: Authentication Pages**
- [ ] User registration tracked
- [ ] Registration method tracked
- [ ] User login tracked
- [ ] Login method tracked
- [ ] User ID set after login
- [ ] User properties set

### **Test 10: Admin Panel**
- [ ] Admin page views tracked
- [ ] Admin actions tracked
- [ ] User role tracked in properties

### **Test 11: Growth Suite Tools**
- [ ] Tool page views tracked
- [ ] Tool interactions tracked
- [ ] Form submissions tracked
- [ ] Results tracked

### **Test 12: Legal Pages**
- [ ] Privacy policy view tracked
- [ ] Terms of service view tracked
- [ ] Cookie policy view tracked

---

## 🎯 Advanced Feature Tests

### **Test 13: Enhanced Measurement**

**Objective:** Verify enhanced measurement features

**Features to Test:**
- [ ] Scroll tracking (automatic)
- [ ] Outbound link clicks
- [ ] Site search tracking
- [ ] Video engagement (if applicable)
- [ ] File downloads

**Steps:**
1. Enable enhanced measurement in GA4
2. Test each feature
3. Verify events in GA4 Real-time

---

### **Test 14: Custom Dimensions**

**Objective:** Verify custom dimensions are set

**Steps:**
1. Set user properties
2. Navigate to different pages
3. Check if dimensions persist

**Expected Results:**
- [ ] User role dimension set
- [ ] Subscription tier dimension set
- [ ] Content group dimension set
- [ ] Dimensions appear in GA4 reports

**Verification:**
```javascript
// In browser console
window.dataLayer.filter(item => item.user_properties);
```

---

### **Test 15: E-commerce Tracking**

**Objective:** Verify e-commerce events (if applicable)

**Events to Test:**
- [ ] Product view
- [ ] Add to cart
- [ ] Begin checkout
- [ ] Purchase

**Verification:**
```javascript
// Test product view
trackProductView('pro-plan', 'Pro Plan', 'Subscription', 49.99);

// Test add to cart
trackAddToCart('pro-plan', 'Pro Plan', 49.99, 1);

// Check dataLayer
window.dataLayer.filter(item => 
  ['view_item', 'add_to_cart', 'purchase'].includes(item.event)
);
```

---

### **Test 16: Error Tracking**

**Objective:** Verify errors are tracked

**Steps:**
1. Trigger a JavaScript error
2. Trigger a 404 error
3. Trigger an API error
4. Check GA4 Real-time

**Expected Results:**
- [ ] JavaScript errors tracked
- [ ] 404 errors tracked
- [ ] API errors tracked
- [ ] Error details included (message, stack, type)

**Verification:**
```javascript
// Test error tracking
trackError('Test error', 'Error stack', 'test_error', false);

// Check dataLayer
window.dataLayer.filter(item => item.event === 'error_occurred');
```

---

## 🌐 Cross-Browser Testing

### **Test 17: Browser Compatibility**

**Browsers to Test:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**For Each Browser:**
- [ ] Scripts load correctly
- [ ] Events fire correctly
- [ ] No console errors
- [ ] Performance acceptable

---

## 📱 Mobile Testing

### **Test 18: Mobile Devices**

**Devices to Test:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

**For Each Device:**
- [ ] Scripts load correctly
- [ ] Touch events tracked
- [ ] Scroll tracking works
- [ ] Time tracking works
- [ ] No performance issues

---

## 🚀 Performance Testing

### **Test 19: PageSpeed Insights**

**Objective:** Verify tracking doesn't negatively impact performance

**Steps:**
1. Run PageSpeed Insights on homepage
2. Check Performance score
3. Check for tracking script warnings

**Expected Results:**
- [ ] Performance score ≥ 85
- [ ] No blocking scripts
- [ ] Scripts load with `lazyOnload`
- [ ] Resource hints present

**URL:** https://pagespeed.web.dev/analysis?url=https://www.mediaplanpro.com

---

### **Test 20: Core Web Vitals**

**Metrics to Check:**
- [ ] LCP < 2.5s (good)
- [ ] FID/INP < 100ms (good)
- [ ] CLS < 0.1 (good)
- [ ] FCP < 1.8s (good)
- [ ] TTFB < 600ms (good)

---

## 📊 GA4 Reports Verification

### **Test 21: Real-Time Reports**

**Steps:**
1. Go to GA4 → Reports → Real-time
2. Trigger various events
3. Verify events appear

**Expected Results:**
- [ ] Events appear within 30 seconds
- [ ] Event parameters visible
- [ ] User properties visible
- [ ] Page views tracked

---

### **Test 22: Events Report**

**Steps:**
1. Go to GA4 → Reports → Events
2. Check for custom events
3. Verify event counts

**Expected Results:**
- [ ] All custom events listed
- [ ] Event counts accurate
- [ ] Event parameters captured

---

### **Test 23: User Properties Report**

**Steps:**
1. Go to GA4 → Configure → Custom definitions
2. Check user properties
3. Verify properties are set

**Expected Results:**
- [ ] User ID property exists
- [ ] User role property exists
- [ ] Subscription tier property exists

---

## ✅ Final Checklist

### **Production Deployment**
- [ ] All tests passed
- [ ] No console errors
- [ ] Performance score ≥ 85
- [ ] GA4 receiving data
- [ ] GTM container published
- [ ] Documentation updated

### **Monitoring**
- [ ] Set up GA4 alerts
- [ ] Monitor error rates
- [ ] Monitor conversion rates
- [ ] Review reports weekly

---

## 🐛 Troubleshooting

### **Issue: Scripts not loading**
- Check environment variables
- Check ad blockers
- Check network tab for errors
- Verify script URLs

### **Issue: Events not firing**
- Check if gtag/dataLayer exists
- Check console for errors
- Verify event names
- Check GA4 Real-time reports

### **Issue: Performance issues**
- Verify `lazyOnload` strategy
- Check resource hints
- Review PageSpeed Insights
- Optimize tracking code

---

**For support, see:**
- [TRACKING_IMPLEMENTATION_GUIDE.md](./TRACKING_IMPLEMENTATION_GUIDE.md)
- [COMPREHENSIVE_GA_AUDIT_REPORT.md](./COMPREHENSIVE_GA_AUDIT_REPORT.md)

