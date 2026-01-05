import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
    test('Home page loads correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/MediaPlanPro/);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('Tools page displays categories and tools', async ({ page }) => {
        await page.goto('/tools');
        await expect(page.getByText('Advertising')).toBeVisible();
        await expect(page.getByText('Ad Copy Generator')).toBeVisible();
    });

    test('Ad Copy Generator page has "How to Use" section', async ({ page }) => {
        await page.goto('/tools/advertising/ad-copy-generator-enhanced');

        // Check for main title
        await expect(page.getByRole('heading', { name: 'Ad Copy Generator' })).toBeVisible();

        // Check for "How to Use" section visibility
        // We look for the heading "How to Use This Tool" which is standard in our ToolLayout/Content
        const howToUseHeading = page.getByRole('heading', { name: 'How to Use This Tool' });
        await howToUseHeading.scrollIntoViewIfNeeded();
        await expect(howToUseHeading).toBeVisible();

        // Check for specific content in that section to ensure it's rendered
        await expect(page.getByText('Select your platform')).toBeVisible();
    });
});
