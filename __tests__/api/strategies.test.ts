/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/strategies/route';
import { GET as getStrategy, PUT, DELETE } from '@/app/api/strategies/[id]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    marketingStrategy: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as vi.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as vi.Mocked<typeof prisma>;

describe('/api/strategies', () => {
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

  const mockStrategyInput = {
    businessName: 'Test Company',
    industry: 'technology',
    targetAudience: 'Young professionals interested in technology solutions',
    budget: 50000,
    objectives: ['Increase brand awareness', 'Generate more leads'],
    timeframe: '6-months',
    currentChallenges: 'Limited brand recognition and high customer acquisition costs',
    competitorInfo: 'Main competitors include TechCorp and InnovateSoft',
    existingMarketing: 'Currently using Google Ads and social media',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/strategies', () => {
    it('should return user strategies with pagination', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      
      const mockStrategies = [
        {
          id: 'strategy-1',
          input: JSON.stringify(mockStrategyInput),
          output: JSON.stringify({ executiveSummary: 'Test summary' }),
          generatedBy: 'AI',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.marketingStrategy.findMany.mockResolvedValue(mockStrategies);
      mockPrisma.marketingStrategy.count.mockResolvedValue(1);

      const { req } = createMocks({
        method: 'GET',
        url: 'http://localhost:3000/api/strategies?page=1&limit=10',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'GET',
        url: '/api/strategies',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.marketingStrategy.findMany.mockRejectedValue(new Error('Database error'));

      const { req } = createMocks({
        method: 'GET',
        url: 'http://localhost:3000/api/strategies',
      });

      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/strategies', () => {
    it('should create a new strategy with valid input', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockCreatedStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        input: JSON.stringify(mockStrategyInput),
        output: null,
        generatedBy: 'AI',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdatedStrategy = {
        ...mockCreatedStrategy,
        output: JSON.stringify({ executiveSummary: 'Generated summary' }),
        generatedBy: 'FALLBACK',
      };

      mockPrisma.marketingStrategy.create.mockResolvedValue(mockCreatedStrategy);
      mockPrisma.marketingStrategy.update.mockResolvedValue(mockUpdatedStrategy);

      const { req } = createMocks({
        method: 'POST',
        url: 'http://localhost:3000/api/strategies',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockStrategyInput),
      });

      // Mock the json method
      req.json = vi.fn().mockResolvedValue(mockStrategyInput);

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('strategy-123');
      expect(data.data.input).toEqual(mockStrategyInput);
      expect(data.data.output).toBeDefined();
    });

    it('should return 400 for invalid input', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const invalidInput = {
        businessName: 'A', // Too short
        industry: 'technology',
        // Missing required fields
      };

      const { req } = createMocks({
        method: 'POST',
        url: 'http://localhost:3000/api/strategies',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidInput),
      });

      // Mock the json method
      req.json = vi.fn().mockResolvedValue(invalidInput);

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'POST',
        url: 'http://localhost:3000/api/strategies',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockStrategyInput),
      });

      // Mock the json method
      req.json = vi.fn().mockResolvedValue(mockStrategyInput);

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('GET /api/strategies/[id]', () => {
    it('should return specific strategy for authenticated user', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        input: JSON.stringify(mockStrategyInput),
        output: JSON.stringify({ executiveSummary: 'Test summary' }),
        generatedBy: 'AI',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      };

      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy);

      const { req } = createMocks({
        method: 'GET',
        url: 'http://localhost:3000/api/strategies/strategy-123',
      });

      const response = await getStrategy(req, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('strategy-123');
      expect(data.data.input).toEqual(mockStrategyInput);
    });

    it('should return 404 for non-existent strategy', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'GET',
        url: 'http://localhost:3000/api/strategies/non-existent',
      });

      const response = await getStrategy(req, { params: { id: 'non-existent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Strategy not found');
    });
  });

  describe('PUT /api/strategies/[id]', () => {
    it('should update existing strategy', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const existingStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        input: JSON.stringify(mockStrategyInput),
        output: JSON.stringify({ executiveSummary: 'Old summary' }),
        generatedBy: 'AI',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedStrategy = {
        ...existingStrategy,
        input: JSON.stringify({ ...mockStrategyInput, businessName: 'Updated Company' }),
        output: null,
        updatedAt: new Date(),
      };

      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(existingStrategy);
      mockPrisma.marketingStrategy.update.mockResolvedValue(updatedStrategy);

      const { req } = createMocks({
        method: 'PUT',
        url: 'http://localhost:3000/api/strategies/strategy-123',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...mockStrategyInput, businessName: 'Updated Company' }),
      });

      // Mock the json method
      req.json = vi.fn().mockResolvedValue({ ...mockStrategyInput, businessName: 'Updated Company' });

      const response = await PUT(req, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.input.businessName).toBe('Updated Company');
    });

    it('should return 404 for non-existent strategy', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'PUT',
        url: 'http://localhost:3000/api/strategies/non-existent',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockStrategyInput),
      });

      // Mock the json method
      req.json = vi.fn().mockResolvedValue(mockStrategyInput);

      const response = await PUT(req, { params: { id: 'non-existent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Strategy not found');
    });
  });

  describe('DELETE /api/strategies/[id]', () => {
    it('should delete existing strategy', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const existingStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        input: JSON.stringify(mockStrategyInput),
        output: JSON.stringify({ executiveSummary: 'Test summary' }),
        generatedBy: 'AI',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(existingStrategy);
      mockPrisma.marketingStrategy.delete.mockResolvedValue(existingStrategy);

      const { req } = createMocks({
        method: 'DELETE',
        url: 'http://localhost:3000/api/strategies/strategy-123',
      });

      const response = await DELETE(req, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Strategy deleted successfully');
    });

    it('should return 404 for non-existent strategy', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(null);

      const { req } = createMocks({
        method: 'DELETE',
        url: 'http://localhost:3000/api/strategies/non-existent',
      });

      const response = await DELETE(req, { params: { id: 'non-existent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Strategy not found');
    });
  });
});
