# CRO Components Integration Checklist

## 🎯 Quick Start: Add CRO Components to Your Site

This checklist helps you integrate the CRO components into your existing MediaPlanPro pages.

---

## ✅ Priority 1: High-Impact, Quick Wins (Do First)

### 1. Add Exit Intent Popup to Homepage (5 minutes)

**File:** `src/app/page.tsx`

**Add this import:**
```tsx
import { ExitIntentPopup } from '@/components/cro/ExitIntentPopup';
```

**Add this component at the end of your return statement:**
```tsx
export default function HomePage() {
  return (
    <>
      {/* Your existing homepage content */}
      
      {/* Add this at the very end, before closing fragment */}
      <ExitIntentPopup enabled={true} />
    </>
  );
}
```

**Expected Result:** When users move their mouse to leave the page, they'll see a popup offering a free Marketing Toolkit in exchange for their email.

---

### 2. Add Social Proof to Homepage (5 minutes)

**File:** `src/app/page.tsx`

**Add this import:**
```tsx
import { SocialProof } from '@/components/cro/SocialProof';
```

**Add after your hero section:**
```tsx
export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      
      {/* Add social proof here */}
      <section className="py-12">
        <SocialProof />
      </section>
      
      {/* Rest of homepage */}
    </>
  );
}
```

**Expected Result:** Shows stats (50,000+ users, 1M+ tools used) and 3 testimonials with ratings.

---

### 3. Add Newsletter Signup to Footer (10 minutes)

**File:** Find your footer component (likely `src/components/layout/Footer.tsx` or similar)

**Add this import:**
```tsx
import { NewsletterSignup } from '@/components/cro/NewsletterSignup';
```

**Add to footer:**
```tsx
export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-primary">
      <div className="container mx-auto px-4 py-12">
        {/* Your existing footer content */}
        
        {/* Add newsletter signup */}
        <div className="mt-8 pt-8 border-t border-border-primary">
          <NewsletterSignup 
            variant="compact"
            title="Stay Updated with Marketing Tips"
            description="Get weekly insights, tool updates, and exclusive content"
          />
        </div>
      </div>
    </footer>
  );
}
```

**Expected Result:** Newsletter signup form appears in footer on all pages.

---

## ✅ Priority 2: Tool Page Email Capture (30 minutes)

### 4. Add Email Capture to Top 5 Most-Used Tools

Pick your 5 most popular tools and add email capture. Here's an example for the Headline Analyzer:

**File:** `src/app/tools/content/headline-analyzer-enhanced/page.tsx`

**Step 1: Make it a client component (if not already)**
```tsx
'use client';
```

**Step 2: Add imports**
```tsx
import { useState, useEffect } from 'react';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';
```

**Step 3: Add state**
```tsx
export default function HeadlineAnalyzerPage() {
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  // Your existing state...
```

**Step 4: Trigger after tool use**
```tsx
  const handleAnalyze = () => {
    // Your existing analyze logic
    
    // Mark as analyzed
    setHasAnalyzed(true);
  };
  
  // Show email capture 3 seconds after first use
  useEffect(() => {
    if (hasAnalyzed && !localStorage.getItem('email-captured-headline-analyzer')) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [hasAnalyzed]);
```

**Step 5: Add modal to JSX**
```tsx
  return (
    <>
      {/* Your existing tool UI */}
      
      {/* Email capture modal */}
      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={() => {
          setShowEmailCapture(false);
          localStorage.setItem('email-captured-headline-analyzer', 'true');
        }}
        source="headline-analyzer"
        toolId="headline-analyzer-enhanced"
        title="Get Your Results + Weekly Marketing Tips"
        description="Save your analysis and receive expert marketing insights every week"
        incentive="Free Marketing Toolkit (worth $99)"
      />
    </>
  );
```

**Repeat for these tools:**
1. ✅ Headline Analyzer
2. ⬜ ROI Calculator
3. ⬜ CPC/CPM Calculator
4. ⬜ Landing Page Analyzer
5. ⬜ (Your 5th most popular tool)

---

## ✅ Priority 3: Pricing & Dashboard Pages (15 minutes)

### 5. Create Pricing Page

**File:** `src/app/pricing/page.tsx`

**Create new file with this content:**
```tsx
import { PricingTable } from '@/components/pricing/PricingTable';
import { PricingFAQ } from '@/components/pricing/PricingFAQ';
import { SocialProof } from '@/components/cro/SocialProof';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-tertiary">
      {/* Header */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Start free, upgrade when you need more. No credit card required.
        </p>
      </section>

      {/* Pricing Table */}
      <section className="py-12">
        <PricingTable />
      </section>

      {/* Social Proof */}
      <section className="py-12">
        <SocialProof variant="compact" />
      </section>

      {/* FAQ */}
      <section className="py-12">
        <PricingFAQ />
      </section>
    </div>
  );
}
```

**Add to navigation:**
Add a "Pricing" link to your main navigation menu.

---

### 6. Create Dashboard Page

**File:** `src/app/dashboard/page.tsx`

**Create new file with this content:**
```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  return (
    <div className="min-h-screen bg-bg-tertiary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Dashboard
        </h1>
        <DashboardContent />
      </div>
    </div>
  );
}
```

**Add to user menu:**
Add a "Dashboard" link to your user dropdown menu (when logged in).

---

## 📊 Testing Checklist

After implementing the above, test each component:

### Exit Intent Popup
- [ ] Visit homepage
- [ ] Move mouse to top of browser window
- [ ] Popup should appear
- [ ] Submit email
- [ ] Check database for new entry in `email_subscribers` table
- [ ] Refresh page and try again - should NOT show (localStorage)

### Social Proof
- [ ] Visit homepage
- [ ] Scroll to social proof section
- [ ] Verify stats are visible
- [ ] Verify 3 testimonials are showing

### Newsletter Signup
- [ ] Scroll to footer on any page
- [ ] Enter email and submit
- [ ] Should show success message
- [ ] Check database for new entry

### Email Capture Modal
- [ ] Use a tool (e.g., Headline Analyzer)
- [ ] Wait 3 seconds
- [ ] Modal should appear
- [ ] Submit email
- [ ] Check database for new entry
- [ ] Use tool again - should NOT show modal (localStorage)

### Pricing Page
- [ ] Visit `/pricing`
- [ ] Verify all 4 tiers are showing
- [ ] Toggle monthly/yearly billing
- [ ] Verify prices update correctly
- [ ] Click "Get Started" - should redirect to sign-in

### Dashboard Page
- [ ] Visit `/dashboard` (not logged in)
- [ ] Should redirect to sign-in
- [ ] Sign in
- [ ] Should see dashboard with 4 tabs
- [ ] Click through each tab

---

## 🗄️ Database Verification

After testing, verify data is being captured:

```bash
npx prisma studio
```

Check these tables:
- `email_subscribers` - Should have entries from newsletter and email capture
- `lead_captures` - Should have detailed tracking of all submissions

---

## 📈 Analytics Setup (Optional)

To track conversion rates, add these events to your analytics:

```tsx
// When email capture modal is shown
analytics.track('Email Capture Modal Shown', {
  source: 'headline-analyzer',
  toolId: 'headline-analyzer-enhanced'
});

// When email is submitted
analytics.track('Email Captured', {
  source: 'headline-analyzer',
  toolId: 'headline-analyzer-enhanced'
});

// When exit intent is triggered
analytics.track('Exit Intent Shown');

// When newsletter signup is submitted
analytics.track('Newsletter Signup', {
  source: 'footer'
});
```

---

## 🎯 Success Metrics

After 1 week, you should see:
- ✅ 50-100 email captures
- ✅ 10-20% conversion rate on email capture modals
- ✅ 5-10% conversion rate on exit intent
- ✅ 2-5% conversion rate on newsletter signup

After 1 month, you should have:
- ✅ 500-1,000 email subscribers
- ✅ Baseline conversion data for optimization
- ✅ Email list ready for nurture campaigns

---

## 🚀 Next Steps After Integration

1. **Week 1:** Monitor and fix any bugs
2. **Week 2:** A/B test different copy and timing
3. **Week 3:** Set up email welcome sequence
4. **Week 4:** Start weekly newsletter
5. **Month 2:** Prepare for Stripe integration

---

**Estimated Total Time:** 1-2 hours  
**Expected Impact:** 500-1,000 email leads in first month  
**ROI:** Foundation for $5,000+/month recurring revenue

