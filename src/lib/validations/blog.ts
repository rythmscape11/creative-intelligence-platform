import { z } from 'zod';

/**
 * Blog Post Validation Schemas
 * Used for creating and updating blog posts in the CMS
 */

// Blog post status enum
export const BlogPostStatus = z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']);

// Create blog post schema
export const createBlogPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  
  slug: z.string()
    .min(1, 'Slug is required')
    .max(250, 'Slug must be 250 characters or less')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  
  content: z.string()
    .min(100, 'Content must be at least 100 characters')
    .max(100000, 'Content must be 100,000 characters or less'),
  
  excerpt: z.string()
    .min(50, 'Excerpt must be at least 50 characters')
    .max(300, 'Excerpt must be 300 characters or less'),
  
  featuredImage: z.string()
    .url('Featured image must be a valid URL')
    .optional()
    .nullable(),
  
  categoryId: z.string()
    .min(1, 'Category is required'),
  
  tagIds: z.array(z.string())
    .min(2, 'At least 2 tags are required')
    .max(10, 'Maximum 10 tags allowed'),
  
  status: BlogPostStatus
    .default('DRAFT'),
  
  seoTitle: z.string()
    .max(70, 'SEO title must be 70 characters or less')
    .optional()
    .nullable(),
  
  seoDescription: z.string()
    .max(160, 'SEO description must be 160 characters or less')
    .optional()
    .nullable(),
  
  publishedAt: z.string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => val ? new Date(val) : null),
});

// Update blog post schema (all fields optional except id)
export const updateBlogPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  
  slug: z.string()
    .min(1, 'Slug is required')
    .max(250, 'Slug must be 250 characters or less')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  
  content: z.string()
    .min(100, 'Content must be at least 100 characters')
    .max(100000, 'Content must be 100,000 characters or less')
    .optional(),
  
  excerpt: z.string()
    .min(50, 'Excerpt must be at least 50 characters')
    .max(300, 'Excerpt must be 300 characters or less')
    .optional(),
  
  featuredImage: z.string()
    .url('Featured image must be a valid URL')
    .optional()
    .nullable(),
  
  categoryId: z.string()
    .min(1, 'Category is required')
    .optional(),
  
  tagIds: z.array(z.string())
    .min(2, 'At least 2 tags are required')
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  
  status: BlogPostStatus
    .optional(),
  
  seoTitle: z.string()
    .max(70, 'SEO title must be 70 characters or less')
    .optional()
    .nullable(),
  
  seoDescription: z.string()
    .max(160, 'SEO description must be 160 characters or less')
    .optional()
    .nullable(),
  
  publishedAt: z.string()
    .datetime()
    .optional()
    .nullable()
    .transform((val) => val ? new Date(val) : null),
});

// Query parameters for listing blog posts
export const blogPostQuerySchema = z.object({
  page: z.string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 1),
  
  limit: z.string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 20),
  
  status: z.string()
    .optional(),
  
  categoryId: z.string()
    .optional(),
  
  authorId: z.string()
    .optional(),
  
  search: z.string()
    .optional(),
  
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title'])
    .optional()
    .default('createdAt'),
  
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  
  startDate: z.string()
    .datetime()
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
  
  endDate: z.string()
    .datetime()
    .optional()
    .transform((val) => val ? new Date(val) : undefined),
});

// Bulk action schema
export const bulkBlogPostActionSchema = z.object({
  postIds: z.array(z.string())
    .min(1, 'At least one post must be selected'),
  
  action: z.enum(['publish', 'archive', 'delete', 'changeCategory']),
  
  categoryId: z.string()
    .optional(), // Required only for changeCategory action
});

// Publish post schema
export const publishBlogPostSchema = z.object({
  publishedAt: z.string()
    .datetime()
    .optional()
    .transform((val) => val ? new Date(val) : new Date()),
});

// Auto-save draft schema
export const autoSaveDraftSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  featuredImage: z.string().optional().nullable(),
});

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Validate slug uniqueness (to be used in API)
export async function validateSlugUniqueness(
  slug: string,
  prisma: any,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.blogPost.findUnique({
    where: { slug },
    select: { id: true },
  });
  
  if (!existing) return true;
  if (excludeId && existing.id === excludeId) return true;
  
  return false;
}

// Type exports
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>;
export type BulkBlogPostAction = z.infer<typeof bulkBlogPostActionSchema>;
export type PublishBlogPost = z.infer<typeof publishBlogPostSchema>;
export type AutoSaveDraft = z.infer<typeof autoSaveDraftSchema>;

