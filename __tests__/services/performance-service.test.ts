import { PerformanceService } from '../../src/lib/services/performance-service';

describe('PerformanceService', () => {
  let performanceService: PerformanceService;

  beforeEach(() => {
    performanceService = PerformanceService.getInstance();
  });

  describe('getImageConfig', () => {
    it('should return hero image configuration', () => {
      const config = performanceService.getImageConfig('hero');
      
      expect(config.quality).toBe(85);
      expect(config.format).toBe('webp');
      expect(config.sizes).toEqual([640, 768, 1024, 1280, 1920]);
      expect(config.placeholder).toBe('blur');
    });

    it('should return thumbnail image configuration', () => {
      const config = performanceService.getImageConfig('thumbnail');
      
      expect(config.quality).toBe(80);
      expect(config.format).toBe('webp');
      expect(config.sizes).toEqual([150, 300, 450]);
      expect(config.placeholder).toBe('blur');
    });

    it('should return content image configuration', () => {
      const config = performanceService.getImageConfig('content');
      
      expect(config.quality).toBe(85);
      expect(config.format).toBe('webp');
      expect(config.sizes).toEqual([400, 600, 800, 1200]);
      expect(config.placeholder).toBe('blur');
    });

    it('should return avatar image configuration', () => {
      const config = performanceService.getImageConfig('avatar');
      
      expect(config.quality).toBe(90);
      expect(config.format).toBe('webp');
      expect(config.sizes).toEqual([32, 48, 64, 96, 128]);
      expect(config.placeholder).toBe('blur');
    });
  });

  describe('generateSrcSet', () => {
    it('should generate responsive image srcSet', () => {
      const config = performanceService.getImageConfig('content');
      const srcSet = performanceService.generateSrcSet('/test-image.jpg', config);
      
      expect(srcSet).toContain('/api/image-proxy?url=%2Ftest-image.jpg&w=400&q=85&f=webp 400w');
      expect(srcSet).toContain('/api/image-proxy?url=%2Ftest-image.jpg&w=600&q=85&f=webp 600w');
      expect(srcSet).toContain('/api/image-proxy?url=%2Ftest-image.jpg&w=800&q=85&f=webp 800w');
      expect(srcSet).toContain('/api/image-proxy?url=%2Ftest-image.jpg&w=1200&q=85&f=webp 1200w');
    });

    it('should handle special characters in URLs', () => {
      const config = performanceService.getImageConfig('thumbnail');
      const srcSet = performanceService.generateSrcSet('/test image with spaces.jpg', config);

      // URLSearchParams encodes spaces as + instead of %20
      expect(srcSet).toContain('url=%2Ftest+image+with+spaces.jpg');
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should generate optimized image URL with correct parameters', () => {
      const config = performanceService.getImageConfig('hero');
      const url = performanceService.getOptimizedImageUrl('/hero.jpg', 1280, config);
      
      expect(url).toBe('/api/image-proxy?url=%2Fhero.jpg&w=1280&q=85&f=webp');
    });

    it('should handle external URLs', () => {
      const config = performanceService.getImageConfig('content');
      const url = performanceService.getOptimizedImageUrl('https://example.com/image.jpg', 800, config);
      
      expect(url).toBe('/api/image-proxy?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=800&q=85&f=webp');
    });
  });

  describe('getCacheHeaders', () => {
    it('should return static cache headers', () => {
      const headers = performanceService.getCacheHeaders('static');
      
      expect(headers['Cache-Control']).toContain('max-age=31536000');
      expect(headers['Cache-Control']).toContain('stale-while-revalidate=86400');
      expect(headers['CDN-Cache-Control']).toContain('max-age=31536000');
    });

    it('should return API cache headers', () => {
      const headers = performanceService.getCacheHeaders('api');
      
      expect(headers['Cache-Control']).toContain('max-age=300');
      expect(headers['Cache-Control']).toContain('stale-while-revalidate=60');
    });

    it('should return page cache headers', () => {
      const headers = performanceService.getCacheHeaders('page');
      
      expect(headers['Cache-Control']).toContain('max-age=3600');
      expect(headers['Cache-Control']).toContain('stale-while-revalidate=300');
    });

    it('should return image cache headers', () => {
      const headers = performanceService.getCacheHeaders('image');
      
      expect(headers['Cache-Control']).toContain('max-age=2592000');
      expect(headers['Cache-Control']).toContain('stale-while-revalidate=86400');
    });
  });

  describe('metrics management', () => {
    beforeEach(() => {
      // Clear metrics before each test to avoid state pollution
      performanceService = PerformanceService.getInstance();
      performanceService.getAllMetrics().clear();
    });

    it('should record and retrieve performance metrics', () => {
      const metrics = {
        fcp: 1200,
        lcp: 2100,
        fid: 80,
        cls: 0.05,
        ttfb: 400,
      };

      performanceService.recordMetrics('/test-page', metrics);
      const retrievedMetrics = performanceService.getMetrics('/test-page');

      expect(retrievedMetrics).toEqual(metrics);
    });

    it('should return undefined for non-existent metrics', () => {
      const metrics = performanceService.getMetrics('/non-existent');
      expect(metrics).toBeUndefined();
    });

    it('should return all metrics', () => {
      // Clear any existing metrics first
      performanceService.getAllMetrics().clear();

      const metrics1 = { fcp: 1200, lcp: 2100, fid: 80, cls: 0.05, ttfb: 400 };
      const metrics2 = { fcp: 1500, lcp: 2500, fid: 120, cls: 0.08, ttfb: 500 };

      performanceService.recordMetrics('/page1', metrics1);
      performanceService.recordMetrics('/page2', metrics2);

      const allMetrics = performanceService.getAllMetrics();

      expect(allMetrics.size).toBeGreaterThanOrEqual(2);
      expect(allMetrics.get('/page1')).toEqual(metrics1);
      expect(allMetrics.get('/page2')).toEqual(metrics2);
    });
  });

  describe('generatePreloadLinks', () => {
    it('should generate preload links for resources', () => {
      const resources = [
        { href: '/styles.css', as: 'style' as const },
        { href: '/script.js', as: 'script' as const },
        { href: '/font.woff2', as: 'font' as const, type: 'font/woff2', crossorigin: true },
      ];

      const links = performanceService.generatePreloadLinks(resources);
      
      expect(links).toContain('</styles.css>; rel=preload; as=style');
      expect(links).toContain('</script.js>; rel=preload; as=script');
      expect(links).toContain('</font.woff2>; rel=preload; as=font; type=font/woff2; crossorigin');
    });
  });

  describe('generateDNSPrefetchLinks', () => {
    it('should generate DNS prefetch links', () => {
      const domains = ['https://fonts.googleapis.com', 'https://api.example.com'];
      const links = performanceService.generateDNSPrefetchLinks(domains);
      
      expect(links).toContain('<https://fonts.googleapis.com>; rel=dns-prefetch');
      expect(links).toContain('<https://api.example.com>; rel=dns-prefetch');
    });
  });

  describe('generateModulePreloadLinks', () => {
    it('should generate module preload links', () => {
      const modules = ['/chunk-123.js', '/chunk-456.js'];
      const links = performanceService.generateModulePreloadLinks(modules);
      
      expect(links).toContain('</chunk-123.js>; rel=modulepreload');
      expect(links).toContain('</chunk-456.js>; rel=modulepreload');
    });
  });

  describe('extractCriticalCSS', () => {
    it('should extract critical CSS', () => {
      const html = '<div class="header"><h1>Title</h1></div>';
      const criticalCSS = performanceService.extractCriticalCSS(html);
      
      expect(criticalCSS).toContain('body');
      expect(criticalCSS).toContain('.header');
      expect(criticalCSS).toContain('h1');
      expect(criticalCSS).toContain('.container');
    });
  });

  describe('generateServiceWorkerConfig', () => {
    it('should generate service worker configuration', () => {
      const config = performanceService.generateServiceWorkerConfig();

      expect(config.runtimeCaching).toBeDefined();
      expect(config.runtimeCaching).toHaveLength(4);
      expect(config.skipWaiting).toBe(true);
      expect(config.clientsClaim).toBe(true);

      // Check that we have the expected cache configurations
      expect(config.runtimeCaching[0].handler).toBe('CacheFirst'); // Google Fonts
      expect(config.runtimeCaching[1].handler).toBe('CacheFirst'); // Images
      expect(config.runtimeCaching[2].handler).toBe('NetworkFirst'); // API
      expect(config.runtimeCaching[3].handler).toBe('CacheFirst'); // Static files

      // Verify cache names
      expect(config.runtimeCaching[0].options.cacheName).toBe('google-fonts-cache');
      expect(config.runtimeCaching[1].options.cacheName).toBe('images-cache');
      expect(config.runtimeCaching[2].options.cacheName).toBe('api-cache');
      expect(config.runtimeCaching[3].options.cacheName).toBe('static-cache');
    });
  });

  describe('analyzeWebVitals', () => {
    it('should analyze good Web Vitals metrics', () => {
      const metrics = {
        fcp: 1200, // Good (< 1800)
        lcp: 2000, // Good (< 2500)
        fid: 50,   // Good (< 100)
        cls: 0.05, // Good (< 0.1)
        ttfb: 400, // Good (< 600)
      };

      const analysis = performanceService.analyzeWebVitals(metrics);
      
      expect(analysis.score).toBe(100);
      expect(analysis.recommendations).toHaveLength(0);
    });

    it('should analyze poor Web Vitals metrics', () => {
      const metrics = {
        fcp: 3500, // Poor (> 3000)
        lcp: 4500, // Poor (> 4000)
        fid: 350,  // Poor (> 300)
        cls: 0.3,  // Poor (> 0.25)
        ttfb: 1600, // Poor (> 1500)
      };

      const analysis = performanceService.analyzeWebVitals(metrics);
      
      expect(analysis.score).toBeLessThan(100);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
      expect(analysis.recommendations.some(rec => rec.includes('LCP'))).toBe(true);
      expect(analysis.recommendations.some(rec => rec.includes('FID'))).toBe(true);
      expect(analysis.recommendations.some(rec => rec.includes('CLS'))).toBe(true);
      expect(analysis.recommendations.some(rec => rec.includes('FCP'))).toBe(true);
      expect(analysis.recommendations.some(rec => rec.includes('TTFB'))).toBe(true);
    });

    it('should analyze needs improvement Web Vitals metrics', () => {
      const metrics = {
        fcp: 2000, // Needs improvement (1800-3000)
        lcp: 3000, // Needs improvement (2500-4000)
        fid: 150,  // Needs improvement (100-300)
        cls: 0.15, // Needs improvement (0.1-0.25)
        ttfb: 800, // Needs improvement (600-1500)
      };

      const analysis = performanceService.analyzeWebVitals(metrics);
      
      expect(analysis.score).toBeLessThan(100);
      expect(analysis.score).toBeGreaterThan(0);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('getPerformanceBudget', () => {
    it('should return performance budget configuration', () => {
      const budget = performanceService.getPerformanceBudget();
      
      expect(budget.budgets).toBeDefined();
      expect(budget.budgets).toHaveLength(4);
      
      const initialBudget = budget.budgets.find((b: any) => b.type === 'initial');
      expect(initialBudget.maximumWarning).toBe('500kb');
      expect(initialBudget.maximumError).toBe('1mb');
      
      const scriptBudget = budget.budgets.find((b: any) => b.type === 'allScript');
      expect(scriptBudget.maximumWarning).toBe('300kb');
      expect(scriptBudget.maximumError).toBe('500kb');
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PerformanceService.getInstance();
      const instance2 = PerformanceService.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should maintain state across instances', () => {
      const instance1 = PerformanceService.getInstance();
      const instance2 = PerformanceService.getInstance();
      
      const metrics = { fcp: 1200, lcp: 2100, fid: 80, cls: 0.05, ttfb: 400 };
      instance1.recordMetrics('/test', metrics);
      
      expect(instance2.getMetrics('/test')).toEqual(metrics);
    });
  });
});
