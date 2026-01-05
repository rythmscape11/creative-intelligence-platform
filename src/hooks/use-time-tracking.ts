'use client';

import { useEffect, useRef } from 'react';
import { trackTimeOnPage } from '@/lib/tracking-enhanced';

interface UseTimeTrackingOptions {
  /**
   * Time intervals to track in seconds (default: [30, 60, 120, 300])
   */
  intervals?: number[];
  
  /**
   * Enable tracking (default: true)
   */
  enabled?: boolean;
  
  /**
   * Custom page identifier (default: current pathname)
   */
  pageId?: string;
  
  /**
   * Track on page visibility change (default: true)
   */
  trackOnVisibilityChange?: boolean;
}

/**
 * Hook to track time spent on page
 * 
 * @example
 * ```tsx
 * function BlogPost() {
 *   useTimeTracking({
 *     intervals: [30, 60, 120, 300], // Track at 30s, 1min, 2min, 5min
 *     pageId: '/blog/my-post',
 *   });
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function useTimeTracking(options: UseTimeTrackingOptions = {}) {
  const {
    intervals = [30, 60, 120, 300],
    enabled = true,
    pageId,
    trackOnVisibilityChange = true,
  } = options;

  const startTimeRef = useRef<number>(Date.now());
  const trackedIntervalsRef = useRef<Set<number>>(new Set());
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isVisibleRef = useRef<boolean>(true);
  const totalTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Reset on mount
    startTimeRef.current = Date.now();
    trackedIntervalsRef.current.clear();
    totalTimeRef.current = 0;

    // Set up interval timers
    intervals.forEach(interval => {
      const timer = setTimeout(() => {
        if (!trackedIntervalsRef.current.has(interval)) {
          trackedIntervalsRef.current.add(interval);
          trackTimeOnPage(interval, pageId || window.location.pathname);

          if (process.env.NODE_ENV === 'development') {
            console.log(`[Time Tracking] ${interval}s reached`);
          }
        }
      }, interval * 1000);

      timersRef.current.push(timer);
    });

    // Track on visibility change
    const handleVisibilityChange = () => {
      if (trackOnVisibilityChange) {
        const now = Date.now();
        const timeSpent = Math.round((now - startTimeRef.current) / 1000);

        if (document.hidden) {
          // Page is hidden
          isVisibleRef.current = false;
          totalTimeRef.current += timeSpent;
          
          // Track time when leaving page
          trackTimeOnPage(totalTimeRef.current, pageId || window.location.pathname);

          if (process.env.NODE_ENV === 'development') {
            console.log(`[Time Tracking] Page hidden after ${totalTimeRef.current}s`);
          }
        } else {
          // Page is visible again
          isVisibleRef.current = true;
          startTimeRef.current = now;
        }
      }
    };

    // Track on page unload
    const handleBeforeUnload = () => {
      const now = Date.now();
      const timeSpent = Math.round((now - startTimeRef.current) / 1000);
      totalTimeRef.current += timeSpent;

      trackTimeOnPage(totalTimeRef.current, pageId || window.location.pathname);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Time Tracking] Page unload after ${totalTimeRef.current}s`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      // Clear all timers
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track final time on unmount
      const now = Date.now();
      const timeSpent = Math.round((now - startTimeRef.current) / 1000);
      totalTimeRef.current += timeSpent;

      if (totalTimeRef.current > 0) {
        trackTimeOnPage(totalTimeRef.current, pageId || window.location.pathname);
      }
    };
  }, [enabled, intervals, pageId, trackOnVisibilityChange]);

  return totalTimeRef.current;
}

/**
 * Hook to track active time on page (excludes time when page is hidden)
 */
export function useActiveTimeTracking(enabled: boolean = true) {
  const startTimeRef = useRef<number>(Date.now());
  const activeTimeRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const handleVisibilityChange = () => {
      const now = Date.now();

      if (document.hidden) {
        // Page is hidden - stop counting
        if (isActiveRef.current) {
          const activeTime = Math.round((now - startTimeRef.current) / 1000);
          activeTimeRef.current += activeTime;
          isActiveRef.current = false;
        }
      } else {
        // Page is visible - start counting
        if (!isActiveRef.current) {
          startTimeRef.current = now;
          isActiveRef.current = true;
        }
      }
    };

    const handleBeforeUnload = () => {
      if (isActiveRef.current) {
        const now = Date.now();
        const activeTime = Math.round((now - startTimeRef.current) / 1000);
        activeTimeRef.current += activeTime;
      }

      if (activeTimeRef.current > 0) {
        trackTimeOnPage(activeTimeRef.current, window.location.pathname);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track final active time
      if (isActiveRef.current) {
        const now = Date.now();
        const activeTime = Math.round((now - startTimeRef.current) / 1000);
        activeTimeRef.current += activeTime;
      }

      if (activeTimeRef.current > 0) {
        trackTimeOnPage(activeTimeRef.current, window.location.pathname);
      }
    };
  }, [enabled]);

  return activeTimeRef.current;
}

/**
 * Hook to track time spent reading (based on scroll position)
 */
export function useReadingTimeTracking(enabled: boolean = true) {
  const startTimeRef = useRef<number>(Date.now());
  const readingTimeRef = useRef<number>(0);
  const isReadingRef = useRef<boolean>(false);
  const lastScrollRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      const now = Date.now();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Consider user is reading if they scrolled
      if (scrollTop !== lastScrollRef.current) {
        if (!isReadingRef.current) {
          startTimeRef.current = now;
          isReadingRef.current = true;
        }
        lastScrollRef.current = scrollTop;
      }
    };

    const handleBeforeUnload = () => {
      if (isReadingRef.current) {
        const now = Date.now();
        const readingTime = Math.round((now - startTimeRef.current) / 1000);
        readingTimeRef.current += readingTime;
      }

      if (readingTimeRef.current > 0) {
        trackTimeOnPage(readingTimeRef.current, window.location.pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track final reading time
      if (isReadingRef.current) {
        const now = Date.now();
        const readingTime = Math.round((now - startTimeRef.current) / 1000);
        readingTimeRef.current += readingTime;
      }

      if (readingTimeRef.current > 0) {
        trackTimeOnPage(readingTimeRef.current, window.location.pathname);
      }
    };
  }, [enabled]);

  return readingTimeRef.current;
}

/**
 * Hook to get current time on page
 */
export function useCurrentTimeOnPage(): number {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  if (typeof window === 'undefined') {
    return 0;
  }

  return Math.round((Date.now() - startTimeRef.current) / 1000);
}

