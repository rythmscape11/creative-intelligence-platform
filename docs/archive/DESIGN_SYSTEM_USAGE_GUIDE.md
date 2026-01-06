# 🎨 DESIGN SYSTEM USAGE GUIDE
**MediaPlanPro - How to Use the New Artistic Design**

---

## 📚 TABLE OF CONTENTS

1. [Getting Started](#getting-started)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Buttons](#buttons)
5. [Cards](#cards)
6. [Glassmorphism](#glassmorphism)
7. [Animations](#animations)
8. [Illustrations](#illustrations)
9. [Best Practices](#best-practices)

---

## 🚀 GETTING STARTED

### **Import the Design System**

```tsx
import '@/styles/design-system.css';
```

This is already imported in `src/app/layout.tsx`, so it's available globally.

### **Using CSS Variables**

```tsx
<div style={{ 
  background: 'var(--color-primary-blue)',
  padding: 'var(--space-6)',
  borderRadius: 'var(--radius-xl)'
}}>
  Content
</div>
```

---

## 🎨 COLOR PALETTE

### **Primary Pastels**

```tsx
// Soft Blue
<div style={{ background: 'var(--color-primary-blue)' }}>Soft Blue</div>
<div style={{ background: 'var(--color-primary-blue-light)' }}>Light Blue</div>

// Lavender
<div style={{ background: 'var(--color-lavender)' }}>Lavender</div>
<div style={{ background: 'var(--color-lavender-light)' }}>Light Lavender</div>

// Mint
<div style={{ background: 'var(--color-mint)' }}>Mint</div>
<div style={{ background: 'var(--color-mint-light)' }}>Light Mint</div>
```

### **Secondary Pastels**

```tsx
// Peach
<div style={{ background: 'var(--color-secondary-peach)' }}>Peach</div>

// Pink
<div style={{ background: 'var(--color-pink)' }}>Soft Pink</div>

// Cream
<div style={{ background: 'var(--color-cream)' }}>Cream</div>
```

### **Accent Colors**

```tsx
// Coral
<div style={{ background: 'var(--color-accent-coral)' }}>Coral</div>

// Sage Green
<div style={{ background: 'var(--color-accent-sage)' }}>Sage</div>

// Soft Purple
<div style={{ background: 'var(--color-accent-purple)' }}>Purple</div>
```

### **Gradients**

```tsx
// Primary Gradient (Blue → Lavender)
<div className="bg-gradient-primary">Primary Gradient</div>

// Secondary Gradient (Peach → Pink)
<div className="bg-gradient-secondary">Secondary Gradient</div>

// Accent Gradient (Coral → Purple)
<div className="bg-gradient-accent">Accent Gradient</div>

// Mesh Gradient (Multi-color radial)
<div className="bg-gradient-mesh">Mesh Gradient</div>
```

### **Text Gradients**

```tsx
<h1 className="text-gradient">Animated Gradient Text</h1>

// Custom gradient
<h1 style={{
  background: 'linear-gradient(135deg, var(--color-accent-coral) 0%, var(--color-accent-purple) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}}>
  Custom Gradient
</h1>
```

---

## ✍️ TYPOGRAPHY

### **Font Sizes**

```tsx
<p style={{ fontSize: 'var(--font-size-xs)' }}>Extra Small (12px)</p>
<p style={{ fontSize: 'var(--font-size-sm)' }}>Small (14px)</p>
<p style={{ fontSize: 'var(--font-size-base)' }}>Base (16px)</p>
<p style={{ fontSize: 'var(--font-size-lg)' }}>Large (18px)</p>
<p style={{ fontSize: 'var(--font-size-xl)' }}>XL (20px)</p>
<p style={{ fontSize: 'var(--font-size-2xl)' }}>2XL (24px)</p>
<p style={{ fontSize: 'var(--font-size-3xl)' }}>3XL (30px)</p>
<p style={{ fontSize: 'var(--font-size-4xl)' }}>4XL (36px)</p>
<p style={{ fontSize: 'var(--font-size-5xl)' }}>5XL (48px)</p>
<p style={{ fontSize: 'var(--font-size-6xl)' }}>6XL (60px)</p>
```

### **Font Weights**

```tsx
<p style={{ fontWeight: 'var(--font-weight-normal)' }}>Normal (400)</p>
<p style={{ fontWeight: 'var(--font-weight-medium)' }}>Medium (500)</p>
<p style={{ fontWeight: 'var(--font-weight-semibold)' }}>Semibold (600)</p>
<p style={{ fontWeight: 'var(--font-weight-bold)' }}>Bold (700)</p>
```

### **Headlines**

```tsx
<h1 style={{ fontFamily: 'var(--font-family-display)' }}>
  Display Headline
</h1>

<h1 className="text-balance">
  Balanced Headline Text
</h1>
```

---

## 🔘 BUTTONS

### **Primary Button**

```tsx
<button className="btn btn-primary">
  Primary Button
</button>
```

### **Secondary Button**

```tsx
<button className="btn btn-secondary">
  Secondary Button
</button>
```

### **With Icon**

```tsx
<button className="btn btn-primary group">
  Get Started
  <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
</button>
```

### **Custom Sizes**

```tsx
// Small
<button className="btn btn-primary text-sm px-5 py-2">
  Small Button
</button>

// Large
<button className="btn btn-primary text-lg px-8 py-4">
  Large Button
</button>
```

---

## 🃏 CARDS

### **Basic Card**

```tsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### **Pastel Cards**

```tsx
// Blue
<div className="card card-pastel-blue">
  Blue Pastel Card
</div>

// Lavender
<div className="card card-pastel-lavender">
  Lavender Pastel Card
</div>

// Mint
<div className="card card-pastel-mint">
  Mint Pastel Card
</div>

// Peach
<div className="card card-pastel-peach">
  Peach Pastel Card
</div>
```

### **Glass Card**

```tsx
<div className="glass-card">
  <h3>Glassmorphism Card</h3>
  <p>With backdrop blur effect</p>
</div>
```

---

## 🔮 GLASSMORPHISM

### **Glass Effect**

```tsx
<div className="glass">
  Glassmorphism Element
</div>
```

### **Custom Glass**

```tsx
<div style={{
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 'var(--radius-xl)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-xl)'
}}>
  Custom Glass Element
</div>
```

### **Glass Badge**

```tsx
<span style={{
  background: 'rgba(168, 216, 234, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(168, 216, 234, 0.3)',
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--font-size-sm)'
}}>
  ✨ Badge Text
</span>
```

---

## 🎬 ANIMATIONS

### **Float Animation**

```tsx
<div className="animate-float">
  Floating Element
</div>

// Custom duration
<div 
  className="animate-float"
  style={{ animationDuration: '8s' }}
>
  Slow Float
</div>
```

### **Fade In Up**

```tsx
<div className="animate-fade-in-up">
  Fades in from bottom
</div>
```

### **Scale In**

```tsx
<div className="animate-scale-in">
  Scales in from center
</div>
```

### **Staggered Animations**

```tsx
<div className="animate-fade-in-up stagger-1">First</div>
<div className="animate-fade-in-up stagger-2">Second</div>
<div className="animate-fade-in-up stagger-3">Third</div>
<div className="animate-fade-in-up stagger-4">Fourth</div>
<div className="animate-fade-in-up stagger-5">Fifth</div>
```

### **Floating Blobs**

```tsx
<div 
  className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30 animate-float"
  style={{
    background: 'radial-gradient(circle, var(--color-primary-blue-light) 0%, transparent 70%)',
    animationDuration: '8s'
  }}
/>
```

---

## 🎨 ILLUSTRATIONS

### **Hero Illustration**

```tsx
import { HeroIllustration } from '@/components/illustrations/HeroIllustration';

<div className="relative">
  <HeroIllustration />
</div>
```

### **Empty State**

```tsx
import { EmptyStateIllustration } from '@/components/illustrations/EmptyStateIllustration';

<div className="text-center py-12">
  <div className="max-w-md mx-auto">
    <EmptyStateIllustration />
  </div>
  <h3>No strategies yet</h3>
  <p>Create your first strategy to get started</p>
</div>
```

### **Team Collaboration**

```tsx
import { TeamCollaborationIllustration } from '@/components/illustrations/TeamCollaborationIllustration';

<div className="max-w-2xl mx-auto">
  <TeamCollaborationIllustration />
</div>
```

---

## 💡 BEST PRACTICES

### **1. Color Usage**

✅ **DO**:
- Use pastel colors for backgrounds
- Use accent colors for CTAs
- Use gradients for headlines
- Maintain consistent color themes

❌ **DON'T**:
- Mix too many colors in one section
- Use bright, saturated colors
- Ignore color accessibility

### **2. Spacing**

✅ **DO**:
```tsx
<div style={{ 
  padding: 'var(--space-6)',
  marginBottom: 'var(--space-8)'
}}>
  Content
</div>
```

❌ **DON'T**:
```tsx
<div style={{ padding: '23px', marginBottom: '37px' }}>
  Content
</div>
```

### **3. Shadows**

✅ **DO**:
```tsx
<div style={{ boxShadow: 'var(--shadow-xl)' }}>
  Card with proper shadow
</div>
```

❌ **DON'T**:
```tsx
<div style={{ boxShadow: '0 0 10px black' }}>
  Card with harsh shadow
</div>
```

### **4. Border Radius**

✅ **DO**:
```tsx
<div style={{ borderRadius: 'var(--radius-xl)' }}>
  Rounded card
</div>
```

❌ **DON'T**:
```tsx
<div style={{ borderRadius: '15px' }}>
  Inconsistent radius
</div>
```

### **5. Animations**

✅ **DO**:
- Use subtle, smooth animations
- Respect `prefers-reduced-motion`
- Keep animations under 1s (except infinite)
- Use cubic-bezier for natural motion

❌ **DON'T**:
- Overuse animations
- Make animations too fast/slow
- Ignore accessibility
- Use jarring transitions

### **6. Glassmorphism**

✅ **DO**:
- Use on overlays and modals
- Combine with subtle borders
- Use appropriate blur (10-20px)
- Layer with shadows

❌ **DON'T**:
- Overuse on every element
- Use without backdrop
- Make too transparent
- Ignore browser support

---

## 📋 QUICK REFERENCE

### **Common Patterns**

**Section with Gradient Background**:
```tsx
<section className="py-20 px-4 bg-gradient-mesh">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

**Glassmorphism Header**:
```tsx
<header 
  className="sticky top-0 z-50"
  style={{
    background: 'rgba(250, 250, 250, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(168, 216, 234, 0.2)'
  }}
>
  {/* Navigation */}
</header>
```

**Animated Card Grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="card card-pastel-blue animate-fade-in-up stagger-1">Card 1</div>
  <div className="card card-pastel-lavender animate-fade-in-up stagger-2">Card 2</div>
  <div className="card card-pastel-mint animate-fade-in-up stagger-3">Card 3</div>
</div>
```

**Gradient Headline**:
```tsx
<h1 style={{ fontFamily: 'var(--font-family-display)' }}>
  <span className="text-gradient">Gradient</span>
  {' '}
  <span style={{ color: 'var(--color-neutral-charcoal)' }}>Headline</span>
</h1>
```

---

## 🎯 EXAMPLES

### **Feature Card**

```tsx
<div className="card card-pastel-blue animate-fade-in-up">
  <div 
    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
    style={{ background: 'var(--gradient-primary)' }}
  >
    <Icon className="h-6 w-6 text-white" />
  </div>
  <h3 style={{ 
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-bold)',
    marginBottom: 'var(--space-2)'
  }}>
    Feature Title
  </h3>
  <p style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
    Feature description goes here
  </p>
</div>
```

### **CTA Section**

```tsx
<section className="py-20 px-4 bg-gradient-primary">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-4xl font-bold mb-6" style={{ color: 'white' }}>
      Ready to Get Started?
    </h2>
    <p className="text-xl mb-8" style={{ color: 'white', opacity: 0.9 }}>
      Create your first strategy in minutes
    </p>
    <button className="btn btn-secondary text-lg px-8 py-4">
      Start Free Trial
    </button>
  </div>
</section>
```

---

## ✅ CHECKLIST

When creating new components:

- [ ] Use CSS variables for colors
- [ ] Use design system spacing
- [ ] Use consistent border radius
- [ ] Use layered shadows
- [ ] Add smooth transitions
- [ ] Consider animations
- [ ] Test with reduced motion
- [ ] Check color contrast
- [ ] Use pastel palette
- [ ] Add hover states

---

**Happy Designing! 🎨**

