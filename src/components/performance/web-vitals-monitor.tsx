'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

interface WebVitalsMonitorProps {
  onMetric?: (metric: WebVitalsMetric) => void;
  reportToAnalytics?: boolean;
}

export function WebVitalsMonitor({
  onMetric,
  reportToAnalytics = true
}: WebVitalsMonitorProps) {
  useEffect(() => {
    // Only run in production for performance
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Use requestIdleCallback to defer web vitals monitoring
    const scheduleMonitoring = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initializeMonitoring(), { timeout: 2000 });
      } else {
        setTimeout(() => initializeMonitoring(), 2000);
      }
    };

    const initializeMonitoring = () => {
      const handleMetric = (metric: any) => {
        // Determine rating based on thresholds
        let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

        switch (metric.name) {
          case 'CLS':
            if (metric.value > 0.25) rating = 'poor';
            else if (metric.value > 0.1) rating = 'needs-improvement';
            break;
          case 'FCP':
            if (metric.value > 3000) rating = 'poor';
            else if (metric.value > 1800) rating = 'needs-improvement';
            break;
          case 'INP':
            if (metric.value > 500) rating = 'poor';
            else if (metric.value > 200) rating = 'needs-improvement';
            break;
          case 'LCP':
            if (metric.value > 4000) rating = 'poor';
            else if (metric.value > 2500) rating = 'needs-improvement';
            break;
          case 'TTFB':
            if (metric.value > 1500) rating = 'poor';
            else if (metric.value > 600) rating = 'needs-improvement';
            break;
        }

        const enhancedMetric: WebVitalsMetric = {
          ...metric,
          rating,
        };

        // Call custom handler
        if (onMetric) {
          onMetric(enhancedMetric);
        }

        // Report to analytics if enabled (deferred)
        if (reportToAnalytics) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => reportMetricToAnalytics(enhancedMetric));
          } else {
            setTimeout(() => reportMetricToAnalytics(enhancedMetric), 0);
          }
        }
      };

      // Register all Web Vitals metrics
      onCLS(handleMetric);
      onFCP(handleMetric);
      onINP(handleMetric); // INP replaced FID in web-vitals v3
      onLCP(handleMetric);
      onTTFB(handleMetric);
    };

    scheduleMonitoring();
  }, [onMetric, reportToAnalytics]);

  return null; // This component doesn't render anything
}

function reportMetricToAnalytics(metric: WebVitalsMetric) {
  // Report to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: {
        metric_rating: metric.rating,
      },
    });
  }

  // Report to custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch(error => {
      console.warn('Failed to report Web Vitals metric:', error);
    });
  }
}

// Hook for using Web Vitals in components
export function useWebVitals(callback?: (metric: WebVitalsMetric) => void) {
  useEffect(() => {
    if (!callback) return;

    const handleMetric = (metric: any) => {
      let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
      
      switch (metric.name) {
        case 'CLS':
          if (metric.value > 0.25) rating = 'poor';
          else if (metric.value > 0.1) rating = 'needs-improvement';
          break;
        case 'FCP':
          if (metric.value > 3000) rating = 'poor';
          else if (metric.value > 1800) rating = 'needs-improvement';
          break;
        case 'FID':
          if (metric.value > 300) rating = 'poor';
          else if (metric.value > 100) rating = 'needs-improvement';
          break;
        case 'LCP':
          if (metric.value > 4000) rating = 'poor';
          else if (metric.value > 2500) rating = 'needs-improvement';
          break;
        case 'TTFB':
          if (metric.value > 1500) rating = 'poor';
          else if (metric.value > 600) rating = 'needs-improvement';
          break;
      }

      callback({
        ...metric,
        rating,
      });
    };

    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric); // INP replaced FID in web-vitals v3
    onLCP(handleMetric);
    onTTFB(handleMetric);
  }, [callback]);
}

// Performance observer for custom metrics
export function usePerformanceObserver(
  entryTypes: string[],
  callback: (entries: PerformanceEntry[]) => void
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    try {
      observer.observe({ entryTypes });
    } catch (error) {
      console.warn('PerformanceObserver not supported for:', entryTypes);
    }

    return () => {
      observer.disconnect();
    };
  }, [entryTypes, callback]);
}

// Resource timing analyzer
export function analyzeResourceTiming(): {
  slowResources: PerformanceResourceTiming[];
  totalSize: number;
  totalDuration: number;
} {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return { slowResources: [], totalSize: 0, totalDuration: 0 };
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const slowResources = resources.filter(resource => {
    const duration = resource.responseEnd - resource.requestStart;
    return duration > 1000; // Resources taking more than 1 second
  });

  const totalSize = resources.reduce((total, resource) => {
    return total + (resource.transferSize || 0);
  }, 0);

  const totalDuration = resources.reduce((total, resource) => {
    return total + (resource.responseEnd - resource.requestStart);
  }, 0);

  return {
    slowResources,
    totalSize,
    totalDuration,
  };
}

// Navigation timing analyzer
export function analyzeNavigationTiming(): {
  ttfb: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
} | null {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');

  if (!navigation) return null;

  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
  const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

  return {
    ttfb: navigation.responseStart - navigation.requestStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    firstPaint,
    firstContentfulPaint,
  };
}

// Memory usage analyzer (Chrome only)
export function analyzeMemoryUsage(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  };
}
