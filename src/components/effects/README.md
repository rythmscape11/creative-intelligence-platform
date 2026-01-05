# Mouse Gradient Effect

A subtle, performant mouse-following gradient effect inspired by Formless.xyz's design.

## Overview

This component creates a radial gradient that smoothly follows the user's cursor, adding a subtle interactive lighting effect to the page. It's commonly used in modern web design to create depth and interactivity.

## Components

### `MouseGradient`

The base component with full customization options.

**Props:**
- `size` (number, default: 600) - Size of the gradient circle in pixels
- `opacity` (number, default: 0.15) - Opacity of the gradient effect (0-1)
- `color` (string, default: '255, 255, 255') - RGB color without 'rgb()' wrapper
- `enabled` (boolean, default: true) - Whether to enable the effect
- `blur` (number, default: 100) - Blur amount in pixels

**Example:**
```tsx
<MouseGradient 
  size={600} 
  opacity={0.15} 
  color="255, 255, 255" 
  blur={100}
/>
```

### `MouseGradientSubtle`

A pre-configured subtle version matching Formless.xyz's style. **Recommended for production.**

**Props:**
- `enabled` (boolean, default: true) - Whether to enable the effect

**Example:**
```tsx
<MouseGradientSubtle />
```

### `MouseGradientMultiColor`

A more complex variant with multiple colored gradient layers.

**Props:**
- `enabled` (boolean, default: true) - Whether to enable the effect

**Example:**
```tsx
<MouseGradientMultiColor />
```

## Usage

### Basic Implementation

```tsx
import { MouseGradientSubtle } from '@/components/effects/MouseGradient';

export default function Page() {
  return (
    <div>
      <MouseGradientSubtle />
      {/* Your page content */}
    </div>
  );
}
```

### Dynamic Import (Recommended)

For better performance, use dynamic imports to avoid SSR issues:

```tsx
import dynamic from 'next/dynamic';

const MouseGradientSubtle = dynamic(
  () => import('@/components/effects/MouseGradient').then(mod => ({ 
    default: mod.MouseGradientSubtle 
  })),
  { ssr: false }
);

export default function Page() {
  return (
    <div>
      <MouseGradientSubtle />
      {/* Your page content */}
    </div>
  );
}
```

### Custom Configuration

```tsx
import { MouseGradient } from '@/components/effects/MouseGradient';

export default function Page() {
  return (
    <div>
      <MouseGradient 
        size={800}
        opacity={0.2}
        color="147, 197, 253" // Blue tint
        blur={120}
      />
      {/* Your page content */}
    </div>
  );
}
```

## Performance

The component is optimized for performance:

- **RequestAnimationFrame**: Uses RAF for smooth 60fps animations
- **Linear Interpolation**: Smoothly interpolates position for fluid movement
- **Will-change**: Uses CSS `will-change` for GPU acceleration
- **Pointer-events: none**: Doesn't interfere with page interactions
- **Dynamic Import**: Can be loaded client-side only to avoid SSR overhead

## Design Considerations

### When to Use

✅ **Good for:**
- Hero sections
- Landing pages
- Portfolio pages
- Interactive showcases
- Dark-themed websites

❌ **Avoid for:**
- Content-heavy pages (blogs, articles)
- Mobile-only experiences (subtle on small screens)
- Accessibility-critical interfaces
- Pages with many interactive elements

### Accessibility

The component includes:
- `aria-hidden="true"` - Hidden from screen readers
- `pointer-events: none` - Doesn't interfere with interactions
- Fade out on mouse leave - Reduces distraction

### Browser Support

Works in all modern browsers that support:
- CSS `radial-gradient`
- CSS `filter: blur()`
- `requestAnimationFrame`
- CSS custom properties

## Color Recommendations

For dark themes (like Formless.xyz):
- **White**: `255, 255, 255` - Subtle, clean
- **Blue**: `147, 197, 253` - Cool, modern
- **Purple**: `196, 181, 253` - Creative, elegant
- **Gray**: `156, 163, 175` - Very subtle

For light themes:
- **Dark Gray**: `31, 41, 55` - Subtle shadow
- **Blue**: `59, 130, 246` - Vibrant
- **Purple**: `139, 92, 246` - Bold

## Customization Examples

### Larger, More Visible Effect
```tsx
<MouseGradient 
  size={1000}
  opacity={0.25}
  blur={150}
/>
```

### Smaller, Tighter Effect
```tsx
<MouseGradient 
  size={400}
  opacity={0.1}
  blur={60}
/>
```

### Colored Tint
```tsx
<MouseGradient 
  size={600}
  opacity={0.15}
  color="147, 197, 253" // Blue
  blur={100}
/>
```

## Implementation Notes

1. **Z-index**: Set to `z-50` to appear above content but below modals
2. **Fixed Positioning**: Uses `fixed` to stay in viewport
3. **Smooth Animation**: Uses lerp (linear interpolation) for smooth following
4. **Fade Transitions**: Fades in/out when mouse enters/leaves viewport

## Troubleshooting

**Effect not visible:**
- Check that the page has a dark background
- Increase `opacity` value
- Decrease `blur` value
- Check z-index conflicts

**Performance issues:**
- Reduce `size` value
- Increase lerp factor (line 73: change 0.1 to 0.15)
- Use only one gradient instead of multi-color

**Effect too strong:**
- Decrease `opacity` value
- Increase `blur` value
- Use `MouseGradientSubtle` instead of custom config

## Credits

Inspired by the mouse-following gradient effect on Formless.xyz and other modern web designs.

