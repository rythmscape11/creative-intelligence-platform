# ✅ MANUAL TESTING CHECKLIST
**MediaPlanPro - User Acceptance Testing**

Use this checklist to manually verify all functionality works as expected.

---

## 🔐 AUTHENTICATION TESTING

### Sign-In Flow
- [ ] Navigate to http://localhost:3002/auth/signin
- [ ] Verify demo credentials are displayed correctly
- [ ] Test Admin account: `admin@mediaplanpro.com` / `admin123`
  - [ ] Enter credentials
  - [ ] Click "Sign in"
  - [ ] Verify toast notification appears: "Welcome back!"
  - [ ] Verify redirect to `/dashboard`
  - [ ] Verify user name displays in header
  - [ ] Verify role shows as "ADMIN"
- [ ] Test session persistence:
  - [ ] Refresh the page (F5)
  - [ ] Verify still logged in
  - [ ] Verify no redirect to sign-in page
- [ ] Test sign-out:
  - [ ] Click user avatar/name in header
  - [ ] Click "Sign Out"
  - [ ] Verify redirect to home page
  - [ ] Verify session cleared

### Other Test Accounts
- [ ] Test Editor account: `editor@mediaplanpro.com` / `editor123`
- [ ] Test User account: `user@mediaplanpro.com` / `user123`

---

## 🧭 NAVIGATION TESTING

### Dashboard Sidebar Links
After signing in as Admin, test each sidebar link:

- [ ] **Dashboard** - Click and verify dashboard overview loads
- [ ] **Strategies** - Click and verify strategy list loads
- [ ] **Create Strategy** - Click and verify original form loads
- [ ] **Analytics** - Click and verify "Coming Soon" page loads
  - [ ] Verify blue icon displays
  - [ ] Verify feature list shows
  - [ ] Click "Back to Dashboard" - verify it works
  - [ ] Click "Create Strategy" - verify it works
- [ ] **Exports** - Click and verify "Coming Soon" page loads
  - [ ] Verify green icon displays
  - [ ] Verify feature list shows
  - [ ] Click "Back to Dashboard" - verify it works
  - [ ] Click "View Strategies" - verify it works
- [ ] **Team** - Click and verify "Coming Soon" page loads
  - [ ] Verify purple icon displays
  - [ ] Verify feature list shows
  - [ ] Click "Back to Dashboard" - verify it works
  - [ ] Click "Create Strategy" - verify it works
- [ ] **Settings** - Click and verify settings page loads
  - [ ] Test all 4 tabs (see detailed testing below)

### Header Dropdown Links
- [ ] Click user avatar/name in header
- [ ] Verify dropdown menu appears
- [ ] Click **Profile** - verify profile page loads
- [ ] Click **Settings** - verify settings page loads
- [ ] Click **Sign Out** - verify sign-out works

### Quick Actions
- [ ] Click "New Strategy" button in sidebar
- [ ] Verify redirect to `/dashboard/strategies/create`
- [ ] Click "View Documentation" link in sidebar
- [ ] Verify redirect to `/help`

---

## 📄 PAGE-SPECIFIC TESTING

### Settings Page (`/dashboard/settings`)

**Profile Tab**:
- [ ] Click "Profile" tab
- [ ] Verify name field shows your name
- [ ] Verify email field shows your email
- [ ] Verify role field shows your role (read-only)
- [ ] Edit name field - type new name
- [ ] Click "Save Changes"
- [ ] Verify toast notification appears
- [ ] Refresh page - verify changes persisted (if backend connected)

**Notifications Tab**:
- [ ] Click "Notifications" tab
- [ ] Verify 4 notification preferences display
- [ ] Toggle "Email Notifications" checkbox
- [ ] Toggle "Strategy Updates" checkbox
- [ ] Toggle "Weekly Reports" checkbox
- [ ] Toggle "Marketing Updates" checkbox
- [ ] Click "Save Preferences"
- [ ] Verify toast notification appears

**Security Tab**:
- [ ] Click "Security" tab
- [ ] Verify 3 password fields display
- [ ] Type in "Current Password" field
- [ ] Type in "New Password" field
- [ ] Type in "Confirm New Password" field
- [ ] Click "Update Password"
- [ ] Verify toast notification appears

**Billing Tab**:
- [ ] Click "Billing" tab
- [ ] Verify "Free Plan" displays
- [ ] Verify "Active" badge shows
- [ ] Click "Upgrade to Pro" button
- [ ] Verify button is clickable (may not have functionality yet)

---

### Profile Page (`/dashboard/profile`)

**View Mode**:
- [ ] Navigate to `/dashboard/profile`
- [ ] Verify avatar displays with your initial
- [ ] Verify name displays
- [ ] Verify email displays
- [ ] Verify role displays
- [ ] Verify "Member Since" displays
- [ ] Verify 3 account activity stats display (all showing 0)

**Edit Mode**:
- [ ] Click "Edit Profile" button
- [ ] Verify form fields become editable
- [ ] Verify "Change Avatar" button appears
- [ ] Edit name field
- [ ] Edit email field
- [ ] Click "Save Changes"
- [ ] Verify toast notification appears
- [ ] Verify edit mode closes

**Cancel Edit**:
- [ ] Click "Edit Profile" again
- [ ] Make changes to name
- [ ] Click "Cancel"
- [ ] Verify changes are reverted
- [ ] Verify edit mode closes

**Quick Links**:
- [ ] Click "Settings" quick link
- [ ] Verify redirect to `/dashboard/settings`
- [ ] Go back to profile
- [ ] Click "Create Strategy" quick link
- [ ] Verify redirect to `/dashboard/strategies/create`

---

### Help Page (`/help`)

**Search Bar**:
- [ ] Navigate to `/help`
- [ ] Verify search bar displays
- [ ] Click in search bar
- [ ] Type "strategy"
- [ ] Note: Search functionality is placeholder only

**Help Categories**:
- [ ] Verify 4 category cards display:
  - [ ] Getting Started (blue)
  - [ ] Strategy Creation (green)
  - [ ] Video Tutorials (purple)
  - [ ] FAQs (orange)
- [ ] Hover over each category card
- [ ] Verify hover effect works
- [ ] Click on article links (note: placeholders only)

**Contact Support**:
- [ ] Scroll to "Still need help?" section
- [ ] Verify gradient background displays
- [ ] Click "Contact Support" button (placeholder)
- [ ] Click "Schedule a Demo" button (placeholder)

**Quick Links**:
- [ ] Click "Create Your First Strategy"
- [ ] Verify redirect to `/dashboard/strategies/create`

**Popular Articles**:
- [ ] Scroll to "Popular Articles" section
- [ ] Verify 6 articles display
- [ ] Hover over article cards
- [ ] Verify hover effects work

---

### Enhanced Strategy Creation (`/dashboard/strategies/create-enhanced`)

**Form Loading**:
- [ ] Navigate to `/dashboard/strategies/create-enhanced`
- [ ] Verify page loads without errors
- [ ] Verify progress indicator shows "Step 1 of 6"
- [ ] Verify "Business Information" step displays

**Step 1 - Business Info**:
- [ ] Fill in Business Name
- [ ] Select Business Type (B2B/B2C)
- [ ] Select Industry
- [ ] Select Business Stage
- [ ] Fill in Target Audience
- [ ] Click "Next"
- [ ] Verify progress updates to "Step 2 of 6"

**Step 2 - Market Context**:
- [ ] Fill in all fields
- [ ] Click "Next"
- [ ] Verify progress updates to "Step 3 of 6"

**Step 3 - Objectives**:
- [ ] Fill in all fields
- [ ] Click "Next"
- [ ] Verify progress updates to "Step 4 of 6"

**Step 4 - Resources**:
- [ ] Fill in budget
- [ ] Select team size
- [ ] Fill in other fields
- [ ] Click "Next"
- [ ] Verify progress updates to "Step 5 of 6"

**Step 5 - Channels**:
- [ ] Select marketing channels
- [ ] Fill in other fields
- [ ] Click "Next"
- [ ] Verify progress updates to "Step 6 of 6"

**Step 6 - Context**:
- [ ] Fill in additional context
- [ ] Click "Generate Strategy"
- [ ] Verify loading state appears
- [ ] Verify redirect to strategy view page
- [ ] Verify all 17 sections display

**Navigation**:
- [ ] Click "Back" button during form
- [ ] Verify previous step loads
- [ ] Verify form data persists
- [ ] Click "Cancel" button
- [ ] Verify confirmation dialog (if implemented)

---

## 🔍 BROWSER CONSOLE TESTING

### Check for Errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Navigate through all pages
- [ ] Verify no red error messages
- [ ] Verify no yellow warning messages (or note them)

### Check Network Tab
- [ ] Go to Network tab in DevTools
- [ ] Navigate to `/dashboard`
- [ ] Verify all requests return 200 status
- [ ] Navigate to `/dashboard/analytics`
- [ ] Verify 200 status (not 404)
- [ ] Navigate to `/dashboard/settings`
- [ ] Verify 200 status (not 404)
- [ ] Navigate to `/dashboard/profile`
- [ ] Verify 200 status (not 404)
- [ ] Navigate to `/help`
- [ ] Verify 200 status (not 404)

---

## 🎨 VISUAL TESTING

### Layout & Design
- [ ] Verify consistent header across all pages
- [ ] Verify sidebar displays on all dashboard pages
- [ ] Verify footer displays on public pages
- [ ] Verify no layout breaks or overlapping elements
- [ ] Verify text is readable (good contrast)
- [ ] Verify buttons have hover effects
- [ ] Verify links have hover effects

### Icons & Images
- [ ] Verify all icons display (no broken icon boxes)
- [ ] Verify logo displays in header
- [ ] Verify logo displays in dashboard header
- [ ] Verify avatar displays in profile page
- [ ] Verify no broken image icons (🖼️ with X)

### Colors & Branding
- [ ] Verify primary color is blue/purple
- [ ] Verify consistent color scheme
- [ ] Verify "Coming Soon" pages have color-coded themes:
  - [ ] Analytics - Blue
  - [ ] Exports - Green
  - [ ] Team - Purple

---

## 📱 RESPONSIVE TESTING (Optional)

### Desktop
- [ ] Test at 1920x1080 resolution
- [ ] Verify all elements display correctly
- [ ] Verify no horizontal scrolling

### Tablet
- [ ] Resize browser to ~768px width
- [ ] Verify layout adapts
- [ ] Verify sidebar behavior
- [ ] Verify navigation menu

### Mobile
- [ ] Resize browser to ~375px width
- [ ] Verify mobile menu appears
- [ ] Verify content is readable
- [ ] Verify buttons are tappable

---

## 🐛 BUG REPORTING

If you find any issues, document them here:

### Bug Template:
```
**Bug #**: 
**Severity**: Critical / High / Medium / Low
**Page**: 
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**: 
**Actual Result**: 
**Screenshot**: (if applicable)
**Browser**: 
**Console Errors**: (if any)
```

---

## ✅ SIGN-OFF

After completing all tests:

- [ ] All authentication tests passed
- [ ] All navigation tests passed
- [ ] All page-specific tests passed
- [ ] No critical bugs found
- [ ] Browser console clean (no errors)
- [ ] Visual inspection passed

**Tester Name**: ___________________  
**Date**: ___________________  
**Signature**: ___________________  

**Overall Status**: ✅ PASS / ⚠️ PASS WITH MINOR ISSUES / ❌ FAIL

**Notes**:
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

## 🎯 PRIORITY TESTING

If you have limited time, test these in order:

### High Priority (Must Test):
1. ✅ Sign-in with admin account
2. ✅ Dashboard navigation (all sidebar links)
3. ✅ Settings page (all tabs)
4. ✅ Enhanced strategy creation (full flow)
5. ✅ Browser console (check for errors)

### Medium Priority (Should Test):
1. ✅ Profile page (edit mode)
2. ✅ Help page (all sections)
3. ✅ Sign-out functionality
4. ✅ Other test accounts (editor, user)

### Low Priority (Nice to Test):
1. ✅ Visual inspection
2. ✅ Responsive design
3. ✅ All hover effects
4. ✅ Footer links (expected to be 404)

---

**Happy Testing! 🚀**

