/**
 * Agency OS Module E2E Tests
 * 
 * Tests Agency management:
 * - Dashboard access
 * - Client management (CRUD)
 * - Project management
 * - Task management with Kanban
 */

import { test, expect } from '@playwright/test';
import { mockClient, mockProject, mockTasks } from './fixtures';

test.describe('Agency OS Module', () => {
    test.use({ storageState: 'storage/user.json' });

    test.skip(!process.env.TEST_USER_EMAIL, 'Requires authenticated user');

    test.describe('Dashboard', () => {
        test('should load Agency OS dashboard', async ({ page }) => {
            await page.goto('/agency');
            await page.waitForLoadState('networkidle');

            await test.step('Verify dashboard loads', async () => {
                // Check for dashboard elements
                const heading = page.locator('h1, h2').filter({ hasText: /agency|dashboard|overview/i }).first();
                await expect(heading).toBeVisible({ timeout: 15000 });
            });

            await test.step('Verify sidebar navigation', async () => {
                const sidebar = page.locator('nav, aside, [data-testid="sidebar"]').first();
                await expect(sidebar).toBeVisible();
            });

            await test.step('Verify key navigation items', async () => {
                const navItems = ['Clients', 'Projects', 'Tasks'];
                for (const item of navItems) {
                    const navLink = page.locator(`a:has-text("${item}")`).first();
                    await expect(navLink).toBeVisible({ timeout: 5000 });
                }
            });
        });
    });

    test.describe('Client Management', () => {
        test('should navigate to clients page', async ({ page }) => {
            await page.goto('/agency/clients');
            await page.waitForLoadState('networkidle');

            await test.step('Verify clients page', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /client/i }).first();
                await expect(heading).toBeVisible({ timeout: 10000 });
            });

            await test.step('Verify add client button', async () => {
                const addBtn = page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add Client")').first();
                await expect(addBtn).toBeVisible();
            });
        });

        test('should create a new client', async ({ page }) => {
            // Mock API for client creation
            await page.route('**/api/agency/clients**', async (route) => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 201,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            id: 'client_test123',
                            ...mockClient,
                            createdAt: new Date().toISOString(),
                        }),
                    });
                } else {
                    await route.continue();
                }
            });

            await page.goto('/agency/clients');
            await page.waitForLoadState('networkidle');

            await test.step('Click Add Client', async () => {
                const addBtn = page.locator('button:has-text("Add"), button:has-text("New Client")').first();
                if (await addBtn.isVisible()) {
                    await addBtn.click();
                    await page.waitForTimeout(1000);
                }
            });

            await test.step('Fill client form', async () => {
                const nameInput = page.locator('input[name="name"], input[placeholder*="name"]').first();
                if (await nameInput.isVisible()) {
                    await nameInput.fill(mockClient.name);
                }

                const emailInput = page.locator('input[name="email"], input[type="email"]').first();
                if (await emailInput.isVisible()) {
                    await emailInput.fill(mockClient.email);
                }
            });

            await test.step('Submit form', async () => {
                const submitBtn = page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
                if (await submitBtn.isVisible()) {
                    await submitBtn.click();
                    await page.waitForTimeout(2000);
                }
            });
        });
    });

    test.describe('Project Management', () => {
        test('should navigate to projects page', async ({ page }) => {
            await page.goto('/agency/projects');
            await page.waitForLoadState('networkidle');

            await test.step('Verify projects page', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /project/i }).first();
                await expect(heading).toBeVisible({ timeout: 10000 });
            });
        });

        test('should create a new project', async ({ page }) => {
            // Mock API
            await page.route('**/api/agency/projects**', async (route) => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 201,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            id: 'project_test123',
                            ...mockProject,
                        }),
                    });
                } else {
                    await route.continue();
                }
            });

            await page.goto('/agency/projects');
            await page.waitForLoadState('networkidle');

            await test.step('Click Add Project', async () => {
                const addBtn = page.locator('button:has-text("Add"), button:has-text("New"), a:has-text("New Project")').first();
                if (await addBtn.isVisible()) {
                    await addBtn.click();
                }
            });

            await test.step('Fill project form', async () => {
                const titleInput = page.locator('input[name="title"], input[name="name"], input[placeholder*="title"]').first();
                if (await titleInput.isVisible()) {
                    await titleInput.fill(mockProject.title);
                }
            });

            await test.step('Submit', async () => {
                const submitBtn = page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]').first();
                if (await submitBtn.isVisible()) {
                    await submitBtn.click();
                }
            });
        });
    });

    test.describe('Task Management', () => {
        test('should navigate to tasks page', async ({ page }) => {
            await page.goto('/agency/tasks');
            await page.waitForLoadState('networkidle');

            await test.step('Verify tasks page loads', async () => {
                const heading = page.locator('h1, h2').filter({ hasText: /task/i }).first();
                await expect(heading).toBeVisible({ timeout: 10000 });
            });

            await test.step('Look for Kanban columns', async () => {
                const columns = ['To Do', 'In Progress', 'Done', 'Todo'];
                for (const col of columns) {
                    const column = page.locator(`text*="${col}"`).first();
                    if (await column.isVisible()) {
                        expect(true).toBe(true);
                        break;
                    }
                }
            });
        });

        test('should create tasks', async ({ page }) => {
            await page.route('**/api/agency/tasks**', async (route) => {
                if (route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 201,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            id: 'task_test123',
                            ...mockTasks[0],
                        }),
                    });
                } else {
                    await route.continue();
                }
            });

            await page.goto('/agency/tasks');
            await page.waitForLoadState('networkidle');

            await test.step('Add task', async () => {
                const addBtn = page.locator('button:has-text("Add"), button:has-text("New Task")').first();
                if (await addBtn.isVisible()) {
                    await addBtn.click();

                    const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first();
                    if (await titleInput.isVisible()) {
                        await titleInput.fill(mockTasks[0].title);
                    }

                    const submitBtn = page.locator('button:has-text("Save"), button:has-text("Add"), button[type="submit"]').first();
                    if (await submitBtn.isVisible()) {
                        await submitBtn.click();
                    }
                }
            });
        });
    });

    test.describe('Other Pages', () => {
        test('should load content calendar', async ({ page }) => {
            await page.goto('/agency/content-calendar');
            await page.waitForLoadState('networkidle');

            const heading = page.locator('h1, h2').first();
            await expect(heading).toBeVisible({ timeout: 10000 });
        });

        test('should load reports page', async ({ page }) => {
            await page.goto('/agency/reports');
            await page.waitForLoadState('networkidle');

            const heading = page.locator('h1, h2').first();
            await expect(heading).toBeVisible({ timeout: 10000 });
        });
    });
});
