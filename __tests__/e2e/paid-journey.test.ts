/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { POST as createStrategy } from '@/app/api/strategies/route';
import { GET as getStrategies } from '@/app/api/strategies/enhanced/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
        subscription: {
            create: vi.fn(),
            findUnique: vi.fn(),
            upsert: vi.fn(),
        },
        marketingStrategy: {
            create: vi.fn(),
            findMany: vi.fn(),
            count: vi.fn(),
            update: vi.fn(),
        },
    },
}));

vi.mock('@/lib/csrf', () => ({
    requireCsrfToken: vi.fn().mockReturnValue({ valid: true }),
}));

vi.mock('@/lib/services/strategy-metrics-logger', () => ({
    StrategyMetricsLogger: {
        log: vi.fn(),
    },
}));

vi.mock('@/lib/services/strategy-processor', () => ({
    StrategyProcessor: {
        processStrategy: vi.fn().mockResolvedValue({
            output: { executiveSummary: 'Mock Summary' },
            generatedBy: 'AI',
        }),
    },
}));

vi.mock('@/lib/rate-limiters', () => ({
    strategyCreationRateLimiter: {
        check: vi.fn().mockReturnValue({ allowed: true, remaining: 10, resetAt: Date.now() + 1000 }),
    },
}));

const mockGetServerSession = getServerSession as vi.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as vi.Mocked<typeof prisma>;

describe('Paid User Journey Integration', () => {
    const mockUser = {
        id: 'paid-user-123',
        name: 'Paid User',
        email: 'paid@example.com',
        role: 'USER',
    };

    const mockSession = {
        user: mockUser,
        expires: '2024-12-31',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should allow PRO user to create multiple strategies (Unlimited)', async () => {
        mockGetServerSession.mockResolvedValue(mockSession);

        // Mock PRO subscription
        mockPrisma.subscription.findUnique.mockResolvedValue({
            id: 'sub-1',
            userId: mockUser.id,
            plan: 'PRO',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock user verification
        mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

        // Mock existing strategies count (e.g., 5)
        mockPrisma.marketingStrategy.count.mockResolvedValue(5);

        // Mock strategy creation
        const newStrategy = {
            id: 'strategy-6',
            userId: mockUser.id,
            input: JSON.stringify({ businessName: 'Biz 6', industry: 'Tech' }),
            output: null,
            createdAt: new Date(),
        };
        mockPrisma.marketingStrategy.create.mockResolvedValue(newStrategy as any);

        // Mock strategy update (after processing)
        const updatedStrategy = {
            ...newStrategy,
            output: JSON.stringify({ executiveSummary: 'Mock Summary' }),
            generatedBy: 'AI',
        };
        mockPrisma.marketingStrategy.update.mockResolvedValue(updatedStrategy as any);

        const strategyInput = {
            businessName: 'Biz 6',
            industry: 'Tech',
            targetAudience: 'Tech professionals',
            budget: 50000,
            objectives: ['Increase sales', 'Brand awareness'],
            timeframe: '6-months',
            currentChallenges: 'Market competition',
        };

        const { req } = createMocks({
            method: 'POST',
            url: 'http://localhost:3000/api/strategies',
            body: strategyInput,
            headers: {
                'x-csrf-token': 'valid-token',
            },
        });
        req.json = vi.fn().mockResolvedValue(strategyInput);

        const response = await createStrategy(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.success).toBe(true);
        expect(data.data.id).toBe('strategy-6');
    });

    it('should allow PRO user to access Export features (via Enhanced API)', async () => {
        // This logic is usually in the UI or a specific export API
        // We'll verify the API endpoint for export if it exists, or just the strategy fetch which might return permissions

        mockGetServerSession.mockResolvedValue(mockSession);

        // Mock PRO subscription
        mockPrisma.subscription.findUnique.mockResolvedValue({
            id: 'sub-1',
            userId: mockUser.id,
            plan: 'PRO',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock strategies fetch with all required fields
        mockPrisma.marketingStrategy.findMany.mockResolvedValue([
            {
                id: 's1',
                name: 'Test Strategy',
                input: '{}',
                output: '{}',
                generatedBy: 'AI',
                status: 'ACTIVE',
                tags: null,
                notes: null,
                version: 1,
                isArchived: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                _count: {
                    comments: 0,
                    versions: 1,
                },
            }
        ] as any);
        mockPrisma.marketingStrategy.count.mockResolvedValue(1);

        const { req } = createMocks({
            method: 'GET',
            url: 'http://localhost:3000/api/strategies/enhanced',
        });

        const response = await getStrategies(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.freeTier).toBe(false); // Key verification: Not free tier
    });

    it('should restrict FREE user to 1 strategy per month', async () => {
        mockGetServerSession.mockResolvedValue(mockSession);

        // Mock FREE subscription
        mockPrisma.subscription.findUnique.mockResolvedValue({
            id: 'sub-free',
            userId: mockUser.id,
            plan: 'FREE',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock user verification
        mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

        // Mock existing strategies count (1 strategy this month)
        mockPrisma.marketingStrategy.count.mockResolvedValue(1);

        const { req } = createMocks({
            method: 'POST',
            url: 'http://localhost:3000/api/strategies',
            body: {
                businessName: 'Biz 2',
                industry: 'Tech',
                targetAudience: 'Test audience',
                budget: 10000,
                objectives: ['Test objective'],
                timeframe: '3-months',
                currentChallenges: 'Test challenges',
            },
            headers: {
                'x-csrf-token': 'valid-token',
            },
        });
        req.json = vi.fn().mockResolvedValue({
            businessName: 'Biz 2',
            industry: 'Tech',
            targetAudience: 'Test audience',
            budget: 10000,
            objectives: ['Test objective'],
            timeframe: '3-months',
            currentChallenges: 'Test challenges',
        });

        const response = await createStrategy(req);
        const data = await response.json();

        // Should return 403 due to free tier limit
        expect(response.status).toBe(403);
        expect(data.success).toBe(false);
        expect(data.code).toBe('FREE_TIER_LIMIT_EXCEEDED');
        expect(data.error).toContain('free tier limit');
    });
});
