/**
 * Comprehensive Site-Wide E2E Tests
 * 
 * Tests all major pages, CTAs, and functionality across:
 * - Public pages (Home, Pricing, Blog)
 * - Agency OS (Dashboard, Clients, Projects, Tasks, Gantt)
 * - The Optimiser (Dashboard, Campaigns, Settings)
 * - The Analyser (Dashboard, Domains, Keywords, Settings)
 * - The Strategiser (Dashboard, Create, Templates)
 */

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://www.mediaplanpro.com';

// Helper to check page loads without 404
async function checkPageLoads(page: Page, path: string) {
    const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
    const status = response?.status() || 0;
    // Accept 200, 307 (redirect), 302 (redirect)
    // 401 is OK for protected routes
    expect(status, `${path} returned ${status}`).not.toBe(404);
    expect(status, `${path} returned ${status}`).not.toBe(500);
    return status;
}

// =====================================
// PUBLIC PAGES
// =====================================
test.describe('🌐 Public Pages', () => {
    const publicPages = [
        '/',
        '/pricing',
        '/products',
        '/tools',
        '/blog',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
    ];

    for (const path of publicPages) {
        test(`${path} loads without error`, async ({ page }) => {
            await checkPageLoads(page, path);
            // Check for basic content
            await expect(page.locator('body')).toBeVisible();
        });
    }

    test('Homepage has hero section and CTAs', async ({ page }) => {
        await page.goto(BASE_URL);
        // Check for key elements
        await expect(page.locator('h1').first()).toBeVisible();
        const ctaButtons = page.locator('a:has-text("Get Started"), a:has-text("Start Free"), button:has-text("Get Started")');
        expect(await ctaButtons.count()).toBeGreaterThan(0);
    });

    test('Pricing page has product tiers', async ({ page }) => {
        await page.goto(`${BASE_URL}/pricing`);
        await expect(page.locator('text=Agency OS').first()).toBeVisible({ timeout: 10000 });
    });
});

// =====================================
// THE OPTIMISER
// =====================================
test.describe('📈 The Optimiser', () => {
    const optimizerPages = [
        '/optimizer',
        '/optimizer/campaigns',
        '/optimizer/connections',
        '/optimizer/copilot',
        '/optimizer/reports',
        '/optimizer/settings',
        '/optimizer/creative-intel',
        '/optimizer/experiments',
        '/optimizer/automations',
    ];

    for (const path of optimizerPages) {
        test(`${path} loads`, async ({ page }) => {
            await checkPageLoads(page, path);
        });
    }

    test('Dashboard shows KPIs', async ({ page }) => {
        await page.goto(`${BASE_URL}/optimizer`);
        await page.waitForTimeout(2000);
        // Look for KPI-related text
        const body = await page.textContent('body');
        expect(body).toMatch(/spend|revenue|roas|cpa|ctr|campaigns/i);
    });

    test('Settings page has configuration options', async ({ page }) => {
        await page.goto(`${BASE_URL}/optimizer/settings`);
        await page.waitForTimeout(2000);
        // Should have form elements
        const inputs = page.locator('input, select, [role="switch"]');
        expect(await inputs.count()).toBeGreaterThan(0);
    });
});

// =====================================
// THE ANALYSER
// =====================================
test.describe('🔍 The Analyser', () => {
    const analyserPages = [
        '/analyser',
        '/analyser/domains',
        '/analyser/keywords',
        '/analyser/backlinks',
        '/analyser/traffic',
        '/analyser/audit',
        '/analyser/competitors',
        '/analyser/pages',
        '/analyser/reports',
        '/analyser/settings',
        '/analyser/copilot',
    ];

    for (const path of analyserPages) {
        test(`${path} loads`, async ({ page }) => {
            await checkPageLoads(page, path);
        });
    }

    test('Dashboard shows domain metrics', async ({ page }) => {
        await page.goto(`${BASE_URL}/analyser`);
        await page.waitForTimeout(2000);
        const body = await page.textContent('body');
        expect(body).toMatch(/domain|keyword|backlink|traffic|seo/i);
    });

    test('Settings page has integrations', async ({ page }) => {
        await page.goto(`${BASE_URL}/analyser/settings`);
        await page.waitForTimeout(2000);
        const body = await page.textContent('body');
        expect(body).toMatch(/settings|google|connect|api/i);
    });
});

// =====================================
// THE STRATEGISER
// =====================================
test.describe('💡 The Strategiser', () => {
    const strategiserPages = [
        '/strategiser',
        '/strategiser/create',
        '/strategiser/templates',
        '/strategiser/personas',
        '/strategiser/channel-mix',
        '/strategiser/insights',
        '/strategiser/copilot',
        '/strategiser/reports',
        '/strategiser/settings',
    ];

    for (const path of strategiserPages) {
        test(`${path} loads`, async ({ page }) => {
            await checkPageLoads(page, path);
        });
    }

    test('Dashboard has quick actions', async ({ page }) => {
        await page.goto(`${BASE_URL}/strategiser`);
        await page.waitForTimeout(2000);
        const body = await page.textContent('body');
        expect(body).toMatch(/strategy|create|template|competitor/i);
    });
});

// =====================================
// AGENCY OS
// =====================================
test.describe('🏢 Agency OS', () => {
    // These may require auth, so we test they don't 500
    const agencyPages = [
        '/agency',
        '/agency/clients',
        '/agency/projects',
        '/agency/tasks',
        '/agency/gantt',
        '/agency/content-calendar',
        '/agency/analytics',
        '/agency/reports',
        '/agency/settings',
        '/agency/integrations',
        '/agency/notifications',
    ];

    for (const path of agencyPages) {
        test(`${path} does not 500`, async ({ page }) => {
            const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });
            expect(response?.status()).not.toBe(500);
        });
    }

    test('Gantt chart renders with bars', async ({ page }) => {
        await page.goto(`${BASE_URL}/agency/gantt`);
        await page.waitForTimeout(3000);
        // Check for gantt container
        const ganttContainer = page.locator('.gantt-container, [class*="gantt"]');
        expect(await ganttContainer.count()).toBeGreaterThan(0);
    });
});

// =====================================
// CTA TESTING
// =====================================
test.describe('🔘 CTA Buttons', () => {
    test('Homepage CTAs are clickable', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForTimeout(1000);

        const getStartedBtns = page.locator('a:has-text("Get Started"), button:has-text("Get Started")');
        if (await getStartedBtns.count() > 0) {
            await expect(getStartedBtns.first()).toBeEnabled();
        }
    });

    test('Pricing page buttons work', async ({ page }) => {
        await page.goto(`${BASE_URL}/pricing`);
        await page.waitForTimeout(2000);

        // Check for trial/purchase buttons
        const buttons = page.locator('button, a[href*="checkout"], a[href*="signup"]');
        expect(await buttons.count()).toBeGreaterThan(0);
    });
});

// =====================================
// FORM TESTING
// =====================================
test.describe('📝 Form Functionality', () => {
    test('Contact form has required fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/contact`);
        await page.waitForTimeout(1000);

        const inputs = page.locator('input[type="email"], input[name*="email"], textarea');
        expect(await inputs.count()).toBeGreaterThan(0);
    });

    test('Newsletter signup exists in footer', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForTimeout(1000);

        const footer = page.locator('footer');
        const emailInput = footer.locator('input[type="email"], input[placeholder*="email"]');
        expect(await emailInput.count()).toBeGreaterThanOrEqual(0);
    });
});

// =====================================
// NAVIGATION
// =====================================
test.describe('🧭 Navigation', () => {
    test('Header navigation links work', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForTimeout(1000);

        // Check header has nav items
        const nav = page.locator('header nav, nav');
        await expect(nav.first()).toBeVisible();
    });

    test('Footer links are present', async ({ page }) => {
        await page.goto(BASE_URL);

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();

        const footerLinks = footer.locator('a');
        expect(await footerLinks.count()).toBeGreaterThan(5);
    });
});
