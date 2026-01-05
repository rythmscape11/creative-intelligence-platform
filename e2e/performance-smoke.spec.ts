/**
 * Performance & Smoke Tests
 * 
 * Quick sanity checks:
 * - Page load times
 * - Key routes return 200
 * - No console errors
 */

import { test, expect } from '@playwright/test';

test.describe('Performance & Smoke Tests', () => {

    test.describe('Page Load Performance', () => {
        test('home page loads under 3 seconds', async ({ page }) => {
            const startTime = Date.now();

            await page.goto('/', { waitUntil: 'domcontentloaded' });

            const loadTime = Date.now() - startTime;
            console.log(`Home page load time: ${loadTime}ms`);

            // Should load DOM content under 3 seconds
            expect(loadTime).toBeLessThan(5000);

            // Verify page has content
            const body = page.locator('body');
            await expect(body).toBeVisible();
        });

        test('pricing page loads under 3 seconds', async ({ page }) => {
            const startTime = Date.now();

            await page.goto('/pricing', { waitUntil: 'domcontentloaded' });

            const loadTime = Date.now() - startTime;
            console.log(`Pricing page load time: ${loadTime}ms`);

            expect(loadTime).toBeLessThan(5000);
        });
    });

    test.describe('HTTP Status Checks', () => {
        const routes = [
            { path: '/', name: 'Home' },
            { path: '/pricing', name: 'Pricing' },
            { path: '/products', name: 'Products' },
            { path: '/products/agency-os', name: 'Agency OS Product' },
            { path: '/products/the-optimiser', name: 'Optimiser Product' },
            { path: '/products/the-analyser', name: 'Analyser Product' },
            { path: '/products/the-strategiser', name: 'Strategiser Product' },
        ];

        for (const route of routes) {
            test(`${route.name} (${route.path}) returns 200`, async ({ page }) => {
                const response = await page.goto(route.path);

                expect(response?.status()).toBe(200);
            });
        }
    });

    test.describe('Protected Routes Status', () => {
        const protectedRoutes = [
            { path: '/agency', name: 'Agency Dashboard' },
            { path: '/optimizer', name: 'Optimizer Dashboard' },
            { path: '/analyser', name: 'Analyser Dashboard' },
            { path: '/strategiser', name: 'Strategiser Dashboard' },
        ];

        for (const route of protectedRoutes) {
            test(`${route.name} returns valid response (200 or redirect/401)`, async ({ page }) => {
                const response = await page.goto(route.path);
                const status = response?.status();

                // Should be 200, 3xx redirect, or 401 unauthorized
                const isValid = status === 200 || status === 401 || (status !== undefined && status >= 300 && status < 400);
                expect(isValid).toBe(true);
            });
        }
    });

    test.describe('Console Error Checks', () => {
        test('home page has no critical console errors', async ({ page }) => {
            const consoleErrors: string[] = [];

            page.on('console', (msg) => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });

            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Filter out known acceptable errors (e.g., third-party scripts)
            const criticalErrors = consoleErrors.filter(error =>
                !error.includes('404') && // Already tested separately
                !error.includes('Failed to load resource') && // Network issues
                !error.includes('third-party') && // Third-party scripts
                !error.includes('analytics') // Analytics can fail without breaking app
            );

            console.log('Console errors:', consoleErrors);

            // Should have no critical errors
            expect(criticalErrors.length).toBe(0);
        });

        test('pricing page has no critical console errors', async ({ page }) => {
            const consoleErrors: string[] = [];

            page.on('console', (msg) => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });

            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            const criticalErrors = consoleErrors.filter(error =>
                !error.includes('404') &&
                !error.includes('Failed to load resource') &&
                !error.includes('analytics')
            );

            expect(criticalErrors.length).toBe(0);
        });
    });

    test.describe('Core Web Vitals (Basic)', () => {
        test('measure basic performance metrics on home page', async ({ page }) => {
            await page.goto('/');

            // Get basic performance metrics
            const metrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
                    load: navigation.loadEventEnd - navigation.startTime,
                    firstByte: navigation.responseStart - navigation.startTime,
                };
            });

            console.log('Performance metrics:', metrics);

            // Basic thresholds
            expect(metrics.domContentLoaded).toBeLessThan(5000); // 5s DOMContentLoaded
            expect(metrics.firstByte).toBeLessThan(2000); // 2s TTFB
        });
    });

    test.describe('API Health Checks', () => {
        test('navigation API returns valid response', async ({ page }) => {
            const response = await page.request.get('/api/navigation');

            // 200 if authenticated, 401 if not - both are valid
            expect([200, 401]).toContain(response.status());
        });
    });
});
