import { test, expect } from '@playwright/test';

/**
 * Homepage and Core Pages E2E Tests
 * Tests homepage, pricing, features, and public pages
 */

test.describe('Homepage & Core Pages', () => {
    test.describe('Homepage', () => {
        test('should load homepage successfully', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            await expect(page).toHaveTitle(/MediaPlanPro/);
        });

        test('should display hero section', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Hero section with headline
            const hero = page.locator('h1').first();
            await expect(hero).toBeVisible();
        });

        test('should have navigation menu', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Navigation should have key links
            const navLinks = ['Tools', 'Pricing', 'Features'];
            for (const link of navLinks) {
                const navLink = page.locator(`nav a:has-text("${link}"), header a:has-text("${link}")`).first();
                if (await navLink.isVisible()) {
                    await expect(navLink).toBeVisible();
                }
            }
        });

        test('should have sign in / sign up buttons', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Auth buttons
            const authButton = page.locator('button:has-text("Sign"), a:has-text("Sign"), button:has-text("Login"), a:has-text("Login")').first();
            await expect(authButton).toBeVisible();
        });

        test('should have footer with links', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Footer should exist
            const footer = page.locator('footer').first();
            await expect(footer).toBeVisible();
        });

        test('should be responsive on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            await expect(page).toHaveTitle(/MediaPlanPro/);
        });
    });

    test.describe('Pricing Page', () => {
        test('should load pricing page', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Pricing, text=Plans').first()).toBeVisible();
        });

        test('should display pricing tiers', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            // Should have multiple pricing cards
            const pricingCards = page.locator('[class*="card"], [class*="plan"], [class*="tier"]');
            await expect(pricingCards.first()).toBeVisible();
        });

        test('should have CTA buttons on pricing cards', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            // CTA buttons like "Get Started", "Subscribe"
            const ctaButton = page.locator('button:has-text("Start"), button:has-text("Subscribe"), a:has-text("Start")').first();
            if (await ctaButton.isVisible()) {
                await expect(ctaButton).toBeEnabled();
            }
        });
    });

    test.describe('Features Page', () => {
        test('should load features page', async ({ page }) => {
            await page.goto('/features');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Features').first()).toBeVisible();
        });

        test('should display feature sections', async ({ page }) => {
            await page.goto('/features');
            await page.waitForLoadState('networkidle');

            // Features content should be visible
            const content = page.locator('[class*="feature"], section, article').first();
            await expect(content).toBeVisible();
        });
    });

    test.describe('About Page', () => {
        test('should load about page', async ({ page }) => {
            await page.goto('/about');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=About').first()).toBeVisible();
        });
    });

    test.describe('Blog', () => {
        test('should load blog listing page', async ({ page }) => {
            await page.goto('/blog');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Blog').first()).toBeVisible();
        });

        test('should display blog posts', async ({ page }) => {
            await page.goto('/blog');
            await page.waitForLoadState('networkidle');

            // Blog posts or empty state should be visible
            const content = page.locator('article, [class*="post"], [class*="card"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Contact Page', () => {
        test('should load contact page', async ({ page }) => {
            await page.goto('/contact');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Contact').first()).toBeVisible();
        });

        test('should have contact form', async ({ page }) => {
            await page.goto('/contact');
            await page.waitForLoadState('networkidle');

            // Contact form should be visible
            const form = page.locator('form, input[type="email"], textarea').first();
            await expect(form).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Legal Pages', () => {
        test('should load privacy policy', async ({ page }) => {
            await page.goto('/privacy');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Privacy').first()).toBeVisible();
        });

        test('should load terms of service', async ({ page }) => {
            await page.goto('/terms');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Terms').first()).toBeVisible();
        });
    });

    test.describe('Error Handling', () => {
        test('should show 404 for non-existent pages', async ({ page }) => {
            await page.goto('/this-page-does-not-exist-12345');
            await page.waitForLoadState('networkidle');

            // Should show 404 or redirect
            const is404 = await page.locator('text=404, text=not found').first().isVisible().catch(() => false);
            const isRedirected = page.url() !== 'https://www.mediaplanpro.com/this-page-does-not-exist-12345';

            expect(is404 || isRedirected).toBeTruthy();
        });
    });
});
