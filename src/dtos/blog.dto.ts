/**
 * Blog DTOs
 * 
 * This file centralizes Blog-related DTOs.
 * The core schemas are re-exported from lib/validations/blog.ts
 * for consistency with the DTO architecture.
 */

// Re-export all blog schemas from the validations module
export {
    BlogPostStatus,
    createBlogPostSchema,
    updateBlogPostSchema,
    blogPostQuerySchema,
    bulkBlogPostActionSchema,
    publishBlogPostSchema,
    autoSaveDraftSchema,
    generateSlug,
    validateSlugUniqueness,
    type CreateBlogPostInput,
    type UpdateBlogPostInput,
    type BlogPostQuery,
    type BulkBlogPostAction,
    type PublishBlogPost,
    type AutoSaveDraft,
} from '@/lib/validations/blog';

import { z } from 'zod';

// --- Additional Response Schemas ---

// Author subset for API responses
export const BlogAuthorSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().nullable().optional(),
});

export type BlogAuthorDTO = z.infer<typeof BlogAuthorSchema>;

// Category subset for API responses
export const BlogCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    color: z.string().nullable().optional(),
});

export type BlogCategoryDTO = z.infer<typeof BlogCategorySchema>;

// Tag subset for API responses
export const BlogTagSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});

export type BlogTagDTO = z.infer<typeof BlogTagSchema>;

// Full Blog Post response (with relations)
export const BlogPostResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string(),
    featuredImage: z.string().nullable().optional(),
    status: z.string(),
    seoTitle: z.string().nullable().optional(),
    seoDescription: z.string().nullable().optional(),
    viewCount: z.number().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: BlogAuthorSchema,
    category: BlogCategorySchema,
    tags: z.array(BlogTagSchema),
});

export type BlogPostResponseDTO = z.infer<typeof BlogPostResponseSchema>;

// Pagination response
export const BlogPaginationSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
});

export type BlogPaginationDTO = z.infer<typeof BlogPaginationSchema>;

// List response
export const BlogPostListResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        posts: z.array(BlogPostResponseSchema),
        pagination: BlogPaginationSchema,
    }),
});

export type BlogPostListResponseDTO = z.infer<typeof BlogPostListResponseSchema>;
