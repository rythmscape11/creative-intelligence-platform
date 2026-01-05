import { test, expect } from '@playwright/test';

test.describe('Product Pages Tests', () => {
    test('should load product overview page', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        // Check page title
        const heading = page.locator('h1').first();
        await expect(heading).toContainText(/Product|Suite/i);
    });

    test('should display all 5 module cards', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        const modules = [
            { name: 'Agency OS', url: '/product/agency-os' },
            { name: 'Optimiser', url: '/product/optimiser' },
            { name: 'Analyser', url: '/product/analyser' },
            { name: 'GEO Engine', url: '/product/geo-engine' },
            { name: 'Strategiser', url: '/product/strategiser' },
        ];

        for (const module of modules) {
            const moduleCard = page.locator(`text=${module.name}`).first();
            await expect(moduleCard).toBeVisible();
        }
    });

    test('should navigate to Agency OS product page', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        // Click Agency OS card
        await page.click('a:has-text("Agency OS")');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/agency-os/);
        await expect(page.locator('h1').first()).toContainText(/Agency OS/i);
    });

    test('should navigate to Optimiser product page', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        await page.click('a:has-text("Optimiser")');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/optimiser/);
        await expect(page.locator('h1').first()).toContainText(/Optimiser/i);
    });

    test('should navigate to Analyser product page', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        await page.click('a:has-text("Analyser")');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/analyser/);
        await expect(page.locator('h1').first()).toContainText(/Analyser/i);
    });

    test('should navigate to GEO Engine product page', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        await page.click('a:has-text("GEO Engine")');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/geo-engine/);
        await expect(page.locator('h1').first()).toContainText(/GEO Engine/i);
    });

    test('should navigate to Strategiser product page', async ({ page }) => {
        await page.goto('/product');
        await page.waitForLoadState('networkidle');

        await page.click('a:has-text("Strategiser")');
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/strategiser/);
        await expect(page.locator('h1').first()).toContainText(/Strategiser/i);
    });
});

test.describe('Individual Product Pages', () => {
    test('Agency OS page has correct content', async ({ page }) => {
        await page.goto('/product/agency-os');
        await page.waitForLoadState('networkidle');

        // Check for key sections
        await expect(page.locator('text=Client')).toBeVisible();
        await expect(page.locator('text=Project')).toBeVisible();
    });

    test('GEO Engine page has correct content', async ({ page }) => {
        await page.goto('/product/geo-engine');
        await page.waitForLoadState('networkidle');

        // Check for GEO-specific content
        await expect(page.locator('h1').first()).toContainText(/GEO Engine/i);
        await expect(page.locator('text=Generative Engine Optimisation')).toBeVisible();
    });
});
