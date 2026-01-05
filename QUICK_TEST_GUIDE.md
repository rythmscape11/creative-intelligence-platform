# MediaPlanPro - Quick Test Guide

**Status**: 🟢 APPLICATION IS LIVE  
**URL**: http://localhost:3000  
**Time Required**: 15-20 minutes

---

## 🎯 Quick Testing Checklist

### ✅ Step 1: Verify Homepage (2 minutes)

**The homepage is already open in your browser!**

**Check these items**:
- [ ] Page loads without errors
- [ ] Animated gradient background visible
- [ ] "AI-Powered Marketing Strategy Platform" badge has glassmorphism effect
- [ ] Headline has gradient text effect
- [ ] CTA buttons change on hover
- [ ] Social proof section shows statistics
- [ ] Page is responsive (resize window to test)

**Screenshot**: Take a screenshot if everything looks good ✅

---

### ✅ Step 2: Verify GTM Integration (2 minutes)

**Open Browser Console** (Press F12 or Right-click → Inspect → Console)

**Run these commands**:

```javascript
// 1. Check GTM DataLayer
console.log('GTM DataLayer:', window.dataLayer);

// 2. Verify GTM Script
const gtmScript = document.querySelector('script[src*="googletagmanager.com"]');
console.log('GTM Script:', gtmScript ? '✅ Loaded' : '❌ Not Found');

// 3. Check Container ID
console.log('Container ID:', gtmScript?.src.includes('GTM-NQRV6DDM') ? '✅ GTM-NQRV6DDM' : '❌ Wrong');

// 4. View GTM Events
window.dataLayer?.forEach((event, i) => console.log(`Event ${i}:`, event));
```

**Expected Results**:
- ✅ `window.dataLayer` is an array
- ✅ GTM script is loaded
- ✅ Container ID is GTM-NQRV6DDM
- ✅ At least one GTM event visible

**Result**: [ ] PASS / [ ] FAIL

---

### ✅ Step 3: Test User Registration (3 minutes)

**The signup page is already open in your browser!**

**If not, navigate to**: http://localhost:3000/auth/signup

**Test Steps**:
1. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123!`

2. Click "Sign Up"

3. Check browser console for GTM event:
   ```javascript
   // Look for user_registration event
   window.dataLayer.filter(e => e.event === 'user_registration')
   ```

**Checklist**:
- [ ] Form displays correctly
- [ ] Can enter data
- [ ] Validation works
- [ ] Submit button works
- [ ] GTM tracks registration (check console)

**Result**: [ ] PASS / [ ] FAIL

---

### ✅ Step 4: Test User Login (2 minutes)

**Navigate to**: http://localhost:3000/auth/signin

**Test Steps**:
1. Enter credentials:
   - Email: `test@example.com`
   - Password: `TestPassword123!`

2. Click "Sign In"

3. Check for redirect to dashboard

4. Check console for GTM event:
   ```javascript
   window.dataLayer.filter(e => e.event === 'user_login')
   ```

**Checklist**:
- [ ] Login form displays
- [ ] Can enter credentials
- [ ] Login works
- [ ] Redirects to dashboard
- [ ] GTM tracks login

**Result**: [ ] PASS / [ ] FAIL

---

### ✅ Step 5: Test Strategy Builder (5 minutes)

**Navigate to**: http://localhost:3000/dashboard/strategies/create

**Test Steps**:

**Step 1 - Business Info**:
- [ ] Form displays
- [ ] Fill in business name
- [ ] Select industry
- [ ] Enter description
- [ ] Click "Next"

**Step 2 - Target Audience**:
- [ ] Form displays
- [ ] Define target audience
- [ ] Set budget
- [ ] Click "Next"

**Step 3 - Objectives**:
- [ ] Form displays
- [ ] Select objectives
- [ ] Set timeframe
- [ ] Click "Next"

**Step 4 - Review**:
- [ ] Review displays
- [ ] Click "Generate Strategy"
- [ ] Strategy generates
- [ ] Check console for GTM event:
   ```javascript
   window.dataLayer.filter(e => e.event === 'strategy_created')
   ```

**Result**: [ ] PASS / [ ] FAIL

---

### ✅ Step 6: Test Export Functionality (3 minutes)

**After creating a strategy**, test exports:

**PPTX Export**:
- [ ] Click "Export to PowerPoint"
- [ ] File downloads
- [ ] Check console:
   ```javascript
   window.dataLayer.filter(e => e.event === 'export_generated' && e.export_format === 'pptx')
   ```

**DOCX Export**:
- [ ] Click "Export to Word"
- [ ] File downloads
- [ ] GTM tracks export

**XLSX Export**:
- [ ] Click "Export to Excel"
- [ ] File downloads
- [ ] GTM tracks export

**Result**: [ ] PASS / [ ] FAIL

---

### ✅ Step 7: Test Responsive Design (2 minutes)

**In Browser DevTools**:
1. Press F12
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Test different screen sizes:
   - [ ] Desktop (1920x1080)
   - [ ] Tablet (768x1024)
   - [ ] Mobile (375x667)

**Check**:
- [ ] Layout adapts correctly
- [ ] Navigation works
- [ ] Content is readable
- [ ] Buttons are clickable

**Result**: [ ] PASS / [ ] FAIL

---

### ✅ Step 8: Check for Errors (1 minute)

**In Browser Console**:

```javascript
// Check for any errors
console.log('Errors:', performance.getEntriesByType('navigation'));

// Check for React errors
console.log('React errors:', document.querySelectorAll('[data-error]').length);

// Check for hydration errors
console.log('Hydration errors:', document.querySelectorAll('[data-hydration-error]').length);
```

**Checklist**:
- [ ] No console errors (red text)
- [ ] No React errors
- [ ] No hydration errors
- [ ] No 404 errors (except expected ones)

**Result**: [ ] PASS / [ ] FAIL

---

## 📊 Test Results Summary

**Fill in your results**:

| Test | Status | Notes |
|------|--------|-------|
| Homepage | [ ] PASS / [ ] FAIL | |
| GTM Integration | [ ] PASS / [ ] FAIL | |
| User Registration | [ ] PASS / [ ] FAIL | |
| User Login | [ ] PASS / [ ] FAIL | |
| Strategy Builder | [ ] PASS / [ ] FAIL | |
| Export Functionality | [ ] PASS / [ ] FAIL | |
| Responsive Design | [ ] PASS / [ ] FAIL | |
| No Errors | [ ] PASS / [ ] FAIL | |

**Overall Result**: [ ] ALL PASS / [ ] SOME FAILURES

---

## 🐛 Issues Found

**Document any issues here**:

1. **Issue**: 
   - **Severity**: High / Medium / Low
   - **Description**: 
   - **Steps to Reproduce**: 
   - **Expected**: 
   - **Actual**: 

2. **Issue**: 
   - **Severity**: High / Medium / Low
   - **Description**: 
   - **Steps to Reproduce**: 
   - **Expected**: 
   - **Actual**: 

---

## ✅ GTM Tracking Verification

**Events to Verify** (check console after each action):

```javascript
// View all GTM events
window.dataLayer.forEach((event, i) => {
  if (event.event) {
    console.log(`${i}. ${event.event}`, event);
  }
});
```

**Expected Events**:
- [ ] `gtm.js` - GTM initialization
- [ ] `page_view` - Page views
- [ ] `user_registration` - User signup
- [ ] `user_login` - User login
- [ ] `strategy_created` - Strategy generation
- [ ] `export_generated` - File exports

**GTM Status**: [ ] ALL EVENTS TRACKED / [ ] SOME MISSING

---

## 🎨 UI/UX Verification

**Visual Checklist**:

**Animations**:
- [ ] Fade-in-up on scroll
- [ ] Blob animations moving
- [ ] Gradient backgrounds
- [ ] Hover effects on buttons
- [ ] Smooth transitions

**Design**:
- [ ] Glassmorphism effects
- [ ] Gradient text
- [ ] Proper spacing
- [ ] Consistent colors
- [ ] Professional look

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Text is readable
- [ ] Color contrast good

---

## 🚀 Performance Check

**Quick Performance Test**:

1. **Reload Homepage** (Ctrl+Shift+R)
2. **Open Network Tab** in DevTools
3. **Check Load Time**:
   - [ ] < 3 seconds (good)
   - [ ] 3-5 seconds (acceptable)
   - [ ] > 5 seconds (needs optimization)

4. **Check Bundle Size**:
   - [ ] < 1 MB (excellent)
   - [ ] 1-2 MB (good)
   - [ ] > 2 MB (needs optimization)

**Performance Status**: [ ] GOOD / [ ] NEEDS WORK

---

## ✅ Final Checklist

**Before marking as complete**:

- [ ] All tests completed
- [ ] Results documented
- [ ] Issues logged (if any)
- [ ] GTM tracking verified
- [ ] UI/UX looks good
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] Ready for production

---

## 📝 Testing Notes

**Date**: _______________  
**Tester**: _______________  
**Browser**: _______________  
**OS**: _______________  

**Additional Notes**:
_______________________________________
_______________________________________
_______________________________________

---

## 🎯 Next Steps

**If all tests pass**:
1. ✅ Mark testing as complete
2. 📝 Document any minor issues
3. 🚀 Proceed with production build
4. 🌐 Deploy to Hostinger

**If tests fail**:
1. 📋 Document all failures
2. 🐛 Fix critical issues
3. 🔄 Re-test
4. ✅ Verify fixes work

---

**Application URL**: http://localhost:3000  
**Status**: 🟢 LIVE AND READY  
**Time to Complete**: 15-20 minutes  

**Start Testing Now! 🚀**
