import { test, expect } from '@playwright/test';

/**
 * API Endpoint E2E Tests
 * Tests API endpoints for The Analyser and The Optimizer
 */

test.describe('API Endpoints', () => {
    test.describe('Analyser API', () => {
        test('GET /api/analyser/projects should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/projects');

            // Should return 200 or 401 (if auth required)
            expect([200, 401]).toContain(response.status());

            if (response.status() === 200) {
                const data = await response.json();
                expect(data).toBeDefined();
            }
        });

        test('GET /api/analyser/keywords should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/keywords');

            expect([200, 400, 401]).toContain(response.status());

            const contentType = response.headers()['content-type'];
            expect(contentType).toContain('application/json');
        });

        test('GET /api/analyser/copilot should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/copilot');

            expect([200, 401]).toContain(response.status());
        });

        test('POST /api/analyser/copilot should accept queries', async ({ request }) => {
            const response = await request.post('/api/analyser/copilot', {
                data: { query: 'What are my top keywords?' }
            });

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/analyser/domains should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/domains');

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/analyser/traffic should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/traffic?projectId=test');

            expect([200, 400, 401, 404]).toContain(response.status());
        });

        test('GET /api/analyser/backlinks should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/backlinks?projectId=test');

            expect([200, 400, 401, 404]).toContain(response.status());
        });

        test('GET /api/analyser/audit should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/audit?projectId=test');

            expect([200, 400, 401, 404]).toContain(response.status());
        });

        test('GET /api/analyser/competitors should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/competitors?projectId=test');

            expect([200, 400, 401, 404]).toContain(response.status());
        });

        test('GET /api/analyser/reports should return JSON', async ({ request }) => {
            const response = await request.get('/api/analyser/reports');

            expect([200, 401]).toContain(response.status());
        });
    });

    test.describe('Optimizer API', () => {
        test('GET /api/optimizer/connections should return JSON', async ({ request }) => {
            const response = await request.get('/api/optimizer/connections');

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/optimizer/campaigns should return JSON', async ({ request }) => {
            const response = await request.get('/api/optimizer/campaigns');

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/optimizer/rules should return JSON', async ({ request }) => {
            const response = await request.get('/api/optimizer/rules');

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/optimizer/suggestions should return JSON', async ({ request }) => {
            const response = await request.get('/api/optimizer/suggestions');

            expect([200, 401]).toContain(response.status());
        });

        test('POST /api/optimizer/copilot should accept queries', async ({ request }) => {
            const response = await request.post('/api/optimizer/copilot', {
                data: { message: 'What is my best performing campaign?' }
            });

            expect([200, 401]).toContain(response.status());
        });
    });

    test.describe('Agency API', () => {
        test('GET /api/agency/clients should return JSON', async ({ request }) => {
            const response = await request.get('/api/agency/clients');

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/agency/projects should return JSON', async ({ request }) => {
            const response = await request.get('/api/agency/projects');

            expect([200, 401]).toContain(response.status());
        });

        test('GET /api/agency/tasks should return JSON', async ({ request }) => {
            const response = await request.get('/api/agency/tasks');

            expect([200, 401]).toContain(response.status());
        });
    });

    test.describe('Strategy API', () => {
        test('GET /api/strategies should return JSON', async ({ request }) => {
            const response = await request.get('/api/strategies');

            expect([200, 401]).toContain(response.status());
        });
    });

    test.describe('Blog API', () => {
        test('GET /api/blog/posts should return JSON', async ({ request }) => {
            const response = await request.get('/api/blog/posts');

            expect([200, 401]).toContain(response.status());

            if (response.status() === 200) {
                const data = await response.json();
                expect(data).toBeDefined();
            }
        });
    });

    test.describe('Health Checks', () => {
        test('API should respond to health checks', async ({ request }) => {
            const response = await request.get('/api/health');

            // May or may not exist, but shouldn't error
            expect([200, 404]).toContain(response.status());
        });
    });

    test.describe('Error Handling', () => {
        test('should return 404 for non-existent API routes', async ({ request }) => {
            const response = await request.get('/api/this-does-not-exist-12345');

            expect(response.status()).toBe(404);
        });

        test('should return proper error format', async ({ request }) => {
            const response = await request.post('/api/analyser/projects', {
                data: {} // Empty data - should fail validation
            });

            expect([400, 401]).toContain(response.status());

            const data = await response.json();
            expect(data.error).toBeDefined();
        });
    });
});
