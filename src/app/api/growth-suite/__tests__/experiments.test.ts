/**
 * Integration Tests for Experiments API
 * 
 * Tests API endpoints for experiment CRUD operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '../experiments/route';
import { GET as GET_SINGLE, PUT, DELETE } from '../experiments/[id]/route';
import { NextRequest } from 'next/server';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    experiment: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock usage tracker
vi.mock('@/lib/growth-suite/usage-tracker', () => ({
  trackUsage: vi.fn(),
  checkQuota: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { trackUsage, checkQuota } from '@/lib/growth-suite/usage-tracker';

describe('Experiments API', () => {
  const mockUserId = 'user-123';

  const mockExperiment = {
    id: 'exp-123',
    userId: 'user-123',
    name: 'Test Experiment',
    description: 'Test description',
    variants: JSON.stringify([
      { id: 'control', name: 'Control' },
      { id: 'variant-a', name: 'Variant A' },
    ]),
    trafficSplit: JSON.stringify({ control: 50, 'variant-a': 50 }),
    targetingRules: null,
    status: 'draft',
    startDate: null,
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/growth-suite/experiments', () => {
    it('should return 401 when not authenticated', async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return experiments for authenticated user', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findMany as any).mockResolvedValue([mockExperiment]);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.experiments).toHaveLength(1);
      expect(data.experiments[0].id).toBe('exp-123');
      expect(data.experiments[0].variants).toBeInstanceOf(Array);
    });

    it('should parse JSON fields correctly', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findMany as any).mockResolvedValue([mockExperiment]);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments');
      const response = await GET(request);
      const data = await response.json();

      expect(data.experiments[0].variants).toEqual([
        { id: 'control', name: 'Control' },
        { id: 'variant-a', name: 'Variant A' },
      ]);
      expect(data.experiments[0].trafficSplit).toEqual({ control: 50, 'variant-a': 50 });
    });
  });

  describe('POST /api/growth-suite/experiments', () => {
    it('should return 401 when not authenticated', async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 when missing required fields', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should create experiment with valid data', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.count as any).mockResolvedValue(0);
      (checkQuota as any).mockResolvedValue({ allowed: true, limit: 1, current: 0, remaining: 1 });
      (prisma.experiment.create as any).mockResolvedValue(mockExperiment);
      (trackUsage as any).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Experiment',
          description: 'Test description',
          variants: [
            { id: 'control', name: 'Control' },
            { id: 'variant-a', name: 'Variant A' },
          ],
          trafficSplit: { control: 50, 'variant-a': 50 },
          status: 'draft',
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.experiment.id).toBe('exp-123');
      expect(trackUsage).toHaveBeenCalledWith(
        'user-123',
        'experiments',
        'create',
        1,
        expect.any(Object)
      );
    });

    it('should return 429 when quota exceeded', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.count as any).mockResolvedValue(1);
      (checkQuota as any).mockResolvedValue({ allowed: false, limit: 1, current: 1, remaining: 0 });

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Experiment',
          variants: [{ id: 'control', name: 'Control' }],
          trafficSplit: { control: 100 },
          status: 'running',
        }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('limit reached');
    });
  });

  describe('GET /api/growth-suite/experiments/[id]', () => {
    it('should return 401 when not authenticated', async () => {
      (auth as any).mockResolvedValue({ userId: null });

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-123');
      const response = await GET_SINGLE(request, { params: { id: 'exp-123' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when experiment not found', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findFirst as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-999');
      const response = await GET_SINGLE(request, { params: { id: 'exp-999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Experiment not found');
    });

    it('should return experiment when found', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findFirst as any).mockResolvedValue(mockExperiment);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-123');
      const response = await GET_SINGLE(request, { params: { id: 'exp-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.experiment.id).toBe('exp-123');
    });
  });

  describe('PUT /api/growth-suite/experiments/[id]', () => {
    it('should update experiment', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findFirst as any).mockResolvedValue(mockExperiment);
      (prisma.experiment.update as any).mockResolvedValue({
        ...mockExperiment,
        name: 'Updated Name',
      });

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' }),
      });
      const response = await PUT(request, { params: { id: 'exp-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.experiment.name).toBe('Updated Name');
    });

    it('should return 404 when updating non-existent experiment', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findFirst as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-999', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' }),
      });
      const response = await PUT(request, { params: { id: 'exp-999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Experiment not found');
    });
  });

  describe('DELETE /api/growth-suite/experiments/[id]', () => {
    it('should delete experiment', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findFirst as any).mockResolvedValue(mockExperiment);
      (prisma.experiment.delete as any).mockResolvedValue(mockExperiment);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-123', {
        method: 'DELETE',
      });
      const response = await DELETE(request, { params: { id: 'exp-123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Experiment deleted');
    });

    it('should return 404 when deleting non-existent experiment', async () => {
      (auth as any).mockResolvedValue({ userId: mockUserId });
      (prisma.experiment.findFirst as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/growth-suite/experiments/exp-999', {
        method: 'DELETE',
      });
      const response = await DELETE(request, { params: { id: 'exp-999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Experiment not found');
    });
  });
});

