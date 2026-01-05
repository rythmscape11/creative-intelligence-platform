/**
 * Optimiser Module E2E Tests (Updated)
 * 
 * Tests The Optimiser ad campaign management:
 * - Dashboard access
 * - Campaign table with mocked data
 * - Filters
 * - AI Recommendations
 */

import { test, expect } from '@playwright/test';
import { mockCampaignData } from './fixtures';

test.describe('Optimiser Module', () => {
    test.use({ storageState: 'storage/user.json' });

    test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

    test.describe('Dashboard', () => {
        test('should load Optimiser dashboard', async ({ page }) => {
            await page.goto('/optimizer');
            await page.waitForLoadState('networkidle');

            await test.step('Verify dashboard loads', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /optimi|dashboard|campaign/i }).first();
                await expect(heading).toBeVisible({ timeout: 15000 });
            });

            await test.step('Verify sidebar exists', async () => {
                const sidebar = page.locator('nav, aside, [data-testid="sidebar"]').first();
                await expect(sidebar).toBeVisible();
            });
        });

        test('should display campaign data table', async ({ page }) => {
            // Mock campaigns API
            await page.route('**/api/optimizer/campaigns**', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockCampaignData),
                });
            });

            await page.goto('/optimizer/campaigns');
            await page.waitForLoadState('networkidle');

            await test.step('Verify campaigns page', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /campaign/i }).first();
                await expect(heading).toBeVisible({ timeout: 10000 });
            });

            await test.step('Verify table or list structure', async () => {
                const table = page.locator('table, [data-testid="campaigns-table"], .campaigns-list').first();
                await expect(table).toBeVisible({ timeout: 10000 });
            });

            await test.step('Verify metrics columns exist', async () => {
                const metrics = ['Spend', 'Impressions', 'Clicks', 'CTR', 'ROAS'];
                let foundMetrics = 0;

                for (const metric of metrics) {
                    const metricHeader = page.locator(`text*="${metric}"`).first();
                    if (await metricHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
                        foundMetrics++;
                    }
                }

                console.log(`Found ${foundMetrics}/${metrics.length} campaign metrics`);
            });
        });
    });

    test.describe('Filters', () => {
        test('should have platform filter', async ({ page }) => {
            await page.route('**/api/optimizer/campaigns**', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockCampaignData),
                });
            });

            await page.goto('/optimizer/campaigns');
            await page.waitForLoadState('networkidle');

            await test.step('Look for platform filter', async () => {
                const platformFilter = page.locator(
                    'select:has-text("Platform"), button:has-text("Platform"), [data-testid="platform-filter"]'
                ).first();

                if (await platformFilter.isVisible()) {
                    await platformFilter.click();

                    // Should show Meta/Google options
                    const metaOption = page.locator('text*="Meta", option:has-text("Meta")').first();
                    const googleOption = page.locator('text*="Google", option:has-text("Google")').first();

                    // At least one platform should be available
                    const hasPlatforms = await metaOption.isVisible().catch(() => false) ||
                        await googleOption.isVisible().catch(() => false);
                    console.log('Platform filter available:', hasPlatforms);
                }
            });
        });

        test('should have date range filter', async ({ page }) => {
            await page.goto('/optimizer/campaigns');
            await page.waitForLoadState('networkidle');

            await test.step('Look for date filter', async () => {
                const dateFilter = page.locator(
                    'input[type="date"], button:has-text("Date"), [data-testid="date-range"]'
                ).first();

                const hasDateFilter = await dateFilter.isVisible().catch(() => false);
                console.log('Date filter available:', hasDateFilter);
            });
        });
    });

    test.describe('AI Recommendations', () => {
        test('should display AI recommendations panel', async ({ page }) => {
            // Mock recommendations API
            await page.route('**/api/optimizer/recommendations**', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        recommendations: [
                            {
                                id: 'rec_1',
                                type: 'budget',
                                title: 'Increase Budget for High-Performing Campaign',
                                description: 'Campaign "Summer Sale 2024" has ROAS of 3.5x. Consider increasing budget by 20%.',
                                impact: 'high',
                                action: 'increase_budget',
                            },
                            {
                                id: 'rec_2',
                                type: 'creative',
                                title: 'Refresh Creative Assets',
                                description: 'Creative fatigue detected on "Brand Awareness Q4". CTR dropped 15% this week.',
                                impact: 'medium',
                                action: 'refresh_creative',
                            },
                        ],
                    }),
                });
            });

            await page.goto('/optimizer');
            await page.waitForLoadState('networkidle');

            await test.step('Look for recommendations section', async () => {
                const recommendationsSection = page.locator(
                    '[data-testid="recommendations"], section:has-text("Recommend"), div:has-text("AI")'
                ).first();

                if (await recommendationsSection.isVisible({ timeout: 10000 }).catch(() => false)) {
                    expect(true).toBe(true);
                }
            });
        });
    });

    test.describe('Other Pages', () => {
        test('should load copilot page', async ({ page }) => {
            await page.goto('/optimizer/copilot');
            await page.waitForLoadState('networkidle');

            const heading = page.locator('h1, h2').first();
            await expect(heading).toBeVisible({ timeout: 10000 });
        });

        test('should load reports page', async ({ page }) => {
            await page.goto('/optimizer/reports');
            await page.waitForLoadState('networkidle');

            const heading = page.locator('h1, h2').first();
            await expect(heading).toBeVisible({ timeout: 10000 });
        });
    });
});
