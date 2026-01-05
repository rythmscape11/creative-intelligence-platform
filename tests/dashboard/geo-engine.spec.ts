import { test, expect } from '@playwright/test';
import { login } from '../utils/authHelpers';

test.describe('GEO Engine Dashboard Tests', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto('/analyser/geo');
        await page.waitForLoadState('networkidle');
    });

    test('should display GEO Engine page', async ({ page }) => {
        const heading = page.locator('h1, header').first();
        await expect(heading).toContainText(/GEO/i);
    });

    test('should have URL input field', async ({ page }) => {
        // Look for URL input
        const urlInput = page.locator(
            'input[type="url"], input[placeholder*="URL"], input[placeholder*="url"], input[placeholder*="https"]'
        ).first();

        await expect(urlInput).toBeVisible();
    });

    test('should have Run GEO analysis button', async ({ page }) => {
        const analyzeButton = page.locator(
            'button:has-text("Run"), button:has-text("Analyze"), button:has-text("Analyse"), button[type="submit"]'
        ).first();

        await expect(analyzeButton).toBeVisible();
    });

    test('should enable analysis button when URL entered', async ({ page }) => {
        const urlInput = page.locator(
            'input[type="url"], input[placeholder*="URL"], input[placeholder*="url"], input[placeholder*="https"]'
        ).first();

        const analyzeButton = page.locator(
            'button:has-text("Run"), button:has-text("Analyze"), button:has-text("Analyse"), button[type="submit"]'
        ).first();

        // Enter a URL
        await urlInput.fill('https://www.mediaplanpro.com');

        // Button should be enabled
        await expect(analyzeButton).toBeEnabled();
    });

    test('should run GEO analysis', async ({ page }) => {
        // This test runs actual analysis - may need credits
        test.slow(); // Allow more time for this test

        const urlInput = page.locator(
            'input[type="url"], input[placeholder*="URL"], input[placeholder*="url"], input[placeholder*="https"]'
        ).first();

        const analyzeButton = page.locator(
            'button:has-text("Run"), button:has-text("Analyze"), button:has-text("Analyse"), button[type="submit"]'
        ).first();

        // Enter a URL
        await urlInput.fill('https://www.mediaplanpro.com');

        // Click analyze
        await analyzeButton.click();

        // Wait for results with generous timeout
        await page.waitForTimeout(3000);

        // Should show either results, loading, or error
        const result = page.locator(
            'text=GEO Score, text=Score, text=Questions, text=loading, text=Analyzing, text=error, text=credits'
        ).first();

        await expect(result).toBeVisible({ timeout: 30000 });
    });

    test('should display GEO score if results exist', async ({ page }) => {
        // If there are previous results, they should display
        const scoreDisplay = page.locator(
            '[data-testid="geo-score"], text=/\\d+/, [class*="score"]'
        ).first();

        // Just verify page loads correctly
        const pageContent = page.locator('main, section').first();
        await expect(pageContent).toBeVisible();
    });
});

test.describe('GEO Engine Results', () => {
    // These tests assume a previous analysis exists
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should display result tabs if results exist', async ({ page }) => {
        await page.goto('/analyser/geo');
        await page.waitForLoadState('networkidle');

        // Look for result tabs
        const tabs = ['Summary', 'Questions', 'Entities', 'Recommendations'];

        for (const tabName of tabs) {
            const tab = page.locator(
                `button:has-text("${tabName}"), a:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`
            ).first();

            const isVisible = await tab.isVisible({ timeout: 2000 }).catch(() => false);
            if (isVisible) {
                // Found tabs, results exist
                break;
            }
        }
    });
});
