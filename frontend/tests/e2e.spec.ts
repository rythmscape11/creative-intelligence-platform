import { test, expect } from '@playwright/test';

const BASE_URL = 'https://frontend-eta-one-78.vercel.app';
const API_URL = 'https://creative-intelligence-platform.onrender.com';

test.describe('Creative Intelligence Platform E2E Tests', () => {

    test('Backend health check', async ({ request }) => {
        const response = await request.get(`${API_URL}/health`);
        expect(response.ok()).toBeTruthy();
        const json = await response.json();
        expect(json.status).toBe('healthy');
        expect(json.service).toBe('creative-intelligence-api');
    });

    test('Frontend loads correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page.locator('h1')).toContainText('Creative Intelligence');
        await expect(page.locator('text=CMO-Grade Scoring Platform')).toBeVisible();
    });

    test('Login form is visible', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });

    test('Can switch between Login and Register tabs', async ({ page }) => {
        await page.goto(BASE_URL);

        // Check Login is active by default
        await expect(page.locator('button:has-text("Login")')).toBeVisible();
        await expect(page.locator('button:has-text("Register")')).toBeVisible();

        // Click Register
        await page.click('button:has-text("Register")');
        await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
        await expect(page.locator('input[placeholder="Organization Name (optional)"]')).toBeVisible();

        // Click back to Login
        await page.click('button:has-text("Login")');
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });

    test('Login with demo credentials', async ({ page }) => {
        await page.goto(BASE_URL);

        // Fill login form
        await page.fill('input[type="email"]', 'demo@company.com');
        await page.fill('input[type="password"]', 'password123');

        // Click Sign In
        await page.click('button:has-text("Sign In")');

        // Wait for dashboard to load (shows user email)
        await expect(page.locator('text=demo@company.com')).toBeVisible({ timeout: 15000 });

        // Check dashboard elements
        await expect(page.locator('text=Drop your creative here')).toBeVisible();
        await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    });

    test('Dashboard shows upload zone after login', async ({ page }) => {
        await page.goto(BASE_URL);

        // Login
        await page.fill('input[type="email"]', 'demo@company.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button:has-text("Sign In")');

        // Wait for dashboard
        await expect(page.locator('text=demo@company.com')).toBeVisible({ timeout: 15000 });

        // Check upload zone
        await expect(page.locator('text=Drop your creative here')).toBeVisible();
        await expect(page.locator('text=PNG, JPG, WEBP up to 10MB')).toBeVisible();
    });

    test('Logout works correctly', async ({ page }) => {
        await page.goto(BASE_URL);

        // Login
        await page.fill('input[type="email"]', 'demo@company.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button:has-text("Sign In")');

        // Wait for dashboard
        await expect(page.locator('text=demo@company.com')).toBeVisible({ timeout: 15000 });

        // Logout
        await page.click('button:has-text("Logout")');

        // Should be back at login
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });

});
