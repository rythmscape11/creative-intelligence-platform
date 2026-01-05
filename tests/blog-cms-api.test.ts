/**
 * Blog CMS API Integration Tests
 * 
 * These tests verify that all blog CMS API endpoints are working correctly.
 * Run with: npm test tests/blog-cms-api.test.ts
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const BASE_URL = 'http://localhost:3000';

describe('Blog CMS API Endpoints', () => {
  let authToken: string;
  let testPostId: string;
  let testCategoryId: string;
  let testTagId: string;

  beforeAll(async () => {
    // Note: You'll need to implement authentication to get a valid session
    // For now, these tests will check public endpoints or require manual auth
  });

  describe('Categories API', () => {
    it('should fetch all categories', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/categories`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should include post count in categories', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/categories`);
      const data = await response.json();

      if (data.data.length > 0) {
        const category = data.data[0];
        expect(category).toHaveProperty('_count');
        expect(category._count).toHaveProperty('blogPosts');
      }
    });
  });

  describe('Tags API', () => {
    it('should fetch all tags', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/tags`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should include post count in tags', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/tags`);
      const data = await response.json();

      if (data.data.length > 0) {
        const tag = data.data[0];
        expect(tag).toHaveProperty('_count');
        expect(tag._count).toHaveProperty('blogPosts');
      }
    });
  });

  describe('Blog Posts API', () => {
    it('should fetch blog posts with pagination', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts?page=1&limit=10`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('posts');
      expect(data.data).toHaveProperty('pagination');
      expect(Array.isArray(data.data.posts)).toBe(true);
    });

    it('should include pagination metadata', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts?page=1&limit=10`);
      const data = await response.json();

      expect(data.data.pagination).toHaveProperty('page');
      expect(data.data.pagination).toHaveProperty('limit');
      expect(data.data.pagination).toHaveProperty('total');
      expect(data.data.pagination).toHaveProperty('totalPages');
    });

    it('should filter posts by status', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts?status=PUBLISHED`);
      const data = await response.json();

      expect(response.status).toBe(200);
      if (data.data.posts.length > 0) {
        data.data.posts.forEach((post: any) => {
          expect(post.status).toBe('PUBLISHED');
        });
      }
    });

    it('should search posts by title/content', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts?search=health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Results should contain the search term (case-sensitive on SQLite)
    });

    it('should sort posts by different fields', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts?sortBy=createdAt&sortOrder=desc`);
      const data = await response.json();

      expect(response.status).toBe(200);
      if (data.data.posts.length > 1) {
        const firstPost = new Date(data.data.posts[0].createdAt);
        const secondPost = new Date(data.data.posts[1].createdAt);
        expect(firstPost.getTime()).toBeGreaterThanOrEqual(secondPost.getTime());
      }
    });

    it('should include author, category, and tags in posts', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts?page=1&limit=1`);
      const data = await response.json();

      if (data.data.posts.length > 0) {
        const post = data.data.posts[0];
        expect(post).toHaveProperty('author');
        expect(post).toHaveProperty('category');
        expect(post).toHaveProperty('tags');
        expect(Array.isArray(post.tags)).toBe(true);
      }
    });
  });

  describe('Individual Post API', () => {
    it('should fetch a single post by ID', async () => {
      // First get a post ID
      const listResponse = await fetch(`${BASE_URL}/api/blog/posts?page=1&limit=1`);
      const listData = await listResponse.json();

      if (listData.data.posts.length > 0) {
        const postId = listData.data.posts[0].id;
        const response = await fetch(`${BASE_URL}/api/blog/posts/${postId}`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toHaveProperty('id');
        expect(data.data.id).toBe(postId);
      }
    });

    it('should return 404 for non-existent post', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts/non-existent-id`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe('Related Posts API', () => {
    it('should fetch related posts for a given post', async () => {
      // First get a post ID
      const listResponse = await fetch(`${BASE_URL}/api/blog/posts?page=1&limit=1`);
      const listData = await listResponse.json();

      if (listData.data.posts.length > 0) {
        const postId = listData.data.posts[0].id;
        const response = await fetch(`${BASE_URL}/api/blog/posts/${postId}/related`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
        // Related posts should not include the original post
        data.data.forEach((post: any) => {
          expect(post.id).not.toBe(postId);
        });
      }
    });
  });

  describe('Authentication Required Endpoints', () => {
    it('should require authentication for creating posts', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Post',
          slug: 'test-post',
          content: 'Test content',
          excerpt: 'Test excerpt',
          categoryId: 'test-category',
          tagIds: ['test-tag'],
        }),
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for updating posts', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts/test-id`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Updated Title',
        }),
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for deleting posts', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts/test-id`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(401);
    });

    it('should require authentication for bulk actions', async () => {
      const response = await fetch(`${BASE_URL}/api/blog/posts/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'publish',
          postIds: ['test-id-1', 'test-id-2'],
        }),
      });

      expect(response.status).toBe(401);
    });
  });
});

/**
 * Manual Testing Instructions:
 * 
 * 1. Start the dev server: npm run dev
 * 2. Sign in as an ADMIN or EDITOR user
 * 3. Navigate to http://localhost:3000/dashboard/blog
 * 4. Test the following features:
 *    - View blog posts list
 *    - Filter by status, category, author
 *    - Search for posts
 *    - Sort by different fields
 *    - Create a new post
 *    - Edit an existing post
 *    - Duplicate a post
 *    - Delete a post (ADMIN only)
 *    - Perform bulk actions
 *    - Auto-save functionality
 *    - Preview post
 * 
 * 5. Verify the following on the public blog:
 *    - Navigate to http://localhost:3000/blog
 *    - Click on a blog post
 *    - Verify related posts are displayed
 *    - Verify SEO metadata is correct
 */

