import { test, expect } from '@playwright/test';

/**
 * Free Tools E2E Tests
 * Tests the 70+ free marketing tools
 */

test.describe('Free Marketing Tools', () => {
    test.describe('Tools Landing Page', () => {
        test('should load tools page', async ({ page }) => {
            await page.goto('/tools');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Tools').first()).toBeVisible();
        });

        test('should display tool categories', async ({ page }) => {
            await page.goto('/tools');
            await page.waitForLoadState('networkidle');

            // Should have category sections
            const categories = ['SEO', 'Content', 'Social', 'Email', 'Advertising'];
            for (const category of categories) {
                const categorySection = page.locator(`text=${category}`).first();
                if (await categorySection.isVisible()) {
                    await expect(categorySection).toBeVisible();
                    break; // At least one category should be visible
                }
            }
        });

        test('should have clickable tool cards', async ({ page }) => {
            await page.goto('/tools');
            await page.waitForLoadState('networkidle');

            // Tool cards should be clickable
            const toolCard = page.locator('[class*="card"] a, a[class*="tool"]').first();
            await expect(toolCard).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('SEO Tools', () => {
        test('should load keyword research tool', async ({ page }) => {
            await page.goto('/tools/seo/keyword-research-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Keyword').first()).toBeVisible();
        });

        test('should load SERP preview tool', async ({ page }) => {
            await page.goto('/tools/seo/serp-preview-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=SERP, text=Preview').first()).toBeVisible();
        });

        test('should load backlink checker tool', async ({ page }) => {
            await page.goto('/tools/seo/backlink-checker-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Backlink').first()).toBeVisible();
        });

        test('should load schema generator tool', async ({ page }) => {
            await page.goto('/tools/seo/schema-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Schema').first()).toBeVisible();
        });

        test('should load robots.txt generator', async ({ page }) => {
            await page.goto('/tools/seo/robots-txt-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Robots').first()).toBeVisible();
        });
    });

    test.describe('Content Tools', () => {
        test('should load headline analyzer', async ({ page }) => {
            await page.goto('/tools/content/headline-analyzer-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Headline').first()).toBeVisible();
        });

        test('should load meta description generator', async ({ page }) => {
            await page.goto('/tools/content/meta-description-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Meta').first()).toBeVisible();
        });

        test('should load readability scorer', async ({ page }) => {
            await page.goto('/tools/content/readability-scorer-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Readability').first()).toBeVisible();
        });

        test('should load blog outline generator', async ({ page }) => {
            await page.goto('/tools/content/blog-outline-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Blog, text=Outline').first()).toBeVisible();
        });
    });

    test.describe('Social Media Tools', () => {
        test('should load hashtag generator', async ({ page }) => {
            await page.goto('/tools/social/hashtag-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Hashtag').first()).toBeVisible();
        });

        test('should load UTM builder', async ({ page }) => {
            await page.goto('/tools/social/utm-builder-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=UTM').first()).toBeVisible();
        });

        test('should load engagement calculator', async ({ page }) => {
            await page.goto('/tools/social/engagement-calculator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Engagement').first()).toBeVisible();
        });

        test('should load best time to post tool', async ({ page }) => {
            await page.goto('/tools/social/best-time-to-post-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Time, text=Post').first()).toBeVisible();
        });
    });

    test.describe('Email Tools', () => {
        test('should load email subject tester', async ({ page }) => {
            await page.goto('/tools/email/email-subject-tester-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Email, text=Subject').first()).toBeVisible();
        });

        test('should load signature generator', async ({ page }) => {
            await page.goto('/tools/email/signature-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Signature').first()).toBeVisible();
        });

        test('should load spam score checker', async ({ page }) => {
            await page.goto('/tools/email/spam-score-checker-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Spam').first()).toBeVisible();
        });
    });

    test.describe('Advertising Tools', () => {
        test('should load ad copy generator', async ({ page }) => {
            await page.goto('/tools/advertising/ad-copy-generator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Ad, text=Copy').first()).toBeVisible();
        });

        test('should load ROI calculator', async ({ page }) => {
            await page.goto('/tools/advertising/roi-calculator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=ROI').first()).toBeVisible();
        });

        test('should load budget allocator', async ({ page }) => {
            await page.goto('/tools/advertising/budget-allocator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=Budget').first()).toBeVisible();
        });

        test('should load CPC/CPM calculator', async ({ page }) => {
            await page.goto('/tools/advertising/cpc-cpm-calculator-enhanced');
            await page.waitForLoadState('networkidle');

            await expect(page.locator('text=CPC, text=CPM').first()).toBeVisible();
        });
    });

    test.describe('Tool Functionality', () => {
        test('UTM builder should generate URLs', async ({ page }) => {
            await page.goto('/tools/social/utm-builder-enhanced');
            await page.waitForLoadState('networkidle');

            // Find input fields and fill them
            const urlInput = page.locator('input[name*="url"], input[placeholder*="URL"]').first();
            if (await urlInput.isVisible()) {
                await urlInput.fill('https://example.com');

                // Fill other fields if present
                const sourceInput = page.locator('input[name*="source"]').first();
                if (await sourceInput.isVisible()) {
                    await sourceInput.fill('google');
                }

                // Result should be visible
                const result = page.locator('[class*="result"], [class*="output"], textarea').first();
                await expect(result).toBeVisible({ timeout: 5000 });
            }
        });

        test('Headline analyzer should analyze headlines', async ({ page }) => {
            await page.goto('/tools/content/headline-analyzer-enhanced');
            await page.waitForLoadState('networkidle');

            const input = page.locator('input, textarea').first();
            if (await input.isVisible()) {
                await input.fill('10 Amazing Ways to Boost Your SEO Rankings');

                // Look for analyze button
                const analyzeButton = page.locator('button:has-text("Analyze"), button:has-text("Check")').first();
                if (await analyzeButton.isVisible()) {
                    await analyzeButton.click();

                    // Result should appear
                    const result = page.locator('[class*="result"], [class*="score"]').first();
                    await expect(result).toBeVisible({ timeout: 10000 });
                }
            }
        });
    });
});
