import { Page, expect } from '@playwright/test';

/**
 * Auth Helper Functions for Playwright Tests
 * 
 * Handles login and logout flows for the Aureon One application.
 */

/**
 * Logs in a user with test credentials from environment variables.
 * Waits for the dashboard to load to confirm successful login.
 */
export async function login(page: Page): Promise<void> {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
        throw new Error(
            'Missing test credentials. Set TEST_EMAIL and TEST_PASSWORD environment variables.'
        );
    }

    // Navigate to login page
    await page.goto('/auth/signin');
    await page.waitForLoadState('networkidle');

    // Fill in credentials
    await page.fill('input[type="email"], input[name="email"], #email', email);
    await page.fill('input[type="password"], input[name="password"], #password', password);

    // Click sign in button
    await page.click('button:has-text("Sign in"), button:has-text("Log in"), button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Assert login success by checking for dashboard elements
    // Wait for either sidebar or dashboard header to appear
    await expect(
        page.locator('[data-testid="dashboard-sidebar"], aside, .sidebar').first()
    ).toBeVisible({ timeout: 15000 }).catch(async () => {
        // Alternative: check for Overview text or dashboard page
        await expect(page.locator('text=Overview, text=Dashboard, text=Agency OS').first()).toBeVisible();
    });
}

/**
 * Logs out the current user.
 * Handles both sidebar and header-based sign out flows.
 */
export async function logout(page: Page): Promise<void> {
    try {
        // Try clicking user avatar/button first (Clerk UserButton)
        const userButton = page.locator('.cl-userButtonTrigger, [data-testid="user-button"], button:has(.avatar)').first();

        if (await userButton.isVisible({ timeout: 3000 })) {
            await userButton.click();
            await page.waitForTimeout(500);

            // Click sign out in the dropdown
            await page.click('button:has-text("Sign out"), button:has-text("Log out"), [data-testid="sign-out"]');
        } else {
            // Alternative: Look for sign out link in sidebar
            await page.click('text=Sign out, text=Log out, a[href*="signout"]');
        }
    } catch {
        // If above methods fail, try direct navigation to sign out route
        await page.goto('/auth/signout');
    }

    await page.waitForLoadState('networkidle');

    // Assert logout success - should be on login page or homepage
    await expect(page).toHaveURL(/\/(auth\/signin|login|$)/, { timeout: 10000 });
}

/**
 * Verifies that the session is properly cleared after logout.
 * Tries to access a protected route and expects redirect to login.
 */
export async function verifySessionCleared(page: Page): Promise<void> {
    // Try to access a protected route
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/(auth\/signin|login|unauthorized)/, { timeout: 10000 });
}

/**
 * Attempts login with invalid credentials.
 * Returns true if error message is displayed.
 */
export async function attemptInvalidLogin(page: Page, email: string, password: string): Promise<boolean> {
    await page.goto('/auth/signin');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"], input[name="email"], #email', email);
    await page.fill('input[type="password"], input[name="password"], #password', password);
    await page.click('button:has-text("Sign in"), button:has-text("Log in"), button[type="submit"]');

    await page.waitForTimeout(2000);

    // Check for error message
    const errorVisible = await page.locator(
        'text=Invalid, text=incorrect, text=wrong, text=error, [role="alert"], .error-message'
    ).first().isVisible({ timeout: 5000 }).catch(() => false);

    return errorVisible;
}
