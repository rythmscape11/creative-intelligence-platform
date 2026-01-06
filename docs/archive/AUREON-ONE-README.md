# Aureon One - Brand & Development Guide

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Aureon Gold** | `#F1C40F` | Accents, logo, secondary CTAs |
| **Mars Red** | `#B3001B` | Primary CTA buttons |
| **Signal Red** | `#A81B24` | Secondary accents |
| **Midnight Charcoal** | `#0A0A0A` | Background |
| **Pure White** | `#FFFFFF` | Text, cards |

## Components Created

All homepage components are in `/src/components/aureon/`:

| Component | Description |
|-----------|-------------|
| `Hero.tsx` | Two-column hero with orbit visual |
| `ProductSuite.tsx` | 5 product module cards |
| `HowItWorks.tsx` | 3-step flow (Connect → Illuminate → Act) |
| `GeoHighlight.tsx` | GEO Engine feature showcase |
| `AudienceStrip.tsx` | 3 audience columns |
| `PricingPreview.tsx` | 3 pricing plan cards |
| `FinalCtaBand.tsx` | Bottom CTA strip |

## Logo Assets

Stored in `/public/aureon/`:

- `logo-icon.svg` - Orbit icon only
- `logo-full.svg` - Orbit + wordmark

## Typography

- **Headlines**: Space Grotesk (bold/extrabold)
- **Body**: Inter (system fallback)
- **Mono**: JetBrains Mono

## Editing Sections

Each homepage section is a separate component. To edit:

1. Open the component in `/src/components/aureon/`
2. Modify copy, styling, or structure
3. Components use Tailwind classes with Aureon colors

## Theme Configuration

See `/src/lib/theme.ts` for:
- Color constants
- Typography tokens
- Spacing scale
- Shadow definitions

## Navigation Structure

**Header** (`/src/components/layout/header.tsx`):
- Product → `/products`
- Solutions → `/services`
- GEO → `/analyser/geo`
- Pricing → `/pricing`
- Resources → `/resources`
- About → `/about`

**Footer** (`/src/components/layout/footer.tsx`):
- Product: Agency OS, Optimiser, Analyser, GEO Engine, Strategiser
- Company: About, Careers, Contact
- Resources: Docs, Blog, Changelog
- Legal: Terms, Privacy
