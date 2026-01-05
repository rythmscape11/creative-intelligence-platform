# Aureon One Marketing Pages Overview

## Routes Implemented

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/product` | Product suite overview | MarketingHero, FeatureCards (5 modules), SplitSection, CtaBand |
| `/product/agency-os` | Agency OS module page | MarketingHero, FeatureCards (4 capabilities), SplitSection, Roles grid, CtaBand |
| `/product/optimiser` | Optimiser module page | MarketingHero, Channel icons, FeatureCards, Before/After grid, CtaBand |
| `/product/analyser` | Analyser module page | MarketingHero, Data sources list, FeatureCards, SplitSection (GEO bridge), CtaBand |
| `/product/geo-engine` | GEO Engine module page | MarketingHero, What is GEO section, FeatureCards, Sample report UI, Why GEO matters, CtaBand |
| `/product/strategiser` | Strategiser module page | MarketingHero, Inputs/Outputs, FeatureCards (templates), SplitSection, CtaBand |
| `/solutions` | Solutions by customer type | MarketingHero, FeatureCards (3 types), Use cases grid, CtaBand |
| `/pricing` | Pricing plans | MarketingHero, 3 plan cards, FAQ section, CtaBand |
| `/about` | About Aureon One | MarketingHero, Story, Values, Milestones timeline, CtaBand |
| `/resources` | Resource hub | MarketingHero, Resource cards (Docs, Blog, Changelog, GEO Playbook) |

---

## Reusable Components

All marketing components are in `/src/components/marketing/`:

### `MarketingHero`
Full-width hero section with eyebrow text, H1, subtitle, and CTAs.

**Props:**
- `eyebrow?: string` - Small uppercase text above title
- `title: string` - Main H1 heading
- `subtitle: string` - Supporting paragraph
- `primaryCta: { text, href }` - Primary button
- `secondaryCta?: { text, href }` - Optional secondary button
- `centered?: boolean` - Center-align content (default: true)

---

### `FeatureCards`
Responsive grid of feature cards with icons.

**Props:**
- `title?: string` - Section title
- `subtitle?: string` - Section subtitle
- `cards: FeatureCard[]` - Array of cards with icon, title, description, href, linkText
- `columns?: 2 | 3 | 4 | 5` - Number of columns (default: 3)

---

### `SplitSection`
Two-column layout with text and visual.

**Props:**
- `title: string` - Section heading
- `subtitle?: string` - Supporting text
- `bullets?: string[]` - List of bullet points
- `children?: ReactNode` - Custom content
- `imageSrc?: string` - Image path
- `visual?: ReactNode` - Custom visual component
- `reversed?: boolean` - Swap column order

---

### `CtaBand`
Full-width CTA section with orbit watermark.

**Props:**
- `title: string` - Main CTA heading
- `subtitle?: string` - Supporting text
- `primaryCta: { text, href }` - Primary button
- `secondaryCta?: { text, href }` - Optional secondary button
- `showOrbit?: boolean` - Show orbit watermark (default: true)

---

## How to Edit Copy

1. **Page copy** is defined directly in each page file.
2. **Plan data** (for pricing) is in `/src/app/pricing/page.tsx`.
3. **Module cards** are defined as arrays in each page.

### Example: Updating a module description
```tsx
// In /src/app/product/page.tsx
const moduleCards = [
  {
    icon: Briefcase,
    title: 'Agency OS',
    description: 'Your new description here.', // Edit this
    href: '/product/agency-os',
  },
  // ...
];
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0A0A` | Page background |
| Aureon Gold | `#F1C40F` | Accents, icons, highlights |
| Mars Red | `#B3001B` | Primary CTAs |
| Signal Red | `#A81B24` | Hover states |
| White | `#FFFFFF` | Primary text |
| Gray | `#9CA3AF` | Secondary text |

---

## Responsiveness

All pages are fully responsive:
- Hero text scales: `text-4xl md:text-5xl lg:text-6xl`
- Grids stack on mobile: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- CTAs become full-width on small screens
- Minimum tap target: 44px height

---

## Adding New Pages

1. Create a new file in `/src/app/[route]/page.tsx`
2. Import components from `@/components/marketing`
3. Add metadata for SEO
4. Follow the existing page structure:
   - MarketingHero at top
   - 2-4 content sections
   - CtaBand at bottom
