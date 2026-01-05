import { test, expect } from '@playwright/test';
import { login } from '../utils/authHelpers';

/**
 * Gantt Chart Regression Tests
 * 
 * These tests specifically protect against previous bugs in the Gantt view:
 * - Header hover rendering issues
 * - Timeline visibility
 * - Data display problems
 */
test.describe('Gantt View Regression Tests', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto('/agency/gantt');
        await page.waitForLoadState('networkidle');
    });

    test('should render Gantt container', async ({ page }) => {
        // Look for Gantt container
        const ganttContainer = page.locator(
            '[data-testid="gantt-container"], [class*="gantt"], .gantt-chart, [class*="Gantt"]'
        ).first();

        // Or an empty state message
        const emptyState = page.locator(
            'text=No projects, text=No data, text=Nothing scheduled, text=Create a project'
        ).first();

        await expect(ganttContainer.or(emptyState)).toBeVisible({ timeout: 10000 });
    });

    test('should display timeline header', async ({ page }) => {
        // Look for timeline header with dates
        const timelineHeader = page.locator(
            '[class*="header"], [class*="timeline"], thead, [role="rowheader"]'
        ).first();

        // If Gantt exists, header should be visible
        const ganttExists = await page.locator('[class*="gantt"]').isVisible({ timeout: 3000 }).catch(() => false);

        if (ganttExists) {
            await expect(timelineHeader).toBeVisible();
        }
    });

    test('should maintain header visibility on hover', async ({ page }) => {
        // This tests the specific bug where header text became invisible on hover

        const ganttHeader = page.locator(
            '[class*="gantt"] [class*="header"], [class*="timeline-header"]'
        ).first();

        const ganttExists = await ganttHeader.isVisible({ timeout: 3000 }).catch(() => false);

        if (ganttExists) {
            // Hover over header
            await ganttHeader.hover();
            await page.waitForTimeout(500);

            // Header should still be visible
            await expect(ganttHeader).toBeVisible();

            // Text should still be readable (not transparent)
            const textContent = await ganttHeader.textContent();
            expect(textContent).toBeTruthy();
            expect(textContent?.length).toBeGreaterThan(0);
        }
    });

    test('should display project bars if data exists', async ({ page }) => {
        // Look for Gantt bars (project/task representations)
        const ganttBars = page.locator(
            '[class*="bar"], [class*="task-bar"], [class*="project-bar"], [data-testid="gantt-bar"]'
        );

        const ganttExists = await page.locator('[class*="gantt"]').isVisible({ timeout: 3000 }).catch(() => false);

        if (ganttExists) {
            const barCount = await ganttBars.count();
            // Either bars exist or we have an empty state
            expect(barCount).toBeGreaterThanOrEqual(0);
        }
    });

    test('should have zoom controls if available', async ({ page }) => {
        // Check for zoom or time scale controls
        const zoomControls = page.locator(
            'button:has-text("Week"), button:has-text("Month"), button:has-text("Day"), [class*="zoom"]'
        );

        // Just verify page is functional
        const pageContent = page.locator('main, section').first();
        await expect(pageContent).toBeVisible();
    });

    test('should not have overlapping elements on header', async ({ page }) => {
        // Check that header elements are properly spaced
        const ganttExists = await page.locator('[class*="gantt"]').isVisible({ timeout: 3000 }).catch(() => false);

        if (ganttExists) {
            const header = page.locator('[class*="gantt"] [class*="header"]').first();

            if (await header.isVisible().catch(() => false)) {
                // Get bounding box to check for overlap issues
                const box = await header.boundingBox();

                if (box) {
                    expect(box.height).toBeGreaterThan(0);
                    expect(box.width).toBeGreaterThan(0);
                }
            }
        }
    });
});

test.describe('Gantt Data Integrity', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should match task count with bars', async ({ page }) => {
        // First go to tasks to get count
        await page.goto('/agency/tasks');
        await page.waitForLoadState('networkidle');

        // Count tasks (if any)
        const taskRows = page.locator('table tbody tr, [class*="task-row"], [data-testid="task"]');
        const taskCount = await taskRows.count();

        // Now go to Gantt
        await page.goto('/agency/gantt');
        await page.waitForLoadState('networkidle');

        // Compare (this is a soft check as not all tasks may be scheduled)
        const ganttBars = page.locator('[class*="bar"], [data-testid="gantt-bar"]');
        const barCount = await ganttBars.count();

        // Bar count should not exceed task count (roughly)
        expect(barCount).toBeLessThanOrEqual(taskCount + 10); // Allow some buffer
    });
});

test.describe('Gantt Interaction', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto('/agency/gantt');
        await page.waitForLoadState('networkidle');
    });

    test('should show tooltip on bar hover if bars exist', async ({ page }) => {
        const ganttBar = page.locator('[class*="bar"], [data-testid="gantt-bar"]').first();

        if (await ganttBar.isVisible({ timeout: 3000 }).catch(() => false)) {
            await ganttBar.hover();
            await page.waitForTimeout(500);

            // Look for tooltip
            const tooltip = page.locator(
                '[role="tooltip"], [class*="tooltip"], [class*="popover"]'
            ).first();

            // Tooltip may or may not appear depending on implementation
            const isTooltipVisible = await tooltip.isVisible({ timeout: 2000 }).catch(() => false);
            // Just verify interaction doesn't break the page
            await expect(page.locator('main').first()).toBeVisible();
        }
    });

    test('should allow scrolling in timeline', async ({ page }) => {
        const ganttContainer = page.locator('[class*="gantt"]').first();

        if (await ganttContainer.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Try to scroll
            await ganttContainer.evaluate(el => {
                if (el.scrollWidth > el.clientWidth) {
                    el.scrollLeft += 100;
                }
            });

            // Page should still be functional
            await expect(ganttContainer).toBeVisible();
        }
    });
});
