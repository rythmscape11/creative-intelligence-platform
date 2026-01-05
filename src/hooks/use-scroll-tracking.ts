'use client';

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/tracking-enhanced';

interface UseScrollTrackingOptions {
  /**
   * Scroll depth milestones to track (default: [25, 50, 75, 100])
   */
  milestones?: number[];
  
  /**
   * Debounce delay in milliseconds (default: 500)
   */
  debounceDelay?: number;
  
  /**
   * Enable tracking (default: true)
   */
  enabled?: boolean;
  
  /**
   * Custom page identifier (default: current pathname)
   */
  pageId?: string;
}

/**
 * Hook to track scroll depth on a page
 * 
 * @example
 * ```tsx
 * function BlogPost() {
 *   useScrollTracking({
 *     milestones: [25, 50, 75, 100],
 *     pageId: '/blog/my-post',
 *   });
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function useScrollTracking(options: UseScrollTrackingOptions = {}) {
  const {
    milestones = [25, 50, 75, 100],
    debounceDelay = 500,
    enabled = true,
    pageId,
  } = options;

  const trackedMilestones = useRef<Set<number>>(new Set());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Reset tracked milestones on page change
    trackedMilestones.current.clear();

    const handleScroll = () => {
      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer
      debounceTimer.current = setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Calculate scroll percentage
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = Math.round((scrollTop / scrollableHeight) * 100);

        // Track milestones
        milestones.forEach(milestone => {
          if (
            scrollPercentage >= milestone &&
            !trackedMilestones.current.has(milestone)
          ) {
            trackedMilestones.current.add(milestone);
            trackScrollDepth(
              milestone,
              pageId || window.location.pathname
            );

            if (process.env.NODE_ENV === 'development') {
              console.log(`[Scroll Tracking] ${milestone}% reached`);
            }
          }
        });
      }, debounceDelay);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [enabled, milestones, debounceDelay, pageId]);
}

/**
 * Hook to track maximum scroll depth on page
 * Tracks only the maximum depth reached, not all milestones
 */
export function useMaxScrollTracking(enabled: boolean = true) {
  const maxScrollRef = useRef<number>(0);
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = Math.round((scrollTop / scrollableHeight) * 100);

      if (scrollPercentage > maxScrollRef.current) {
        maxScrollRef.current = scrollPercentage;
      }
    };

    const handleBeforeUnload = () => {
      if (!hasTrackedRef.current && maxScrollRef.current > 0) {
        trackScrollDepth(maxScrollRef.current, window.location.pathname);
        hasTrackedRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track on unmount if not already tracked
      if (!hasTrackedRef.current && maxScrollRef.current > 0) {
        trackScrollDepth(maxScrollRef.current, window.location.pathname);
        hasTrackedRef.current = true;
      }
    };
  }, [enabled]);

  return maxScrollRef.current;
}

/**
 * Hook to track scroll to specific element
 */
export function useElementScrollTracking(
  elementId: string,
  eventName: string = 'element_viewed',
  enabled: boolean = true
) {
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTrackedRef.current) {
            trackScrollDepth(0, window.location.pathname); // Track element view
            hasTrackedRef.current = true;

            if (process.env.NODE_ENV === 'development') {
              console.log(`[Element Tracking] ${elementId} viewed`);
            }
          }
        });
      },
      {
        threshold: 0.5, // Element is 50% visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementId, eventName, enabled]);
}

