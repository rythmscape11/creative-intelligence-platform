/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/strategies/enhanced/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
    prisma: {
        marketingStrategy: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
        subscription: {
            findUnique: vi.fn(),
        },
    },
}));

const mockGetServerSession = getServerSession as vi.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as vi.Mocked<typeof prisma>;

describe('/api/strategies/enhanced (Free Tier)', () => {
    const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
    };

    const mockSession = {
        user: mockUser,
        expires: '2024-12-31',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return freeTier: true for user with FREE subscription', async () => {
        mockGetServerSession.mockResolvedValue(mockSession);

        // Mock free subscription
        mockPrisma.subscription.findUnique.mockResolvedValue({
            id: 'sub-1',
            userId: mockUser.id,
            plan: 'FREE',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock empty strategies
        mockPrisma.marketingStrategy.findMany.mockResolvedValue([]);
        mockPrisma.marketingStrategy.count.mockResolvedValue(0);

        const { req } = createMocks({
            method: 'GET',
            url: 'http://localhost:3000/api/strategies/enhanced',
        });

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.freeTier).toBe(true);
        expect(data.data).toEqual([]);
    });

    it('should return freeTier: true for user with NO subscription', async () => {
        mockGetServerSession.mockResolvedValue(mockSession);

        // Mock no subscription
        mockPrisma.subscription.findUnique.mockResolvedValue(null);

        // Mock empty strategies
        mockPrisma.marketingStrategy.findMany.mockResolvedValue([]);
        mockPrisma.marketingStrategy.count.mockResolvedValue(0);

        const { req } = createMocks({
            method: 'GET',
            url: 'http://localhost:3000/api/strategies/enhanced',
        });

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.freeTier).toBe(true);
    });

    it('should return freeTier: false for PRO user', async () => {
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

        mockPrisma.marketingStrategy.findMany.mockResolvedValue([]);
        mockPrisma.marketingStrategy.count.mockResolvedValue(0);

        const { req } = createMocks({
            method: 'GET',
            url: 'http://localhost:3000/api/strategies/enhanced',
        });

        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.freeTier).toBe(false);
    });

    it('should return empty list instead of 500 for free user when DB fails', async () => {
        mockGetServerSession.mockResolvedValue(mockSession);

        // Mock free subscription
        mockPrisma.subscription.findUnique.mockResolvedValue({
            id: 'sub-1',
            userId: mockUser.id,
            plan: 'FREE',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Mock DB error
        mockPrisma.marketingStrategy.findMany.mockRejectedValue(new Error('Database connection failed'));

        const { req } = createMocks({
            method: 'GET',
            url: 'http://localhost:3000/api/strategies/enhanced',
        });

        const response = await GET(req);
        const data = await response.json();

        // This is the key fix: should be 200, not 500
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.freeTier).toBe(true);
        expect(data.data).toEqual([]);
    });

    it('should return 500 for PRO user when DB fails', async () => {
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

        // Mock DB error
        mockPrisma.marketingStrategy.findMany.mockRejectedValue(new Error('Database connection failed'));

        const { req } = createMocks({
            method: 'GET',
            url: 'http://localhost:3000/api/strategies/enhanced',
        });

        const response = await GET(req);
        const data = await response.json();

        // PRO users should still see errors to debug issues
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
    });
});
