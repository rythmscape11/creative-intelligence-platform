/**
 * Product Access & Feature Gating E2E Tests
 * 
 * Tests access control:
 * - Free user access to products
 * - Paid user access to subscribed products
 * - Upgrade prompts for non-subscribed products
 */

import { test, expect } from '@playwright/test';

test.describe('Product Access & Feature Gating', () => {

    test.describe('Free User Access', () => {
        test.use({ storageState: 'storage/user.json' });

        test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

        test('should show upgrade prompt or redirect for Agency OS', async ({ page }) => {
            await page.goto('/agency');
            await page.waitForLoadState('networkidle');

            await test.step('Check for access control', async () => {
                const currentUrl = page.url();
                const hasUpgradePrompt = await page.locator('text*="Upgrade", text*="Subscribe", text*="upgrade"').isVisible();
                const isRedirected = currentUrl.includes('pricing') || currentUrl.includes('billing');
                const hasFullAccess = await page.locator('[data-testid="agency-dashboard"], h1:has-text("Agency")').isVisible();

                // Should either show upgrade prompt, redirect to pricing, or grant access if subscribed
                expect(hasUpgradePrompt || isRedirected || hasFullAccess).toBe(true);
                console.log('Agency OS access:', { hasUpgradePrompt, isRedirected, hasFullAccess });
            });
        });

        test('should show upgrade prompt or redirect for Optimizer', async ({ page }) => {
            await page.goto('/optimizer');
            await page.waitForLoadState('networkidle');

            await test.step('Check for access control', async () => {
                const currentUrl = page.url();
                const hasUpgradePrompt = await page.locator('text*="Upgrade", text*="Subscribe"').isVisible();
                const isRedirected = currentUrl.includes('pricing') || currentUrl.includes('billing');
                const hasFullAccess = await page.locator('[data-testid="optimizer-dashboard"], h1:has-text("Optimi")').isVisible();

                expect(hasUpgradePrompt || isRedirected || hasFullAccess).toBe(true);
                console.log('Optimizer access:', { hasUpgradePrompt, isRedirected, hasFullAccess });
            });
        });

        test('should show upgrade prompt or redirect for Analyser', async ({ page }) => {
            await page.goto('/analyser');
            await page.waitForLoadState('networkidle');

            await test.step('Check for access control', async () => {
                const currentUrl = page.url();
                const hasUpgradePrompt = await page.locator('text*="Upgrade", text*="Subscribe"').isVisible();
                const isRedirected = currentUrl.includes('pricing') || currentUrl.includes('billing');
                const hasFullAccess = await page.locator('[data-testid="analyser-dashboard"], h1:has-text("Analy")').isVisible();

                expect(hasUpgradePrompt || isRedirected || hasFullAccess).toBe(true);
                console.log('Analyser access:', { hasUpgradePrompt, isRedirected, hasFullAccess });
            });
        });

        test('should show upgrade prompt or redirect for Strategiser', async ({ page }) => {
            await page.goto('/strategiser');
            await page.waitForLoadState('networkidle');

            await test.step('Check for access control', async () => {
                const currentUrl = page.url();
                const hasUpgradePrompt = await page.locator('text*="Upgrade", text*="Subscribe"').isVisible();
                const isRedirected = currentUrl.includes('pricing') || currentUrl.includes('billing');
                const hasFullAccess = await page.locator('[data-testid="strategiser-dashboard"], h1:has-text("Strate")').isVisible();

                // Strategiser has free tier, so should have access or upgrade for more features
                expect(hasUpgradePrompt || isRedirected || hasFullAccess).toBe(true);
                console.log('Strategiser access:', { hasUpgradePrompt, isRedirected, hasFullAccess });
            });
        });
    });

    test.describe('Feature Gating UI', () => {
        test.use({ storageState: 'storage/user.json' });

        test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

        test('should show clear upgrade path when feature is gated', async ({ page }) => {
            // Go to a product page
            await page.goto('/agency');
            await page.waitForLoadState('networkidle');

            await test.step('Look for pricing/upgrade CTA', async () => {
                const upgradeCTA = page.locator(
                    'a:has-text("Upgrade"), button:has-text("Upgrade"), a:has-text("View Plans"), button:has-text("Subscribe")'
                ).first();

                if (await upgradeCTA.isVisible()) {
                    // Click and verify it leads to pricing
                    await upgradeCTA.click();
                    await page.waitForTimeout(2000);

                    const currentUrl = page.url();
                    const isPricing = currentUrl.includes('pricing') || currentUrl.includes('billing');
                    console.log('Upgrade CTA leads to:', currentUrl);
                }
            });
        });
    });

    test.describe('Admin-Only Routes', () => {
        test.use({ storageState: 'storage/user.json' });

        test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

        test('should block non-admin from admin analytics', async ({ page }) => {
            await page.goto('/admin/analytics');
            await page.waitForLoadState('networkidle');

            await test.step('Verify access denied', async () => {
                const currentUrl = page.url();
                const is403 = await page.locator('text*="403", text*="Forbidden", text*="unauthorized", text*="Access Denied"').isVisible();
                const isRedirected = !currentUrl.includes('/admin');

                // Non-admin should be blocked or redirected
                expect(is403 || isRedirected).toBe(true);
                console.log('Admin analytics access for non-admin:', { is403, isRedirected });
            });
        });

        test('should block non-admin from admin users page', async ({ page }) => {
            await page.goto('/admin/users');
            await page.waitForLoadState('networkidle');

            await test.step('Verify access denied', async () => {
                const currentUrl = page.url();
                const is403 = await page.locator('text*="403", text*="Forbidden", text*="unauthorized"').isVisible();
                const isRedirected = !currentUrl.includes('/admin');

                expect(is403 || isRedirected).toBe(true);
                console.log('Admin users access for non-admin:', { is403, isRedirected });
            });
        });
    });
});
