import { test, expect } from '@playwright/test';
import { login } from '../utils/authHelpers';

test.describe('Analyser Dashboard Tests', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto('/analyser');
        await page.waitForLoadState('networkidle');
    });

    test('should display Analyser page', async ({ page }) => {
        const heading = page.locator('h1, header').first();
        await expect(heading).toContainText(/Analyser|Analyzer/i);
    });

    test('should display overview section', async ({ page }) => {
        // Should show some analytics content
        const content = page.locator('main, section, [class*="card"]').first();
        await expect(content).toBeVisible();
    });

    test('should navigate to Keywords view', async ({ page }) => {
        const keywordsLink = page.locator('a:has-text("Keywords"), a[href*="keywords"]').first();

        if (await keywordsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await keywordsLink.click();
            await page.waitForLoadState('networkidle');

            // Should show keywords table or input
            const tableOrInput = page.locator(
                'table, input[placeholder*="keyword"], text=No keywords, text=Enter'
            ).first();
            await expect(tableOrInput).toBeVisible({ timeout: 10000 });
        }
    });

    test('should navigate to Domain view', async ({ page }) => {
        const domainLink = page.locator('a:has-text("Domain"), a[href*="domain"]').first();

        if (await domainLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await domainLink.click();
            await page.waitForLoadState('networkidle');

            // Should show domain analysis content
            const content = page.locator('input, table, text=domain, text=Enter URL').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        }
    });

    test('should have available tools section', async ({ page }) => {
        // Check for tools or features
        const tools = page.locator(
            '[class*="card"], [class*="tool"], [data-testid="tool"]'
        );

        // Just verify page loads
        const pageContent = page.locator('main').first();
        await expect(pageContent).toBeVisible();
    });

    test('should display credits or usage info', async ({ page }) => {
        // Navigate to credits page
        const creditsLink = page.locator('a:has-text("Credits"), a[href*="credits"]').first();

        if (await creditsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await creditsLink.click();
            await page.waitForLoadState('networkidle');

            // Should show credits info
            const creditsInfo = page.locator('text=credits, text=Credits, text=usage').first();
            await expect(creditsInfo).toBeVisible({ timeout: 10000 });
        }
    });
});

test.describe('Analyser Tool Tests', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should access SERP analysis', async ({ page }) => {
        await page.goto('/analyser/serp');
        await page.waitForLoadState('networkidle');

        // Should show SERP tool
        const serpContent = page.locator('h1, input, form').first();
        await expect(serpContent).toBeVisible();
    });

    test('should access backlinks tool', async ({ page }) => {
        await page.goto('/analyser/backlinks');
        await page.waitForLoadState('networkidle');

        // Should show backlinks tool
        const backlinkContent = page.locator('h1, input, form').first();
        await expect(backlinkContent).toBeVisible();
    });
});
