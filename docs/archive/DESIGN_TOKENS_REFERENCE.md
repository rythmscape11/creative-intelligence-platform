# 🎨 Design Tokens Reference

**MediaPlanPro Design System**  
**Formless.xyz Inspired - Minimalist, Modern, Clean**

---

## 📋 **Table of Contents**

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Shadows](#shadows)
5. [Border Radius](#border-radius)
6. [Transitions](#transitions)
7. [Usage Examples](#usage-examples)

---

## 🎨 **Color Palette**

### **Neutral Colors** (Minimalism)

| Token | Value | Usage |
|-------|-------|-------|
| `neutral-0` | `#FFFFFF` | Pure white backgrounds |
| `neutral-50` | `#FAFAFA` | Off-white backgrounds |
| `neutral-100` | `#F5F5F5` | Light backgrounds |
| `neutral-200` | `#E5E5E5` | Borders, dividers |
| `neutral-300` | `#D4D4D4` | Input borders |
| `neutral-400` | `#A3A3A3` | Placeholder text |
| `neutral-500` | `#737373` | Secondary text |
| `neutral-600` | `#525252` | Body text |
| `neutral-700` | `#404040` | Headings |
| `neutral-800` | `#262626` | Dark backgrounds |
| `neutral-900` | `#171717` | Footer, dark sections |

### **Primary Colors** (Brand - Yellow/Amber)

| Token | Value | Usage |
|-------|-------|-------|
| `primary-50` | `#FFFBEB` | Light backgrounds |
| `primary-100` | `#FEF3C7` | Hover backgrounds |
| `primary-200` | `#FDE68A` | Light accents |
| `primary-300` | `#FCD34D` | Borders |
| `primary-400` | `#FBBF24` | Hover states |
| `primary-500` | `#F59E0B` | **Base brand color** |
| `primary-600` | `#D97706` | Active states |
| `primary-700` | `#B45309` | Dark accents |
| `primary-800` | `#92400E` | Very dark |
| `primary-900` | `#78350F` | Darkest |

### **Semantic Colors**

#### **Success** (Green)
- `success-light`: `#D1FAE5` - Light backgrounds
- `success`: `#10B981` - Success messages, checkmarks
- `success-dark`: `#059669` - Dark success states

#### **Warning** (Orange)
- `warning-light`: `#FEF3C7` - Light backgrounds
- `warning`: `#F59E0B` - Warning messages
- `warning-dark`: `#D97706` - Dark warning states

#### **Error** (Red)
- `error-light`: `#FEE2E2` - Light backgrounds
- `error`: `#EF4444` - Error messages, validation
- `error-dark`: `#DC2626` - Dark error states

#### **Info** (Blue)
- `info-light`: `#DBEAFE` - Light backgrounds
- `info`: `#3B82F6` - Info messages
- `info-dark`: `#2563EB` - Dark info states

### **Accent Colors**

#### **Purple**
- `accent-purple-light`: `#F3E8FF`
- `accent-purple`: `#A855F7`
- `accent-purple-dark`: `#7E22CE`

#### **Blue**
- `accent-blue-light`: `#DBEAFE`
- `accent-blue`: `#3B82F6`
- `accent-blue-dark`: `#1D4ED8`

#### **Teal**
- `accent-teal-light`: `#CCFBF1`
- `accent-teal`: `#14B8A6`
- `accent-teal-dark`: `#0F766E`

---

## ✍️ **Typography**

### **Font Families**

```css
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-display: 'Inter', sans-serif;
--font-family-mono: 'Fira Code', 'Courier New', monospace;
```

### **Font Sizes**

| Token | Value | Usage |
|-------|-------|-------|
| `text-xs` | `12px` | Small labels, captions |
| `text-sm` | `14px` | Secondary text, labels |
| `text-base` | `16px` | **Body text** |
| `text-lg` | `18px` | Large body text |
| `text-xl` | `20px` | Small headings |
| `text-2xl` | `24px` | H4 headings |
| `text-3xl` | `30px` | H3 headings |
| `text-4xl` | `36px` | H2 headings |
| `text-5xl` | `48px` | H1 headings |
| `text-6xl` | `60px` | Hero headings |
| `text-7xl` | `72px` | Large hero headings |

### **Font Weights**

| Token | Value | Usage |
|-------|-------|-------|
| `font-light` | `300` | Light text |
| `font-normal` | `400` | Body text |
| `font-medium` | `500` | Labels, emphasis |
| `font-semibold` | `600` | Subheadings |
| `font-bold` | `700` | Headings |
| `font-extrabold` | `800` | Hero text |

### **Line Heights**

| Token | Value | Usage |
|-------|-------|-------|
| `leading-none` | `1` | Tight headings |
| `leading-tight` | `1.25` | Headings |
| `leading-snug` | `1.375` | Subheadings |
| `leading-normal` | `1.5` | Body text |
| `leading-relaxed` | `1.625` | Comfortable reading |
| `leading-loose` | `2` | Spacious text |

### **Letter Spacing**

| Token | Value | Usage |
|-------|-------|-------|
| `tracking-tighter` | `-0.05em` | Tight headings |
| `tracking-tight` | `-0.025em` | Headings |
| `tracking-normal` | `0` | Body text |
| `tracking-wide` | `0.025em` | Buttons, labels |
| `tracking-wider` | `0.05em` | Uppercase text |
| `tracking-widest` | `0.1em` | Very wide spacing |

---

## 📏 **Spacing**

**8px Base Grid System**

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-0` | `0px` | No spacing |
| `spacing-0.5` | `2px` | Tiny gaps |
| `spacing-1` | `4px` | Very small |
| `spacing-1.5` | `6px` | Small gaps |
| `spacing-2` | `8px` | **Base unit** |
| `spacing-2.5` | `10px` | Small spacing |
| `spacing-3` | `12px` | Small padding |
| `spacing-4` | `16px` | Medium padding |
| `spacing-5` | `20px` | Medium spacing |
| `spacing-6` | `24px` | Large padding |
| `spacing-8` | `32px` | Large spacing |
| `spacing-10` | `40px` | Extra large |
| `spacing-12` | `48px` | Section spacing |
| `spacing-16` | `64px` | Large sections |
| `spacing-20` | `80px` | Very large |
| `spacing-24` | `96px` | Hero spacing |
| `spacing-32` | `128px` | Massive spacing |

---

## 🌑 **Shadows**

**Subtle, Formless.xyz Style**

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.03)` | Very subtle |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.05)` | Cards, inputs |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.05)` | Hover states |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.06)` | Modals |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.08)` | Dropdowns |
| `shadow-2xl` | `0 25px 50px rgba(0,0,0,0.1)` | Large modals |

**Colored Shadows** (for emphasis)

| Token | Usage |
|-------|-------|
| `shadow-primary` | Primary buttons |
| `shadow-success` | Success states |
| `shadow-error` | Error states |

---

## 🔲 **Border Radius**

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | `0px` | No rounding |
| `rounded-sm` | `2px` | Subtle rounding |
| `rounded` | `4px` | Default |
| `rounded-md` | `6px` | Medium |
| `rounded-lg` | `8px` | **Cards, buttons** |
| `rounded-xl` | `12px` | Large cards |
| `rounded-2xl` | `16px` | Hero sections |
| `rounded-3xl` | `24px` | Very large |
| `rounded-full` | `9999px` | Circles, pills |

---

## ⚡ **Transitions**

### **Timing Functions**

```css
--ease-linear: cubic-bezier(0, 0, 1, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);  /* Formless.xyz default */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### **Durations**

| Token | Value | Usage |
|-------|-------|-------|
| `duration-75` | `75ms` | Very fast |
| `duration-100` | `100ms` | Fast |
| `duration-150` | `150ms` | Quick |
| `duration-200` | `200ms` | Default |
| `duration-250` | `250ms` | **Formless.xyz default** |
| `duration-300` | `300ms` | Slow |
| `duration-500` | `500ms` | Very slow |

---

## 💡 **Usage Examples**

### **Button Component**

```tsx
<button className="
  h-11 px-6 py-2.5 
  bg-gradient-to-r from-primary-500 to-primary-600 
  text-white 
  rounded-lg 
  shadow-sm hover:shadow-md 
  hover:-translate-y-0.5 
  transition-all duration-250 ease-out
">
  Click Me
</button>
```

### **Card Component**

```tsx
<div className="
  p-6 sm:p-8 
  bg-white 
  border border-neutral-200 
  rounded-xl 
  shadow-sm hover:shadow-md 
  hover:-translate-y-0.5 
  transition-all duration-250 ease-out
">
  Card Content
</div>
```

### **Input Component**

```tsx
<input className="
  h-12 w-full 
  px-4 py-3 
  border border-neutral-300 
  rounded-lg 
  text-base text-neutral-900 
  placeholder:text-neutral-500 
  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
  hover:border-neutral-400 
  transition-all duration-250 ease-out
" />
```

### **Typography**

```tsx
<h1 className="text-5xl font-bold leading-tight tracking-tight text-neutral-900">
  Hero Heading
</h1>

<p className="text-base font-normal leading-relaxed text-neutral-600">
  Body text with comfortable reading experience.
</p>
```

---

## 🎯 **Design Principles**

1. **Minimalism** - Use neutral colors, remove unnecessary elements
2. **Whitespace** - Generous spacing (8px grid system)
3. **Subtle Animations** - Smooth, purposeful (250ms ease-out)
4. **Clear Typography** - Excellent hierarchy and readability
5. **Muted Colors** - Sophisticated, not vibrant
6. **Clean Layouts** - Grid-based, aligned, organized
7. **Premium Feel** - High-quality, professional, trustworthy

---

**Last Updated**: 2025-10-15  
**Version**: 2.0.0  
**Inspiration**: Formless.xyz


