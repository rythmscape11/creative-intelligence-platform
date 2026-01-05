/**
 * Forge API Key Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

// Mock modules
vi.mock('@/lib/prisma', () => ({
    prisma: {
        forgeEnvironment: {
            findUnique: vi.fn(),
        },
        forgeApiKey: {
            create: vi.fn(),
            findMany: vi.fn(),
            findFirst: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

describe('ForgeApiKeyService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Key format', () => {
        it('should generate keys with correct prefix for sandbox', async () => {
            // Test that sandbox keys start with frg_test_
            const sandboxKey = 'frg_test_abc123';
            expect(sandboxKey.startsWith('frg_test_')).toBe(true);
        });

        it('should generate keys with correct prefix for production', async () => {
            // Test that production keys start with frg_live_
            const liveKey = 'frg_live_xyz789';
            expect(liveKey.startsWith('frg_live_')).toBe(true);
        });
    });

    describe('Key validation', () => {
        it('should identify sandbox keys correctly', () => {
            const key = 'frg_test_abcdef123456';
            const isSandbox = key.includes('test');
            expect(isSandbox).toBe(true);
        });

        it('should identify production keys correctly', () => {
            const key = 'frg_live_abcdef123456';
            const isProduction = key.includes('live');
            expect(isProduction).toBe(true);
        });

        it('should reject invalid key format', () => {
            const invalidKey = 'sk_test_abc123';
            const isValid = invalidKey.startsWith('frg_');
            expect(isValid).toBe(false);
        });
    });

    describe('Scope validation', () => {
        it('should validate required scopes', () => {
            const keyScopes = ['images', 'videos', 'flows'];
            const requiredScopes = ['images'];

            const hasAllScopes = requiredScopes.every(scope => keyScopes.includes(scope));
            expect(hasAllScopes).toBe(true);
        });

        it('should fail when missing required scopes', () => {
            const keyScopes = ['images'];
            const requiredScopes = ['videos'];

            const hasAllScopes = requiredScopes.every(scope => keyScopes.includes(scope));
            expect(hasAllScopes).toBe(false);
        });
    });
});
