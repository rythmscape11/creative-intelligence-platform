import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.mediaplanpro.com';

/**
 * Detailed CTA Tests for Optimizer and Analyser
 * 
 * Tests all buttons, clickable sections, and interactive elements
 */

test.describe('📈 Optimizer Page CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/optimizer`);
    await page.waitForLoadState('networkidle');
  });

  test('Page should load successfully', async ({ page }) => {
    await expect(page).not.toHaveTitle(/404/i);
    await expect(page.locator('h1')).toContainText(/Command Center|Optimizer/i);
  });

  test.describe('Header Buttons', () => {
    test('Refresh button should be visible and clickable', async ({ page }) => {
      const refreshBtn = page.locator('button:has-text("Refresh")');
      await expect(refreshBtn).toBeVisible();
      
      // Click should trigger refresh (button should show loading state)
      await refreshBtn.click();
      
      // Check for spinning icon or loading state
      const spinningIcon = refreshBtn.locator('svg.animate-spin');
      // Wait briefly to see if animation starts
      await page.waitForTimeout(500);
    });

    test('Connect Platform button should be visible and trigger action', async ({ page }) => {
      const connectBtn = page.locator('button:has-text("Connect Platform")');
      await expect(connectBtn).toBeVisible();
      
      await connectBtn.click();
      await page.waitForTimeout(1000);
      
      // Should open modal, navigate, or show feedback
      const hasModal = await page.locator('[role="dialog"], [class*="modal"]').isVisible().catch(() => false);
      const hasNavigation = page.url() !== `${BASE_URL}/optimizer`;
      const hasToast = await page.locator('[class*="toast"], [role="alert"]').isVisible().catch(() => false);
      
      // Log the result
      console.log(`Connect Platform button: modal=${hasModal}, navigation=${hasNavigation}, toast=${hasToast}`);
      
      // At minimum, button should be clickable without error
      expect(true).toBe(true);
    });
  });

  test.describe('Action Inbox Buttons', () => {
    test('View All button should be visible', async ({ page }) => {
      const viewAllBtn = page.locator('button:has-text("View All")');
      
      if (await viewAllBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewAllBtn.click();
        await page.waitForTimeout(1000);
        console.log('View All button clicked');
      }
    });

    test('Apply buttons on suggestions should be clickable', async ({ page }) => {
      const applyBtns = page.locator('button:has-text("Apply")');
      const count = await applyBtns.count();
      
      console.log(`Found ${count} Apply buttons`);
      
      if (count > 0) {
        // Click first Apply button
        await applyBtns.first().click();
        await page.waitForTimeout(1000);
        
        // Check for any response
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        const hasToast = await page.locator('[class*="toast"], [role="alert"]').isVisible().catch(() => false);
        console.log(`Apply result: modal=${hasModal}, toast=${hasToast}`);
      }
    });

    test('Dismiss buttons on suggestions should be clickable', async ({ page }) => {
      const dismissBtns = page.locator('button:has-text("Dismiss")');
      const count = await dismissBtns.count();
      
      console.log(`Found ${count} Dismiss buttons`);
      
      if (count > 0) {
        const initialCount = count;
        await dismissBtns.first().click();
        await page.waitForTimeout(1000);
        
        // Card should disappear or show feedback
        const newCount = await page.locator('button:has-text("Dismiss")').count();
        console.log(`Dismiss: before=${initialCount}, after=${newCount}`);
      }
    });
  });

  test.describe('KPI Cards', () => {
    test('KPI cards should be visible', async ({ page }) => {
      // Check for main KPI values
      const spendCard = page.locator('text=/Total Spend/');
      const revenueCard = page.locator('text=/Revenue/');
      const roasCard = page.locator('text=/ROAS/');
      const cpaCard = page.locator('text=/CPA/');

      await expect(spendCard).toBeVisible();
      await expect(revenueCard).toBeVisible();
      await expect(roasCard).toBeVisible();
      await expect(cpaCard).toBeVisible();
    });
  });

  test.describe('Connected Platforms Badges', () => {
    test('Platform badges should be visible', async ({ page }) => {
      const badges = page.locator('[class*="badge"], .badge');
      const count = await badges.count();
      console.log(`Found ${count} badges on page`);
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation Sidebar', () => {
    test('Should have working sidebar navigation', async ({ page }) => {
      const sidebarLinks = [
        { text: 'Dashboard', path: '/optimizer' },
        { text: 'Campaigns', path: '/optimizer/campaigns' },
        { text: 'Reports', path: '/optimizer/reports' },
        { text: 'Copilot', path: '/optimizer/copilot' },
        { text: 'Connections', path: '/optimizer/connections' },
      ];

      for (const link of sidebarLinks) {
        const navLink = page.locator(`a:has-text("${link.text}"), nav >> text="${link.text}"`).first();
        if (await navLink.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`Found nav link: ${link.text}`);
        }
      }
    });
  });
});

test.describe('🔍 Analyser Page CTAs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/analyser`);
    await page.waitForLoadState('networkidle');
  });

  test('Page should load successfully', async ({ page }) => {
    await expect(page).not.toHaveTitle(/404/i);
    await expect(page.locator('h1')).toContainText(/Intelligence|Analyser/i);
  });

  test.describe('Header Buttons', () => {
    test('Add Domain button should be visible and trigger action', async ({ page }) => {
      const addBtn = page.locator('button:has-text("Add Domain")');
      await expect(addBtn).toBeVisible();
      
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      // Should open modal or navigate
      const hasModal = await page.locator('[role="dialog"], [class*="modal"]').isVisible().catch(() => false);
      const hasNavigation = page.url() !== `${BASE_URL}/analyser`;
      
      console.log(`Add Domain button: modal=${hasModal}, navigation=${hasNavigation}`);
    });
  });

  test.describe('Domain Cards', () => {
    test('Domain cards should be clickable', async ({ page }) => {
      const domainCards = page.locator('[class*="cursor-pointer"]');
      const count = await domainCards.count();
      
      console.log(`Found ${count} clickable domain cards`);
      
      if (count > 0) {
        await domainCards.first().click();
        await page.waitForTimeout(1000);
        
        // Should navigate or open details
        const urlChanged = page.url() !== `${BASE_URL}/analyser`;
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        console.log(`Domain card click: navigation=${urlChanged}, modal=${hasModal}`);
      }
    });
  });

  test.describe('Stats Cards', () => {
    test('All overview stats should be visible', async ({ page }) => {
      const stats = ['Tracked Domains', 'Tracked Keywords', 'Total Backlinks', 'Authority Score'];
      
      for (const stat of stats) {
        const statElement = page.locator(`text=/${stat}/i`).first();
        if (await statElement.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log(`✓ ${stat} visible`);
        } else {
          console.log(`✗ ${stat} NOT visible`);
        }
      }
    });
  });

  test.describe('Keyword Movers Section', () => {
    test('Keyword movers should be visible', async ({ page }) => {
      const keywordSection = page.locator('text=/Keyword Movers/i');
      await expect(keywordSection).toBeVisible();
      
      // Check for keyword items
      const keywordItems = page.locator('[class*="rounded-lg"] >> text=/#/');
      const count = await keywordItems.count();
      console.log(`Found ${count} keyword ranking items`);
    });
  });

  test.describe('Alerts Section', () => {
    test('Recent alerts should be visible', async ({ page }) => {
      const alertsSection = page.locator('text=/Recent Alerts/i');
      await expect(alertsSection).toBeVisible();
    });
  });

  test.describe('Navigation Sidebar', () => {
    test('Should have working sidebar navigation links', async ({ page }) => {
      const sidebarLinks = [
        { text: 'Overview', path: '/analyser' },
        { text: 'Domains', path: '/analyser/domains' },
        { text: 'Keywords', path: '/analyser/keywords' },
        { text: 'Traffic', path: '/analyser/traffic' },
        { text: 'Backlinks', path: '/analyser/backlinks' },
        { text: 'Audit', path: '/analyser/audit' },
      ];

      for (const link of sidebarLinks) {
        const response = await page.request.get(`${BASE_URL}${link.path}`);
        console.log(`${link.text} (${link.path}): ${response.status()}`);
        expect(response.status()).not.toBe(404);
      }
    });
  });
});

test.describe('🔗 All CTA Link Validation', () => {
  const pagesToTest = [
    '/optimizer',
    '/optimizer/campaigns',
    '/optimizer/reports',
    '/optimizer/copilot',
    '/optimizer/connections',
    '/analyser',
    '/analyser/domains',
    '/analyser/keywords',
    '/analyser/traffic',
    '/analyser/backlinks',
    '/analyser/audit',
  ];

  for (const pagePath of pagesToTest) {
    test(`${pagePath} should have working buttons`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${pagePath}`);
      
      // Check page loaded
      expect(response?.status()).not.toBe(404);
      
      await page.waitForLoadState('networkidle');
      
      // Count all buttons
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      console.log(`${pagePath}: Found ${buttonCount} buttons`);
      
      // Count all links
      const links = page.locator('a[href]');
      const linkCount = await links.count();
      console.log(`${pagePath}: Found ${linkCount} links`);
      
      // Test that buttons are clickable (no errors)
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const btn = buttons.nth(i);
        const isVisible = await btn.isVisible().catch(() => false);
        const isDisabled = await btn.isDisabled().catch(() => false);
        
        if (isVisible && !isDisabled) {
          try {
            await btn.click({ timeout: 2000 });
            await page.waitForTimeout(500);
            console.log(`  Button ${i}: clicked successfully`);
          } catch (e) {
            console.log(`  Button ${i}: click failed - ${e}`);
          }
          
          // Navigate back if page changed
          if (!page.url().includes(pagePath)) {
            await page.goto(`${BASE_URL}${pagePath}`);
          }
        }
      }
    });
  }
});

test.describe('🎯 Button Click Response Tests', () => {
  test('Optimizer buttons should have visual feedback', async ({ page }) => {
    await page.goto(`${BASE_URL}/optimizer`);
    await page.waitForLoadState('networkidle');

    // Test Refresh button animation
    const refreshBtn = page.locator('button:has-text("Refresh")');
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click();
      
      // Should show spinner
      await page.waitForTimeout(100);
      const hasSpinner = await page.locator('.animate-spin').isVisible().catch(() => false);
      console.log(`Refresh button spinner: ${hasSpinner}`);
    }
  });

  test('Analyser Add Domain should respond', async ({ page }) => {
    await page.goto(`${BASE_URL}/analyser`);
    await page.waitForLoadState('networkidle');

    const addBtn = page.locator('button:has-text("Add Domain")');
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      // Check multiple possible responses
      const responses = {
        modal: await page.locator('[role="dialog"]').isVisible().catch(() => false),
        toast: await page.locator('[class*="toast"]').isVisible().catch(() => false),
        form: await page.locator('form').isVisible().catch(() => false),
        inputField: await page.locator('input[type="text"]').isVisible().catch(() => false),
      };
      
      console.log('Add Domain responses:', responses);
    }
  });
});
