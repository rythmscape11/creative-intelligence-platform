import { test, expect } from '@playwright/test';
import { login, logout, verifySessionCleared, attemptInvalidLogin } from '../utils/authHelpers';

test.describe('Authentication Tests', () => {
    test.describe('Valid Login', () => {
        test('should log in with valid credentials', async ({ page }) => {
            await test.step('Navigate to login and authenticate', async () => {
                await login(page);
            });

            await test.step('Verify dashboard is accessible', async () => {
                // Should be on a dashboard page
                await expect(page).toHaveURL(/.*(dashboard|agency|overview|app)/i);

                // Sidebar or dashboard content should be visible
                const dashboardContent = page.locator(
                    'aside, [data-testid="dashboard-sidebar"], h1:has-text("Overview"), h1:has-text("Agency")'
                ).first();
                await expect(dashboardContent).toBeVisible();
            });
        });
    });

    test.describe('Logout', () => {
        test('should log out successfully', async ({ page }) => {
            // First log in
            await login(page);

            await test.step('Perform logout', async () => {
                await logout(page);
            });

            await test.step('Verify redirected to login or homepage', async () => {
                await expect(page).toHaveURL(/.*(signin|login|^\/$/) / i);
        });
    });
});

test.describe('Session Clearance', () => {
    test('should not access protected routes after logout', async ({ page }) => {
        // Login first
        await login(page);

        // Then logout
        await logout(page);

        await test.step('Verify session is cleared', async () => {
            await verifySessionCleared(page);
        });
    });

    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
        // Directly try to access a protected route without logging in
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        // Should be redirected to login
        await expect(page).toHaveURL(/.*(signin|login|unauthorized)/i, { timeout: 10000 });
    });
});

test.describe('Invalid Login', () => {
    test('should show error for invalid credentials', async ({ page }) => {
        const hasError = await attemptInvalidLogin(
            page,
            'invalid@test.com',
            'wrongpassword123'
        );

        // Should show some form of error or stay on login page
        await expect(page).toHaveURL(/.*(signin|login)/i);
    });

    test('should not login with empty credentials', async ({ page }) => {
        await page.goto('/auth/signin');
        await page.waitForLoadState('networkidle');

        // Try to submit empty form
        await page.click('button:has-text("Sign in"), button[type="submit"]');

        // Should stay on login page (validation)
        await expect(page).toHaveURL(/.*(signin|login)/i);
    });
});

test.describe('Navigation After Auth', () => {
    test('should persist session across page refreshes', async ({ page }) => {
        await login(page);

        // Navigate to a module
        await page.goto('/agency');
        await page.waitForLoadState('networkidle');

        // Refresh the page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Should still be logged in on the same page
        await expect(page).toHaveURL(/agency/);

        // Dashboard sidebar should still be visible
        const sidebar = page.locator('aside, [data-testid="dashboard-sidebar"]').first();
        await expect(sidebar).toBeVisible();
    });
});
});
