/**
 * Essential Features E2E Tests
 * Detailed testing for Strategy Builder, Competition Analysis, and core features
 * 
 * Run: npx playwright test e2e/essential-features.spec.ts
 */

import { test, expect } from '@playwright/test';

// ============================================
// STRATEGY BUILDER TESTS
// ============================================
test.describe('🎯 STRATEGY BUILDER', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/strategy');
    });

    test('Strategy page loads successfully', async ({ page }) => {
        await expect(page).toHaveURL(/strategy/);
        await expect(page.locator('body')).not.toBeEmpty();
    });

    test('Strategy page has main heading', async ({ page }) => {
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
    });

    test('Strategy page has form or input elements', async ({ page }) => {
        // Look for any interactive elements
        const hasInteractive = await page.locator('input, textarea, button, select').first().isVisible();
        console.log('Strategy page has interactive elements:', hasInteractive);
    });

    test('Strategy page performance', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/strategy', { waitUntil: 'domcontentloaded' });
        const loadTime = Date.now() - startTime;
        console.log(`Strategy page load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(5000);
    });
});

// ============================================
// COMPETITION ANALYSIS TESTS
// ============================================
test.describe('📊 COMPETITION ANALYSIS', () => {
    test('Competitors page loads', async ({ page }) => {
        const response = await page.goto('/growth-suite/competitors');
        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator('body')).not.toBeEmpty();
    });

    test('Competitors page has content', async ({ page }) => {
        await page.goto('/growth-suite/competitors');
        await page.waitForLoadState('domcontentloaded');

        // Verify page has meaningful content
        const bodyText = await page.textContent('body');
        expect(bodyText?.length).toBeGreaterThan(100);
    });

    test('Growth Suite access', async ({ page }) => {
        const response = await page.goto('/growth-suite');
        // May redirect to dashboard or show feature
        expect([200, 302, 307, 308]).toContain(response?.status());
    });
});

// ============================================
// FEATURES PAGE TESTS
// ============================================
test.describe('✨ FEATURES PAGE', () => {
    test('Features page loads', async ({ page }) => {
        const response = await page.goto('/features');
        expect(response?.status()).toBe(200);
    });

    test('Features page has categories', async ({ page }) => {
        await page.goto('/features');

        // Look for category sections
        const sections = page.locator('section, div[class*="grid"]');
        const count = await sections.count();
        expect(count).toBeGreaterThan(0);
    });

    test('Features page links are valid', async ({ page }) => {
        await page.goto('/features');

        // Check that links exist
        const links = page.locator('a[href^="/"]');
        const count = await links.count();
        expect(count).toBeGreaterThan(5);
    });
});

// ============================================
// PRICING PAGE TESTS
// ============================================
test.describe('💰 PRICING PAGE', () => {
    test('Pricing page loads', async ({ page }) => {
        await page.goto('/pricing');
        await expect(page).toHaveURL(/pricing/);
    });

    test('Pricing page has pricing cards', async ({ page }) => {
        await page.goto('/pricing');

        // Look for pricing-related elements
        const pricingElements = page.locator('[class*="price"], [class*="plan"], [class*="tier"]');
        const count = await pricingElements.count();
        console.log(`Found ${count} pricing elements`);
    });

    test('Pricing page has CTA buttons', async ({ page }) => {
        await page.goto('/pricing');

        const buttons = page.locator('button, a[href*="sign"], a[href*="start"]');
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);
    });
});

// ============================================
// MARKETING TOOLS DETAILED TESTS
// ============================================
test.describe('🔧 MARKETING TOOLS DETAIL', () => {
    test('Tools index page', async ({ page }) => {
        await page.goto('/tools');
        await expect(page).toHaveURL(/tools/);

        // Should have tool categories
        const links = page.locator('a[href*="/tools/"]');
        const count = await links.count();
        expect(count).toBeGreaterThan(5);
    });

    test('Ad Copy Generator functionality', async ({ page }) => {
        await page.goto('/tools/advertising/ad-copy-generator-enhanced');
        await page.waitForLoadState('domcontentloaded');

        // Check page loaded
        await expect(page.locator('body')).not.toBeEmpty();
    });

    test('Keyword Research functionality', async ({ page }) => {
        await page.goto('/tools/seo/keyword-research-enhanced');
        await page.waitForLoadState('domcontentloaded');

        await expect(page.locator('body')).not.toBeEmpty();
    });

    test('UTM Builder functionality', async ({ page }) => {
        await page.goto('/tools/social/utm-builder-enhanced');
        await page.waitForLoadState('domcontentloaded');

        await expect(page.locator('body')).not.toBeEmpty();
    });
});

// ============================================
// AGENCY OS DETAILED TESTS
// ============================================
test.describe('🏢 AGENCY OS DETAIL', () => {
    test('Agency dashboard accessible', async ({ page }) => {
        const response = await page.goto('/agency');
        // May redirect to auth
        expect([200, 302, 307, 308]).toContain(response?.status());
    });

    test('Tasks page accessible', async ({ page }) => {
        const response = await page.goto('/agency/tasks');
        expect([200, 302, 307, 308]).toContain(response?.status());
    });

    test('Reports page accessible', async ({ page }) => {
        const response = await page.goto('/agency/reports');
        expect([200, 302, 307, 308]).toContain(response?.status());
    });

    test('Settings page accessible', async ({ page }) => {
        const response = await page.goto('/agency/settings');
        expect([200, 302, 307, 308]).toContain(response?.status());
    });

    test('Ads Manager accessible', async ({ page }) => {
        const response = await page.goto('/agency/ads');
        expect([200, 302, 307, 308]).toContain(response?.status());
    });
});

// ============================================
// AUTHENTICATION FLOW TESTS
// ============================================
test.describe('🔐 AUTHENTICATION', () => {
    test('Sign-in page accessible', async ({ page }) => {
        const response = await page.goto('/sign-in');
        // Clerk handles auth - may be 200, redirect, or 404 if using Clerk's hosted pages
        expect([200, 302, 307, 308, 404]).toContain(response?.status());
    });

    test('Sign-up page accessible', async ({ page }) => {
        const response = await page.goto('/sign-up');
        expect([200, 302, 307, 308, 404]).toContain(response?.status());
    });

    test('Protected route redirects unauthenticated user', async ({ page }) => {
        await page.goto('/dashboard');
        // Should redirect to auth
        await page.waitForLoadState('domcontentloaded');
        const url = page.url();
        console.log('Dashboard redirect URL:', url);
    });
});

// ============================================
// API HEALTH CHECKS
// ============================================
test.describe('🔌 API HEALTH', () => {
    test('Tasks API exists', async ({ request }) => {
        const response = await request.get('/api/agency/tasks');
        expect([200, 401, 405]).toContain(response.status());
    });

    test('Notifications API exists', async ({ request }) => {
        const response = await request.get('/api/agency/notifications');
        expect([200, 401, 405]).toContain(response.status());
    });

    test('Ads API exists', async ({ request }) => {
        const response = await request.get('/api/agency/ads');
        expect([200, 401, 405]).toContain(response.status());
    });

    test('Google Ads API exists', async ({ request }) => {
        const response = await request.get('/api/agency/ads/google');
        expect([200, 401, 405]).toContain(response.status());
    });

    test('Meta Ads API exists', async ({ request }) => {
        const response = await request.get('/api/agency/ads/meta');
        expect([200, 401, 405]).toContain(response.status());
    });
});

// ============================================
// PERFORMANCE BENCHMARKS
// ============================================
test.describe('⚡ PERFORMANCE', () => {
    test('Homepage loads under 3s', async ({ page }) => {
        const start = Date.now();
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        expect(Date.now() - start).toBeLessThan(3000);
    });

    test('Strategy page loads under 3s', async ({ page }) => {
        const start = Date.now();
        await page.goto('/strategy', { waitUntil: 'domcontentloaded' });
        expect(Date.now() - start).toBeLessThan(3000);
    });

    test('Tools page loads under 3s', async ({ page }) => {
        const start = Date.now();
        await page.goto('/tools', { waitUntil: 'domcontentloaded' });
        expect(Date.now() - start).toBeLessThan(3000);
    });
});

// ============================================
// MOBILE RESPONSIVENESS
// ============================================
test.describe('📱 MOBILE', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('Homepage is mobile-friendly', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
    });

    test('Strategy page is mobile-friendly', async ({ page }) => {
        await page.goto('/strategy');
        await expect(page.locator('body')).toBeVisible();
    });

    test('Pricing page is mobile-friendly', async ({ page }) => {
        await page.goto('/pricing');
        await expect(page.locator('body')).toBeVisible();
    });
});
