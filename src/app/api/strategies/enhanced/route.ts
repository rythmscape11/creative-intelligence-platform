import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

// GET /api/strategies/enhanced - Get strategies with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists in database (auto-sync from Clerk if needed)
    const userSync = await ensureUserInDb(userId);
    if (!userSync.success) {
      console.error('Failed to sync user to database:', userSync.error);
      return NextResponse.json(
        { success: false, error: 'User sync failed. Please try again.' },
        { status: 500 }
      );
    }

    // Check subscription status
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    // Check if user is admin
    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    const isFreeTier = !isAdmin && (!subscription || subscription.plan === 'FREE');

    // Check if user is in trial period (60 days)
    const userCreatedAt = new Date(user?.createdAt || Date.now());
    const trialEndDate = new Date(userCreatedAt.getTime() + 60 * 24 * 60 * 60 * 1000);
    const isTrialActive = new Date() < trialEndDate;

    // If in trial, treat as premium for visibility purposes
    const effectiveFreeTier = isFreeTier && !isTrialActive;


    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Filtering parameters
    const status = searchParams.get('status'); // DRAFT, ACTIVE, COMPLETED, ARCHIVED
    const search = searchParams.get('search'); // Search in name, business, industry
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // createdAt, updatedAt, name
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc
    const tags = searchParams.get('tags'); // Comma-separated tags
    const isArchived = searchParams.get('archived') === 'true';

    // Build where clause
    const where: any = {
      userId: userId,
      isArchived,
    };

    if (status) {
      where.status = status;
    }

    // Build AND conditions for tags and search
    const andConditions: any[] = [];

    if (tags) {
      const tagList = tags.split(',');
      andConditions.push({
        OR: tagList.map(tag => ({
          tags: {
            contains: tag.trim(),
          },
        })),
      });
    }

    // Search functionality
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search } },
          { input: { contains: search } }, // Search in JSON (business name, industry)
          { notes: { contains: search } },
        ],
      });
    }

    // Add AND conditions if any exist
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Get strategies with filtering
    let strategies = [];
    let total = 0;
    let parsedStrategies = [];

    try {
      console.log('Fetching strategies with where:', JSON.stringify(where));

      const [fetchedStrategies, fetchedTotal] = await Promise.all([
        prisma.marketingStrategy.findMany({
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip: offset,
          take: limit,
          select: {
            id: true,
            name: true,
            input: true,
            output: true,
            generatedBy: true,
            status: true,
            tags: true,
            notes: true,
            version: true,
            isArchived: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                comments: true,
                versions: true,
              },
            },
          },
        }),
        prisma.marketingStrategy.count({ where }),
      ]);

      console.log(`Found ${fetchedTotal} strategies for user ${userId}`);
      strategies = fetchedStrategies;
      total = fetchedTotal;

      // Parse JSON strings back to objects with error handling
      parsedStrategies = strategies.map(strategy => {
        let input = {};
        let output = null;
        let tags: string[] = [];

        try {
          input = JSON.parse(strategy.input);

          // Ensure all required fields exist
          if (!input) input = {};

          const typedInput = input as any;
          if (!typedInput.businessName) typedInput.businessName = 'Unknown Business';
          if (!typedInput.industry) typedInput.industry = 'Unknown';
          if (typeof typedInput.budget !== 'number') typedInput.budget = 0;
          if (!typedInput.timeframe) typedInput.timeframe = 'Unknown';
          if (!Array.isArray(typedInput.objectives)) typedInput.objectives = [];

        } catch (e) {
          console.error(`Failed to parse input for strategy ${strategy.id}`, e);
          // Provide fallback input structure if parsing fails
          input = {
            businessName: 'Unknown Business',
            industry: 'Unknown',
            budget: 0,
            timeframe: 'Unknown',
            objectives: []
          };
        }

        try {
          if (strategy.output) {
            output = JSON.parse(strategy.output);
          }
        } catch (e) {
          console.error(`Failed to parse output for strategy ${strategy.id}`, e);
        }

        if (strategy.tags) {
          tags = strategy.tags.split(',').map(t => t.trim());
        }

        return {
          ...strategy,
          input,
          output,
          tags,
          commentCount: strategy._count.comments,
          versionCount: strategy._count.versions,
        };
      });
    } catch (error) {
      if (effectiveFreeTier) {
        console.warn('Failed to fetch strategies for free user, returning empty list', error);
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
          filters: {
            status,
            search,
            sortBy,
            sortOrder,
            tags,
            isArchived,
          },
          freeTier: true,
        });
      }
      throw error;
    }


    return NextResponse.json({
      success: true,
      data: parsedStrategies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        status,
        search,
        sortBy,
        sortOrder,
        tags,
        isArchived,
      },
      freeTier: effectiveFreeTier,
    });

  } catch (error) {
    console.error('Get enhanced strategies error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/strategies/enhanced - Bulk operations
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, strategyIds } = body;

    if (!action || !strategyIds || !Array.isArray(strategyIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request. Provide action and strategyIds.' },
        { status: 400 }
      );
    }

    // Verify ownership of all strategies
    const strategies = await prisma.marketingStrategy.findMany({
      where: {
        id: { in: strategyIds },
        userId: userId,
      },
      select: { id: true },
    });

    if (strategies.length !== strategyIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some strategies not found or unauthorized' },
        { status: 403 }
      );
    }

    let result;

    switch (action) {
      case 'delete':
        result = await prisma.marketingStrategy.deleteMany({
          where: {
            id: { in: strategyIds },
            userId: userId,
          },
        });
        break;

      case 'archive':
        result = await prisma.marketingStrategy.updateMany({
          where: {
            id: { in: strategyIds },
            userId: userId,
          },
          data: {
            isArchived: true,
            status: 'ARCHIVED',
          },
        });
        break;

      case 'restore':
        result = await prisma.marketingStrategy.updateMany({
          where: {
            id: { in: strategyIds },
            userId: userId,
          },
          data: {
            isArchived: false,
            status: 'DRAFT',
          },
        });
        break;

      case 'updateStatus':
        const { status } = body;
        if (!status || !['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'].includes(status)) {
          return NextResponse.json(
            { success: false, error: 'Invalid status' },
            { status: 400 }
          );
        }
        result = await prisma.marketingStrategy.updateMany({
          where: {
            id: { in: strategyIds },
            userId: userId,
          },
          data: { status },
        });
        break;

      case 'addTags':
        const { tags } = body;
        if (!tags || !Array.isArray(tags)) {
          return NextResponse.json(
            { success: false, error: 'Invalid tags' },
            { status: 400 }
          );
        }

        // Update each strategy individually to append tags
        const updatePromises = strategyIds.map(async (id) => {
          const strategy = await prisma.marketingStrategy.findUnique({
            where: { id },
            select: { tags: true },
          });

          const existingTags = strategy?.tags ? strategy.tags.split(',').map(t => t.trim()) : [];
          const newTags = Array.from(new Set([...existingTags, ...tags]));

          return prisma.marketingStrategy.update({
            where: { id },
            data: { tags: newTags.join(', ') },
          });
        });

        await Promise.all(updatePromises);
        result = { count: strategyIds.length };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully performed ${action} on ${result.count} strategies`,
      count: result.count,
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

