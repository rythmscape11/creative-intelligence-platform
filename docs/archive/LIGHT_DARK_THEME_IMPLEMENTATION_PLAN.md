# Light/Dark Theme Implementation Plan

## Overview
This document outlines the comprehensive plan to implement light/dark theme support across the entire MediaPlanPro website.

## Current Status
- ✅ Hero section - Light mode working
- ✅ Header - Light mode working  
- ✅ Theme toggle - Working
- ❌ All other sections - Still in dark mode only

## Theme Color Scheme

### Light Mode (Default)
- **Backgrounds:** `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Text:** `text-gray-900` (primary), `text-gray-600` (secondary), `text-gray-500` (tertiary)
- **Borders:** `border-gray-200`, `border-gray-300`
- **Primary Color:** `text-blue-600`, `bg-blue-600`, `border-blue-500`
- **Accent Color:** `text-amber-500`, `bg-amber-500`

### Dark Mode
- **Backgrounds:** `dark:bg-bg-primary`, `dark:bg-bg-secondary`, `dark:bg-bg-tertiary`
- **Text:** `dark:text-text-primary`, `dark:text-text-secondary`, `dark:text-text-tertiary`
- **Borders:** `dark:border-border-primary`
- **Primary Color:** `dark:text-white`
- **Accent Color:** `dark:text-[#F59E0B]`, `dark:bg-[#F59E0B]`

## Files to Update

### Homepage Sections (15 files)
1. ✅ `src/components/home/client-logos.tsx` - UPDATED
2. ✅ `src/components/home/compact-testimonials.tsx` - UPDATED
3. ❌ `src/components/home/quick-faq.tsx` - NEEDS UPDATE
4. ❌ `src/components/home/why-mediaplanpro.tsx` - NEEDS UPDATE
5. ❌ `src/components/home/how-it-works.tsx` - NEEDS UPDATE
6. ❌ `src/components/home/free-tools-section.tsx` - NEEDS UPDATE
7. ❌ `src/components/home/metrics-that-matter.tsx` - NEEDS UPDATE
8. ❌ `src/components/home/features.tsx` - NEEDS UPDATE
9. ❌ `src/components/home/latest-blog-posts.tsx` - NEEDS UPDATE
10. ❌ `src/components/home/popular-resources.tsx` - NEEDS UPDATE
11. ❌ `src/components/home/services-section.tsx` - NEEDS UPDATE
12. ❌ `src/components/home/testimonials.tsx` - NEEDS UPDATE
13. ❌ `src/components/home/cta.tsx` - NEEDS UPDATE
14. ❌ `src/components/cro/SocialProof.tsx` - NEEDS UPDATE
15. ❌ `src/components/cro/ExitIntentPopup.tsx` - NEEDS UPDATE

### Layout Components (2 files)
1. ❌ `src/components/layout/footer.tsx` - NEEDS UPDATE
2. ❌ `src/app/page.tsx` - Update wrapper div background

### Internal Pages (10+ files)
1. ❌ `src/app/strategy/page.tsx` - Strategy Builder
2. ❌ `src/app/tools/page.tsx` - Tools listing
3. ❌ `src/app/pricing/page.tsx` - Pricing page
4. ❌ `src/app/about/page.tsx` - About page
5. ❌ `src/app/contact/page.tsx` - Contact page
6. ❌ `src/app/blog/page.tsx` - Blog listing
7. ❌ `src/app/blog/[slug]/page.tsx` - Blog posts
8. ❌ `src/app/resources/*` - Resource pages
9. ❌ `src/app/services/page.tsx` - Services page
10. ❌ `src/app/dashboard/*` - Dashboard pages
11. ❌ `src/app/auth/*` - Auth pages

## Pattern for Updates

### Section Background Pattern
```tsx
// OLD (dark only)
className="py-12 bg-bg-primary"

// NEW (light/dark)
className="py-12 bg-white dark:bg-bg-primary"

// Alternating sections
className="py-12 bg-gray-50 dark:bg-bg-secondary"
```

### Text Color Pattern
```tsx
// OLD (dark only)
className="text-text-primary"
className="text-text-secondary"
className="text-text-tertiary"

// NEW (light/dark)
className="text-gray-900 dark:text-text-primary"
className="text-gray-600 dark:text-text-secondary"
className="text-gray-500 dark:text-text-tertiary"
```

### Border Pattern
```tsx
// OLD (dark only)
className="border-border-primary"

// NEW (light/dark)
className="border-gray-200 dark:border-border-primary"
```

### Card/Container Pattern
```tsx
// OLD (dark only)
className="bg-bg-secondary border border-border-primary"

// NEW (light/dark)
className="bg-gray-50 dark:bg-bg-secondary border border-gray-200 dark:border-border-primary"
```

### Button Pattern
```tsx
// Primary button - OLD
className="bg-[#F59E0B] hover:bg-[#D97706]"

// Primary button - NEW
className="bg-blue-600 dark:bg-[#F59E0B] hover:bg-blue-700 dark:hover:bg-[#D97706]"
```

### Hover Effects Pattern
```tsx
// OLD (dark only)
className="hover:border-[#F59E0B]/30 hover:shadow-[#F59E0B]/5"

// NEW (light/dark)
className="hover:border-blue-500/30 dark:hover:border-[#F59E0B]/30 hover:shadow-blue-500/5 dark:hover:shadow-[#F59E0B]/5"
```

## Priority Order

### Phase 1: Critical Homepage Sections (High Visibility)
1. quick-faq.tsx
2. why-mediaplanpro.tsx
3. how-it-works.tsx
4. features.tsx
5. testimonials.tsx
6. cta.tsx
7. footer.tsx

### Phase 2: Secondary Homepage Sections
1. free-tools-section.tsx
2. metrics-that-matter.tsx
3. latest-blog-posts.tsx
4. popular-resources.tsx
5. services-section.tsx
6. SocialProof.tsx

### Phase 3: Internal Pages
1. /strategy (Strategy Builder)
2. /tools (Tools page)
3. /pricing (Pricing page)
4. /about (About page)
5. /blog (Blog pages)

### Phase 4: Dashboard & Auth Pages
1. Dashboard pages
2. Auth pages

## Testing Checklist

After each update:
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Theme toggle switches between modes smoothly
- [ ] No sections remain stuck in one theme
- [ ] Text is readable in both themes (contrast check)
- [ ] Hover states work in both themes
- [ ] Buttons and CTAs are visible in both themes
- [ ] No visual glitches or FOUC

## Next Steps

1. Update remaining homepage sections (Phase 1)
2. Update footer component
3. Update homepage wrapper div
4. Test all homepage sections
5. Update internal pages (Phase 2-3)
6. Final testing and deployment

