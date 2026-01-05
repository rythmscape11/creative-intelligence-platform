import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/stats', asyncHandler(async (req: any, res: any) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User statistics
    const [totalUsers, activeUsers, newUsersThisMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
    ]);

    // Content statistics
    const [totalPosts, publishedPosts, draftPosts, scheduledPosts] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.blogPost.count({ where: { status: 'SCHEDULED' } }),
    ]);

    // Strategy statistics
    const [totalStrategies, strategiesThisMonth, exportedStrategies] = await Promise.all([
      prisma.strategy.count(),
      prisma.strategy.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.exportJob.count({
        where: {
          status: 'COMPLETED',
        },
      }),
    ]);

    // System information
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeDays = Math.floor(uptimeHours / 24);
    const uptimeString = uptimeDays > 0 
      ? `${uptimeDays}d ${uptimeHours % 24}h`
      : `${uptimeHours}h ${Math.floor((uptime % 3600) / 60)}m`;

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      content: {
        totalPosts,
        publishedPosts,
        draftPosts,
        scheduledPosts,
      },
      strategies: {
        total: totalStrategies,
        thisMonth: strategiesThisMonth,
        exported: exportedStrategies,
      },
      system: {
        uptime: uptimeString,
        version: process.env.npm_package_version || '1.0.0',
        lastBackup: new Date().toISOString(), // Placeholder
      },
    };

    res.json({
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get recent activity
router.get('/activity', asyncHandler(async (req: any, res: any) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get recent blog posts
    const recentPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get recent strategies
    const recentStrategies = await prisma.strategy.findMany({
      select: {
        id: true,
        businessName: true,
        createdAt: true,
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get recent exports
    const recentExports = await prisma.exportJob.findMany({
      select: {
        id: true,
        format: true,
        status: true,
        createdAt: true,
        strategy: {
          select: {
            businessName: true,
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Combine and format activities
    const activities = [
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user_registered' as const,
        description: `New user registered: ${user.name}`,
        timestamp: user.createdAt.toISOString(),
        user: user.name,
      })),
      ...recentPosts.map(post => ({
        id: `post-${post.id}`,
        type: 'post_published' as const,
        description: `Blog post ${post.status.toLowerCase()}: ${post.title}`,
        timestamp: (post.publishedAt || post.createdAt).toISOString(),
        user: post.author.name,
      })),
      ...recentStrategies.map(strategy => ({
        id: `strategy-${strategy.id}`,
        type: 'strategy_created' as const,
        description: `Strategy created for ${strategy.businessName}`,
        timestamp: strategy.createdAt.toISOString(),
        user: strategy.user.name,
      })),
      ...recentExports.map(exportJob => ({
        id: `export-${exportJob.id}`,
        type: 'export_generated' as const,
        description: `${exportJob.format} export ${exportJob.status.toLowerCase()} for ${exportJob.strategy.businessName}`,
        timestamp: exportJob.createdAt.toISOString(),
        user: exportJob.strategy.user.name,
      })),
    ];

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: sortedActivities,
      message: 'Recent activity retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent activity',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get all users with pagination and filtering
router.get('/users', asyncHandler(async (req: any, res: any) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status === 'active') {
      where.lastLoginAt = {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
    } else if (status === 'inactive') {
      where.OR = [
        { lastLoginAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        { lastLoginAt: null },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              strategies: true,
              blogPosts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalUsers,
        totalPages,
      },
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Update user role
const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'EDITOR', 'ADMIN']),
});

router.patch('/users/:id/role', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  
  try {
    const { role } = updateUserRoleSchema.parse(req.body);

    // Prevent users from removing their own admin role
    if (req.user.id === id && req.user.role === 'ADMIN' && role !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove your own admin privileges',
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: user,
      message: 'User role updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Delete user
router.delete('/users/:id', asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Prevent users from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete user (this will cascade to related records)
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get system information
router.get('/system', asyncHandler(async (req: any, res: any) => {
  try {
    const systemInfo = {
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      databaseStatus: 'connected', // Placeholder
      redisStatus: 'connected', // Placeholder
    };

    res.json({
      success: true,
      data: systemInfo,
      message: 'System information retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system information',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export { router as adminRoutes };
