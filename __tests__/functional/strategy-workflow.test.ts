/**
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

 * Functional Tests for Complete Strategy Workflow
 * 
 * This test suite verifies the end-to-end functionality of the
 * Strategy Builder Engine including CRUD operations, authentication,
 * and API integration.
 */

import { createMocks } from 'node-mocks-http';
import { POST, GET, PUT, DELETE } from '@/app/api/strategies/route';
import { GET as GetStrategy, PUT as UpdateStrategy, DELETE as DeleteStrategy } from '@/app/api/strategies/[id]/route';
import { StrategyProcessor } from '@/lib/services/strategy-processor';
import { OpenAIStrategyService } from '@/lib/services/openai-client';
import { EnterpriseStrategyPlan } from '@/types';

const { getServerSessionMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => {
  const strategy = {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  };

  const strategyGenerationMetric = {
    create: vi.fn(),
    count: vi.fn(),
  };

  const user = {
    findUnique: vi.fn(),
  };

  return {
    prisma: {
      strategy,
      marketingStrategy: strategy,
      strategyGenerationMetric,
      user,
    },
  };
});

vi.mock('@/lib/csrf', () => ({
  requireCsrfToken: () => ({ valid: true }),
}));

// Mock NextAuth for both import paths used across the app
vi.mock('next-auth/next', () => ({
  getServerSession: getServerSessionMock,
}));
vi.mock('next-auth', () => ({
  getServerSession: getServerSessionMock,
}));

// Mock OpenAI
vi.mock('@/lib/services/openai-client');

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';

const mockPrisma = prisma as vi.Mocked<typeof prisma>;
const mockGetServerSession = getServerSession as vi.Mock;

describe('Strategy Workflow Functional Tests', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'USER',
  };

  const mockSession = {
    user: mockUser,
  };

  const validStrategyInput = {
    businessName: 'Test Company',
    industry: 'technology',
    targetAudience: 'Tech-savvy professionals aged 25-45',
    budget: 50000,
    objectives: ['increase_brand_awareness', 'generate_leads'],
    timeframe: '6-months',
    currentChallenges: 'Limited brand recognition in the market',
    competitorInfo: 'Competing with established players',
    existingMarketing: 'Basic social media presence',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerSession.mockResolvedValue(mockSession);
    (mockPrisma.user?.findUnique as unknown as vi.Mock).mockResolvedValue({
      id: mockUser.id,
      email: mockUser.email,
    });
  });

const createMockStrategyOutput = () => ({
  executiveSummary: 'AI-generated summary',
  targetAudience: [],
  marketingChannels: [],
  contentStrategy: { themes: [], contentTypes: [], frequency: '', distribution: [] },
  timeline: [],
  budget: { total: 50000, channels: [], contingency: 5000 },
  kpis: [],
  recommendations: [],
  enterprisePlan: createMockEnterprisePlan(),
});

  describe('Strategy Creation Workflow', () => {
    it('should create strategy with valid input', async () => {
      const mockStrategyOutput = createMockStrategyOutput();
      const createdRecord = {
        id: 'strategy-123',
        userId: mockUser.id,
        input: JSON.stringify(validStrategyInput),
        output: null,
        generatedBy: 'AI',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const processSpy = vi
        .spyOn(StrategyProcessor, 'processStrategy')
        .mockResolvedValue({ output: mockStrategyOutput, generatedBy: 'AI' });

      mockPrisma.strategy.create.mockResolvedValue(createdRecord as any);
      mockPrisma.strategy.update.mockResolvedValue({
        ...createdRecord,
        output: JSON.stringify(mockStrategyOutput),
      } as any);

      const { req, res } = createMocks({
        method: 'POST',
        body: validStrategyInput,
      });
      (req as any).json = async () => validStrategyInput;

      await POST(req as any);

      expect(mockPrisma.strategy.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          businessName: validStrategyInput.businessName,
          industry: validStrategyInput.industry,
          budget: validStrategyInput.budget,
        }),
      });

      processSpy.mockRestore();
    });

    it('should validate input before creating strategy', async () => {
      const invalidInput = {
        businessName: 'A', // Too short
        industry: 'invalid_industry',
        budget: 500, // Too low
        objectives: [], // Empty array
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidInput,
      });
      (req as any).json = async () => invalidInput;

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('validation');
    });

    it('should require authentication for strategy creation', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'POST',
        body: validStrategyInput,
      });
      (req as any).json = async () => validStrategyInput;

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should process strategy with AI when available', async () => {
      const mockAIOutput = {
        executiveSummary: 'AI-generated summary',
        targetAudience: [],
        marketingChannels: [],
        contentStrategy: { themes: [], contentTypes: [], frequency: '', distribution: [] },
        timeline: [],
        budget: { total: 50000, channels: [], contingency: 5000 },
        kpis: [],
        recommendations: [],
        enterprisePlan: createMockEnterprisePlan(),
      };

      (OpenAIStrategyService.generateStrategy as vi.Mock).mockResolvedValue(mockAIOutput);

      const result = await StrategyProcessor.processStrategy(validStrategyInput, { useAI: true });

      expect(result.generatedBy).toBe('AI');
      expect(result.output).toEqual(mockAIOutput);
    });

    it('should fallback to rules engine when AI fails', async () => {
      (OpenAIStrategyService.generateStrategy as vi.Mock).mockRejectedValue(new Error('AI Error'));

      const result = await StrategyProcessor.processStrategy(validStrategyInput, { useAI: true, fallbackToRules: true });

      expect(result.generatedBy).toBe('FALLBACK');
      expect(result.output).toBeDefined();
      expect(result.output.executiveSummary).toBeDefined();
    });
  });

  describe('Strategy Retrieval and Listing', () => {
    it('should list user strategies with pagination', async () => {
      const mockStrategies = [
        { id: '1', businessName: 'Company 1', userId: mockUser.id },
        { id: '2', businessName: 'Company 2', userId: mockUser.id },
      ];

      mockPrisma.strategy.findMany.mockResolvedValue(mockStrategies);
      mockPrisma.strategy.count.mockResolvedValue(2);

      const { req, res } = createMocks({
        method: 'GET',
        query: { page: '1', limit: '10' },
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockStrategies);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        pages: 1,
      });
    });

    it('should filter strategies by industry', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { industry: 'technology' },
      });

      await GET(req as any);

      expect(mockPrisma.strategy.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          industry: 'technology',
        }),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should search strategies by business name', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { search: 'test company' },
      });

      await GET(req as any);

      expect(mockPrisma.strategy.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          businessName: {
            contains: 'test company',
            mode: 'insensitive',
          },
        }),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should get specific strategy by ID', async () => {
      const mockStrategy = {
        id: 'strategy-123',
        businessName: 'Test Company',
        userId: mockUser.id,
      };

      mockPrisma.strategy.findUnique.mockResolvedValue(mockStrategy);

      const { req, res } = createMocks({
        method: 'GET',
      });

      const response = await GetStrategy(req as any, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockStrategy);
    });

    it('should return 404 for non-existent strategy', async () => {
      mockPrisma.strategy.findUnique.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'GET',
      });

      const response = await GetStrategy(req as any, { params: { id: 'non-existent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Strategy not found');
    });
  });

  describe('Strategy Update Workflow', () => {
    it('should update strategy with valid data', async () => {
      const existingStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        businessName: 'Old Name',
      };

      const updateData = {
        businessName: 'New Name',
        budget: 75000,
      };

      const updatedStrategy = {
        ...existingStrategy,
        ...updateData,
      };

      mockPrisma.strategy.findUnique.mockResolvedValue(existingStrategy);
      mockPrisma.strategy.update.mockResolvedValue(updatedStrategy);

      const { req, res } = createMocks({
        method: 'PUT',
        body: updateData,
      });

      const response = await UpdateStrategy(req as any, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.businessName).toBe('New Name');
    });

    it('should prevent updating other users strategies', async () => {
      const otherUserStrategy = {
        id: 'strategy-123',
        userId: 'other-user-id',
        businessName: 'Other User Strategy',
      };

      mockPrisma.strategy.findUnique.mockResolvedValue(otherUserStrategy);

      const { req, res } = createMocks({
        method: 'PUT',
        body: { businessName: 'Hacked Name' },
      });

      const response = await UpdateStrategy(req as any, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Access denied');
    });
  });

  describe('Strategy Deletion Workflow', () => {
    it('should delete strategy successfully', async () => {
      const existingStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        businessName: 'Test Strategy',
      };

      mockPrisma.strategy.findUnique.mockResolvedValue(existingStrategy);
      mockPrisma.strategy.delete.mockResolvedValue(existingStrategy);

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      const response = await DeleteStrategy(req as any, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Strategy deleted successfully');
    });

    it('should prevent deleting other users strategies', async () => {
      const otherUserStrategy = {
        id: 'strategy-123',
        userId: 'other-user-id',
        businessName: 'Other User Strategy',
      };

      mockPrisma.strategy.findUnique.mockResolvedValue(otherUserStrategy);

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      const response = await DeleteStrategy(req as any, { params: { id: 'strategy-123' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Access denied');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle database connection errors', async () => {
      mockPrisma.strategy.create.mockRejectedValue(new Error('Database connection failed'));

      const { req, res } = createMocks({
        method: 'POST',
        body: validStrategyInput,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Internal server error');
    });

    it('should handle malformed JSON input', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should handle missing required fields', async () => {
      const incompleteInput = {
        businessName: 'Test Company',
        // Missing required fields
      };

      const { req, res } = createMocks({
        method: 'POST',
        body: incompleteInput,
      });

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('validation');
    });
  });
});
  const createMockEnterprisePlan = (): EnterpriseStrategyPlan => ({
    executiveSummary: {
      overview: 'Overview',
      globalPriorities: ['priority'],
      investmentRationale: ['rationale'],
      expectedImpact: ['impact'],
      globalRisks: ['risk'],
    },
    marketOverview: {
      globalSnapshot: 'Global snapshot',
      keyTrends: ['trend'],
      regions: [],
    },
    segmentationAndUseCases: {
      globalSegments: [],
      regionalAdaptations: [],
      useCases: [],
    },
    objectivesAndKPIs: [],
    governanceModel: {
      executiveSponsors: [],
      globalMarketingLeads: [],
      regionalLeads: [],
      crossFunctionalPartners: [],
      decisionFramework: 'framework',
      reviewCadence: [],
    },
    resourcingAndBudget: {
      headcountPlan: [],
      partnerStrategy: [],
      budgetModel: {
        summary: 'summary',
        regionalAllocations: [],
        channelAllocations: [],
        innovationReserve: 'reserve',
      },
    },
    technologyDataCompliance: {
      martechStack: [],
      dataFlow: [],
      complianceChecklist: [],
    },
    integratedChannelStrategy: {
      lifecycleNarrative: 'narrative',
      channels: [],
    },
    regionalPlaybooks: [],
    measurementAndOptimization: {
      globalDashboard: [],
      regionalDashboardGuidelines: [],
      testAndLearnFramework: [],
      reviewCadence: {
        monthly: [],
        quarterly: [],
      },
      reallocationGuidelines: [],
    },
    roadmap90To180: {
      quickWins90Days: [],
      initiatives90To180: [],
      dependencies: [],
    },
  });
