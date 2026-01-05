/**
 * Agency OS Feature Tests
 * Tests all Agency OS pages and functionality
 */

import { test, expect } from '@playwright/test';

// Agency OS pages (require auth - will test basic load)
const AGENCY_PAGES = [
    { path: '/agency', name: 'Dashboard' },
    { path: '/agency/clients', name: 'Clients' },
    { path: '/agency/projects', name: 'Projects' },
    { path: '/agency/tasks', name: 'Tasks Kanban' },
    { path: '/agency/campaigns', name: 'Campaigns' },
    { path: '/agency/ads', name: 'Ads Manager' },
    { path: '/agency/content-calendar', name: 'Content Calendar' },
    { path: '/agency/assets', name: 'Assets' },
    { path: '/agency/ai-studio', name: 'AI Studio' },
    { path: '/agency/analytics', name: 'Analytics' },
    { path: '/agency/notifications', name: 'Notifications' },
    { path: '/agency/reports', name: 'Reports' },
    { path: '/agency/settings', name: 'Settings' },
    { path: '/agency/time-tracker', name: 'Time Tracker' },
];

test.describe('Agency OS Pages', () => {
    for (const page of AGENCY_PAGES) {
        test(`${page.name} page accessible`, async ({ page: browserPage }) => {
            const response = await browserPage.goto(page.path, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            // Should either load (200) or redirect to sign-in (307/302)
            const status = response?.status();
            expect(status).toBeDefined();
            expect([200, 302, 307, 308]).toContain(status);

            // Page should not be blank
            const bodyContent = await browserPage.textContent('body');
            expect(bodyContent).toBeTruthy();
        });
    }
});

// API Health Checks
test.describe('API Health Checks', () => {
    test('Agency Tasks API responds', async ({ request }) => {
        const response = await request.get('/api/agency/tasks');
        // Should return 401 (unauthorized) or 200
        expect([200, 401]).toContain(response.status());
    });

    test('Agency Notifications API responds', async ({ request }) => {
        const response = await request.get('/api/agency/notifications');
        expect([200, 401]).toContain(response.status());
    });

    test('Agency Ads API responds', async ({ request }) => {
        const response = await request.get('/api/agency/ads');
        expect([200, 401]).toContain(response.status());
    });

    test('Google Ads Integration API responds', async ({ request }) => {
        const response = await request.get('/api/agency/ads/google');
        expect([200, 401]).toContain(response.status());
    });

    test('Meta Ads Integration API responds', async ({ request }) => {
        const response = await request.get('/api/agency/ads/meta');
        expect([200, 401]).toContain(response.status());
    });
});

// Performance checks
test.describe('Performance', () => {
    test('Homepage loads within 5 seconds', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(5000);
        console.log(`Homepage load time: ${loadTime}ms`);
    });

    test('Pricing page loads within 5 seconds', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(5000);
        console.log(`Pricing page load time: ${loadTime}ms`);
    });
});
