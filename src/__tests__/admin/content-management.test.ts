/**
 * Content Management API Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET as getCategoriesGET, POST as getCategoriesPOST } from '@/app/api/admin/blog/categories/route';
import { DELETE as deleteCategory } from '@/app/api/admin/blog/categories/[id]/route';
import { GET as getTagsGET, POST as getTagsPOST } from '@/app/api/admin/blog/tags/route';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type { Session } from 'next-auth';

type Role = 'ADMIN' | 'EDITOR' | 'USER';
type SessionResult = NonNullable<Session>;
type PrismaUserRecord = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
type CategoryList = Awaited<ReturnType<typeof prisma.category.findMany>>;
type CategoryRecord = CategoryList extends Array<infer R> ? R : never;
type TagList = Awaited<ReturnType<typeof prisma.tag.findMany>>;
type TagRecord = TagList extends Array<infer R> ? R : never;

const buildSession = (user: { id: string; email: string; role?: Role; name?: string }): SessionResult =>
  ({
    user: {
      name: user.name ?? 'Test User',
      ...user,
    },
    expires: new Date('2999-01-01T00:00:00.000Z').toISOString(),
  }) as SessionResult;

const prismaUser = (role: Role, overrides: Record<string, unknown> = {}): PrismaUserRecord =>
  ({
    id: `${role.toLowerCase()}-1`,
    email: `${role.toLowerCase()}@example.com`,
    name: `${role} User`,
    role,
    ...overrides,
  } as unknown as PrismaUserRecord);

const categoryRecord = (overrides: Partial<CategoryRecord> = {}): CategoryRecord =>
  ({
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
    description: 'Tech posts',
    _count: { posts: 5, blogPosts: 5 },
    ...overrides,
  } as unknown as CategoryRecord);

const tagRecord = (overrides: Partial<TagRecord> = {}): TagRecord =>
  ({
    id: 'tag-1',
    name: 'AI',
    slug: 'ai',
    description: 'Artificial Intelligence',
    ...overrides,
  } as unknown as TagRecord);

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));
vi.mock('@/lib/services/audit-logger', () => ({
  logContentAction: vi.fn(),
}));

describe('Category Management API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/blog/categories', () => {
    it('should return 401 if not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const request = new Request('http://localhost/api/admin/blog/categories');
      const response = await getCategoriesGET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should return 403 if not admin or editor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'user-1', email: 'user@example.com' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('USER'));

      const request = new Request('http://localhost/api/admin/blog/categories');
      const response = await getCategoriesGET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it('should return categories for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.category.findMany).mockResolvedValue([categoryRecord()]);

      const request = new Request('http://localhost/api/admin/blog/categories');
      const response = await getCategoriesGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('Technology');
    });

    it('should allow editor to view categories', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'editor-1', email: 'editor@example.com', role: 'EDITOR' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('EDITOR'));

      vi.mocked(prisma.category.findMany).mockResolvedValue([]);

      const request = new Request('http://localhost/api/admin/blog/categories');
      const response = await getCategoriesGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/admin/blog/categories', () => {
    it('should create category successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.category.create).mockResolvedValue(categoryRecord());

      const request = new Request('http://localhost/api/admin/blog/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Technology',
          slug: 'technology',
          description: 'Tech posts',
        }),
      });
      const response = await getCategoriesPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Technology');
    });

    it('should return 400 if slug already exists', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.category.findUnique).mockResolvedValue(
        categoryRecord({ _count: undefined })
      );

      const request = new Request('http://localhost/api/admin/blog/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Technology',
          slug: 'technology',
        }),
      });
      const response = await getCategoriesPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('already exists');
    });
  });

  describe('DELETE /api/admin/blog/categories/:id', () => {
    it('should return 403 if not admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'editor-1', email: 'editor@example.com', role: 'EDITOR' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('EDITOR'));

      const request = new Request('http://localhost/api/admin/blog/categories/cat-1', {
        method: 'DELETE',
      });
      const response = await deleteCategory(request, { params: { id: 'cat-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it('should prevent deleting category with posts', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.category.findUnique).mockResolvedValue(
        categoryRecord({ _count: { blogPosts: 5, posts: 5 } })
      );

      const request = new Request('http://localhost/api/admin/blog/categories/cat-1', {
        method: 'DELETE',
      });
      const response = await deleteCategory(request, { params: { id: 'cat-1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('Cannot delete category with posts');
    });

    it('should delete category successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.category.findUnique).mockResolvedValue(
        categoryRecord({ _count: { blogPosts: 0, posts: 0 } })
      );

      vi.mocked(prisma.category.delete).mockResolvedValue(categoryRecord());

      const request = new Request('http://localhost/api/admin/blog/categories/cat-1', {
        method: 'DELETE',
      });
      const response = await deleteCategory(request, { params: { id: 'cat-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

describe('Tag Management API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/blog/tags', () => {
    it('should return tags for admin', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.tag.findMany).mockResolvedValue([
        tagRecord({ _count: { posts: 3 } }),
      ]);

      const request = new Request('http://localhost/api/admin/blog/tags');
      const response = await getTagsGET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
    });
  });

  describe('POST /api/admin/blog/tags', () => {
    it('should create tag successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue(
        buildSession({ id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' })
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(prismaUser('ADMIN'));

      vi.mocked(prisma.tag.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.tag.create).mockResolvedValue(tagRecord());

      const request = new Request('http://localhost/api/admin/blog/tags', {
        method: 'POST',
        body: JSON.stringify({
          name: 'AI',
          slug: 'ai',
        }),
      });
      const response = await getTagsPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('AI');
    });
  });
});
