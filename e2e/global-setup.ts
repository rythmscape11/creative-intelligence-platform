/**
 * Global Setup for Playwright Tests
 * 
 * This script runs once before all tests to:
 * 1. Create storage directory
 * 2. Set up authenticated storage states for user and admin
 */

import { chromium, FullConfig } from '@playwright/test';
import { loginAsUser, loginAsAdmin, hasUserStorageState, hasAdminStorageState } from './utils/auth';
import * as path from 'path';
import * as fs from 'fs';

async function globalSetup(config: FullConfig): Promise<void> {
    // Create storage directory if it doesn't exist
    const storageDir = path.join(process.cwd(), 'storage');
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }

    // Skip if storage states already exist and not in CI
    // In CI, always regenerate for fresh state
    const forceRegenerate = process.env.CI || process.env.REGENERATE_AUTH;

    if (!forceRegenerate && hasUserStorageState() && hasAdminStorageState()) {
        console.log('Storage states exist, skipping auth setup');
        return;
    }

    const browser = await chromium.launch();

    // Check if we have test credentials
    const hasUserCreds = process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD;
    const hasAdminCreds = process.env.TEST_ADMIN_EMAIL && process.env.TEST_ADMIN_PASSWORD;

    if (hasUserCreds) {
        try {
            console.log('Setting up user auth storage state...');
            const userContext = await browser.newContext();
            const userPage = await userContext.newPage();
            await loginAsUser(userPage, userContext);
            await userContext.close();
            console.log('User auth storage state saved');
        } catch (error) {
            console.warn('Failed to set up user auth:', error);
        }
    } else {
        console.warn('Skipping user auth setup - TEST_USER_EMAIL/PASSWORD not set');
    }

    if (hasAdminCreds) {
        try {
            console.log('Setting up admin auth storage state...');
            const adminContext = await browser.newContext();
            const adminPage = await adminContext.newPage();
            await loginAsAdmin(adminPage, adminContext);
            await adminContext.close();
            console.log('Admin auth storage state saved');
        } catch (error) {
            console.warn('Failed to set up admin auth:', error);
        }
    } else {
        console.warn('Skipping admin auth setup - TEST_ADMIN_EMAIL/PASSWORD not set');
    }

    await browser.close();
}

export default globalSetup;
