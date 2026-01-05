import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  next();
};

// Middleware to check admin/editor role
const requireEditor = (req: any, res: any, next: any) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR')) {
    return res.status(403).json({
      success: false,
      message: 'Editor or admin access required',
    });
  }
  next();
};

// Validation schemas
const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  featuredImage: z.string().url().optional(),
  categoryId: z.string().cuid(),
  tagIds: z.array(z.string().cuid()).optional().default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  publishedAt: z.string().datetime().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

const tagSchema = z.object({
  name: z.string().min(1).max(50),
});

// Helper function to generate slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get all blog posts (public)
router.get('/posts', asyncHandler(async (req: any, res: any) => {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    search,
    status = 'PUBLISHED'
  } = req.query;

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where: any = {};

    // Only show published posts for public access, unless user is admin/editor
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR')) {
      where.status = 'PUBLISHED';
      where.publishedAt = { lte: new Date() };
    } else if (status) {
      where.status = status;
    }

    // Filter by category
    if (category) {
      where.category = { slug: category };
    }

    // Filter by tag
    if (tag) {
      where.tags = {
        some: { slug: tag }
      };
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true, avatar: true }
          },
          category: true,
          tags: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      message: 'Blog posts retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog posts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get single blog post by slug (public)
router.get('/posts/:slug', asyncHandler(async (req: any, res: any) => {
  const { slug } = req.params;

  try {
    const where: any = { slug };

    // Only show published posts for public access, unless user is admin/editor
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR')) {
      where.status = 'PUBLISHED';
      where.publishedAt = { lte: new Date() };
    }

    const post = await prisma.blogPost.findFirst({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      data: post,
      message: 'Blog post retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Create blog post (editor/admin only)
router.post('/posts', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const validationResult = blogPostSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog post data',
      errors: validationResult.error.errors,
    });
  }

  const { title, content, excerpt, featuredImage, categoryId, tagIds, status, seoTitle, seoDescription, publishedAt } = validationResult.data;

  try {
    // Generate unique slug
    let slug = generateSlug(title);
    let slugCounter = 1;

    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${generateSlug(title)}-${slugCounter}`;
      slugCounter++;
    }

    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Verify tags exist
    if (tagIds.length > 0) {
      const existingTags = await prisma.tag.findMany({
        where: { id: { in: tagIds } }
      });

      if (existingTags.length !== tagIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more tags not found',
        });
      }
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        authorId: req.user.id,
        categoryId,
        status,
        seoTitle,
        seoDescription,
        publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
        tags: {
          connect: tagIds.map(id => ({ id }))
        }
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
    });

    res.status(201).json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Update blog post (editor/admin only)
router.put('/posts/:id', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const validationResult = blogPostSchema.partial().safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog post data',
      errors: validationResult.error.errors,
    });
  }

  try {
    // Check if post exists and user has permission
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Only allow author or admin to edit
    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied',
      });
    }

    const { title, content, excerpt, featuredImage, categoryId, tagIds, status, seoTitle, seoDescription, publishedAt } = validationResult.data;

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = generateSlug(title);
      let slugCounter = 1;

      while (await prisma.blogPost.findFirst({ where: { slug, id: { not: id } } })) {
        slug = `${generateSlug(title)}-${slugCounter}`;
        slugCounter++;
      }
    }

    // Verify category exists if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
        });
      }
    }

    // Verify tags exist if provided
    if (tagIds && tagIds.length > 0) {
      const existingTags = await prisma.tag.findMany({
        where: { id: { in: tagIds } }
      });

      if (existingTags.length !== tagIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more tags not found',
        });
      }
    }

    // Update blog post
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (status !== undefined) updateData.status = status;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (publishedAt !== undefined) updateData.publishedAt = new Date(publishedAt);
    if (title !== undefined) updateData.slug = slug;

    // Handle publishedAt for status changes
    if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED' && !publishedAt) {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        ...(tagIds !== undefined && {
          tags: {
            set: [],
            connect: tagIds.map(id => ({ id }))
          }
        })
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
    });

    res.json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Delete blog post (editor/admin only)
router.delete('/posts/:id', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Check if post exists and user has permission
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Only allow author or admin to delete
    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Permission denied',
      });
    }

    await prisma.blogPost.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get categories (public)
router.get('/categories', asyncHandler(async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            blogPosts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() }
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get tags (public)
router.get('/tags', asyncHandler(async (req: any, res: any) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            blogPosts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() }
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: tags,
      message: 'Tags retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tags',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Create category (admin only)
router.post('/categories', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const validationResult = categorySchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category data',
      errors: validationResult.error.errors,
    });
  }

  const { name, description, color } = validationResult.data;

  try {
    // Generate unique slug
    let slug = generateSlug(name);
    let slugCounter = 1;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${generateSlug(name)}-${slugCounter}`;
      slugCounter++;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Update category (admin only)
router.put('/categories/:id', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const validationResult = categorySchema.partial().safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category data',
      errors: validationResult.error.errors,
    });
  }

  try {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const { name, description, color } = validationResult.data;

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = generateSlug(name);
      let slugCounter = 1;

      while (await prisma.category.findFirst({ where: { slug, id: { not: id } } })) {
        slug = `${generateSlug(name)}-${slugCounter}`;
        slugCounter++;
      }
    }

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slug;
    }
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Delete category (admin only)
router.delete('/categories/:id', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { blogPosts: true } } }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (existingCategory._count.blogPosts > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with associated blog posts',
      });
    }

    await prisma.category.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Create tag (admin only)
router.post('/tags', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const validationResult = tagSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tag data',
      errors: validationResult.error.errors,
    });
  }

  const { name } = validationResult.data;

  try {
    // Generate unique slug
    let slug = generateSlug(name);
    let slugCounter = 1;

    while (await prisma.tag.findUnique({ where: { slug } })) {
      slug = `${generateSlug(name)}-${slugCounter}`;
      slugCounter++;
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    res.status(201).json({
      success: true,
      data: tag,
      message: 'Tag created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create tag',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Update tag (admin only)
router.put('/tags/:id', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const validationResult = tagSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tag data',
      errors: validationResult.error.errors,
    });
  }

  try {
    const existingTag = await prisma.tag.findUnique({ where: { id } });
    if (!existingTag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    const { name } = validationResult.data;

    // Generate new slug
    let slug = generateSlug(name);
    let slugCounter = 1;

    while (await prisma.tag.findFirst({ where: { slug, id: { not: id } } })) {
      slug = `${generateSlug(name)}-${slugCounter}`;
      slugCounter++;
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    res.json({
      success: true,
      data: tag,
      message: 'Tag updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update tag',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Delete tag (admin only)
router.delete('/tags/:id', requireAuth, requireEditor, asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { blogPosts: true } } }
    });

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    if (existingTag._count.blogPosts > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tag with associated blog posts',
      });
    }

    await prisma.tag.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete tag',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export { router as blogRoutes };
