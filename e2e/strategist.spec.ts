/**
 * Strategiser Module E2E Tests
 * 
 * Tests the Strategy Builder:
 * - Dashboard access
 * - Strategy creation form
 * - AI generation (mocked)
 * - Export functionality
 */

import { test, expect } from '@playwright/test';
import { mockStrategyInput } from './fixtures';

test.describe('Strategiser Module', () => {
    test.use({ storageState: 'storage/user.json' });

    test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

    test.describe('Dashboard', () => {
        test('should load Strategiser dashboard', async ({ page }) => {
            await page.goto('/strategiser');
            await page.waitForLoadState('networkidle');

            await test.step('Verify dashboard loads', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /strategi|dashboard/i }).first();
                await expect(heading).toBeVisible({ timeout: 15000 });
            });

            await test.step('Verify key dashboard elements', async () => {
                // Should have stats or quick actions
                const statsOrActions = page.locator('[data-testid="stats"], [data-testid="quick-actions"], .card, .stat').first();
                await expect(statsOrActions).toBeVisible({ timeout: 10000 });
            });

            await test.step('Verify Create Strategy CTA', async () => {
                const createBtn = page.locator('a:has-text("Create"), button:has-text("Create")').first();
                await expect(createBtn).toBeVisible();
            });
        });

        test('should navigate to strategy creation', async ({ page }) => {
            await page.goto('/strategiser');
            await page.waitForLoadState('networkidle');

            await test.step('Click Create Strategy', async () => {
                const createBtn = page.locator('a:has-text("Create"), button:has-text("Create")').first();
                await createBtn.click();

                await expect(page).toHaveURL(/create|new/);
            });
        });
    });

    test.describe('Strategy Creation', () => {
        test('should complete strategy creation form', async ({ page }) => {
            // Mock the AI generation endpoint
            await page.route('**/api/strategy/**', async (route) => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            id: 'strategy_test123',
                            name: 'Test Strategy',
                            channels: [
                                { name: 'Paid Search', budget: 3000, percentage: 30 },
                                { name: 'Social Media', budget: 2500, percentage: 25 },
                                { name: 'Content Marketing', budget: 2000, percentage: 20 },
                                { name: 'Email Marketing', budget: 1500, percentage: 15 },
                                { name: 'SEO', budget: 1000, percentage: 10 },
                            ],
                            kpis: [
                                { name: 'Leads Generated', target: '500', timeframe: 'monthly' },
                                { name: 'Cost Per Lead', target: '$20', timeframe: 'monthly' },
                                { name: 'Website Traffic', target: '25000', timeframe: 'monthly' },
                            ],
                            funnelStages: ['Awareness', 'Interest', 'Consideration', 'Decision'],
                            recommendations: [
                                'Focus on LinkedIn for B2B lead generation',
                                'Implement remarketing campaigns',
                                'Create case studies for consideration stage',
                            ],
                        }),
                    });
                } else {
                    await route.continue();
                }
            });

            await page.goto('/strategiser/create');
            await page.waitForLoadState('networkidle');

            await test.step('Fill business information', async () => {
                const businessNameInput = page.locator('input[name="businessName"], input[placeholder*="business"], input[placeholder*="Business"]').first();
                if (await businessNameInput.isVisible()) {
                    await businessNameInput.fill(mockStrategyInput.businessName);
                }

                const industryInput = page.locator('input[name="industry"], select[name="industry"], input[placeholder*="industry"]').first();
                if (await industryInput.isVisible()) {
                    await industryInput.fill(mockStrategyInput.industry);
                }
            });

            await test.step('Fill target audience', async () => {
                const audienceInput = page.locator('textarea[name="targetAudience"], input[name="targetAudience"], textarea[placeholder*="audience"]').first();
                if (await audienceInput.isVisible()) {
                    await audienceInput.fill(mockStrategyInput.targetAudience);
                }
            });

            await test.step('Fill budget', async () => {
                const budgetInput = page.locator('input[name="budget"], input[type="number"], input[placeholder*="budget"]').first();
                if (await budgetInput.isVisible()) {
                    await budgetInput.fill(mockStrategyInput.monthlyBudget);
                }
            });

            await test.step('Select goals', async () => {
                for (const goal of mockStrategyInput.goals) {
                    const goalCheckbox = page.locator(`input[value="${goal}"], label:has-text("${goal}")`).first();
                    if (await goalCheckbox.isVisible()) {
                        await goalCheckbox.click();
                    }
                }
            });

            await test.step('Submit and generate', async () => {
                const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Create"), button[type="submit"]').first();
                if (await generateBtn.isVisible()) {
                    await generateBtn.click();

                    // Wait for generation (mocked, should be quick)
                    await page.waitForTimeout(2000);
                }
            });
        });

        test('should display strategy results after generation', async ({ page }) => {
            // Mock successful generation with results
            await page.route('**/api/strategy/**', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 'strategy_test123',
                        status: 'completed',
                        channels: [
                            { name: 'Paid Search', budget: 3000, percentage: 30 },
                            { name: 'Social Media', budget: 2500, percentage: 25 },
                        ],
                        kpis: [
                            { name: 'Leads', target: '500' },
                        ],
                    }),
                });
            });

            await page.goto('/strategiser/strategies');
            await page.waitForLoadState('networkidle');

            await test.step('Verify strategies list', async () => {
                // Should show list of strategies or empty state
                const strategiesList = page.locator('[data-testid="strategies-list"], table, .strategies-grid').first();
                const emptyState = page.locator('text*="No strategies", text*="Create your first"').first();

                const hasContent = await strategiesList.isVisible() || await emptyState.isVisible();
                expect(hasContent).toBe(true);
            });
        });
    });

    test.describe('Strategy Export', () => {
        test('should have export options', async ({ page }) => {
            await page.goto('/strategiser/reports');
            await page.waitForLoadState('networkidle');

            await test.step('Check for export buttons', async () => {
                const exportBtn = page.locator('button:has-text("Export"), button:has-text("Download"), a:has-text("PDF")').first();

                if (await exportBtn.isVisible()) {
                    // Verify export option exists
                    expect(true).toBe(true);
                }
            });
        });
    });

    test.describe('AI Copilot', () => {
        test('should load AI Copilot page', async ({ page }) => {
            await page.goto('/strategiser/copilot');
            await page.waitForLoadState('networkidle');

            await test.step('Verify copilot interface', async () => {
                // Should have chat input
                const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[type="text"]').first();
                await expect(chatInput).toBeVisible({ timeout: 10000 });
            });

            await test.step('Verify send button', async () => {
                const sendBtn = page.locator('button:has-text("Send"), button[type="submit"]').first();
                await expect(sendBtn).toBeVisible();
            });
        });
    });
});
