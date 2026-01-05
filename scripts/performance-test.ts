/**
 * Performance Testing Script
 * Measures and reports on key performance metrics
 */

import { chromium, Browser, Page } from 'playwright';

interface PerformanceMetrics {
    url: string;
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    timeToInteractive: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    resourceCount: number;
    totalResourceSize: number;
    jsHeapSize: number;
}

interface PerformanceReport {
    timestamp: string;
    baseUrl: string;
    pages: PerformanceMetrics[];
    summary: {
        averageLoadTime: number;
        slowestPage: string;
        fastestPage: string;
        totalPages: number;
        passedLCP: number;
        passedFCP: number;
    };
}

// Performance budgets (in milliseconds unless noted)
const PERFORMANCE_BUDGETS = {
    loadTime: 3000,
    domContentLoaded: 2000,
    firstContentfulPaint: 1800,
    largestContentfulPaint: 2500,
    timeToInteractive: 3500,
    totalBlockingTime: 300,
    cumulativeLayoutShift: 0.1, // Score, not ms
};

// Pages to test
const TEST_PAGES = [
    '/',
    '/pricing',
    '/about',
    '/blog',
    '/tools',
    '/sign-in',
    '/dashboard', // Will redirect to auth
];

async function measurePerformance(page: Page, url: string): Promise<PerformanceMetrics> {
    const startTime = Date.now();

    // Navigate and wait for load
    await page.goto(url, { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Get performance timing
    const timing = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
            domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
            loadEventEnd: perf.loadEventEnd - perf.startTime,
        };
    });

    // Get paint timing
    const paintTiming = await page.evaluate(() => {
        const entries = performance.getEntriesByType('paint');
        const fcp = entries.find(e => e.name === 'first-contentful-paint');
        return {
            firstContentfulPaint: fcp ? fcp.startTime : 0,
        };
    });

    // Get LCP (requires PerformanceObserver, approximate here)
    const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
            let lcpValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                lcpValue = lastEntry.startTime;
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
            setTimeout(() => {
                observer.disconnect();
                resolve(lcpValue);
            }, 1000);
        });
    }).catch(() => 0);

    // Get resource stats
    const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return {
            count: entries.length,
            totalSize: entries.reduce((sum, e) => sum + (e.transferSize || 0), 0),
        };
    });

    // Get memory usage (Chrome only)
    const jsHeapSize = await page.evaluate(() => {
        const memory = (performance as any).memory;
        return memory ? memory.usedJSHeapSize : 0;
    }).catch(() => 0);

    return {
        url,
        loadTime,
        domContentLoaded: timing.domContentLoaded,
        firstContentfulPaint: paintTiming.firstContentfulPaint,
        largestContentfulPaint: lcp,
        timeToInteractive: timing.domContentLoaded + 100, // Approximate
        totalBlockingTime: 0, // Would need more complex measurement
        cumulativeLayoutShift: 0, // Would need LayoutShift observer
        resourceCount: resources.count,
        totalResourceSize: resources.totalSize,
        jsHeapSize,
    };
}

function checkBudget(metrics: PerformanceMetrics): { passed: boolean; violations: string[] } {
    const violations: string[] = [];

    if (metrics.loadTime > PERFORMANCE_BUDGETS.loadTime) {
        violations.push(`Load time (${metrics.loadTime}ms) exceeds budget (${PERFORMANCE_BUDGETS.loadTime}ms)`);
    }
    if (metrics.firstContentfulPaint > PERFORMANCE_BUDGETS.firstContentfulPaint) {
        violations.push(`FCP (${metrics.firstContentfulPaint}ms) exceeds budget (${PERFORMANCE_BUDGETS.firstContentfulPaint}ms)`);
    }
    if (metrics.largestContentfulPaint > PERFORMANCE_BUDGETS.largestContentfulPaint) {
        violations.push(`LCP (${metrics.largestContentfulPaint}ms) exceeds budget (${PERFORMANCE_BUDGETS.largestContentfulPaint}ms)`);
    }

    return {
        passed: violations.length === 0,
        violations,
    };
}

async function runPerformanceTests(): Promise<PerformanceReport> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    console.log(`\n🚀 Starting performance tests for ${baseUrl}\n`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();

    const results: PerformanceMetrics[] = [];

    for (const testPage of TEST_PAGES) {
        const url = `${baseUrl}${testPage}`;
        console.log(`Testing: ${testPage}`);

        try {
            const metrics = await measurePerformance(page, url);
            results.push(metrics);

            const { passed, violations } = checkBudget(metrics);
            if (passed) {
                console.log(`  ✅ Passed - Load: ${metrics.loadTime}ms, FCP: ${Math.round(metrics.firstContentfulPaint)}ms`);
            } else {
                console.log(`  ⚠️ Budget violations:`);
                violations.forEach(v => console.log(`     - ${v}`));
            }
        } catch (error) {
            console.log(`  ❌ Error: ${(error as Error).message}`);
            results.push({
                url,
                loadTime: -1,
                domContentLoaded: -1,
                firstContentfulPaint: -1,
                largestContentfulPaint: -1,
                timeToInteractive: -1,
                totalBlockingTime: -1,
                cumulativeLayoutShift: -1,
                resourceCount: 0,
                totalResourceSize: 0,
                jsHeapSize: 0,
            });
        }
    }

    await browser.close();

    // Calculate summary
    const validResults = results.filter(r => r.loadTime > 0);
    const avgLoadTime = validResults.reduce((sum, r) => sum + r.loadTime, 0) / validResults.length;
    const slowest = validResults.reduce((max, r) => r.loadTime > max.loadTime ? r : max);
    const fastest = validResults.reduce((min, r) => r.loadTime < min.loadTime ? r : min);
    const passedLCP = validResults.filter(r => r.largestContentfulPaint <= PERFORMANCE_BUDGETS.largestContentfulPaint).length;
    const passedFCP = validResults.filter(r => r.firstContentfulPaint <= PERFORMANCE_BUDGETS.firstContentfulPaint).length;

    const report: PerformanceReport = {
        timestamp: new Date().toISOString(),
        baseUrl,
        pages: results,
        summary: {
            averageLoadTime: Math.round(avgLoadTime),
            slowestPage: slowest.url,
            fastestPage: fastest.url,
            totalPages: results.length,
            passedLCP,
            passedFCP,
        },
    };

    // Print summary
    console.log('\n📊 Performance Summary');
    console.log('─'.repeat(50));
    console.log(`Average Load Time: ${report.summary.averageLoadTime}ms`);
    console.log(`Fastest Page: ${report.summary.fastestPage} (${fastest.loadTime}ms)`);
    console.log(`Slowest Page: ${report.summary.slowestPage} (${slowest.loadTime}ms)`);
    console.log(`LCP Budget Pass Rate: ${passedLCP}/${validResults.length}`);
    console.log(`FCP Budget Pass Rate: ${passedFCP}/${validResults.length}`);
    console.log('─'.repeat(50));

    return report;
}

// Run if called directly
if (require.main === module) {
    runPerformanceTests()
        .then(report => {
            console.log('\n✅ Performance testing complete');
            // Could write report to file
            // fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
        })
        .catch(err => {
            console.error('Performance testing failed:', err);
            process.exit(1);
        });
}

export { runPerformanceTests, measurePerformance, checkBudget, PERFORMANCE_BUDGETS };
export type { PerformanceMetrics, PerformanceReport };
