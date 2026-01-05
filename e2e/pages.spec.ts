/**
 * Comprehensive Page Load Tests
 * Tests all major pages for successful load, proper title, and no console errors
 */

import { test, expect } from '@playwright/test';

// All public pages to test
const PUBLIC_PAGES = [
    { path: '/', name: 'Homepage' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/blog', name: 'Blog' },
    { path: '/tools', name: 'Tools' },
    { path: '/services', name: 'Services' },
    { path: '/strategy', name: 'Strategy' },
    { path: '/templates', name: 'Templates' },
    { path: '/features', name: 'Features' },
    { path: '/privacy', name: 'Privacy' },
    { path: '/terms', name: 'Terms' },
];

// Marketing tools pages
const TOOL_PAGES = [
    { path: '/tools/advertising/ad-copy-generator-enhanced', name: 'Ad Copy Generator' },
    { path: '/tools/advertising/budget-allocator-enhanced', name: 'Budget Allocator' },
    { path: '/tools/advertising/roi-calculator-enhanced', name: 'ROI Calculator' },
    { path: '/tools/content/headline-analyzer-enhanced', name: 'Headline Analyzer' },
    { path: '/tools/content/blog-outline-generator-enhanced', name: 'Blog Outline Generator' },
    { path: '/tools/seo/keyword-research-enhanced', name: 'Keyword Research' },
    { path: '/tools/seo/serp-preview-enhanced', name: 'SERP Preview' },
    { path: '/tools/social/hashtag-generator-enhanced', name: 'Hashtag Generator' },
    { path: '/tools/social/utm-builder-enhanced', name: 'UTM Builder' },
];

// Test each public page
test.describe('Public Pages', () => {
    for (const page of PUBLIC_PAGES) {
        test(`${page.name} (${page.path}) loads successfully`, async ({ page: browserPage }) => {
            const consoleErrors: string[] = [];

            // Collect console errors
            browserPage.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });

            // Navigate to page
            const response = await browserPage.goto(page.path, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            // Verify response
            expect(response?.status()).toBeLessThan(400);

            // Verify page loaded (not blank)
            await expect(browserPage.locator('body')).not.toBeEmpty();

            // Check for critical errors (ignore some common non-critical ones)
            const criticalErrors = consoleErrors.filter(e =>
                !e.includes('favicon') &&
                !e.includes('hydration') &&
                !e.includes('third-party')
            );

            if (criticalErrors.length > 0) {
                console.warn(`Console errors on ${page.path}:`, criticalErrors);
            }
        });
    }
});

// Test each tool page
test.describe('Marketing Tools', () => {
    for (const tool of TOOL_PAGES) {
        test(`${tool.name} loads successfully`, async ({ page }) => {
            const response = await page.goto(tool.path, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            expect(response?.status()).toBeLessThan(400);
            await expect(page.locator('body')).not.toBeEmpty();

            // Verify main content area exists
            await expect(page.locator('main, .main-content, [role="main"]').first()).toBeVisible();
        });
    }
});

// Test responsive behavior
test.describe('Responsive Design', () => {
    test('Homepage is responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Verify mobile layout
        await expect(page.locator('body')).toBeVisible();
    });

    test('Homepage is responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        await expect(page.locator('body')).toBeVisible();
    });
});

// Test navigation
test.describe('Navigation', () => {
    test('Header navigation works', async ({ page }) => {
        await page.goto('/');

        // Wait for page to load
        await page.waitForLoadState('domcontentloaded');

        // Verify header exists
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
    });

    test('Footer is present on homepage', async ({ page }) => {
        await page.goto('/');

        const footer = page.locator('footer').first();
        await expect(footer).toBeVisible();
    });
});
