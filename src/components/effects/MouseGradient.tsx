'use client';

import { useEffect, useRef } from 'react';

interface MouseGradientProps {
  /**
   * Size of the gradient circle in pixels
   * @default 600
   */
  size?: number;

  /**
   * Opacity of the gradient effect (0-1)
   * @default 0.15
   */
  opacity?: number;

  /**
   * Color of the gradient (in RGB format without 'rgb()')
   * @default '255, 255, 255' (white)
   */
  color?: string;

  /**
   * Whether to enable the effect
   * @default true
   */
  enabled?: boolean;

  /**
   * Blur amount in pixels
   * @default 100
   */
  blur?: number;
}

/**
 * MouseGradient - Creates a radial gradient that follows the mouse cursor
 * 
 * This component creates a subtle lighting effect that follows the user's cursor,
 * similar to the effect used on Formless.xyz and other modern websites.
 * 
 * Usage:
 * ```tsx
 * <MouseGradient size={600} opacity={0.15} color="255, 255, 255" />
 * ```
 */
export function MouseGradient({
  size = 600,
  opacity = 0.15,
  color = '255, 255, 255',
  enabled = true,
  blur = 100,
}: MouseGradientProps) {
  const gradientRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const gradient = gradientRef.current;
    if (!gradient) return;

    // Smooth animation using lerp (linear interpolation)
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Update gradient position with smooth animation
    const updateGradientPosition = () => {
      // Smoothly interpolate current position towards mouse position
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.1);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.1);

      // Update gradient position
      gradient.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;

      // Continue animation
      rafRef.current = requestAnimationFrame(updateGradientPosition);
    };

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Handle mouse leave (fade out effect)
    const handleMouseLeave = () => {
      if (gradient) {
        gradient.style.opacity = '0';
      }
    };

    // Handle mouse enter (fade in effect)
    const handleMouseEnter = () => {
      if (gradient) {
        gradient.style.opacity = '1';
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Start animation loop
    rafRef.current = requestAnimationFrame(updateGradientPosition);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={gradientRef}
      className="pointer-events-none fixed left-0 top-0 z-50 transition-opacity duration-300"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `-${size / 2}px`,
        marginTop: `-${size / 2}px`,
        background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}

/**
 * MouseGradientMultiColor - Creates multiple colored gradients that follow the mouse
 * 
 * This variant creates a more complex effect with multiple color layers
 */
export function MouseGradientMultiColor({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  return (
    <>
      <MouseGradient
        size={800}
        opacity={0.08}
        color="147, 197, 253" // Blue
        blur={120}
        enabled={enabled}
      />
      <MouseGradient
        size={600}
        opacity={0.06}
        color="196, 181, 253" // Purple
        blur={100}
        enabled={enabled}
      />
      <MouseGradient
        size={700}
        opacity={0.05}
        color="255, 255, 255" // White
        blur={110}
        enabled={enabled}
      />
    </>
  );
}

/**
 * MouseGradientSubtle - A very subtle version matching Formless.xyz style
 * 
 * This is the recommended version for the dark theme redesign
 */
export function MouseGradientSubtle({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  return (
    <MouseGradient
      size={600}
      opacity={0.12}
      color="255, 255, 255" // White
      blur={100}
      enabled={enabled}
    />
  );
}

