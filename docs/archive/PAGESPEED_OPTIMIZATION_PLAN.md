# PageSpeed Insights Optimization Plan

**Date**: October 15, 2025  
**Production URL**: https://mediaplanpro-9u2wbmdft-anustups-projects-438c3483.vercel.app  
**PageSpeed Report**: https://pagespeed.web.dev/analysis/https-www-mediaplanpro-com/pw68pq3i16?hl=en&form_factor=mobile  
**Status**: 📋 PLANNING PHASE

---

## Executive Summary

This document outlines a comprehensive plan to optimize MediaPlanPro's PageSpeed Insights scores across all four categories: Performance, Accessibility, Best Practices, and SEO.

**Target Goals**:
- **Performance**: Improve by 10+ points (target: 90+)
- **Accessibility**: Achieve 90+ (green)
- **Best Practices**: Achieve 90+ (green)
- **SEO**: Achieve 90+ (green)

---

## Phase 1: Current State Analysis

### Step 1: Run PageSpeed Insights Test

**Action**: Manually run PageSpeed Insights test on production URL

1. Visit: https://pagespeed.web.dev/
2. Enter URL: `https://mediaplanpro-9u2wbmdft-anustups-projects-438c3483.vercel.app`
3. Run test for both Mobile and Desktop
4. Document current scores:

**Current Scores** (to be filled in):
- Performance: ___/100
- Accessibility: ___/100
- Best Practices: ___/100
- SEO: ___/100

**Core Web Vitals** (to be filled in):
- Largest Contentful Paint (LCP): ___ seconds (target: < 2.5s)
- First Input Delay (FID): ___ ms (target: < 100ms)
- Cumulative Layout Shift (CLS): ___ (target: < 0.1)
- First Contentful Paint (FCP): ___ seconds (target: < 1.8s)
- Time to Interactive (TTI): ___ seconds (target: < 3.8s)
- Total Blocking Time (TBT): ___ ms (target: < 200ms)

---

## Phase 2: Performance Optimizations

### 2.1 Image Optimization

**Current Issues** (likely):
- Images not using modern formats (WebP, AVIF)
- Images not properly sized for viewport
- Missing lazy loading
- No responsive images

**Solutions**:

#### A. Use Next.js Image Component
Replace all `<img>` tags with Next.js `<Image>` component:

```typescript
// Before
<img src="/logo.png" alt="MediaPlanPro" />

// After
import Image from 'next/image';
<Image 
  src="/logo.png" 
  alt="MediaPlanPro" 
  width={200} 
  height={50}
  priority // for above-fold images
/>
```

#### B. Implement Lazy Loading
For below-fold images:

```typescript
<Image 
  src="/tool-screenshot.png" 
  alt="Tool Screenshot" 
  width={800} 
  height={600}
  loading="lazy" // lazy load below-fold images
/>
```

#### C. Convert Images to WebP
Use image optimization tools to convert PNG/JPG to WebP format.

**Files to Update**:
- `src/app/page.tsx` - Homepage images
- `src/app/tools/page.tsx` - Tool card images (if any)
- `src/components/tools/ToolLayout.tsx` - Tool page images
- All tool pages with screenshots

---

### 2.2 JavaScript Optimization

**Current Issues** (likely):
- Large JavaScript bundles
- Unused JavaScript code
- No code splitting
- Blocking JavaScript

**Solutions**:

#### A. Dynamic Imports for Heavy Components
```typescript
// Before
import { HeavyChart } from '@/components/charts/HeavyChart';

// After
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false // if component doesn't need SSR
});
```

#### B. Defer Non-Critical Scripts
Update `next.config.js`:

```javascript
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components'],
  },
};
```

#### C. Remove Unused Dependencies
Audit `package.json` and remove unused packages.

**Files to Update**:
- `src/app/tools/page.tsx` - Dynamic import for tool components
- `src/components/dashboard/*` - Dynamic imports for dashboard widgets
- `package.json` - Remove unused dependencies

---

### 2.3 CSS Optimization

**Current Issues** (likely):
- Unused CSS
- Large CSS bundles
- No critical CSS inlining

**Solutions**:

#### A. Use Tailwind CSS Purge
Ensure Tailwind is properly purging unused styles in `tailwind.config.ts`:

```typescript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of config
};
```

#### B. Minimize CSS
Ensure production builds minify CSS (Next.js does this by default).

**Files to Check**:
- `tailwind.config.ts` - Verify content paths
- `src/app/globals.css` - Remove unused global styles

---

### 2.4 Font Optimization

**Current Issues** (likely):
- Fonts loaded from external CDN
- No font preloading
- Flash of unstyled text (FOUT)

**Solutions**:

#### A. Use next/font
Update `src/app/layout.tsx`:

```typescript
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // prevents FOUT
  variable: '--font-inter',
});

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### B. Preload Critical Fonts
Add to `<head>` in layout:

```typescript
<link
  rel="preload"
  href="/fonts/custom-font.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

**Files to Update**:
- `src/app/layout.tsx` - Implement next/font
- `src/app/globals.css` - Update font-family references

---

### 2.5 Caching & CDN

**Current Issues** (likely):
- No browser caching headers
- Static assets not cached
- No CDN for static assets

**Solutions**:

#### A. Configure Vercel Caching
Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=1, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

#### B. Use Vercel Edge Network
Vercel automatically uses CDN for static assets. Ensure all static files are in `/public` directory.

**Files to Create/Update**:
- `vercel.json` - Add caching headers
- Move static assets to `/public` directory

---

### 2.6 Server-Side Rendering & Static Generation

**Current Issues** (likely):
- Pages using client-side rendering
- No static generation for static pages

**Solutions**:

#### A. Use Static Generation for Static Pages
Update tool pages to use `generateStaticParams`:

```typescript
// src/app/tools/[category]/[tool]/page.tsx
export async function generateStaticParams() {
  // Generate static pages for all tools at build time
  return tools.map((tool) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}
```

#### B. Use Server Components
Ensure components are server components by default (no 'use client' unless needed).

**Files to Update**:
- `src/app/tools/[category]/[tool]/page.tsx` - Add generateStaticParams
- Review all components - remove unnecessary 'use client' directives

---

## Phase 3: Accessibility Optimizations

### 3.1 Semantic HTML

**Issues to Fix**:
- Missing ARIA labels
- Improper heading hierarchy
- Missing alt text on images
- Form inputs without labels

**Solutions**:

#### A. Add ARIA Labels
```typescript
<button aria-label="Close menu" onClick={closeMenu}>
  <X className="h-6 w-6" />
</button>
```

#### B. Fix Heading Hierarchy
Ensure proper H1 → H2 → H3 order on all pages.

#### C. Add Alt Text to All Images
```typescript
<Image src="/tool.png" alt="Backlink Checker Tool Interface" />
```

**Files to Update**:
- `src/components/layout/header.tsx` - Add ARIA labels to buttons
- `src/app/tools/page.tsx` - Verify heading hierarchy
- All tool pages - Add alt text to images

---

### 3.2 Keyboard Navigation

**Issues to Fix**:
- Interactive elements not keyboard accessible
- No focus indicators
- Tab order incorrect

**Solutions**:

#### A. Add Focus Styles
Update `globals.css`:

```css
*:focus-visible {
  outline: 2px solid #2962ff;
  outline-offset: 2px;
}
```

#### B. Ensure Tab Order
Use `tabIndex` appropriately:

```typescript
<div tabIndex={0} role="button" onKeyDown={handleKeyDown}>
  Clickable Div
</div>
```

**Files to Update**:
- `src/app/globals.css` - Add focus styles
- `src/components/layout/header.tsx` - Verify tab order in navigation

---

### 3.3 Color Contrast

**Issues to Fix**:
- Text color contrast ratio < 4.5:1
- Button text not readable

**Solutions**:

#### A. Use WCAG AA Compliant Colors
Ensure all text has minimum 4.5:1 contrast ratio:

```typescript
// Bad: Light gray on white
<p className="text-gray-300">Text</p>

// Good: Dark gray on white
<p className="text-gray-700">Text</p>
```

#### B. Test with Contrast Checker
Use tools like WebAIM Contrast Checker to verify all color combinations.

**Files to Update**:
- Review all Tailwind color classes
- Update low-contrast text colors

---

## Phase 4: Best Practices Optimizations

### 4.1 HTTPS & Security

**Issues to Fix**:
- Mixed content (HTTP resources on HTTPS page)
- Missing security headers
- Vulnerable dependencies

**Solutions**:

#### A. Add Security Headers
Update `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

#### B. Update Dependencies
```bash
npm audit fix
npm update
```

**Files to Update**:
- `next.config.js` - Add security headers
- `package.json` - Update dependencies

---

### 4.2 Console Errors

**Issues to Fix**:
- JavaScript errors in console
- Failed network requests
- Deprecation warnings

**Solutions**:

#### A. Fix Console Errors
Review browser console and fix all errors.

#### B. Handle Failed Requests
Add proper error handling for API calls.

**Files to Review**:
- All API route handlers
- Client-side fetch calls

---

## Phase 5: SEO Optimizations

### 5.1 Meta Tags

**Issues to Fix**:
- Missing meta descriptions
- Missing Open Graph tags
- Missing Twitter Card tags
- Missing canonical URLs

**Solutions**:

#### A. Add Comprehensive Metadata
Update each page's metadata:

```typescript
// src/app/tools/page.tsx
export const metadata: Metadata = {
  title: '30 Free Marketing Tools | MediaPlanPro',
  description: 'Access 30 powerful free marketing tools including SEO analyzers, content generators, social media planners, and more. No signup required.',
  keywords: ['marketing tools', 'free seo tools', 'content marketing', 'social media tools'],
  authors: [{ name: 'MediaPlanPro' }],
  openGraph: {
    title: '30 Free Marketing Tools | MediaPlanPro',
    description: 'Access 30 powerful free marketing tools for SEO, content, social media, and analytics.',
    url: 'https://www.mediaplanpro.com/tools',
    siteName: 'MediaPlanPro',
    images: [
      {
        url: 'https://www.mediaplanpro.com/og-image-tools.png',
        width: 1200,
        height: 630,
        alt: 'MediaPlanPro Free Marketing Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '30 Free Marketing Tools | MediaPlanPro',
    description: 'Access 30 powerful free marketing tools for SEO, content, social media, and analytics.',
    images: ['https://www.mediaplanpro.com/twitter-image-tools.png'],
  },
  alternates: {
    canonical: 'https://www.mediaplanpro.com/tools',
  },
};
```

**Files to Update**:
- `src/app/page.tsx` - Add homepage metadata
- `src/app/tools/page.tsx` - Add tools page metadata
- All tool pages - Add specific metadata

---

### 5.2 Structured Data

**Issues to Fix**:
- Missing schema.org markup
- No breadcrumb schema
- No organization schema

**Solutions**:

#### A. Add JSON-LD Structured Data
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'MediaPlanPro Free Marketing Tools',
      description: '30 free marketing tools for SEO, content, and social media',
      url: 'https://www.mediaplanpro.com/tools',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }),
  }}
/>
```

**Files to Update**:
- `src/app/tools/page.tsx` - Add WebApplication schema
- `src/components/tools/ToolLayout.tsx` - Add SoftwareApplication schema

---

### 5.3 Sitemap & Robots.txt

**Issues to Fix**:
- Missing or outdated sitemap
- Missing robots.txt
- Pages not indexed

**Solutions**:

#### A. Generate Dynamic Sitemap
Create `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mediaplanpro.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Add all tool pages dynamically
    ...tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.category}/${tool.slug}-enhanced`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
```

#### B. Create Robots.txt
Create `src/app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://www.mediaplanpro.com/sitemap.xml',
  };
}
```

**Files to Create**:
- `src/app/sitemap.ts` - Dynamic sitemap
- `src/app/robots.ts` - Robots.txt

---

## Phase 6: Implementation Checklist

### Priority 1: High Impact (Do First)
- [ ] Implement next/font for font optimization
- [ ] Replace `<img>` with Next.js `<Image>` component
- [ ] Add lazy loading to below-fold images
- [ ] Add comprehensive metadata to all pages
- [ ] Create sitemap.ts and robots.ts
- [ ] Add security headers to next.config.js

### Priority 2: Medium Impact
- [ ] Implement dynamic imports for heavy components
- [ ] Add ARIA labels to interactive elements
- [ ] Fix color contrast issues
- [ ] Add JSON-LD structured data
- [ ] Configure caching headers in vercel.json
- [ ] Add focus styles for keyboard navigation

### Priority 3: Lower Impact (Nice to Have)
- [ ] Convert images to WebP format
- [ ] Implement code splitting
- [ ] Add generateStaticParams for tool pages
- [ ] Remove unused dependencies
- [ ] Add breadcrumb schema
- [ ] Optimize Tailwind CSS purging

---

## Phase 7: Testing & Verification

### Step 1: Local Testing
1. Run `npm run build` to test production build
2. Run `npm run start` to test production server locally
3. Use Chrome DevTools Lighthouse to test locally
4. Fix any issues found

### Step 2: Staging Testing
1. Deploy to Vercel preview URL
2. Run PageSpeed Insights on preview URL
3. Document scores
4. Compare with baseline scores

### Step 3: Production Deployment
1. Merge changes to main branch
2. Deploy to production
3. Run PageSpeed Insights on production URL
4. Document final scores

### Step 4: Create Before/After Report
Document improvements in `PAGESPEED_OPTIMIZATION_RESULTS.md`:

```markdown
## Before Optimization
- Performance: __/100
- Accessibility: __/100
- Best Practices: __/100
- SEO: __/100

## After Optimization
- Performance: __/100 (+__ points)
- Accessibility: __/100 (+__ points)
- Best Practices: __/100 (+__ points)
- SEO: __/100 (+__ points)

## Core Web Vitals Improvements
- LCP: __s → __s (improvement: __%)
- FID: __ms → __ms (improvement: __%)
- CLS: __ → __ (improvement: __%)
```

---

## Estimated Timeline

- **Phase 1 (Analysis)**: 1 hour
- **Phase 2 (Performance)**: 4-6 hours
- **Phase 3 (Accessibility)**: 2-3 hours
- **Phase 4 (Best Practices)**: 1-2 hours
- **Phase 5 (SEO)**: 2-3 hours
- **Phase 6 (Testing)**: 2-3 hours

**Total Estimated Time**: 12-18 hours

---

## Next Steps

1. **Run PageSpeed Insights test** and document current scores
2. **Prioritize optimizations** based on impact and effort
3. **Implement Priority 1 optimizations** first
4. **Test and deploy** incrementally
5. **Re-run PageSpeed Insights** after each major change
6. **Document results** in final report

---

**Report Created**: October 15, 2025  
**Author**: Augment Agent  
**Status**: 📋 Ready for Implementation

