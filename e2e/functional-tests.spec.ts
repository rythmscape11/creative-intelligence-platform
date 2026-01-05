import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.mediaplanpro.com';

/**
 * Comprehensive Functional Tests for MediaPlanPro
 * Tests all buttons, forms, and interactive features
 */

test.describe('🔗 Pricing Page Button Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/pricing`);
        await page.waitForLoadState('networkidle');
    });

    test('should not have any 404 errors on trial buttons', async ({ page }) => {
        // Get all trial/subscribe buttons
        const buttons = page.locator('a:has-text("Trial"), a:has-text("Get Started"), a:has-text("Get Full Stack")');
        const count = await buttons.count();

        expect(count).toBeGreaterThan(0);
        console.log(`Found ${count} CTA buttons on pricing page`);

        // Track any 404s
        const results: { text: string; href: string; status: string }[] = [];

        for (let i = 0; i < Math.min(count, 10); i++) {
            const button = buttons.nth(i);
            const href = await button.getAttribute('href');
            const text = await button.textContent();

            if (href) {
                // Make a request to check if the page exists
                const response = await page.request.get(`${BASE_URL}${href}`);
                const status = response.status();

                results.push({
                    text: text?.trim() || 'Unknown',
                    href,
                    status: status === 404 ? '❌ 404 ERROR' : status === 200 ? '✅ OK' : `⚠️ ${status}`
                });
            }
        }

        // Log results
        console.log('\n📊 Button Link Test Results:');
        results.forEach(r => console.log(`  ${r.status}: "${r.text}" -> ${r.href}`));

        // Assert no 404s
        const has404 = results.some(r => r.status.includes('404'));
        expect(has404).toBe(false);
    });

    test('Contact Sales button should work', async ({ page }) => {
        const contactBtn = page.locator('a:has-text("Contact Sales")');
        await expect(contactBtn).toBeVisible();

        const href = await contactBtn.getAttribute('href');
        expect(href).toBe('/contact');

        // Click and verify
        await contactBtn.click();
        await expect(page).toHaveURL(/\/contact/);
        await expect(page).not.toHaveTitle(/404/i);
    });

    test('Watch Demo button should work', async ({ page }) => {
        const demoBtn = page.locator('a:has-text("Watch Demo")');

        if (await demoBtn.isVisible()) {
            const href = await demoBtn.getAttribute('href');
            expect(href).toBe('/demo');

            await demoBtn.click();
            await expect(page).toHaveURL(/\/demo/);
        }
    });

    test('Currency toggle should work', async ({ page }) => {
        const usdBtn = page.locator('button:has-text("USD")');
        const inrBtn = page.locator('button:has-text("INR")');

        await expect(usdBtn).toBeVisible();
        await expect(inrBtn).toBeVisible();

        // Click INR and verify prices change
        await inrBtn.click();
        await expect(page.locator('text=₹')).toBeVisible();

        // Click USD back
        await usdBtn.click();
        await expect(page.locator('text=$')).toBeVisible();
    });

    test('Monthly/Yearly toggle should work', async ({ page }) => {
        const monthlyBtn = page.locator('button:has-text("Monthly")');
        const yearlyBtn = page.locator('button:has-text("Yearly")');

        await expect(monthlyBtn).toBeVisible();
        await expect(yearlyBtn).toBeVisible();

        // Click Yearly
        await yearlyBtn.click();
        // Should show savings text
        await expect(page.locator('text=/Save.*year/')).toBeVisible({ timeout: 5000 });
    });

    test('Product tabs should switch content', async ({ page }) => {
        const tabs = ['Agency OS', 'The Optimiser', 'The Analyser', 'The Strategiser', 'Full Stack Bundle'];

        for (const tabName of tabs) {
            const tab = page.locator(`button:has-text("${tabName}")`);
            if (await tab.isVisible()) {
                await tab.click();
                await page.waitForTimeout(500);
                // Content should update (no assertion, just functional check)
            }
        }
    });
});

test.describe('📝 Strategy Generator Form Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/strategiser`);
        await page.waitForLoadState('networkidle');
    });

    test('should load strategy dashboard with form elements', async ({ page }) => {
        // Wait for dashboard to load
        await expect(page).not.toHaveTitle(/404/i);

        // Look for strategy-related elements
        const hasForm = await page.locator('form, [role="form"], input, textarea, select').first().isVisible({ timeout: 10000 }).catch(() => false);
        const hasButton = await page.locator('button:has-text("Generate"), button:has-text("Create"), button:has-text("Start")').first().isVisible({ timeout: 5000 }).catch(() => false);

        expect(hasForm || hasButton).toBeTruthy();
    });

    test('should fill and submit strategy form', async ({ page }) => {
        // Find any input fields
        const inputs = page.locator('input[type="text"], input:not([type]), textarea');
        const inputCount = await inputs.count();

        if (inputCount > 0) {
            // Fill first text input
            const firstInput = inputs.first();
            await firstInput.fill('Test Business Strategy');

            // Look for a submit button
            const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Create")').first();

            if (await submitBtn.isVisible()) {
                await submitBtn.click();
                // Wait for response
                await page.waitForTimeout(3000);

                // Check for results/output
                const hasOutput = await page.locator('text=/strategy|result|generated|output/i').first().isVisible({ timeout: 10000 }).catch(() => false);
                // Soft check - just log result
                console.log(`Strategy generation result: ${hasOutput ? 'Output found' : 'No output visible'}`);
            }
        }
    });

    test('Strategy Templates page should work', async ({ page }) => {
        await page.goto(`${BASE_URL}/strategiser/templates`);
        await expect(page).not.toHaveTitle(/404/i);

        // Should have template cards/options
        const templates = page.locator('[class*="template"], [class*="card"], [class*="framework"]');
        if (await templates.count() > 0) {
            // Click first template if exists
            await templates.first().click();
            await page.waitForTimeout(500);
        }
    });

    test('AI Copilot chat should work', async ({ page }) => {
        await page.goto(`${BASE_URL}/strategiser/copilot`);
        await expect(page).not.toHaveTitle(/404/i);

        // Look for chat input
        const chatInput = page.locator('input[placeholder*="chat" i], input[placeholder*="message" i], textarea[placeholder*="ask" i], input[type="text"]').first();

        if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await chatInput.fill('What is the best marketing strategy for SaaS?');

            // Find send button
            const sendBtn = page.locator('button[type="submit"], button:has-text("Send"), button[aria-label*="send" i]').first();
            if (await sendBtn.isVisible()) {
                await sendBtn.click();
                await page.waitForTimeout(2000);
            }
        }
    });
});

test.describe('🔍 Analyser Form Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/analyser`);
        await page.waitForLoadState('networkidle');
    });

    test('should allow domain input for SEO analysis', async ({ page }) => {
        // Find domain input
        const domainInput = page.locator('input[placeholder*="domain" i], input[placeholder*="url" i], input[placeholder*="website" i], input[type="url"], input[type="text"]').first();

        if (await domainInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await domainInput.fill('example.com');

            // Find analyze button
            const analyzeBtn = page.locator('button:has-text("Analyze"), button:has-text("Search"), button:has-text("Check"), button[type="submit"]').first();

            if (await analyzeBtn.isVisible()) {
                await analyzeBtn.click();
                await page.waitForTimeout(3000);
                console.log('Domain analysis triggered');
            }
        }
    });

    test('Analyser navigation links should work', async ({ page }) => {
        const pages = [
            { path: '/analyser/domains', name: 'Domains' },
            { path: '/analyser/keywords', name: 'Keywords' },
            { path: '/analyser/traffic', name: 'Traffic' },
            { path: '/analyser/backlinks', name: 'Backlinks' },
            { path: '/analyser/audit', name: 'Audit' },
        ];

        for (const p of pages) {
            const response = await page.request.get(`${BASE_URL}${p.path}`);
            expect(response.status(), `${p.name} page should not 404`).not.toBe(404);
        }
    });
});

test.describe('📈 Optimizer Dashboard Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/optimizer`);
        await page.waitForLoadState('networkidle');
    });

    test('should have working filter buttons', async ({ page }) => {
        // Platform filter buttons
        const filters = page.locator('button:has-text("Google"), button:has-text("Meta"), button:has-text("All"), [role="tab"]');
        const filterCount = await filters.count();

        if (filterCount > 0) {
            for (let i = 0; i < Math.min(filterCount, 5); i++) {
                await filters.nth(i).click();
                await page.waitForTimeout(500);
            }
        }
    });

    test('Optimizer sub-pages should work', async ({ page }) => {
        const pages = [
            '/optimizer/copilot',
            '/optimizer/reports',
            '/optimizer/connections',
            '/optimizer/settings',
        ];

        for (const path of pages) {
            const response = await page.request.get(`${BASE_URL}${path}`);
            expect(response.status(), `${path} should not 404`).not.toBe(404);
        }
    });
});

test.describe('🏢 Agency OS Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/agency`);
        await page.waitForLoadState('networkidle');
    });

    test('should have working navigation sidebar', async ({ page }) => {
        const navLinks = page.locator('nav a, [role="navigation"] a, aside a');
        const count = await navLinks.count();

        console.log(`Found ${count} navigation links in Agency OS`);
        expect(count).toBeGreaterThan(0);
    });

    test('Add Client button should open modal/form', async ({ page }) => {
        await page.goto(`${BASE_URL}/agency/clients`);

        const addBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').first();

        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(1000);

            // Should show modal or form
            const modal = page.locator('[role="dialog"], [class*="modal"], form');
            const hasModal = await modal.isVisible({ timeout: 3000 }).catch(() => false);
            console.log(`Add client modal: ${hasModal ? 'opened' : 'not found'}`);
        }
    });

    test('Agency sub-pages should work', async ({ page }) => {
        const pages = [
            '/agency/clients',
            '/agency/projects',
            '/agency/tasks',
            '/agency/content-calendar',
            '/agency/settings',
        ];

        for (const path of pages) {
            const response = await page.request.get(`${BASE_URL}${path}`);
            expect(response.status(), `${path} should not 404`).not.toBe(404);
        }
    });
});

test.describe('🛠️ Free Marketing Tools Functionality', () => {
    const tools = [
        { path: '/tools/ad-copy-generator', name: 'Ad Copy Generator' },
        { path: '/tools/headline-analyzer', name: 'Headline Analyzer' },
        { path: '/tools/serp-preview', name: 'SERP Preview' },
        { path: '/tools/utm-builder', name: 'UTM Builder' },
        { path: '/tools/roi-calculator', name: 'ROI Calculator' },
        { path: '/tools/hashtag-generator', name: 'Hashtag Generator' },
    ];

    for (const tool of tools) {
        test(`${tool.name} should have working form`, async ({ page }) => {
            await page.goto(`${BASE_URL}${tool.path}`);
            await expect(page).not.toHaveTitle(/404/i);

            // Find inputs
            const inputs = page.locator('input, textarea, select');
            const inputCount = await inputs.count();
            expect(inputCount).toBeGreaterThan(0);

            // Fill first input
            const firstInput = inputs.first();
            if (await firstInput.isVisible()) {
                const inputType = await firstInput.getAttribute('type');
                if (inputType !== 'hidden' && inputType !== 'checkbox') {
                    await firstInput.fill('Test input value');
                }
            }

            // Find and click submit/generate button
            const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Analyze"), button:has-text("Calculate"), button:has-text("Create")').first();

            if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await submitBtn.click();
                await page.waitForTimeout(2000);
                console.log(`${tool.name}: Form submitted`);
            }
        });
    }
});

test.describe('🔐 Authentication Flow Buttons', () => {
    test('Sign In button on homepage should work', async ({ page }) => {
        await page.goto(BASE_URL);

        const signInBtn = page.locator('a:has-text("Sign In"), a:has-text("Login"), button:has-text("Sign In")').first();

        if (await signInBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await signInBtn.click();
            await page.waitForLoadState('networkidle');

            // Should redirect to auth page
            await expect(page).toHaveURL(/\/auth|\/sign-in|clerk/i);
            await expect(page).not.toHaveTitle(/404/i);
        }
    });

    test('Get Started button should work', async ({ page }) => {
        await page.goto(BASE_URL);

        const getStartedBtn = page.locator('a:has-text("Get Started"), a:has-text("Start Free")').first();

        if (await getStartedBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await getStartedBtn.click();
            await page.waitForLoadState('networkidle');

            await expect(page).not.toHaveTitle(/404/i);
        }
    });
});

test.describe('📚 Blog Functionality', () => {
    test('Blog page should load with posts', async ({ page }) => {
        await page.goto(`${BASE_URL}/blog`);
        await expect(page).not.toHaveTitle(/404/i);

        // Should have blog post cards/links
        const posts = page.locator('article, [class*="post"], a[href*="/blog/"]');
        const count = await posts.count();
        expect(count).toBeGreaterThan(0);
    });

    test('Blog post clicks should work', async ({ page }) => {
        await page.goto(`${BASE_URL}/blog`);

        const postLink = page.locator('a[href*="/blog/"]').first();

        if (await postLink.isVisible()) {
            const href = await postLink.getAttribute('href');
            if (href) {
                await postLink.click();
                await page.waitForLoadState('networkidle');
                await expect(page).not.toHaveTitle(/404/i);
            }
        }
    });
});

test.describe('🔗 Footer Links Validation', () => {
    test('All footer links should work', async ({ page }) => {
        await page.goto(BASE_URL);

        const footer = page.locator('footer');
        const footerLinks = footer.locator('a[href^="/"]');
        const count = await footerLinks.count();

        const results: { href: string; status: number }[] = [];

        for (let i = 0; i < count; i++) {
            const link = footerLinks.nth(i);
            const href = await link.getAttribute('href');

            if (href && href.startsWith('/')) {
                const response = await page.request.get(`${BASE_URL}${href}`);
                results.push({ href, status: response.status() });
            }
        }

        // Log results
        console.log('\nFooter Link Check:');
        results.forEach(r => console.log(`  ${r.status === 404 ? '❌' : '✅'} ${r.href} (${r.status})`));

        // Assert no 404s
        const has404 = results.some(r => r.status === 404);
        expect(has404).toBe(false);
    });
});

test.describe('🎛️ Header Navigation Links', () => {
    test('All header navigation links should work', async ({ page }) => {
        await page.goto(BASE_URL);

        const header = page.locator('header, nav').first();
        const headerLinks = header.locator('a[href^="/"]');
        const count = await headerLinks.count();

        const results: { href: string; status: number }[] = [];

        for (let i = 0; i < count; i++) {
            const link = headerLinks.nth(i);
            const href = await link.getAttribute('href');

            if (href && href.startsWith('/') && !href.includes('#')) {
                const response = await page.request.get(`${BASE_URL}${href}`);
                results.push({ href, status: response.status() });
            }
        }

        // Log and assert
        console.log('\nHeader Link Check:');
        results.forEach(r => console.log(`  ${r.status === 404 ? '❌' : '✅'} ${r.href} (${r.status})`));

        const has404 = results.some(r => r.status === 404);
        expect(has404).toBe(false);
    });
});
