/**
 * Performance Configuration
 * Optimized settings for PageSpeed Insights and Core Web Vitals
 */

export const PERFORMANCE_CONFIG = {
  // Script Loading Strategy
  scripts: {
    // Use lazyOnload for non-critical tracking scripts
    analytics: 'lazyOnload' as const,
    tagManager: 'lazyOnload' as const,
    pixel: 'lazyOnload' as const,
    
    // Use afterInteractive for critical scripts
    critical: 'afterInteractive' as const,
  },

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Font Optimization
  fonts: {
    display: 'swap' as const,
    preload: true,
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Cache Control
  cache: {
    static: {
      maxAge: 31536000, // 1 year
      staleWhileRevalidate: 86400, // 1 day
    },
    dynamic: {
      maxAge: 0,
      staleWhileRevalidate: 60, // 1 minute
    },
    api: {
      maxAge: 60, // 1 minute
      staleWhileRevalidate: 300, // 5 minutes
    },
  },

  // Resource Hints
  resourceHints: {
    preconnect: [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://connect.facebook.net',
    ],
    dnsPrefetch: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
  },

  // Core Web Vitals Thresholds
  webVitals: {
    lcp: {
      good: 2500,
      needsImprovement: 4000,
    },
    fid: {
      good: 100,
      needsImprovement: 300,
    },
    cls: {
      good: 0.1,
      needsImprovement: 0.25,
    },
    fcp: {
      good: 1800,
      needsImprovement: 3000,
    },
    ttfb: {
      good: 600,
      needsImprovement: 1500,
    },
    inp: {
      good: 200,
      needsImprovement: 500,
    },
  },

  // Compression
  compression: {
    enabled: true,
    threshold: 1024, // Compress responses larger than 1KB
    level: 6, // Compression level (0-9)
  },

  // Lazy Loading
  lazyLoading: {
    images: true,
    iframes: true,
    threshold: '50px', // Start loading when element is 50px from viewport
  },

  // Code Splitting
  codeSplitting: {
    chunks: 'all' as const,
    maxInitialRequests: 25,
    maxAsyncRequests: 25,
    minSize: 20000,
  },
};

/**
 * Get cache headers for a resource type
 */
export function getCacheHeaders(type: 'static' | 'dynamic' | 'api'): Record<string, string> {
  const config = PERFORMANCE_CONFIG.cache[type];
  
  return {
    'Cache-Control': `public, max-age=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
    'CDN-Cache-Control': `public, max-age=${config.maxAge}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${config.maxAge}`,
  };
}

/**
 * Get resource hints for preconnect and dns-prefetch
 */
export function getResourceHints() {
  return {
    preconnect: PERFORMANCE_CONFIG.resourceHints.preconnect,
    dnsPrefetch: PERFORMANCE_CONFIG.resourceHints.dnsPrefetch,
  };
}

/**
 * Check if a Web Vital metric is good, needs improvement, or poor
 */
export function getWebVitalRating(
  metric: 'lcp' | 'fid' | 'cls' | 'fcp' | 'ttfb' | 'inp',
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_CONFIG.webVitals[metric];
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Performance optimization recommendations based on metrics
 */
export function getPerformanceRecommendations(metrics: {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}): string[] {
  const recommendations: string[] = [];

  if (metrics.lcp && metrics.lcp > PERFORMANCE_CONFIG.webVitals.lcp.good) {
    recommendations.push(
      'Optimize Largest Contentful Paint (LCP): Optimize images, improve server response times, and preload critical resources'
    );
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_CONFIG.webVitals.fid.good) {
    recommendations.push(
      'Improve First Input Delay (FID): Reduce JavaScript execution time and break up long tasks'
    );
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_CONFIG.webVitals.cls.good) {
    recommendations.push(
      'Reduce Cumulative Layout Shift (CLS): Add size attributes to images and reserve space for dynamic content'
    );
  }

  if (metrics.fcp && metrics.fcp > PERFORMANCE_CONFIG.webVitals.fcp.good) {
    recommendations.push(
      'Optimize First Contentful Paint (FCP): Eliminate render-blocking resources and optimize critical rendering path'
    );
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_CONFIG.webVitals.ttfb.good) {
    recommendations.push(
      'Improve Time to First Byte (TTFB): Optimize server performance, use CDN, and implement caching'
    );
  }

  if (metrics.inp && metrics.inp > PERFORMANCE_CONFIG.webVitals.inp.good) {
    recommendations.push(
      'Optimize Interaction to Next Paint (INP): Reduce JavaScript execution time and optimize event handlers'
    );
  }

  return recommendations;
}

/**
 * Calculate overall performance score based on Web Vitals
 */
export function calculatePerformanceScore(metrics: {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}): number {
  let score = 100;
  const weights = {
    lcp: 25,
    fid: 25,
    cls: 25,
    fcp: 10,
    ttfb: 10,
    inp: 5,
  };

  Object.entries(metrics).forEach(([metric, value]) => {
    if (value !== undefined) {
      const rating = getWebVitalRating(metric as any, value);
      const weight = weights[metric as keyof typeof weights];

      if (rating === 'poor') {
        score -= weight;
      } else if (rating === 'needs-improvement') {
        score -= weight * 0.5;
      }
    }
  });

  return Math.max(0, Math.min(100, score));
}

