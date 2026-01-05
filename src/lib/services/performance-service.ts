import { NextRequest, NextResponse } from 'next/server';

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  sizes: number[];
  placeholder: 'blur' | 'empty';
}

export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate: number;
  mustRevalidate?: boolean;
}

export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: Map<string, PerformanceMetrics> = new Map();

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  /**
   * Generate optimized image configuration
   */
  getImageConfig(type: 'hero' | 'thumbnail' | 'content' | 'avatar'): ImageOptimizationConfig {
    const configs = {
      hero: {
        quality: 85,
        format: 'webp' as const,
        sizes: [640, 768, 1024, 1280, 1920],
        placeholder: 'blur' as const,
      },
      thumbnail: {
        quality: 80,
        format: 'webp' as const,
        sizes: [150, 300, 450],
        placeholder: 'blur' as const,
      },
      content: {
        quality: 85,
        format: 'webp' as const,
        sizes: [400, 600, 800, 1200],
        placeholder: 'blur' as const,
      },
      avatar: {
        quality: 90,
        format: 'webp' as const,
        sizes: [32, 48, 64, 96, 128],
        placeholder: 'blur' as const,
      },
    };

    return configs[type];
  }

  /**
   * Generate responsive image srcSet
   */
  generateSrcSet(src: string, config: ImageOptimizationConfig): string {
    return config.sizes
      .map(size => `${this.getOptimizedImageUrl(src, size, config)} ${size}w`)
      .join(', ');
  }

  /**
   * Get optimized image URL
   */
  getOptimizedImageUrl(
    src: string, 
    width: number, 
    config: ImageOptimizationConfig
  ): string {
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: config.quality.toString(),
      f: config.format,
    });

    return `/api/image-proxy?${params}`;
  }

  /**
   * Generate cache headers for different content types
   */
  getCacheHeaders(type: 'static' | 'api' | 'page' | 'image'): Record<string, string> {
    const configs: Record<string, CacheConfig> = {
      static: {
        maxAge: 31536000, // 1 year
        staleWhileRevalidate: 86400, // 1 day
      },
      api: {
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 60, // 1 minute
      },
      page: {
        maxAge: 3600, // 1 hour
        staleWhileRevalidate: 300, // 5 minutes
      },
      image: {
        maxAge: 2592000, // 30 days
        staleWhileRevalidate: 86400, // 1 day
      },
    };

    const config = configs[type];
    
    return {
      'Cache-Control': `public, max-age=${config.maxAge}, s-maxage=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
      'CDN-Cache-Control': `public, max-age=${config.maxAge}`,
      'Vercel-CDN-Cache-Control': `public, max-age=${config.maxAge}`,
    };
  }

  /**
   * Record performance metrics
   */
  recordMetrics(url: string, metrics: PerformanceMetrics): void {
    this.metrics.set(url, metrics);
  }

  /**
   * Get performance metrics for a URL
   */
  getMetrics(url: string): PerformanceMetrics | undefined {
    return this.metrics.get(url);
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Generate preload links for critical resources
   */
  generatePreloadLinks(resources: Array<{
    href: string;
    as: 'script' | 'style' | 'font' | 'image';
    type?: string;
    crossorigin?: boolean;
  }>): string {
    return resources
      .map(resource => {
        let link = `<${resource.href}>; rel=preload; as=${resource.as}`;
        if (resource.type) link += `; type=${resource.type}`;
        if (resource.crossorigin) link += '; crossorigin';
        return link;
      })
      .join(', ');
  }

  /**
   * Generate DNS prefetch links
   */
  generateDNSPrefetchLinks(domains: string[]): string {
    return domains
      .map(domain => `<${domain}>; rel=dns-prefetch`)
      .join(', ');
  }

  /**
   * Optimize bundle loading with module preloading
   */
  generateModulePreloadLinks(modules: string[]): string {
    return modules
      .map(module => `<${module}>; rel=modulepreload`)
      .join(', ');
  }

  /**
   * Generate critical CSS for above-the-fold content
   */
  extractCriticalCSS(html: string): string {
    // This is a simplified version - in production, you'd use tools like:
    // - critical
    // - penthouse
    // - puppeteer with coverage API
    
    const criticalSelectors = [
      'body', 'html',
      '.header', '.nav', '.hero',
      '.container', '.wrapper',
      'h1', 'h2', 'h3',
      '.btn', '.button',
      '.loading', '.spinner',
    ];

    // Extract only critical CSS rules
    // This would be implemented with a proper CSS parser in production
    return `
      /* Critical CSS - Above the fold */
      body { margin: 0; font-family: system-ui, sans-serif; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .header { background: #fff; border-bottom: 1px solid #e5e7eb; }
      .hero { padding: 4rem 0; text-align: center; }
      h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
      .btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500; }
    `;
  }

  /**
   * Generate service worker configuration
   */
  generateServiceWorkerConfig(): any {
    return {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheKeyWillBeUsed: async ({ request }: any) => {
              return `${request.url}?${Date.now()}`;
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5, // 5 minutes
            },
            networkTimeoutSeconds: 3,
          },
        },
        {
          urlPattern: /\/_next\/static\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
      ],
      skipWaiting: true,
      clientsClaim: true,
    };
  }

  /**
   * Analyze Core Web Vitals and provide recommendations
   */
  analyzeWebVitals(metrics: PerformanceMetrics): {
    score: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let score = 100;

    // LCP (Largest Contentful Paint) - should be < 2.5s
    if (metrics.lcp > 4000) {
      score -= 30;
      recommendations.push('Optimize Largest Contentful Paint (LCP) - consider image optimization, server response times, and resource loading');
    } else if (metrics.lcp > 2500) {
      score -= 15;
      recommendations.push('Improve Largest Contentful Paint (LCP) - optimize critical resources');
    }

    // FID (First Input Delay) - should be < 100ms
    if (metrics.fid > 300) {
      score -= 25;
      recommendations.push('Reduce First Input Delay (FID) - minimize JavaScript execution time and use code splitting');
    } else if (metrics.fid > 100) {
      score -= 10;
      recommendations.push('Optimize First Input Delay (FID) - consider reducing JavaScript bundle size');
    }

    // CLS (Cumulative Layout Shift) - should be < 0.1
    if (metrics.cls > 0.25) {
      score -= 25;
      recommendations.push('Fix Cumulative Layout Shift (CLS) - ensure images have dimensions and avoid inserting content above existing content');
    } else if (metrics.cls > 0.1) {
      score -= 10;
      recommendations.push('Improve Cumulative Layout Shift (CLS) - optimize layout stability');
    }

    // FCP (First Contentful Paint) - should be < 1.8s
    if (metrics.fcp > 3000) {
      score -= 15;
      recommendations.push('Optimize First Contentful Paint (FCP) - improve server response times and eliminate render-blocking resources');
    } else if (metrics.fcp > 1800) {
      score -= 8;
      recommendations.push('Improve First Contentful Paint (FCP) - optimize critical rendering path');
    }

    // TTFB (Time to First Byte) - should be < 600ms
    if (metrics.ttfb > 1500) {
      score -= 15;
      recommendations.push('Optimize Time to First Byte (TTFB) - improve server performance and use CDN');
    } else if (metrics.ttfb > 600) {
      score -= 8;
      recommendations.push('Improve Time to First Byte (TTFB) - optimize server response times');
    }

    return {
      score: Math.max(0, score),
      recommendations,
    };
  }

  /**
   * Generate performance budget configuration
   */
  getPerformanceBudget(): any {
    return {
      budgets: [
        {
          type: 'initial',
          maximumWarning: '500kb',
          maximumError: '1mb',
        },
        {
          type: 'allScript',
          maximumWarning: '300kb',
          maximumError: '500kb',
        },
        {
          type: 'all',
          maximumWarning: '2mb',
          maximumError: '5mb',
        },
        {
          type: 'anyComponentStyle',
          maximumWarning: '50kb',
          maximumError: '100kb',
        },
      ],
    };
  }
}
