# Manual Testing Guide - MediaPlanPro

## Prerequisites

All automated tests are complete (19/19 passing ✅). This guide covers manual browser testing that cannot be automated.

## Test User Credentials

| Email | Password | Subscription | Purpose |
|-------|----------|--------------|---------|
| test_0@example.com | password123 | PRO | Primary test user |
| paid_user_v2@example.com | PaidUser123! | PRO | Secondary test user |
| paid_user_v3@example.com | PaidUser123! | PRO | Tertiary test user |

**Note:** All passwords have been verified working in backend authentication.

---

## Test Scenarios

### 1. Authentication Flow ✓

**Steps:**
1. Navigate to https://www.mediaplanpro.com/auth/signin
2. Enter credentials: `test_0@example.com` / `password123`
3. Click "Sign in"

**Expected:**
- ✅ Successful login
- ✅ Redirect to dashboard
- ✅ User menu shows email/name

---

### 2. Free Tier Functionality ✓

**Setup:** Create a new free user or use existing free account

**Steps:**
1. Sign in as free user
2. Navigate to `/dashboard/strategies`
3. Try to create a strategy
4. Navigate to `/dashboard/strategies` again

**Expected:**
- ✅ Empty state with upgrade prompt (if no strategies)
- ✅ Can create 1 strategy per month
- ✅ Second attempt shows 403 error with upgrade message
- ✅ Export buttons disabled/hidden

---

### 3. PRO User - Unlimited Strategies ✓

**Steps:**
1. Sign in as `test_0@example.com`
2. Navigate to `/dashboard/strategies/create`
3. Fill in strategy form:
   - Business Name: "Test Business 1"
   - Industry: "Technology"
   - Target Audience: "Tech professionals"
   - Budget: $50,000
   - Objectives: "Increase sales"
   - Timeframe: "6 months"
   - Challenges: "Market competition"
4. Submit and verify strategy created
5. Repeat steps 2-4 with "Test Business 2"

**Expected:**
- ✅ Both strategies created successfully
- ✅ No limit errors
- ✅ Strategies appear in list

---

### 4. Export Functionality ✓

**Steps:**
1. Sign in as PRO user (`test_0@example.com`)
2. Navigate to a strategy detail page
3. Click "Export as PowerPoint" (PPTX)
4. Verify file downloads
5. Open downloaded file and verify content
6. Repeat for "Export as Word" (DOCX)
7. Repeat for "Export as Excel" (XLSX)

**Expected:**
- ✅ PPTX file downloads with slides (Title, Summary, Audience, Channels, Timeline)
- ✅ DOCX file downloads with formatted document
- ✅ XLSX file downloads with multiple sheets
- ✅ All exports contain correct strategy data
- ✅ Business name appears in filename

**Verify in Files:**
- Executive summary present
- Target audience segments listed
- Marketing channels with budget breakdown
- Implementation timeline with phases
- KPIs included

---

### 5. Strategy Persistence ✓

**Steps:**
1. Create a new strategy as PRO user
2. Note the strategy ID from URL
3. Close browser completely
4. Reopen browser and sign in
5. Navigate to `/dashboard/strategies`
6. Click on the created strategy

**Expected:**
- ✅ Strategy appears in list after reload
- ✅ Strategy details load correctly
- ✅ All data preserved (input and output)

---

### 6. Sign-Out Functionality ✓

**Steps:**
1. Sign in as any user
2. Click user menu (top right)
3. Click "Sign Out"
4. Verify redirect to home/signin page
5. Try to navigate to `/dashboard` directly

**Expected:**
- ✅ Successful sign out
- ✅ Redirect to signin page
- ✅ User menu no longer shows authenticated state
- ✅ Dashboard redirect to signin (protected route)
- ✅ Session cleared (check cookies/localStorage)

---

### 7. Upgrade Prompts ✓

**Steps:**
1. Sign in as free user
2. Navigate to various pages:
   - `/dashboard/strategies` (after creating 1 strategy)
   - Strategy detail page (try to export)
   - `/pricing`

**Expected:**
- ✅ Clear upgrade prompts on strategies page
- ✅ Export buttons show upgrade tooltip/message
- ✅ Pricing page highlights PRO benefits
- ✅ "Upgrade to Pro" CTAs visible

---

### 8. Payment Flow (Sandbox) ⚠️

**Note:** Requires Razorpay test mode configuration

**Steps:**
1. Sign in as free user
2. Navigate to `/pricing`
3. Click "Upgrade to Pro" on PRO plan
4. Use Razorpay test card: `4111 1111 1111 1111`
5. Complete payment flow

**Expected:**
- ✅ Razorpay modal opens
- ✅ Test payment succeeds
- ✅ Webhook updates subscription
- ✅ User redirected to dashboard
- ✅ PRO features unlocked

---

## Verification Checklist

After completing all tests, verify:

- [ ] All test users can log in successfully
- [ ] Free tier limit enforced (1 strategy/month)
- [ ] PRO users have unlimited strategies
- [ ] Export works for all formats (PPTX, DOCX, XLSX)
- [ ] Export denied for free users
- [ ] Strategies persist across sessions
- [ ] Sign-out clears session properly
- [ ] Upgrade prompts appear correctly
- [ ] Payment flow works (if configured)

---

## Known Issues

1. **Browser Automation:** Login fails via automated browser tools due to CSRF/session handling
   - **Workaround:** Manual testing required
   
2. **Export Testing:** Cannot verify file downloads via automation
   - **Workaround:** Manual download and inspection

---

## Test Results Template

```
Date: ___________
Tester: ___________

[ ] Authentication Flow
[ ] Free Tier Functionality
[ ] PRO Unlimited Strategies
[ ] Export Functionality (PPTX/DOCX/XLSX)
[ ] Strategy Persistence
[ ] Sign-Out Functionality
[ ] Upgrade Prompts
[ ] Payment Flow (if applicable)

Notes:
_________________________________
_________________________________
_________________________________
```

---

## Support

If you encounter issues during testing:
1. Check browser console for errors
2. Verify test user credentials
3. Ensure database is up to date
4. Check server logs for API errors
5. Verify Razorpay configuration (for payment tests)
