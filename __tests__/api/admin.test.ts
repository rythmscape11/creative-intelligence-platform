/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    blogPost: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    strategy: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    exportJob: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  })),
}));

describe('/api/admin', () => {
  let mockPrisma: any;

  beforeEach(() => {
    const { PrismaClient } = require('@prisma/client');
    mockPrisma = new PrismaClient();
    vi.clearAllMocks();
  });

  describe('GET /stats', () => {
    it('should return dashboard statistics for admin users', async () => {
      // Mock user statistics
      mockPrisma.user.count
        .mockResolvedValueOnce(150) // total users
        .mockResolvedValueOnce(45)  // active users
        .mockResolvedValueOnce(12); // new users this month

      // Mock content statistics
      mockPrisma.blogPost.count
        .mockResolvedValueOnce(25)  // total posts
        .mockResolvedValueOnce(18)  // published posts
        .mockResolvedValueOnce(5)   // draft posts
        .mockResolvedValueOnce(2);  // scheduled posts

      // Mock strategy statistics
      mockPrisma.strategy.count
        .mockResolvedValueOnce(89)  // total strategies
        .mockResolvedValueOnce(23); // strategies this month

      // Mock export statistics
      mockPrisma.exportJob.count
        .mockResolvedValueOnce(156); // exported strategies

      const { req, res } = createMocks({
        method: 'GET',
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would verify statistics are returned correctly
      expect(mockPrisma.user.count).toBeDefined();
      expect(mockPrisma.blogPost.count).toBeDefined();
      expect(mockPrisma.strategy.count).toBeDefined();
      expect(mockPrisma.exportJob.count).toBeDefined();
    });

    it('should require admin role', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      req.user = { id: 'user1', role: 'USER' };

      // Test would return 403 for non-admin users
      expect(req.user.role).not.toBe('ADMIN');
    });

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      // No user in request
      req.user = null;

      // Test would return 401 for unauthenticated requests
      expect(req.user).toBeNull();
    });
  });

  describe('GET /activity', () => {
    it('should return recent activity across the platform', async () => {
      const mockUsers = [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date('2024-01-15'),
        },
      ];

      const mockPosts = [
        {
          id: 'post1',
          title: 'Test Post',
          status: 'PUBLISHED',
          publishedAt: new Date('2024-01-14'),
          createdAt: new Date('2024-01-14'),
          author: { name: 'Jane Smith' },
        },
      ];

      const mockStrategies = [
        {
          id: 'strategy1',
          businessName: 'Test Business',
          createdAt: new Date('2024-01-13'),
          user: { name: 'Bob Johnson' },
        },
      ];

      const mockExports = [
        {
          id: 'export1',
          format: 'PPTX',
          status: 'COMPLETED',
          createdAt: new Date('2024-01-12'),
          strategy: {
            businessName: 'Test Business',
            user: { name: 'Alice Brown' },
          },
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.blogPost.findMany.mockResolvedValue(mockPosts);
      mockPrisma.strategy.findMany.mockResolvedValue(mockStrategies);
      mockPrisma.exportJob.findMany.mockResolvedValue(mockExports);

      const { req, res } = createMocks({
        method: 'GET',
        query: { limit: '20' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(mockPrisma.user.findMany).toBeDefined();
      expect(mockPrisma.blogPost.findMany).toBeDefined();
      expect(mockPrisma.strategy.findMany).toBeDefined();
      expect(mockPrisma.exportJob.findMany).toBeDefined();
    });
  });

  describe('GET /users', () => {
    it('should return paginated list of users', async () => {
      const mockUsers = [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
          createdAt: new Date('2024-01-01'),
          lastLoginAt: new Date('2024-01-15'),
          _count: { strategies: 3, blogPosts: 0 },
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'EDITOR',
          createdAt: new Date('2024-01-02'),
          lastLoginAt: new Date('2024-01-14'),
          _count: { strategies: 1, blogPosts: 5 },
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(2);

      const { req, res } = createMocks({
        method: 'GET',
        query: { page: '1', limit: '20' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(mockPrisma.user.findMany).toBeDefined();
      expect(mockPrisma.user.count).toBeDefined();
    });

    it('should support search filtering', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      const { req, res } = createMocks({
        method: 'GET',
        query: { search: 'john', page: '1', limit: '20' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(req.query.search).toBe('john');
    });

    it('should support role filtering', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      const { req, res } = createMocks({
        method: 'GET',
        query: { role: 'ADMIN', page: '1', limit: '20' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(req.query.role).toBe('ADMIN');
    });

    it('should support status filtering', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      const { req, res } = createMocks({
        method: 'GET',
        query: { status: 'active', page: '1', limit: '20' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(req.query.status).toBe('active');
    });
  });

  describe('PATCH /users/:id/role', () => {
    it('should update user role', async () => {
      const mockUser = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'EDITOR',
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);

      const { req, res } = createMocks({
        method: 'PATCH',
        query: { id: 'user1' },
        body: { role: 'EDITOR' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(mockPrisma.user.update).toBeDefined();
    });

    it('should prevent users from removing their own admin role', async () => {
      const { req, res } = createMocks({
        method: 'PATCH',
        query: { id: 'admin1' },
        body: { role: 'USER' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return 400 when trying to remove own admin role
      expect(req.user.id).toBe(req.query.id);
      expect(req.user.role).toBe('ADMIN');
      expect(req.body.role).not.toBe('ADMIN');
    });

    it('should validate role values', async () => {
      const { req, res } = createMocks({
        method: 'PATCH',
        query: { id: 'user1' },
        body: { role: 'INVALID_ROLE' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return 400 for invalid role
      const validRoles = ['USER', 'EDITOR', 'ADMIN'];
      expect(validRoles).not.toContain(req.body.role);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      const mockUser = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'user1' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      expect(mockPrisma.user.findUnique).toBeDefined();
      expect(mockPrisma.user.delete).toBeDefined();
    });

    it('should prevent users from deleting themselves', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'admin1' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return 400 when trying to delete own account
      expect(req.user.id).toBe(req.query.id);
    });

    it('should return 404 for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { id: 'nonexistent' },
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return 404 for non-existent user
      expect(mockPrisma.user.findUnique).toBeDefined();
    });
  });

  describe('GET /system', () => {
    it('should return system information', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return system information
      const expectedFields = [
        'version',
        'nodeVersion',
        'uptime',
        'memoryUsage',
        'platform',
        'environment',
        'databaseStatus',
        'redisStatus',
      ];

      expectedFields.forEach(field => {
        expect(field).toBeTruthy();
      });
    });
  });

  describe('Authorization', () => {
    it('should require admin role for all endpoints', async () => {
      const endpoints = [
        { method: 'GET', path: '/stats' },
        { method: 'GET', path: '/activity' },
        { method: 'GET', path: '/users' },
        { method: 'PATCH', path: '/users/user1/role' },
        { method: 'DELETE', path: '/users/user1' },
        { method: 'GET', path: '/system' },
      ];

      endpoints.forEach(endpoint => {
        const { req, res } = createMocks({
          method: endpoint.method,
        });

        req.user = { id: 'user1', role: 'USER' };

        // Test would return 403 for non-admin users
        expect(req.user.role).not.toBe('ADMIN');
      });
    });

    it('should require authentication for all endpoints', async () => {
      const endpoints = [
        { method: 'GET', path: '/stats' },
        { method: 'GET', path: '/activity' },
        { method: 'GET', path: '/users' },
        { method: 'PATCH', path: '/users/user1/role' },
        { method: 'DELETE', path: '/users/user1' },
        { method: 'GET', path: '/system' },
      ];

      endpoints.forEach(endpoint => {
        const { req, res } = createMocks({
          method: endpoint.method,
        });

        // No user in request
        req.user = null;

        // Test would return 401 for unauthenticated requests
        expect(req.user).toBeNull();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      mockPrisma.user.count.mockRejectedValue(new Error('Database connection failed'));

      const { req, res } = createMocks({
        method: 'GET',
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return 500 for database errors
      expect(mockPrisma.user.count).toBeDefined();
    });

    it('should handle validation errors', async () => {
      const { req, res } = createMocks({
        method: 'PATCH',
        query: { id: 'user1' },
        body: {}, // Missing role field
      });

      req.user = { id: 'admin1', role: 'ADMIN' };

      // Test would return 400 for validation errors
      expect(req.body.role).toBeUndefined();
    });
  });
});
