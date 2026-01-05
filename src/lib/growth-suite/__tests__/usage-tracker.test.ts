/**
 * Unit Tests for Growth Suite Usage Tracker
 * 
 * Tests quota enforcement, usage tracking, and limit calculations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  trackUsage, 
  getMonthlyUsage, 
  checkQuota, 
  getUserUsageStats,
  FREE_TIER_LIMITS 
} from '../usage-tracker';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    growthSuiteUsage: {
      create: vi.fn(),
      aggregate: vi.fn(),
      deleteMany: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

describe('Usage Tracker', () => {
  const mockUserId = 'test-user-123';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackUsage', () => {
    it('should track usage with correct parameters', async () => {
      const mockCreate = vi.fn().mockResolvedValue({
        id: 'usage-1',
        userId: mockUserId,
        tool: 'experiments',
        action: 'create',
        quotaUsed: 1,
      });
      
      (prisma.growthSuiteUsage.create as any) = mockCreate;

      await trackUsage(mockUserId, 'experiments', 'create', 1, { experimentId: 'exp-1' });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          tool: 'experiments',
          action: 'create',
          quotaUsed: 1,
          metadata: JSON.stringify({ experimentId: 'exp-1' }),
        },
      });
    });

    it('should handle metadata as null when not provided', async () => {
      const mockCreate = vi.fn().mockResolvedValue({});
      (prisma.growthSuiteUsage.create as any) = mockCreate;

      await trackUsage(mockUserId, 'seo', 'generate_brief');

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: null,
        }),
      });
    });
  });

  describe('getMonthlyUsage', () => {
    it('should return correct monthly usage', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: 42 },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      const usage = await getMonthlyUsage(mockUserId, 'experiments', 'pageview');

      expect(usage).toBe(42);
      expect(mockAggregate).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: mockUserId,
          tool: 'experiments',
          action: 'pageview',
        }),
        _sum: { quotaUsed: true },
      });
    });

    it('should return 0 when no usage found', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: null },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      const usage = await getMonthlyUsage(mockUserId, 'widgets');

      expect(usage).toBe(0);
    });

    it('should filter by current month', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: 10 },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      await getMonthlyUsage(mockUserId, 'seo');

      const call = mockAggregate.mock.calls[0][0];
      expect(call.where.timestamp).toBeDefined();
      expect(call.where.timestamp.gte).toBeInstanceOf(Date);
    });
  });

  describe('checkQuota', () => {
    it('should allow usage when under quota', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: 5 },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      const result = await checkQuota(mockUserId, 'experiments', 'pageview', 100);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(5);
      expect(result.limit).toBe(FREE_TIER_LIMITS.experiments.pageviews);
      expect(result.remaining).toBe(FREE_TIER_LIMITS.experiments.pageviews - 5);
    });

    it('should deny usage when quota exceeded', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: 10000 },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      const result = await checkQuota(mockUserId, 'experiments', 'pageview', 1);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(10000);
      expect(result.remaining).toBe(0);
    });

    it('should calculate correct limits for different tools', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: 0 },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      // Test experiments
      let result = await checkQuota(mockUserId, 'experiments', 'active', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.experiments.active);

      // Test attribution
      result = await checkQuota(mockUserId, 'attribution', 'event', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.attribution.events);

      // Test SEO
      result = await checkQuota(mockUserId, 'seo', 'generate_brief', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.seo.briefs);

      // Test repurposer
      result = await checkQuota(mockUserId, 'repurposer', 'generate', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.repurposer.generations);

      // Test widgets
      result = await checkQuota(mockUserId, 'widgets', 'active', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.widgets.active);

      // Test heatmaps
      result = await checkQuota(mockUserId, 'heatmaps', 'session', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.heatmaps.sessions);

      // Test competitors
      result = await checkQuota(mockUserId, 'competitors', 'track_competitor', 1);
      expect(result.limit).toBe(FREE_TIER_LIMITS.competitors.tracked);
    });

    it('should handle edge case at exact limit', async () => {
      const mockAggregate = vi.fn().mockResolvedValue({
        _sum: { quotaUsed: 50 },
      });
      
      (prisma.growthSuiteUsage.aggregate as any) = mockAggregate;

      const result = await checkQuota(mockUserId, 'repurposer', 'generate', 1);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(50);
      expect(result.remaining).toBe(0);
    });
  });

  describe('FREE_TIER_LIMITS', () => {
    it('should have correct structure', () => {
      expect(FREE_TIER_LIMITS).toHaveProperty('experiments');
      expect(FREE_TIER_LIMITS).toHaveProperty('attribution');
      expect(FREE_TIER_LIMITS).toHaveProperty('seo');
      expect(FREE_TIER_LIMITS).toHaveProperty('repurposer');
      expect(FREE_TIER_LIMITS).toHaveProperty('widgets');
      expect(FREE_TIER_LIMITS).toHaveProperty('heatmaps');
      expect(FREE_TIER_LIMITS).toHaveProperty('competitors');
    });

    it('should have positive limits', () => {
      expect(FREE_TIER_LIMITS.experiments.active).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.experiments.pageviews).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.attribution.events).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.seo.briefs).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.repurposer.generations).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.widgets.active).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.heatmaps.sessions).toBeGreaterThan(0);
      expect(FREE_TIER_LIMITS.competitors.tracked).toBeGreaterThan(0);
    });
  });
});

