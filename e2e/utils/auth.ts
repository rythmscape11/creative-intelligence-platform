/**
 * Auth Utilities for Playwright E2E Tests
 * 
 * Provides helper functions for:
 * - Logging in as a regular user
 * - Logging in as an admin user
 * - Saving and reusing storage states
 * 
 * Environment Variables Required:
 * - TEST_USER_EMAIL
 * - TEST_USER_PASSWORD
 * - TEST_ADMIN_EMAIL
 * - TEST_ADMIN_PASSWORD
 */

import { Page, BrowserContext } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

export const AUTH_URLS = {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    dashboard: '/dashboard',
    home: '/',
};

export const STORAGE_PATHS = {
    user: path.join(process.cwd(), 'storage/user.json'),
    admin: path.join(process.cwd(), 'storage/admin.json'),
};

export interface TestCredentials {
    email: string;
    password: string;
}

/**
 * Get test user credentials from environment
 */
export function getUserCredentials(): TestCredentials {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!email || !password) {
        throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in environment');
    }

    return { email, password };
}

/**
 * Get admin user credentials from environment
 */
export function getAdminCredentials(): TestCredentials {
    const email = process.env.TEST_ADMIN_EMAIL;
    const password = process.env.TEST_ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD must be set in environment');
    }

    return { email, password };
}

/**
 * Login via Clerk UI
 * Handles the Clerk sign-in flow
 */
export async function loginWithClerk(
    page: Page,
    credentials: TestCredentials
): Promise<void> {
    // Navigate to sign-in page
    await page.goto(AUTH_URLS.signIn);
    await page.waitForLoadState('networkidle');

    // Wait for Clerk sign-in form
    // Clerk uses an iframe or embedded form
    const emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });

    // Enter email
    await emailInput.fill(credentials.email);

    // Click continue button
    const continueButton = page.locator('button:has-text("Continue"), button[type="submit"]').first();
    await continueButton.click();

    // Wait for password field
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });

    // Enter password
    await passwordInput.fill(credentials.password);

    // Click sign in button
    const signInButton = page.locator('button:has-text("Sign in"), button:has-text("Continue"), button[type="submit"]').first();
    await signInButton.click();

    // Wait for redirect to dashboard or authenticated state
    await page.waitForURL(/\/(dashboard|billing|agency|optimizer|analyser|strategiser)/, {
        timeout: 30000
    });
}

/**
 * Login as regular user and save storage state
 */
export async function loginAsUser(page: Page, context: BrowserContext): Promise<void> {
    const credentials = getUserCredentials();
    await loginWithClerk(page, credentials);

    // Save storage state
    ensureStorageDir();
    await context.storageState({ path: STORAGE_PATHS.user });
}

/**
 * Login as admin user and save storage state
 */
export async function loginAsAdmin(page: Page, context: BrowserContext): Promise<void> {
    const credentials = getAdminCredentials();
    await loginWithClerk(page, credentials);

    // Save storage state
    ensureStorageDir();
    await context.storageState({ path: STORAGE_PATHS.admin });
}

/**
 * Check if user storage state exists
 */
export function hasUserStorageState(): boolean {
    return fs.existsSync(STORAGE_PATHS.user);
}

/**
 * Check if admin storage state exists
 */
export function hasAdminStorageState(): boolean {
    return fs.existsSync(STORAGE_PATHS.admin);
}

/**
 * Ensure storage directory exists
 */
function ensureStorageDir(): void {
    const storageDir = path.dirname(STORAGE_PATHS.user);
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }
}

/**
 * Check if user is logged in by looking for common auth indicators
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
    try {
        // Look for user menu, profile button, or dashboard elements
        const loggedInIndicators = [
            '[data-testid="user-button"]',
            '[aria-label="Profile"]',
            'button:has-text("Sign Out")',
            '[data-testid="user-menu"]',
        ];

        for (const selector of loggedInIndicators) {
            const element = page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
                return true;
            }
        }

        return false;
    } catch {
        return false;
    }
}

/**
 * Logout the current user
 */
export async function logout(page: Page): Promise<void> {
    // Try to find and click sign out button
    const signOutButton = page.locator('button:has-text("Sign Out"), button:has-text("Log out")').first();

    if (await signOutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await signOutButton.click();
        await page.waitForURL(AUTH_URLS.home, { timeout: 15000 });
    }
}
