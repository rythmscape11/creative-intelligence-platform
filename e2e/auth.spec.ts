/**
 * Authentication E2E Tests
 * 
 * Tests authentication flows:
 * - Anonymous user sign-in navigation
 * - User login with credentials
 * - Sign out flow
 * - Protected route redirects
 */

import { test, expect } from '@playwright/test';
import { AUTH_URLS, isLoggedIn } from './utils/auth';

test.describe('Authentication Flows', () => {

    test.describe('Anonymous User', () => {

        test('should navigate to sign-in page from home', async ({ page }) => {
            await test.step('Visit homepage', async () => {
                await page.goto('/');
                await expect(page).toHaveTitle(/MediaPlanPro/i);
            });

            await test.step('Click Sign In button', async () => {
                const signInButton = page.locator('a:has-text("Sign In"), button:has-text("Sign In")').first();
                await signInButton.click();
            });

            await test.step('Reach Clerk sign-in page', async () => {
                // Should be on sign-in page or Clerk modal
                await expect(page).toHaveURL(/\/(auth\/signin|sign-in)/);
                // Look for email input
                const emailInput = page.locator('input[type="email"], input[name="identifier"]').first();
                await expect(emailInput).toBeVisible({ timeout: 10000 });
            });
        });

        test('should navigate to sign-up page via Get Started', async ({ page }) => {
            await page.goto('/');

            await test.step('Click Get Started CTA', async () => {
                const getStartedButton = page.locator('a:has-text("Get Started"), button:has-text("Get Started")').first();
                if (await getStartedButton.isVisible()) {
                    await getStartedButton.click();
                    await expect(page).toHaveURL(/\/(auth\/signup|sign-up|pricing)/);
                }
            });
        });

        test('should redirect protected routes to login when not authenticated', async ({ page }) => {
            const protectedRoutes = ['/dashboard', '/agency', '/optimizer', '/analyser', '/strategiser'];

            for (const route of protectedRoutes) {
                await test.step(`Check redirect for ${route}`, async () => {
                    await page.goto(route);
                    // Should redirect to auth or show unauthorized
                    const currentUrl = page.url();
                    const isRedirected = currentUrl.includes('/auth') ||
                        currentUrl.includes('/sign-in') ||
                        currentUrl.includes('unauthorized');
                    expect(isRedirected).toBe(true);
                });
            }
        });
    });

    test.describe('User Login', () => {
        // Skip if no test credentials
        test.skip(!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD,
            'Requires TEST_USER_EMAIL and TEST_USER_PASSWORD');

        test('should login with valid credentials', async ({ page }) => {
            await test.step('Navigate to sign-in', async () => {
                await page.goto('/auth/signin');
                await page.waitForLoadState('networkidle');
            });

            await test.step('Enter email', async () => {
                const emailInput = page.locator('input[type="email"], input[name="identifier"]').first();
                await emailInput.waitFor({ state: 'visible' });
                await emailInput.fill(process.env.TEST_USER_EMAIL!);
            });

            await test.step('Click continue', async () => {
                const continueBtn = page.locator('button:has-text("Continue"), button[type="submit"]').first();
                await continueBtn.click();
            });

            await test.step('Enter password', async () => {
                const passwordInput = page.locator('input[type="password"]').first();
                await passwordInput.waitFor({ state: 'visible' });
                await passwordInput.fill(process.env.TEST_USER_PASSWORD!);
            });

            await test.step('Submit login', async () => {
                const signInBtn = page.locator('button:has-text("Sign in"), button:has-text("Continue"), button[type="submit"]').first();
                await signInBtn.click();
            });

            await test.step('Verify redirect to authenticated area', async () => {
                await page.waitForURL(/\/(dashboard|billing|agency|optimizer|analyser|strategiser)/, {
                    timeout: 30000
                });
                expect(await isLoggedIn(page)).toBe(true);
            });
        });

        test('should show error for invalid credentials', async ({ page }) => {
            await page.goto('/auth/signin');

            await test.step('Enter invalid email', async () => {
                const emailInput = page.locator('input[type="email"], input[name="identifier"]').first();
                await emailInput.fill('invalid@notarealuser.com');
            });

            await test.step('Click continue', async () => {
                const continueBtn = page.locator('button:has-text("Continue"), button[type="submit"]').first();
                await continueBtn.click();
            });

            await test.step('Check for error message', async () => {
                // Either error message or password prompt (Clerk handles differently)
                const errorOrPassword = await Promise.race([
                    page.locator('text="Couldn\'t find your account"').waitFor({ timeout: 5000 }).then(() => 'error'),
                    page.locator('input[type="password"]').waitFor({ timeout: 5000 }).then(() => 'password'),
                ]).catch(() => 'unknown');

                // If password field appeared, enter wrong password
                if (errorOrPassword === 'password') {
                    const passwordInput = page.locator('input[type="password"]').first();
                    await passwordInput.fill('wrongpassword123');
                    const submitBtn = page.locator('button[type="submit"]').first();
                    await submitBtn.click();

                    // Now expect error
                    const errorMsg = page.locator('text="Password is incorrect"');
                    await expect(errorMsg).toBeVisible({ timeout: 10000 });
                }
            });
        });
    });

    test.describe('Sign Out Flow', () => {
        // Use authenticated state
        test.use({ storageState: 'storage/user.json' });

        test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user state');

        test('should sign out and redirect to home', async ({ page }) => {
            await test.step('Navigate to dashboard', async () => {
                await page.goto('/dashboard');
                await page.waitForLoadState('networkidle');
            });

            await test.step('Open user menu', async () => {
                // Look for user button/avatar
                const userMenu = page.locator('[data-testid="user-button"], [aria-label="Profile"], .user-button').first();
                if (await userMenu.isVisible()) {
                    await userMenu.click();
                }
            });

            await test.step('Click sign out', async () => {
                const signOutBtn = page.locator('button:has-text("Sign out"), button:has-text("Log out")').first();
                await signOutBtn.waitFor({ state: 'visible' });
                await signOutBtn.click();
            });

            await test.step('Verify redirect to home', async () => {
                await page.waitForURL('/');
                expect(await isLoggedIn(page)).toBe(false);
            });
        });
    });
});
