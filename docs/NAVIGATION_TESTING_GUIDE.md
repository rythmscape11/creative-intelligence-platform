# Navigation and Authentication Testing Guide

**Purpose**: Step-by-step guide to test all navigation and authentication improvements

---

## Quick Test Checklist

### 1. Tool Pages Navigation (5 minutes)

**Test Original Tool Page:**
1. Visit: `http://localhost:3000/tools/seo/backlink-checker`
2. ✅ Verify Header is visible at top
3. ✅ Verify logo links to homepage
4. ✅ Verify navigation menu (Home, Free Tools, Strategy Builder, Blog, Pricing)
5. ✅ Verify "Back to Tools" button works
6. ✅ Verify Footer is visible at bottom

**Test Enhanced Tool Page:**
1. Visit: `http://localhost:3000/tools/seo/backlink-checker-enhanced`
2. ✅ Verify Header is visible at top
3. ✅ Verify all navigation elements present
4. ✅ Verify Footer is visible at bottom

**Test 3 More Tool Pages:**
- `/tools/content/headline-analyzer`
- `/tools/social/hashtag-generator`
- `/tools/email/signature-generator`

---

### 2. Home Icon Testing (3 minutes)

**From Dashboard:**
1. Sign in: `http://localhost:3000/auth/signin`
   - Email: `admin@mediaplanpro.com`
   - Password: `Adm!n2024$SecureP@ssw0rd#MPP`
2. Navigate to: `http://localhost:3000/dashboard`
3. ✅ Verify Home icon (house icon) is visible next to logo
4. ✅ Hover over home icon - should show tooltip "Go to Homepage"
5. ✅ Click home icon - should navigate to `/`

**From Strategy Builder:**
1. Navigate to: `http://localhost:3000/dashboard/strategies/create`
2. ✅ Verify Home icon is visible
3. ✅ Click home icon - should navigate to `/`

**From User Profile:**
1. Navigate to: `http://localhost:3000/dashboard/profile`
2. ✅ Verify Home icon is visible
3. ✅ Click home icon - should navigate to `/`

---

### 3. Sign Out Testing (5 minutes)

**Desktop Sign Out from Public Page:**
1. Sign in if not already signed in
2. Visit: `http://localhost:3000/`
3. ✅ Verify "Dashboard" and "Sign Out" buttons visible in header
4. Click "Sign Out"
5. ✅ Verify redirected to homepage (`/`)
6. ✅ Verify "Sign In" and "Get Started" buttons now visible
7. Try to access: `http://localhost:3000/dashboard`
8. ✅ Verify redirected to `/auth/signin`

**Desktop Sign Out from Dashboard:**
1. Sign in again
2. Navigate to: `http://localhost:3000/dashboard`
3. Click user menu (top right)
4. ✅ Verify dropdown shows: Admin Panel, Profile, Settings, Sign Out
5. Click "Sign Out"
6. ✅ Verify redirected to homepage (`/`)
7. ✅ Verify session terminated

**Desktop Sign Out from Tool Page:**
1. Sign in again
2. Navigate to: `http://localhost:3000/tools/seo/backlink-checker`
3. ✅ Verify "Dashboard" and "Sign Out" buttons in header
4. Click "Sign Out"
5. ✅ Verify redirected to homepage (`/`)

**Mobile Sign Out:**
1. Resize browser to mobile width (< 768px) or use device emulator
2. Sign in if needed
3. Visit: `http://localhost:3000/`
4. Click hamburger menu (☰)
5. ✅ Verify mobile menu opens
6. ✅ Verify "Dashboard" and "Sign Out" visible in menu
7. Click "Sign Out"
8. ✅ Verify menu closes
9. ✅ Verify redirected to homepage
10. ✅ Verify "Sign In" and "Get Started" now visible in mobile menu

---

## Detailed Testing Scenarios

### Scenario 1: New User Journey

**Steps:**
1. Visit homepage as logged-out user
2. ✅ See "Sign In" and "Get Started" buttons
3. Click "Free Tools" in navigation
4. ✅ Navigate to `/tools`
5. Click any tool (e.g., "Headline Analyzer")
6. ✅ See full header with navigation
7. ✅ See "Sign In" button in header
8. Click "Sign In"
9. ✅ Navigate to `/auth/signin`
10. Sign in with credentials
11. ✅ Redirected to `/dashboard`
12. ✅ See home icon next to logo
13. Click home icon
14. ✅ Navigate to homepage (`/`)
15. ✅ See "Dashboard" and "Sign Out" in header

---

### Scenario 2: Authenticated User Tool Usage

**Steps:**
1. Sign in as user
2. Navigate to `/tools`
3. Click "Backlink Checker"
4. ✅ See header with "Dashboard" and "Sign Out"
5. Use the tool (enter backlinks, analyze)
6. ✅ Tool functions normally
7. Click "Back to Tools"
8. ✅ Navigate to `/tools`
9. Click "Backlink Checker Enhanced"
10. ✅ See same header with navigation
11. ✅ Tool functions normally
12. Click logo in header
13. ✅ Navigate to homepage

---

### Scenario 3: Admin User Navigation

**Steps:**
1. Sign in as admin
2. Navigate to `/dashboard`
3. ✅ See home icon next to logo
4. Click user menu
5. ✅ See "Admin Panel" option
6. Click "Admin Panel"
7. ✅ Navigate to `/admin`
8. ✅ See "Back to Dashboard" link
9. Click "Back to Dashboard"
10. ✅ Navigate to `/dashboard`
11. Click home icon
12. ✅ Navigate to homepage
13. Navigate to any tool page
14. ✅ See full navigation in header
15. Click "Sign Out"
16. ✅ Redirected to homepage
17. Try to access `/admin`
18. ✅ Redirected to `/auth/signin`

---

### Scenario 4: Mobile Navigation Flow

**Steps:**
1. Set browser to mobile width (375px)
2. Visit homepage
3. ✅ See hamburger menu icon (☰)
4. Click hamburger menu
5. ✅ Menu slides in from right
6. ✅ See all navigation items: Home, Free Tools, Strategy Builder, Blog, Pricing
7. ✅ See "Sign In" and "Get Started" buttons
8. Click "Free Tools"
9. ✅ Menu closes
10. ✅ Navigate to `/tools`
11. Click any tool
12. ✅ See hamburger menu in header
13. Click hamburger menu
14. ✅ Menu opens with navigation
15. Sign in via mobile menu
16. ✅ After sign in, see "Dashboard" and "Sign Out" in mobile menu
17. Navigate to dashboard
18. ✅ See hamburger menu for sidebar
19. ✅ See home icon next to logo
20. Click home icon
21. ✅ Navigate to homepage

---

## Browser Compatibility Testing

### Chrome
- [ ] Desktop navigation works
- [ ] Mobile navigation works
- [ ] Sign out works
- [ ] Home icon works
- [ ] No console errors

### Firefox
- [ ] Desktop navigation works
- [ ] Mobile navigation works
- [ ] Sign out works
- [ ] Home icon works
- [ ] No console errors

### Safari
- [ ] Desktop navigation works
- [ ] Mobile navigation works
- [ ] Sign out works
- [ ] Home icon works
- [ ] No console errors

### Edge
- [ ] Desktop navigation works
- [ ] Mobile navigation works
- [ ] Sign out works
- [ ] Home icon works
- [ ] No console errors

---

## Responsive Breakpoint Testing

### Mobile (< 768px)
- [ ] Hamburger menu visible
- [ ] Logo visible
- [ ] Home icon visible (dashboard)
- [ ] Navigation menu slides in
- [ ] All links accessible
- [ ] Sign out works

### Tablet (768px - 1024px)
- [ ] Full navigation visible
- [ ] Logo visible
- [ ] Home icon visible (dashboard)
- [ ] All links accessible
- [ ] Sign out works

### Desktop (> 1024px)
- [ ] Full navigation visible
- [ ] Logo visible
- [ ] Home icon visible (dashboard)
- [ ] All links accessible
- [ ] Sign out works
- [ ] Hover effects work

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all navigation links
- [ ] Enter key activates links
- [ ] Focus visible on all interactive elements
- [ ] Skip to content link works
- [ ] Escape closes mobile menu

### Screen Reader
- [ ] Logo has alt text "MediaPlanPro Logo"
- [ ] Home icon has title "Go to Homepage"
- [ ] Navigation has aria-label
- [ ] Sign out button has clear label
- [ ] Mobile menu has proper ARIA attributes

---

## Performance Testing

### Page Load Times
- [ ] Homepage loads < 2 seconds
- [ ] Tool pages load < 2 seconds
- [ ] Dashboard loads < 2 seconds
- [ ] Navigation doesn't cause layout shift

### Navigation Speed
- [ ] Clicking links navigates instantly
- [ ] Mobile menu opens/closes smoothly
- [ ] Sign out redirects quickly
- [ ] No lag or delays

---

## Error Scenarios

### Network Errors
1. Disconnect network
2. Try to sign out
3. ✅ Should show error message
4. ✅ Should not break navigation

### Session Expiry
1. Sign in
2. Wait for session to expire (or manually clear cookies)
3. Try to access dashboard
4. ✅ Should redirect to sign in
5. ✅ Should preserve callbackUrl

### Invalid Routes
1. Visit `/tools/invalid-tool`
2. ✅ Should show 404 page
3. ✅ Header should still be visible
4. ✅ Navigation should work

---

## Test Credentials

**Admin User:**
- Email: `admin@mediaplanpro.com`
- Password: `Adm!n2024$SecureP@ssw0rd#MPP`

**Regular User:**
- Email: `user@example.com`
- Password: `User123!`

---

## Expected Results Summary

### ✅ All Tool Pages (60 total)
- Header with full navigation
- Footer with links
- "Back to Tools" button
- Sign out functionality (when logged in)

### ✅ Dashboard Pages
- DashboardHeader with home icon
- User menu with sign out
- Sidebar navigation
- Mobile responsive

### ✅ Sign Out Behavior
- Terminates session
- Redirects to homepage
- Clears client state
- Protects routes after sign out

### ✅ Home Icon
- Visible on all authenticated pages
- Links to homepage
- Has hover effect
- Has tooltip

---

## Reporting Issues

If you find any issues during testing, please report:

1. **Page URL** where issue occurred
2. **Browser** and version
3. **Device** (desktop/mobile)
4. **Steps to reproduce**
5. **Expected behavior**
6. **Actual behavior**
7. **Screenshots** if applicable

---

**Testing Status:** Ready for QA
**Last Updated:** January 2025

