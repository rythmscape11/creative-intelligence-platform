/**
 * Navigation & Public Pages E2E Tests
 * 
 * Tests public page navigation:
 * - Home page elements
 * - Products pages
 * - Pricing page
 * - Header/footer links
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation & Public Pages', () => {

    test.describe('Home Page', () => {
        test('should load home page with key elements', async ({ page }) => {
            await page.goto('/');

            await test.step('Check page title', async () => {
                await expect(page).toHaveTitle(/MediaPlanPro/i);
            });

            await test.step('Verify hero section', async () => {
                const heroHeading = page.locator('h1').first();
                await expect(heroHeading).toBeVisible();
            });

            await test.step('Verify CTA buttons', async () => {
                const getStartedBtn = page.locator('a:has-text("Get Started"), button:has-text("Get Started")').first();
                await expect(getStartedBtn).toBeVisible();
            });

            await test.step('Verify navigation header', async () => {
                const header = page.locator('header, nav').first();
                await expect(header).toBeVisible();
            });
        });

        test('should have working header navigation links', async ({ page }) => {
            await page.goto('/');

            const headerLinks = [
                { text: 'Products', expectedUrl: /products/ },
                { text: 'Pricing', expectedUrl: /pricing/ },
                { text: 'Sign In', expectedUrl: /sign-in|auth/ },
            ];

            for (const link of headerLinks) {
                await test.step(`Check ${link.text} link`, async () => {
                    const linkElement = page.locator(`header a:has-text("${link.text}"), nav a:has-text("${link.text}")`).first();
                    if (await linkElement.isVisible()) {
                        const href = await linkElement.getAttribute('href');
                        expect(href).toBeTruthy();
                    }
                });
            }
        });
    });

    test.describe('Products Pages', () => {
        test('should load products index page', async ({ page }) => {
            await page.goto('/products');

            await test.step('Check page loads', async () => {
                await expect(page).toHaveURL(/products/);
                const response = await page.request.get('/products');
                expect(response.status()).toBe(200);
            });

            await test.step('Verify product cards/sections', async () => {
                // Should show all 4 products
                const productNames = ['Agency OS', 'Optimiser', 'Analyser', 'Strategiser'];
                for (const name of productNames) {
                    const productText = page.locator(`text="${name}"`).first();
                    await expect(productText).toBeVisible({ timeout: 10000 });
                }
            });
        });

        test('should load Agency OS product page', async ({ page }) => {
            await page.goto('/products/agency-os');

            await test.step('Verify hero section', async () => {
                const heroHeading = page.locator('h1').first();
                await expect(heroHeading).toBeVisible();
                await expect(heroHeading).toContainText(/Agency/i);
            });

            await test.step('Verify features section', async () => {
                const features = page.locator('section, div').filter({ hasText: /features|includes/i }).first();
                await expect(features).toBeVisible();
            });

            await test.step('Verify CTA buttons', async () => {
                const ctaBtn = page.locator('a:has-text("Start"), button:has-text("Start"), a:has-text("Get Started")').first();
                await expect(ctaBtn).toBeVisible();
            });
        });

        test('should load The Optimiser product page', async ({ page }) => {
            await page.goto('/products/the-optimiser');

            await test.step('Verify page content', async () => {
                const heroHeading = page.locator('h1').first();
                await expect(heroHeading).toBeVisible();
                await expect(heroHeading).toContainText(/Optimiser/i);
            });
        });

        test('should load The Analyser product page', async ({ page }) => {
            await page.goto('/products/the-analyser');

            await test.step('Verify page content', async () => {
                const heroHeading = page.locator('h1').first();
                await expect(heroHeading).toBeVisible();
                await expect(heroHeading).toContainText(/Analyser/i);
            });
        });

        test('should load The Strategiser product page', async ({ page }) => {
            await page.goto('/products/the-strategiser');

            await test.step('Verify page content', async () => {
                const heroHeading = page.locator('h1').first();
                await expect(heroHeading).toBeVisible();
                await expect(heroHeading).toContainText(/Strategi/i);
            });
        });
    });

    test.describe('Pricing Page', () => {
        test('should load pricing page with all sections', async ({ page }) => {
            await page.goto('/pricing');

            await test.step('Check page loads', async () => {
                await expect(page).toHaveURL(/pricing/);
                const response = await page.request.get('/pricing');
                expect(response.status()).toBe(200);
            });

            await test.step('Verify pricing heading', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /pricing/i }).first();
                await expect(heading).toBeVisible();
            });

            await test.step('Verify product tabs or sections', async () => {
                // Should have tabs or sections for each product
                const productNames = ['Agency', 'Optimiser', 'Analyser', 'Strategiser'];
                for (const name of productNames) {
                    const productSection = page.locator(`text="${name}"`).first();
                    await expect(productSection).toBeVisible({ timeout: 10000 });
                }
            });

            await test.step('Verify billing toggles', async () => {
                // Should have monthly/yearly toggle
                const monthlyOption = page.locator('text="Monthly"').first();
                const yearlyOption = page.locator('text="Yearly"').first();
                await expect(monthlyOption).toBeVisible();
                await expect(yearlyOption).toBeVisible();
            });
        });
    });

    test.describe('Footer Links', () => {
        test('should have valid footer links', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            await test.step('Find footer', async () => {
                const footer = page.locator('footer');
                await expect(footer).toBeVisible();
            });

            await test.step('Check important footer links exist', async () => {
                const footerLinks = [
                    { text: 'Privacy', selector: 'a:has-text("Privacy")' },
                    { text: 'Terms', selector: 'a:has-text("Terms")' },
                ];

                for (const link of footerLinks) {
                    const linkElement = page.locator(`footer ${link.selector}`).first();
                    if (await linkElement.isVisible()) {
                        const href = await linkElement.getAttribute('href');
                        expect(href).toBeTruthy();

                        // Quick check that link doesn't 404
                        if (href && href.startsWith('/')) {
                            const response = await page.request.get(href);
                            expect(response.status()).not.toBe(404);
                        }
                    }
                }
            });
        });
    });

    test.describe('Navigation Flow', () => {
        test('should navigate from Home → Products → Product Page → Pricing', async ({ page }) => {
            await test.step('Start at Home', async () => {
                await page.goto('/');
                await expect(page).toHaveURL('/');
            });

            await test.step('Navigate to Products', async () => {
                const productsLink = page.locator('a:has-text("Products")').first();
                await productsLink.click();
                await expect(page).toHaveURL(/products/);
            });

            await test.step('Navigate to a Product Page', async () => {
                const agencyLink = page.locator('a:has-text("Agency OS")').first();
                if (await agencyLink.isVisible()) {
                    await agencyLink.click();
                    await expect(page).toHaveURL(/agency/);
                }
            });

            await test.step('Navigate to Pricing', async () => {
                const pricingLink = page.locator('a:has-text("Pricing")').first();
                await pricingLink.click();
                await expect(page).toHaveURL(/pricing/);
            });
        });
    });
});
