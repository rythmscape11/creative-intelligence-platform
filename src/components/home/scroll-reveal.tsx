'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

/**
 * Scroll Reveal Component
 * Animates elements when they come into view
 */
export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up'
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    // Set initial state based on direction
    const initialTransforms = {
      up: 'translateY(50px)',
      down: 'translateY(-50px)',
      left: 'translateX(50px)',
      right: 'translateX(-50px)',
      scale: 'scale(0.9)'
    };

    element.style.opacity = '0';
    element.style.transform = initialTransforms[direction];
    element.style.transition = `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = direction === 'scale' ? 'scale(1)' : 'translate(0, 0)';
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, direction]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * Smooth Scroll Link Component
 * Smoothly scrolls to anchor links
 */
export function SmoothScrollLink({ href, children, className = '' }: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle anchor links
    if (!href.startsWith('#')) return;

    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      // Update URL without triggering navigation
      window.history.pushState(null, '', href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * Count Up Animation Component
 * Animates numbers counting up when in view
 */
export function CountUp({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = ''
}: CountUpProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.textContent = `${prefix}${end}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            
            const startTime = Date.now();
            const startValue = 0;

            const animate = () => {
              const currentTime = Date.now();
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Easing function (ease-out)
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(startValue + (end - startValue) * easeOut);

              element.textContent = `${prefix}${currentValue}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                element.textContent = `${prefix}${end}${suffix}`;
              }
            };

            animate();
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [end, duration, suffix, prefix]);

  return <span ref={elementRef} className={className}>0</span>;
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Stagger Container Component
 * Staggers animation of child elements
 */
export function StaggerContainer({ 
  children, 
  className = '',
  staggerDelay = 100
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const childElements = Array.from(container.children) as HTMLElement[];

    childElements.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = `opacity 0.5s ease-out ${index * staggerDelay}ms, transform 0.5s ease-out ${index * staggerDelay}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            childElements.forEach((child) => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            });
            observer.unobserve(container);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

