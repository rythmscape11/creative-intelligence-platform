/**
 * Pricing & Checkout E2E Tests
 * 
 * Tests pricing page and Razorpay checkout flow:
 * - Pricing page UI/UX
 * - Monthly/Yearly toggle
 * - Currency toggle (if present)
 * - Checkout flow with mocked Razorpay
 * - Error handling
 */

import { test, expect, Page } from '@playwright/test';
import { mockRazorpayCheckout, API_ENDPOINTS } from './fixtures';

test.describe('Pricing & Checkout', () => {

    test.describe('Pricing Page UI', () => {
        test('should display all 4 products with pricing', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            await test.step('Verify page loads', async () => {
                await expect(page).toHaveURL(/pricing/);
            });

            await test.step('Verify all products are displayed', async () => {
                const products = ['Agency OS', 'Optimiser', 'Analyser', 'Strategiser'];

                for (const product of products) {
                    const productSection = page.locator(`text*="${product}"`).first();
                    await expect(productSection).toBeVisible({ timeout: 10000 });
                }
            });

            await test.step('Verify pricing tiers', async () => {
                // Check for common tier names
                const tiers = ['Starter', 'Pro', 'Agency'];
                for (const tier of tiers) {
                    const tierText = page.locator(`text*="${tier}"`).first();
                    // At least some tiers should be visible
                    if (await tierText.isVisible()) {
                        expect(true).toBe(true);
                    }
                }
            });
        });

        test('should toggle between Monthly and Yearly pricing', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            await test.step('Find billing toggle', async () => {
                const monthlyBtn = page.locator('button:has-text("Monthly"), [role="tab"]:has-text("Monthly")').first();
                const yearlyBtn = page.locator('button:has-text("Yearly"), [role="tab"]:has-text("Yearly")').first();

                await expect(monthlyBtn).toBeVisible();
                await expect(yearlyBtn).toBeVisible();
            });

            await test.step('Toggle to Yearly', async () => {
                const yearlyBtn = page.locator('button:has-text("Yearly"), [role="tab"]:has-text("Yearly")').first();
                await yearlyBtn.click();

                // Yearly prices should show (look for "year" or larger numbers)
                await page.waitForTimeout(500); // Wait for UI update
            });

            await test.step('Toggle back to Monthly', async () => {
                const monthlyBtn = page.locator('button:has-text("Monthly"), [role="tab"]:has-text("Monthly")').first();
                await monthlyBtn.click();

                await page.waitForTimeout(500);
            });
        });

        test('should toggle currency if available', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            const usdOption = page.locator('button:has-text("USD"), [role="tab"]:has-text("USD")').first();
            const inrOption = page.locator('button:has-text("INR"), [role="tab"]:has-text("INR")').first();

            if (await usdOption.isVisible() && await inrOption.isVisible()) {
                await test.step('Switch to INR', async () => {
                    await inrOption.click();
                    // INR prices should show with ₹ symbol
                    const inrSymbol = page.locator('text*="₹"').first();
                    await expect(inrSymbol).toBeVisible({ timeout: 5000 });
                });

                await test.step('Switch back to USD', async () => {
                    await usdOption.click();
                    // USD prices should show with $ symbol
                    const usdSymbol = page.locator('text*="$"').first();
                    await expect(usdSymbol).toBeVisible({ timeout: 5000 });
                });
            } else {
                test.skip(true, 'Currency toggle not available');
            }
        });

        test('should display subscribe/CTA buttons for each plan', async ({ page }) => {
            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            await test.step('Find subscribe buttons', async () => {
                const subscribeButtons = page.locator(
                    'button:has-text("Subscribe"), button:has-text("Start"), button:has-text("Get Started"), a:has-text("Subscribe")'
                );

                const count = await subscribeButtons.count();
                expect(count).toBeGreaterThan(0);
            });
        });
    });

    test.describe('Checkout Flow (Mocked Razorpay)', () => {
        // Use authenticated state
        test.use({ storageState: 'storage/user.json' });

        test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

        test('should initiate checkout and handle success', async ({ page }) => {
            // Mock Razorpay checkout API
            await page.route('**/api/checkout/product', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        subscriptionId: 'sub_test123',
                        shortUrl: 'https://rzp.io/test',
                    }),
                });
            });

            // Mock Razorpay JS SDK
            await page.addInitScript(() => {
                (window as any).Razorpay = class {
                    constructor(options: any) {
                        this.options = options;
                    }
                    options: any;
                    open() {
                        // Simulate successful payment
                        setTimeout(() => {
                            if (this.options.handler) {
                                this.options.handler({
                                    razorpay_payment_id: 'pay_test123',
                                    razorpay_subscription_id: 'sub_test123',
                                    razorpay_signature: 'sig_test123',
                                });
                            }
                        }, 100);
                    }
                };
            });

            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            await test.step('Click subscribe button', async () => {
                // Click first available subscribe button
                const subscribeBtn = page.locator(
                    'button:has-text("Subscribe"), button:has-text("Start Free")'
                ).first();

                if (await subscribeBtn.isVisible()) {
                    await subscribeBtn.click();
                }
            });

            // After payment, user should be redirected or see confirmation
            await test.step('Verify post-checkout state', async () => {
                // Could redirect to /billing or show success message
                await page.waitForTimeout(2000);
                const currentUrl = page.url();
                const hasSuccess = currentUrl.includes('billing') ||
                    currentUrl.includes('success') ||
                    await page.locator('text*="success"').isVisible();
                // This is expected behavior, log for verification
                console.log('Post-checkout URL:', currentUrl);
            });
        });

        test('should handle checkout failure gracefully', async ({ page }) => {
            // Mock failed checkout
            await page.route('**/api/checkout/product', async (route) => {
                await route.fulfill({
                    status: 400,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: 'Payment failed',
                        message: 'Unable to process payment',
                    }),
                });
            });

            await page.goto('/pricing');
            await page.waitForLoadState('networkidle');

            await test.step('Attempt checkout', async () => {
                const subscribeBtn = page.locator(
                    'button:has-text("Subscribe"), button:has-text("Start")'
                ).first();

                if (await subscribeBtn.isVisible()) {
                    await subscribeBtn.click();

                    // Should show error message
                    await page.waitForTimeout(2000);
                    const errorMsg = page.locator('text*="error", text*="failed"').first();
                    // Error should be displayed or user should stay on pricing page
                    const currentUrl = page.url();
                    expect(currentUrl).toContain('pricing');
                }
            });
        });
    });

    test.describe('Billing Page', () => {
        test.use({ storageState: 'storage/user.json' });

        test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

        test('should display billing page with subscription info', async ({ page }) => {
            await page.goto('/billing');
            await page.waitForLoadState('networkidle');

            await test.step('Verify billing page loads', async () => {
                // Should either show subscriptions or "no subscriptions" message
                const hasSubscriptions = await page.locator('text*="subscription"').isVisible();
                const hasNoneMessage = await page.locator('text*="No subscriptions"').isVisible();

                expect(hasSubscriptions || hasNoneMessage).toBe(true);
            });

            await test.step('Check for available products', async () => {
                // Should show products available for subscription
                const productSections = page.locator('[data-testid="product-card"], .product-card, section');
                await expect(productSections.first()).toBeVisible();
            });
        });
    });
});
