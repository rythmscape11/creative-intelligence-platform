# Aureon One Logo Guide

## Source of Truth
All official branding assets are located in `/public/brand/`.
**Do not use** old files from `/aureon/` or other directories.

## 1. Logo Assets

| **Type** | **File** | **Usage Guidelines** |
|----------|----------|----------------------|
| **Horizontal (Dark)** | `aureon-one-logo-horizontal-dark.svg` | **Primary**. Use on dark backgrounds (navbar, footer). Gold icon, White "AUREON", Gold "ONE". |
| **Horizontal (Light)** | `aureon-one-logo-horizontal-light.svg` | Use on light backgrounds. Gold icon, Charcoal "AUREON", Dark Gold "ONE". |
| **Stacked (Dark)** | `aureon-one-logo-stacked-dark.svg` | Centered layouts, auth pages, splash screens. Dark background. |
| **Stacked (Light)** | `aureon-one-logo-stacked-light.svg` | Centered layouts, auth pages. Light background. |
| **Icon (Gold)** | `aureon-one-icon-gold.svg` | **Favicon, App Icon, Avatars**. No text. |

## 2. Implementation Rules

### Navbar / Header
- **Size**: Width ~180px, Height auto (or constrained to 40px).
- **Link**: Always wraps the logo in a `Link` to `/`.
- **Component**: Use `next/image` with `priority` for LCP optimization.

```jsx
<Link href="/">
  <div className="relative h-10 w-[180px]">
    <Image 
      src="/brand/aureon-one-logo-horizontal-dark.svg"
      alt="Aureon One"
      fill
      className="object-contain object-left"
    />
  </div>
</Link>
```

### Footer
- **Size**: Smaller, e.g., Height 32px.
- **Variant**: `aureon-one-icon-gold.svg` (Icon only) OR Horizontal depending on space.

### Auth Pages
- **Variant**: **Stacked Logo**.
- **Placement**: Centered above the login box.
- **Theme**: Support both light/dark modes using standard Tailwind classes (`block dark:hidden`, `hidden dark:block`).

### Dynamic Icons
- **Favicon/App Icon**: Handled by `src/app/icon.tsx`. Auto-generates high-res PNGs from the Gold Icon SVG.
- **Social/OG**: Handled by `src/app/opengraph-image.tsx`. Generates 1200x630 share card.

## 3. Typography & Color
- **Headlines**: Space Grotesk
- **Aureon Gold**: `#F1C40F` (Gradient allowed)
- **Mars Red**: `#B3001B` (Primary Buttons)
- **Midnight Charcoal**: `#0A0A0A` (Backgrounds)

## 4. Do's and Don'ts
- ✅ **DO** use SVGs for all UI logos.
- ✅ **DO** use the Stacked logo for centered layouts.
- ❌ **DON'T** stretch or distort the logo aspect ratio.
- ❌ **DON'T** use the old "MediaPlanPro" logo anywhere.
