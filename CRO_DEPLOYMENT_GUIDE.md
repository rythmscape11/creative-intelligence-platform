# MediaPlanPro CRO Implementation - Quick Start Guide

## 🎯 Overview

This guide helps you deploy the CRO (Conversion Rate Optimization) features that are ready to use **without Stripe integration**.

---

## ✅ What's Ready to Deploy NOW

### 1. Lead Capture System
- ✅ Email capture modal (post-tool-use)
- ✅ Exit-intent popup
- ✅ Newsletter signup forms
- ✅ API endpoint: `/api/lead-capture`
- ✅ Database tables: `email_subscribers`, `lead_captures`

### 2. Social Proof Components
- ✅ Stats display (users, tools used, rating)
- ✅ Testimonials section
- ✅ Trust badges

### 3. Dashboard (Basic Features)
- ✅ User dashboard page at `/dashboard`
- ✅ Account settings
- ✅ Sign out functionality

### 4. Pricing Page
- ✅ Pricing table with 4 tiers
- ✅ FAQ section
- ✅ Feature comparison

---

## 🚀 Quick Deployment (3 Steps)

### Step 1: Commit & Push ✅ READY

```bash
git add -A
git commit -m "feat: implement CRO strategy - lead capture, social proof, and dashboard

- Add email capture modal, exit-intent popup, newsletter signup
- Add social proof components with stats and testimonials
- Add user dashboard with account settings
- Add pricing page with FAQ
- Add lead capture API endpoint
- Update database schema with CRO tables

Related: #cro #lead-capture #dashboard #pricing"

git push origin main
```

### Step 2: Vercel Will Auto-Deploy

Vercel will automatically deploy when you push to main. The build will succeed even without Stripe keys.

### Step 3: Test in Production

After deployment, test these features:

1. **Exit Intent**: Visit homepage, move mouse to top of browser
2. **Newsletter**: Check if newsletter form appears in footer
3. **Lead Capture API**: 
   ```bash
   curl -X POST https://www.mediaplanpro.com/api/lead-capture \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","source":"test"}'
   ```

---

## 📊 How to Use the CRO Components

### 1. Add Email Capture to Tool Pages

Edit any tool page (e.g., `src/app/tools/content/headline-analyzer-enhanced/page.tsx`):

```tsx
'use client';

import { useState } from 'react';
import { EmailCaptureModal } from '@/components/cro/EmailCaptureModal';

export default function HeadlineAnalyzerPage() {
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = () => {
    // Your existing analyze logic
    setHasAnalyzed(true);
    
    // Show email capture after 3 seconds
    setTimeout(() => {
      if (!localStorage.getItem('email-captured-headline-analyzer')) {
        setShowEmailCapture(true);
      }
    }, 3000);
  };

  const handleEmailCaptureClose = () => {
    setShowEmailCapture(false);
    localStorage.setItem('email-captured-headline-analyzer', 'true');
  };

  return (
    <>
      {/* Your existing tool UI */}
      
      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={handleEmailCaptureClose}
        source="headline-analyzer"
        toolId="headline-analyzer-enhanced"
        title="Get Your Results + Weekly Marketing Tips"
      />
    </>
  );
}
```

### 2. Add Exit Intent to Homepage

Edit `src/app/page.tsx`:

```tsx
import { ExitIntentPopup } from '@/components/cro/ExitIntentPopup';

export default function HomePage() {
  return (
    <>
      {/* Your existing homepage content */}
      
      <ExitIntentPopup enabled={true} />
    </>
  );
}
```

### 3. Add Newsletter to Footer

Edit your footer component:

```tsx
import { NewsletterSignup } from '@/components/cro/NewsletterSignup';

export default function Footer() {
  return (
    <footer>
      {/* Your existing footer content */}
      
      <div className="mt-8">
        <NewsletterSignup 
          variant="compact"
          title="Stay Updated"
          description="Get weekly marketing tips and tool updates"
        />
      </div>
    </footer>
  );
}
```

### 4. Add Social Proof to Homepage

Edit `src/app/page.tsx`:

```tsx
import { SocialProof } from '@/components/cro/SocialProof';

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      
      {/* Add social proof after hero */}
      <SocialProof />
      
      {/* Rest of homepage */}
    </>
  );
}
```

---

## 📈 Monitor Lead Capture Performance

### View Captured Leads

Use Prisma Studio to view leads:

```bash
npx prisma studio
```

Then navigate to:
- `email_subscribers` table - See all email subscribers
- `lead_captures` table - See detailed capture events

### Query Lead Stats

```sql
-- Total leads
SELECT COUNT(*) FROM lead_captures;

-- Leads by source
SELECT source, COUNT(*) as count 
FROM lead_captures 
GROUP BY source 
ORDER BY count DESC;

-- Recent leads
SELECT email, source, created_at 
FROM lead_captures 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🎨 Customization Options

### EmailCaptureModal Props

```tsx
<EmailCaptureModal
  isOpen={boolean}
  onClose={() => void}
  source="tool-name"           // Required: tracking source
  toolId="tool-id"             // Optional: specific tool ID
  title="Custom Title"         // Optional: modal title
  description="Custom text"    // Optional: modal description
  incentive="Free guide"       // Optional: what they get
/>
```

### ExitIntentPopup Props

```tsx
<ExitIntentPopup
  enabled={true}               // Enable/disable popup
  title="Custom Title"         // Optional: popup title
  description="Custom text"    // Optional: popup description
  resourceTitle="Free Guide"   // Optional: resource name
/>
```

### NewsletterSignup Props

```tsx
<NewsletterSignup
  variant="default"            // "default" | "compact" | "inline"
  title="Custom Title"         // Optional: form title
  description="Custom text"    // Optional: form description
  placeholder="Your email"     // Optional: input placeholder
  buttonText="Subscribe"       // Optional: button text
/>
```

### SocialProof Props

```tsx
<SocialProof
  variant="default"            // "default" | "compact"
  showTestimonials={true}      // Show/hide testimonials
  showStats={true}             // Show/hide stats
/>
```

---

## 🔧 Troubleshooting

### Email capture not working?

1. Check browser console for errors
2. Verify API endpoint: `curl https://www.mediaplanpro.com/api/lead-capture`
3. Check database connection in Vercel logs

### Exit intent not triggering?

1. Clear localStorage: `localStorage.clear()`
2. Move mouse to very top of browser window
3. Check if `exitIntentShown` is in localStorage

### Newsletter form not submitting?

1. Check network tab for API call
2. Verify email format is valid
3. Check Vercel function logs

---

## 📊 Expected Results

### Week 1 (After Deployment)
- **Goal**: Capture 50-100 email leads
- **Focus**: Test all components, fix any bugs
- **Metrics**: Track conversion rate per tool

### Week 2-4
- **Goal**: Capture 200-500 email leads
- **Focus**: Optimize modal timing and copy
- **Metrics**: A/B test different offers

### Month 2-3
- **Goal**: Build email list to 1,000+ subscribers
- **Focus**: Create email nurture sequence
- **Metrics**: Track email open rates and engagement

---

## 🎯 Next Steps After This Deployment

### Immediate (This Week)
1. ✅ Deploy CRO components
2. ✅ Test all features in production
3. ✅ Monitor lead capture rates
4. ✅ Add components to key pages

### Short Term (Next 2 Weeks)
1. Set up email service (SendGrid, Mailgun, etc.)
2. Create welcome email template
3. Start weekly newsletter
4. A/B test modal copy and timing

### Medium Term (Month 2-3)
1. Build email nurture sequence
2. Create lead magnets (guides, templates)
3. Optimize conversion rates
4. Prepare for Stripe integration

### Long Term (Month 4-6)
1. Add Stripe integration
2. Launch paid plans
3. Implement premium features
4. Scale to 100+ paying customers

---

## 📞 Quick Reference

### Important Files
- Lead Capture API: `src/app/api/lead-capture/route.ts`
- Email Modal: `src/components/cro/EmailCaptureModal.tsx`
- Exit Intent: `src/components/cro/ExitIntentPopup.tsx`
- Newsletter: `src/components/cro/NewsletterSignup.tsx`
- Social Proof: `src/components/cro/SocialProof.tsx`
- Pricing Config: `src/config/pricing.ts`

### Database Tables
- `email_subscribers` - All email subscribers
- `lead_captures` - Detailed capture events
- `saved_tool_results` - Saved results (requires Pro)
- `premium_feature_usage` - Feature usage tracking

### API Endpoints
- `POST /api/lead-capture` - Capture email leads
- `POST /api/tools/save-result` - Save tool results (Pro)
- `GET /api/tools/save-result` - Get saved results (Pro)
- `DELETE /api/tools/save-result` - Delete saved result (Pro)

---

**Status:** ✅ Ready to deploy immediately  
**Last Updated:** 2025-10-27  
**Estimated Setup Time:** 15 minutes

