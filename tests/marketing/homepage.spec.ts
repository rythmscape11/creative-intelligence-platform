import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should load homepage with correct branding', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/Aureon One/i);
    });

    test('should display orbit logo in navigation', async ({ page }) => {
        // Check for Aureon One logo in header
        const logo = page.locator('header img[alt*="Aureon"], header a:has-text("Aureon One")').first();
        await expect(logo).toBeVisible();
    });

    test('should display hero section with tagline', async ({ page }) => {
        // Check for H1 with Aureon One branding
        const heroTitle = page.locator('h1').first();
        await expect(heroTitle).toContainText(/Aureon One|Illuminate Your Marketing/i);

        // Check for tagline
        const tagline = page.locator('text=Illuminate Your Marketing');
        await expect(tagline).toBeVisible();
    });

    test('should have working "Start free workspace" CTA', async ({ page }) => {
        // Find and click the primary CTA
        const ctaButton = page.locator('a:has-text("Start free"), button:has-text("Start free")').first();
        await expect(ctaButton).toBeVisible();

        // Get the href before clicking
        const href = await ctaButton.getAttribute('href');
        expect(href).toMatch(/signup|sign-up|register/i);

        // Click and verify navigation
        await ctaButton.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/signup|sign-up|register|auth/i);
    });

    test('should display product suite section with all modules', async ({ page }) => {
        // Check for product suite section
        const moduleNames = ['Agency OS', 'Optimiser', 'Analyser', 'GEO Engine', 'Strategiser'];

        for (const moduleName of moduleNames) {
            const moduleCard = page.locator(`text=${moduleName}`).first();
            await expect(moduleCard).toBeVisible();
        }
    });

    test('should have visible footer', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
        // Check main nav links exist
        const navLinks = ['Product', 'Solutions', 'Pricing', 'About'];

        for (const linkText of navLinks) {
            const link = page.locator(`header a:has-text("${linkText}"), nav a:has-text("${linkText}")`).first();
            await expect(link).toBeVisible();
        }
    });
});
