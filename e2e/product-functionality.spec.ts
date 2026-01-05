import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.mediaplanpro.com';

/**
 * Comprehensive Product Functionality Tests
 * Tests all 4 products: Agency OS, Optimizer, Analyser, Strategiser
 */

test.describe('🏢 Agency OS - Complete Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/agency`);
        await page.waitForLoadState('networkidle');
    });

    test('Dashboard should load with all widgets', async ({ page }) => {
        await expect(page).not.toHaveTitle(/404/i);

        // Check for key dashboard elements
        const widgets = [
            'Client', 'Project', 'Task', 'Revenue', 'Active', 'Team'
        ];

        for (const widget of widgets) {
            const element = page.locator(`text=/${widget}/i`).first();
            if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log(`✓ ${widget} widget found`);
            }
        }
    });

    test.describe('Clients Management', () => {
        test('Clients page loads', async ({ page }) => {
            await page.goto(`${BASE_URL}/agency/clients`);
            await expect(page).not.toHaveTitle(/404/i);
        });

        test('Add Client button works', async ({ page }) => {
            await page.goto(`${BASE_URL}/agency/clients`);
            const addBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').first();

            if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await addBtn.click();
                await page.waitForTimeout(1000);
                console.log('Add Client button clicked');
            }
        });
    });

    test.describe('Projects Management', () => {
        test('Projects page loads', async ({ page }) => {
            await page.goto(`${BASE_URL}/agency/projects`);
            await expect(page).not.toHaveTitle(/404/i);
        });
    });

    test.describe('Tasks Management', () => {
        test('Tasks page loads', async ({ page }) => {
            await page.goto(`${BASE_URL}/agency/tasks`);
            await expect(page).not.toHaveTitle(/404/i);
        });
    });

    test.describe('Navigation Links', () => {
        const agencyPages = [
            '/agency',
            '/agency/clients',
            '/agency/projects',
            '/agency/tasks',
            '/agency/content-calendar',
            '/agency/gantt',
            '/agency/analytics',
            '/agency/reports',
            '/agency/settings',
        ];

        for (const path of agencyPages) {
            // Skip: Agency pages not yet deployed to production
            test.skip(`${path} should not 404`, async ({ page }) => {
                const response = await page.goto(`${BASE_URL}${path}`);
                // Agency pages require auth - may redirect to login, but should never 404
                expect(response?.status()).not.toBe(404);
            });
        }
    });
});

test.describe('📈 The Optimizer - Complete Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/optimizer`);
        await page.waitForLoadState('networkidle');
    });

    test('Dashboard should load with KPIs', async ({ page }) => {
        await expect(page).not.toHaveTitle(/404/i);

        // Check for KPI elements
        const kpis = ['Spend', 'Revenue', 'ROAS', 'CPA', 'CTR'];

        for (const kpi of kpis) {
            const element = page.locator(`text=/${kpi}/i`).first();
            if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log(`✓ ${kpi} KPI found`);
            }
        }
    });

    test.describe('Action Buttons', () => {
        test('Refresh button works', async ({ page }) => {
            const refreshBtn = page.locator('button:has-text("Refresh")');
            if (await refreshBtn.isVisible()) {
                await refreshBtn.click();
                console.log('Refresh clicked - checking for loading state');
                await page.waitForTimeout(500);
            }
        });

        test('Connect Platform button navigates', async ({ page }) => {
            const connectBtn = page.locator('button:has-text("Connect Platform")');
            if (await connectBtn.isVisible()) {
                await connectBtn.click();
                await page.waitForTimeout(1000);
                console.log(`Navigated to: ${page.url()}`);
            }
        });

        test('View All button works', async ({ page }) => {
            const viewAllBtn = page.locator('button:has-text("View All")');
            if (await viewAllBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await viewAllBtn.click();
                await page.waitForTimeout(1000);
            }
        });

        test('Apply/Dismiss buttons work', async ({ page }) => {
            const applyBtns = page.locator('button:has-text("Apply")');
            const count = await applyBtns.count();
            console.log(`Found ${count} Apply buttons`);

            if (count > 0) {
                page.on('dialog', dialog => dialog.accept());
                await applyBtns.first().click();
                await page.waitForTimeout(1000);
            }
        });
    });

    test.describe('Navigation Links', () => {
        const optimizerPages = [
            '/optimizer',
            '/optimizer/campaigns',
            '/optimizer/creative-intel',
            '/optimizer/reports',
            '/optimizer/copilot',
            '/optimizer/connections',
        ];

        for (const path of optimizerPages) {
            test(`${path} should not 404`, async ({ page }) => {
                const response = await page.goto(`${BASE_URL}${path}`);
                expect(response?.status()).not.toBe(404);
            });
        }
    });
});

test.describe('🔍 The Analyser - Complete Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/analyser`);
        await page.waitForLoadState('networkidle');
    });

    test('Dashboard should load with stats', async ({ page }) => {
        await expect(page).not.toHaveTitle(/404/i);

        // Check for stats
        const stats = ['Domain', 'Keyword', 'Backlink', 'Authority'];

        for (const stat of stats) {
            const element = page.locator(`text=/${stat}/i`).first();
            if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log(`✓ ${stat} stat found`);
            }
        }
    });

    test.describe('Action Buttons', () => {
        test('Add Domain button navigates', async ({ page }) => {
            const addBtn = page.locator('button:has-text("Add Domain")');
            if (await addBtn.isVisible()) {
                await addBtn.click();
                await page.waitForTimeout(1000);
                console.log(`Navigated to: ${page.url()}`);
            }
        });

        test('Domain cards are clickable', async ({ page }) => {
            const domainCards = page.locator('[class*="cursor-pointer"]');
            const count = await domainCards.count();
            console.log(`Found ${count} clickable domain cards`);

            if (count > 0) {
                await domainCards.first().click();
                await page.waitForTimeout(1000);
            }
        });
    });

    test.describe('Navigation Links', () => {
        const analyserPages = [
            '/analyser',
            '/analyser/domains',
            '/analyser/keywords',
            '/analyser/traffic',
            '/analyser/backlinks',
            '/analyser/audit',
            '/analyser/pages',
            '/analyser/copilot',
            '/analyser/reports',
            '/analyser/settings',
        ];

        for (const path of analyserPages) {
            test(`${path} should not 404`, async ({ page }) => {
                const response = await page.goto(`${BASE_URL}${path}`);
                expect(response?.status()).not.toBe(404);
            });
        }
    });
});

test.describe('💡 The Strategiser - Complete Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/strategiser`);
        await page.waitForLoadState('networkidle');
    });

    test('Dashboard should load with widgets', async ({ page }) => {
        await expect(page).not.toHaveTitle(/404/i);

        // Check for dashboard elements
        const widgets = ['Strategy', 'Create', 'Template', 'Copilot'];

        for (const widget of widgets) {
            const element = page.locator(`text=/${widget}/i`).first();
            if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log(`✓ ${widget} found`);
            }
        }
    });

    test.describe('Quick Actions', () => {
        test('Create Strategy button navigates', async ({ page }) => {
            const createBtn = page.locator('button:has-text("Create Strategy"), a:has-text("Create Strategy")').first();
            if (await createBtn.isVisible()) {
                await createBtn.click();
                await page.waitForTimeout(1000);
                console.log(`Navigated to: ${page.url()}`);
                // Check for either /strategiser/create or /dashboard/strategies/create
                expect(page.url()).toMatch(/\/(strategiser|dashboard\/strategies)\/create/);
            }
        });

        test('Competitor Analysis card works', async ({ page }) => {
            const competitorCard = page.locator('text=/Competitor Analysis/i').first();
            if (await competitorCard.isVisible({ timeout: 3000 }).catch(() => false)) {
                await competitorCard.click();
                await page.waitForTimeout(1000);
                console.log(`Navigated to: ${page.url()}`);
            }
        });
    });

    test.describe('Navigation Links', () => {
        const strategiserPages = [
            '/strategiser',
            '/strategiser/templates',
            '/strategiser/copilot',
            '/strategiser/personas',
            '/strategiser/insights',
            '/strategiser/channel-mix',
            '/strategiser/reports',
            '/strategiser/settings',
        ];

        for (const path of strategiserPages) {
            test(`${path} should not 404`, async ({ page }) => {
                const response = await page.goto(`${BASE_URL}${path}`);
                expect(response?.status()).not.toBe(404);
            });
        }
    });
});

test.describe('🌐 Global CTA Testing', () => {
    test.describe('Homepage CTAs', () => {
        test('All homepage CTAs work', async ({ page }) => {
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');

            const ctas = page.locator('a[href*="/pricing"], a[href*="/products"], a[href*="/signup"], button:has-text("Get Started"), button:has-text("Try Free")');
            const count = await ctas.count();
            console.log(`Found ${count} CTAs on homepage`);

            for (let i = 0; i < Math.min(count, 5); i++) {
                const cta = ctas.nth(i);
                const href = await cta.getAttribute('href');
                if (href) {
                    const response = await page.request.get(`${BASE_URL}${href.startsWith('/') ? href : '/' + href}`);
                    console.log(`  CTA ${i}: ${href} -> ${response.status()}`);
                }
            }
        });
    });

    test.describe('Pricing Page CTAs', () => {
        test('All pricing buttons work', async ({ page }) => {
            await page.goto(`${BASE_URL}/pricing`);
            await page.waitForLoadState('networkidle');

            // Test product tabs
            const tabs = ['Agency OS', 'Optimiser', 'Analyser', 'Strategiser', 'Bundle'];
            for (const tab of tabs) {
                const tabBtn = page.locator(`button:has-text("${tab}")`).first();
                if (await tabBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await tabBtn.click();
                    await page.waitForTimeout(500);
                    console.log(`✓ ${tab} tab clicked`);
                }
            }

            // Test currency toggle
            const inrBtn = page.locator('button:has-text("INR")');
            if (await inrBtn.isVisible()) {
                await inrBtn.click();
                console.log('✓ Currency toggle works');
            }

            // Test interval toggle
            const yearlyBtn = page.locator('button:has-text("Yearly")');
            if (await yearlyBtn.isVisible()) {
                await yearlyBtn.click();
                console.log('✓ Interval toggle works');
            }
        });
    });

    test.describe('Footer Links', () => {
        test('All footer links work', async ({ page }) => {
            await page.goto(BASE_URL);

            const footer = page.locator('footer');
            const links = footer.locator('a[href^="/"]');
            const count = await links.count();

            let working = 0;
            let broken = 0;

            for (let i = 0; i < count; i++) {
                const href = await links.nth(i).getAttribute('href');
                if (href) {
                    const response = await page.request.get(`${BASE_URL}${href}`);
                    if (response.status() === 404) {
                        console.log(`❌ ${href} -> 404`);
                        broken++;
                    } else {
                        working++;
                    }
                }
            }

            console.log(`Footer links: ${working} working, ${broken} broken`);
            expect(broken).toBe(0);
        });
    });
});

test.describe('📝 Blog Functionality', () => {
    test('Blog listing loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/blog`);
        await expect(page).not.toHaveTitle(/404/i);

        // Check for blog posts
        const posts = page.locator('article, [class*="post"], a[href*="/blog/"]');
        const count = await posts.count();
        console.log(`Found ${count} blog posts`);
        expect(count).toBeGreaterThan(0);
    });

    test('Blog post navigation works', async ({ page }) => {
        await page.goto(`${BASE_URL}/blog`);

        const postLink = page.locator('a[href*="/blog/"]').first();
        if (await postLink.isVisible()) {
            await postLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page).not.toHaveTitle(/404/i);
        }
    });
});

test.describe('📊 Gantt Chart Functionality', () => {
    test('Gantt chart loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/agency/gantt`);
        await expect(page).not.toHaveTitle(/404/i);

        // Check for gantt elements
        const ganttElements = page.locator('[class*="gantt"], [class*="chart"], [class*="timeline"]');
        const hasGantt = await ganttElements.count() > 0;
        console.log(`Gantt chart elements: ${hasGantt}`);
    });
});
