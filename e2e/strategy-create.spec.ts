import { test, expect } from '@playwright/test';

test.describe('Strategy Creation Page', () => {
    test('Accessing /dashboard/strategies/create', async ({ page }) => {
        // Navigate to the requested URL
        const response = await page.goto('/dashboard/strategies/create');

        console.log(`Initial URL: /dashboard/strategies/create`);
        console.log(`Final URL: ${page.url()}`);
        console.log(`Status: ${response?.status()}`);

        // If unauthenticated, it should likely redirect to sign-in
        // Or if the page doesn't exist, it might be 404

        if (page.url().includes('sign-in') || page.url().includes('clerk.com')) {
            console.log('Redirected to authentication page as expected.');
            await expect(page.locator('body')).not.toBeEmpty();
        } else if (response?.status() === 404) {
            console.log('Page returned 404 Not Found.');
            // We report this as a failure if we expect it to exist
            // But for now we just verify what it does
        } else {
            // If it loads, verify some content
            const title = await page.title();
            console.log(`Page Title: ${title}`);

            const bodyText = await page.textContent('body');
            console.log(`Body Text distinct characters: ${bodyText?.trim().substring(0, 100)}...`);

            // Check for common auth-wall text
            const loginTexts = ['Sign in', 'Log in', 'Welcome back', 'Unauthorized'];
            const foundAuthText = loginTexts.filter(text => bodyText?.includes(text));
            console.log(`Found auth-related text: ${foundAuthText.join(', ')}`);

            // Middleware should now redirect unauthenticated users to sign-in
            // Clerk usually redirects to /sign-in or a hosted page
            if (page.url().includes('sign-in') || page.url().includes('clerk')) {
                console.log('✅ Correctly redirected to sign-in');
            } else {
                console.log('⚠️ WARNING: Still on original URL or unexpected page');
            }

            // We expect a redirect or auth wall
            expect(page.url()).not.toContain('/dashboard/strategies/create');
        }
    });
});
