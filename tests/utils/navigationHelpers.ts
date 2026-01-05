import { Page, expect } from '@playwright/test';

/**
 * Navigation Helper Functions for Playwright Tests
 * 
 * Common navigation patterns for the Aureon One dashboard.
 */

export type ModuleName = 'Overview' | 'Agency OS' | 'The Optimiser' | 'The Analyser' | 'GEO Engine' | 'The Strategiser';

const moduleRoutes: Record<ModuleName, string> = {
    'Overview': '/dashboard',
    'Agency OS': '/agency',
    'The Optimiser': '/optimizer',
    'The Analyser': '/analyser',
    'GEO Engine': '/analyser/geo',
    'The Strategiser': '/strategiser',
};

/**
 * Navigate to a specific module using the sidebar.
 */
export async function navigateToModule(page: Page, moduleName: ModuleName): Promise<void> {
    // Try clicking in sidebar first
    const sidebarLink = page.locator(`aside a:has-text("${moduleName}"), nav a:has-text("${moduleName}")`).first();

    if (await sidebarLink.isVisible({ timeout: 3000 })) {
        await sidebarLink.click();
    } else {
        // Fallback to direct navigation
        await page.goto(moduleRoutes[moduleName]);
    }

    await page.waitForLoadState('networkidle');
}

/**
 * Navigate to a module via URL.
 */
export async function navigateToModuleByUrl(page: Page, moduleName: ModuleName): Promise<void> {
    await page.goto(moduleRoutes[moduleName]);
    await page.waitForLoadState('networkidle');
}

/**
 * Click a tab within a module.
 */
export async function clickModuleTab(page: Page, tabName: string): Promise<void> {
    const tab = page.locator(
        `[role="tab"]:has-text("${tabName}"), a:has-text("${tabName}"), button:has-text("${tabName}")`
    ).first();

    await expect(tab).toBeVisible();
    await tab.click();
    await page.waitForLoadState('networkidle');
}

/**
 * Assert the current module is correct by checking the page title or header.
 */
export async function assertModuleLoaded(page: Page, moduleName: ModuleName): Promise<void> {
    // Check for module name in header or title
    const headerText = page.locator('h1, header, [data-testid="page-title"]').first();

    await expect(headerText).toContainText(moduleName.replace('The ', ''), { timeout: 10000 });
}

/**
 * Open mobile sidebar (for responsive testing).
 */
export async function openMobileSidebar(page: Page): Promise<void> {
    const menuButton = page.locator('button:has([class*="menu"]), [data-testid="mobile-menu"]').first();

    if (await menuButton.isVisible({ timeout: 2000 })) {
        await menuButton.click();
        await page.waitForTimeout(500);
    }
}

/**
 * Check if sidebar is visible.
 */
export async function isSidebarVisible(page: Page): Promise<boolean> {
    return page.locator('aside, [data-testid="dashboard-sidebar"]').first().isVisible({ timeout: 3000 });
}

/**
 * Wait for page content to load (useful after navigation).
 */
export async function waitForPageContent(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    // Additional wait for any dynamic content
    await page.waitForTimeout(500);
}

/**
 * Get current page title/header text.
 */
export async function getPageTitle(page: Page): Promise<string> {
    const header = page.locator('h1').first();
    return header.textContent() || '';
}
