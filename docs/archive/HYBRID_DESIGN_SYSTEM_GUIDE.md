# MediaPlanPro Hybrid Design System Guide
**Version:** 1.0  
**Date:** October 16, 2025  
**Status:** ✅ Active

---

## 🎨 Design System Overview

MediaPlanPro uses a **hybrid design approach** with two distinct themes:

1. **Dark Theme (Formless.xyz)** - Marketing, app, dashboard, admin pages
2. **Light Theme (BBC/Premium Journal)** - Blog and content pages

This approach provides:
- Modern, sleek dark UI for the application
- Professional, readable light theme for long-form content
- Best user experience for each context

---

## 🌓 Theme Breakdown

### Dark Theme (Default - Formless.xyz)

**Used For:**
- Landing page (`/`)
- Authentication pages (`/auth/*`)
- Dashboard (`/dashboard`)
- Admin panel (`/admin/*`)
- Strategy builder (`/strategy/*`)
- Growth suite (`/growth-suite/*`)
- Demo pages (`/demo`)

**Colors:**
```css
Background:     #0A0A0A (near black)
Text Primary:   #FFFFFF (white)
Text Secondary: #A0A0A0 (light gray)
Accent:         #3B82F6 (blue)
Borders:        #2A2A2A (dark gray)
Cards:          #1A1A1A (dark gray)
```

**Typography:**
```css
Font Family:    System sans-serif (-apple-system, BlinkMacSystemFont, etc.)
Body Size:      16px (1rem)
Line Height:    1.75 (relaxed)
Headings:       Tight line-height (1.1)
```

**Components:**
- Use `<Button>` from `@/components/ui/button`
- Use `<Card>` from `@/components/ui/card`
- Use `.glass-card` for glassmorphism effects
- Use Tailwind dark theme classes

---

### Light Theme (Blog Only - BBC/Premium Journal)

**Used For:**
- Blog listing (`/blog`)
- Blog posts (`/blog/[slug]`)
- Blog categories (`/blog/category/[slug]`)

**Colors:**
```css
Background:     #FAFAFA (off-white)
Text Primary:   #1a1a1a (dark gray)
Text Secondary: #374151 (medium gray)
Accent:         #F59E0B (yellow/amber)
Borders:        #E5E7EB (light gray)
Cards:          #FFFFFF (white)
```

**Typography:**
```css
Font Family:    Georgia, 'Times New Roman', serif (body)
                System sans-serif (headings)
Body Size:      18px (1.125rem)
Line Height:    1.8
Content Width:  680px max
```

**Components:**
- Wrap entire blog page in `.blog-page` class
- Use `.article-content` for article body
- Custom blog-specific components

---

## 📁 File Structure

### CSS Files

**src/styles/design-system.css**
- Dark theme CSS variables
- Formless.xyz design tokens
- Component utilities (glass-card, gradients, etc.)
- Animation utilities
- **Use for:** App pages, dashboard, admin

**src/app/globals.css**
- Base Tailwind imports
- Global accessibility styles
- Blog-specific styles (lines 596-870)
- Light theme overrides for blog
- **Use for:** Global styles + blog pages

**tailwind.config.js**
- Dark theme color configuration
- Typography scale
- Spacing system
- Shadows and effects
- **Use for:** Tailwind utility classes

---

## 🛠️ Implementation Guide

### For Dark Theme Pages (App/Marketing)

```tsx
// Example: Dashboard page
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="container mx-auto py-12">
        <h1 className="text-5xl font-bold mb-8">Dashboard</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Your content here</p>
            <Button variant="default" className="mt-4">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Key Classes:**
- `bg-bg-primary` - Dark background
- `text-text-primary` - White text
- `text-text-secondary` - Gray text
- `border-border-primary` - Dark borders
- `glass-card` - Glassmorphism effect

---

### For Light Theme Pages (Blog)

```tsx
// Example: Blog post page
export default function BlogPostPage({ post }) {
  return (
    <div className="blog-page">
      <div className="container mx-auto py-12">
        <article className="article-content">
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
}
```

**Key Classes:**
- `.blog-page` - Light theme wrapper (REQUIRED)
- `.article-content` - Article typography
- `.article-h1`, `.article-h2`, etc. - Heading styles
- `.pull-quote` - Pull quote styling

---

## 🎯 Component Usage

### Buttons

**Dark Theme (App):**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="destructive">Delete</Button>
```

**Light Theme (Blog):**
```tsx
// Use standard HTML with Tailwind classes
<button className="btn-primary">Read More</button>
<a href="/blog" className="text-primary hover:text-primary/90">
  View All Posts
</a>
```

---

### Cards

**Dark Theme (App):**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>

// Or use glass-card for glassmorphism
<div className="glass-card p-6">
  <h3>Glass Card</h3>
  <p>Content with blur effect</p>
</div>
```

**Light Theme (Blog):**
```tsx
// Use standard HTML with light theme classes
<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
  <h3 className="text-xl font-semibold mb-2">Blog Card</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

---

## 🚨 Common Pitfalls & Solutions

### ❌ Problem: Using dark theme components on blog pages

```tsx
// WRONG - Don't use dark theme Card on blog
<div className="blog-page">
  <Card> {/* This will look wrong! */}
    <CardContent>Blog content</CardContent>
  </Card>
</div>
```

**✅ Solution:**
```tsx
// CORRECT - Use light theme HTML on blog
<div className="blog-page">
  <div className="bg-white rounded-lg border p-6">
    Blog content
  </div>
</div>
```

---

### ❌ Problem: Forgetting .blog-page wrapper

```tsx
// WRONG - Blog content without wrapper
<article className="article-content">
  {/* Will have dark background! */}
</article>
```

**✅ Solution:**
```tsx
// CORRECT - Always wrap blog pages
<div className="blog-page">
  <article className="article-content">
    {/* Now has light background */}
  </article>
</div>
```

---

### ❌ Problem: Using undefined CSS variables

```tsx
// WRONG - These variables don't exist
<div style={{ color: 'var(--color-neutral-charcoal)' }}>
  {/* This was causing broken styles */}
</div>
```

**✅ Solution:**
```tsx
// CORRECT - Use Tailwind classes or defined variables
<div className="text-text-primary">
  {/* Or use inline: */}
  <div style={{ color: '#1A1A1A' }}>
</div>
```

---

## 📋 Design Token Reference

### Dark Theme Tokens

```css
/* Backgrounds */
--color-bg-primary:   #0A0A0A
--color-bg-secondary: #111111
--color-bg-tertiary:  #1A1A1A
--color-bg-elevated:  #222222
--color-bg-hover:     #2A2A2A

/* Text */
--color-text-primary:   #FFFFFF
--color-text-secondary: #A0A0A0
--color-text-tertiary:  #707070
--color-text-muted:     #4A4A4A

/* Borders */
--color-border-primary: #2A2A2A
--color-border-hover:   #333333
--color-border-focus:   #404040

/* Accents */
--color-accent-primary:   #FFFFFF
--color-accent-secondary: #3B82F6
```

### Light Theme (Blog) Tokens

```css
/* Backgrounds */
background: #FAFAFA
card: #FFFFFF

/* Text */
foreground: #1a1a1a
text-secondary: #374151
text-tertiary: #6b7280

/* Accents */
primary: #F59E0B (yellow/amber)
primary-dark: #D97706

/* Borders */
border: #E5E7EB
```

---

## ✅ Checklist for New Pages

### Adding a Dark Theme Page:
- [ ] Use `bg-bg-primary` for background
- [ ] Use `text-text-primary` for main text
- [ ] Import and use `<Button>` from `@/components/ui/button`
- [ ] Import and use `<Card>` from `@/components/ui/card`
- [ ] Use Tailwind dark theme classes
- [ ] Test in dark mode

### Adding a Blog Page:
- [ ] Wrap entire page in `.blog-page` class
- [ ] Use `.article-content` for article body
- [ ] Use serif fonts for body text
- [ ] Use sans-serif for headings
- [ ] Set max-width to 680px for content
- [ ] Use light theme colors (#FAFAFA background)
- [ ] Test readability

---

## 🔄 Migration Notes

If you find old code using broken patterns:

**Replace:**
- `var(--color-neutral-charcoal)` → `#1A1A1A` or `text-text-primary`
- `var(--gradient-primary)` → Use defined gradients or Tailwind
- `.btn .btn-primary` → `<Button variant="default">`
- Inline `style={}` props → Tailwind classes

---

## 📞 Support

For questions or issues:
1. Check this guide first
2. Review `COMPREHENSIVE_DESIGN_AUDIT_2025.md`
3. Review `DESIGN_FIX_IMPLEMENTATION_PLAN.md`
4. Check component source code in `src/components/ui/`

---

**Last Updated:** October 16, 2025  
**Maintained By:** Development Team  
**Version:** 1.0

