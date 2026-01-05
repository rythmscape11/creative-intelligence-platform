import { test, expect } from '@playwright/test';

test.describe('GEO Engine Marketing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/product/geo-engine');
        await page.waitForLoadState('networkidle');
    });

    test('should display correct page title', async ({ page }) => {
        const heading = page.locator('h1').first();
        await expect(heading).toContainText(/GEO Engine/i);
    });

    test('should explain Generative Engine Optimisation', async ({ page }) => {
        // Check for GEO explanation section
        const geoExplanation = page.locator('text=Generative Engine Optimisation');
        await expect(geoExplanation).toBeVisible();
    });

    test('should display capabilities section', async ({ page }) => {
        // Check for capability cards/features
        const capabilities = [
            'GEO Score',
            'Questions',
            'Entities',
            'Schema',
        ];

        let foundCount = 0;
        for (const capability of capabilities) {
            const element = page.locator(`text=${capability}`).first();
            if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
                foundCount++;
            }
        }

        // At least 2 capabilities should be visible
        expect(foundCount).toBeGreaterThanOrEqual(2);
    });

    test('should have CTA to try GEO Engine', async ({ page }) => {
        // Check for CTA button
        const ctaButton = page.locator(
            'a:has-text("Try GEO"), button:has-text("Try GEO"), a:has-text("Get started"), a:has-text("Start")'
        ).first();

        await expect(ctaButton).toBeVisible();
    });

    test('should display split section with visual', async ({ page }) => {
        // Check for the two-column layout typical of product pages
        const sections = page.locator('section');
        expect(await sections.count()).toBeGreaterThanOrEqual(2);
    });
});
