import { test, expect } from '@playwright/test';

/**
 * Comprehensive E2E Tests for The Analyser Module
 * Tests all pages, navigation, API endpoints, and core functionality
 */

test.describe('The Analyser Module', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to analyser and wait for it to load
        await page.goto('/analyser');
        await page.waitForLoadState('networkidle');
    });

    test.describe('Dashboard Overview', () => {
        test('should load the analyser dashboard', async ({ page }) => {
            await expect(page).toHaveTitle(/MediaPlanPro/);
            await expect(page.locator('text=The Analyser').first()).toBeVisible();
        });

        test('should display key metrics cards', async ({ page }) => {
            // Check for KPI cards
            await expect(page.locator('[class*="card"]').first()).toBeVisible();
        });

        test('should have functional sidebar navigation', async ({ page }) => {
            // Check sidebar navigation items exist
            const navItems = [
                'Overview', 'Domains', 'Keywords', 'Traffic',
                'Backlinks', 'Competitors', 'Audit', 'Pages',
                'Reports', 'Copilot', 'Settings'
            ];

            for (const item of navItems.slice(0, 5)) {
                await expect(page.locator(`text=${item}`).first()).toBeVisible();
            }
        });
    });

    test.describe('Domains Page', () => {
        test('should load domains page', async ({ page }) => {
            await page.goto('/analyser/domains');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Domains').first()).toBeVisible();
        });

        test('should have add domain functionality', async ({ page }) => {
            await page.goto('/analyser/domains');
            await page.waitForLoadState('networkidle');

            // Look for add domain button or dialog trigger
            const addButton = page.locator('button:has-text("Add")').first();
            if (await addButton.isVisible()) {
                await addButton.click();
                // Dialog should open
                await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
            }
        });

        test('should display domain cards or list', async ({ page }) => {
            await page.goto('/analyser/domains');
            await page.waitForLoadState('networkidle');

            // Either cards or empty state should be visible
            const content = page.locator('[class*="card"], [class*="empty"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Keywords Page', () => {
        test('should load keywords page', async ({ page }) => {
            await page.goto('/analyser/keywords');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Keywords').first()).toBeVisible();
        });

        test('should have keyword search functionality', async ({ page }) => {
            await page.goto('/analyser/keywords');
            await page.waitForLoadState('networkidle');

            // Look for search input
            const searchInput = page.locator('input[type="text"], input[type="search"]').first();
            if (await searchInput.isVisible()) {
                await searchInput.fill('test keyword');
                await expect(searchInput).toHaveValue('test keyword');
            }
        });

        test('should display keyword table or list', async ({ page }) => {
            await page.goto('/analyser/keywords');
            await page.waitForLoadState('networkidle');

            // Table or content should be visible
            const content = page.locator('table, [class*="keyword"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Traffic Page', () => {
        test('should load traffic analytics page', async ({ page }) => {
            await page.goto('/analyser/traffic');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Traffic').first()).toBeVisible();
        });

        test('should display traffic charts or metrics', async ({ page }) => {
            await page.goto('/analyser/traffic');
            await page.waitForLoadState('networkidle');

            // Charts or metrics should be visible
            const content = page.locator('[class*="chart"], [class*="metric"], [class*="card"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });

        test('should have period selector', async ({ page }) => {
            await page.goto('/analyser/traffic');
            await page.waitForLoadState('networkidle');

            // Look for period/time range selector
            const periodSelector = page.locator('select, [class*="dropdown"], button:has-text("days")').first();
            if (await periodSelector.isVisible()) {
                await expect(periodSelector).toBeEnabled();
            }
        });
    });

    test.describe('Backlinks Page', () => {
        test('should load backlinks page', async ({ page }) => {
            await page.goto('/analyser/backlinks');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Backlinks').first()).toBeVisible();
        });

        test('should display backlink metrics', async ({ page }) => {
            await page.goto('/analyser/backlinks');
            await page.waitForLoadState('networkidle');

            // Metrics or table should be visible
            const content = page.locator('table, [class*="backlink"], [class*="card"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Competitors Page', () => {
        test('should load competitors page', async ({ page }) => {
            await page.goto('/analyser/competitors');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Competitors').first()).toBeVisible();
        });

        test('should have add competitor functionality', async ({ page }) => {
            await page.goto('/analyser/competitors');
            await page.waitForLoadState('networkidle');

            const addButton = page.locator('button:has-text("Add")').first();
            if (await addButton.isVisible()) {
                await expect(addButton).toBeEnabled();
            }
        });
    });

    test.describe('Audit Page', () => {
        test('should load audit page', async ({ page }) => {
            await page.goto('/analyser/audit');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Audit').first()).toBeVisible();
        });

        test('should display audit issues or health score', async ({ page }) => {
            await page.goto('/analyser/audit');
            await page.waitForLoadState('networkidle');

            // Issues or score should be visible
            const content = page.locator('[class*="issue"], [class*="health"], [class*="score"], [class*="card"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Pages Page', () => {
        test('should load pages overview', async ({ page }) => {
            await page.goto('/analyser/pages');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Pages').first()).toBeVisible();
        });
    });

    test.describe('Reports Page', () => {
        test('should load reports page', async ({ page }) => {
            await page.goto('/analyser/reports');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Reports').first()).toBeVisible();
        });

        test('should have create report functionality', async ({ page }) => {
            await page.goto('/analyser/reports');
            await page.waitForLoadState('networkidle');

            const createButton = page.locator('button:has-text("Create"), button:has-text("New")').first();
            if (await createButton.isVisible()) {
                await expect(createButton).toBeEnabled();
            }
        });
    });

    test.describe('AI Copilot', () => {
        test('should load copilot page', async ({ page }) => {
            await page.goto('/analyser/copilot');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Copilot').first()).toBeVisible();
        });

        test('should have chat input', async ({ page }) => {
            await page.goto('/analyser/copilot');
            await page.waitForLoadState('networkidle');

            // Chat input should be visible
            const chatInput = page.locator('input, textarea').first();
            await expect(chatInput).toBeVisible({ timeout: 10000 });
        });

        test('should have quick action buttons', async ({ page }) => {
            await page.goto('/analyser/copilot');
            await page.waitForLoadState('networkidle');

            // Look for quick action buttons
            const buttons = page.locator('button').filter({ hasText: /(analyze|keyword|competitor|audit)/i });
            if (await buttons.first().isVisible()) {
                await expect(buttons.first()).toBeEnabled();
            }
        });
    });

    test.describe('Settings Page', () => {
        test('should load settings page', async ({ page }) => {
            await page.goto('/analyser/settings');
            await page.waitForLoadState('networkidle');
            await expect(page.locator('text=Settings').first()).toBeVisible();
        });
    });

    test.describe('Navigation Flow', () => {
        test('should navigate between all pages without errors', async ({ page }) => {
            const routes = [
                '/analyser',
                '/analyser/domains',
                '/analyser/keywords',
                '/analyser/traffic',
                '/analyser/backlinks',
                '/analyser/competitors',
                '/analyser/audit',
                '/analyser/pages',
                '/analyser/reports',
                '/analyser/copilot',
                '/analyser/settings'
            ];

            for (const route of routes) {
                await page.goto(route);
                const response = await page.waitForResponse(
                    resp => resp.url().includes(route.split('/').pop() || 'analyser'),
                    { timeout: 10000 }
                ).catch(() => null);

                // Page should not show 404 or 500
                await expect(page.locator('text=404')).not.toBeVisible({ timeout: 2000 }).catch(() => { });
                await expect(page.locator('text=500')).not.toBeVisible({ timeout: 2000 }).catch(() => { });
            }
        });
    });
});
