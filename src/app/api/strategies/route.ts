import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { strategyInputSchema } from '@/dtos/strategy.dto';
import { StrategyProcessor } from '@/lib/services/strategy-processor';
import { z } from 'zod';
import { strategyCreationRateLimiter } from '@/lib/rate-limiters';
import { logger } from '@/lib/services/logger-service';
import { requireCsrfToken } from '@/lib/csrf';
import { StrategyMetricsLogger } from '@/lib/services/strategy-metrics-logger';
import { ensureUserInDb } from '@/lib/ensure-user';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET /api/strategies - Get user's strategies
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
      logger.error('Failed to sync user to database', new Error(userSync.error));
      return NextResponse.json(
        { success: false, error: 'User sync failed. Please try again.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;


    // Get strategies for the user
    const [strategies, total] = await Promise.all([
      prisma.marketingStrategy.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
        select: {
          id: true,
          input: true,
          output: true,
          generatedBy: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.marketingStrategy.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    // Parse JSON strings back to objects with error handling
    const parsedStrategies = strategies.map(strategy => {
      try {
        return {
          ...strategy,
          input: typeof strategy.input === 'string' ? JSON.parse(strategy.input) : strategy.input,
          output: strategy.output
            ? (typeof strategy.output === 'string' ? JSON.parse(strategy.output) : strategy.output)
            : null,
        };
      } catch (parseError) {
        logger.error('Failed to parse strategy JSON', parseError as Error);
        return {
          ...strategy,
          input: { businessName: 'Unknown', industry: 'Unknown' },
          output: null,
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: parsedStrategies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Get strategies error', error as Error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/strategies - Create new strategy
export async function POST(request: NextRequest) {
  const startTime = new Date();
  const timings = {
    validation: 0,
    generation: 0,
    dbSave: 0,
  };

  let userId: string | undefined;
  let strategyId: string | undefined;
  let errorType: 'VALIDATION_ERROR' | 'GENERATION_ERROR' | 'DB_ERROR' | 'TIMEOUT_ERROR' | 'UNKNOWN_ERROR' | undefined;
  let errorMessage: string | undefined;
  let errorStack: string | undefined;
  let strategyInput: any;

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.error('Strategy creation failed: No user ID');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const { allowed, remaining, resetAt } = strategyCreationRateLimiter.check(userId);

    if (!allowed) {
      logger.warn('Strategy creation rate limit exceeded', { userId });
      return NextResponse.json(
        { success: false, error: 'Too many strategies created. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetAt).toISOString(),
          }
        }
      );
    }

    logger.info('Creating strategy for user', { userId });

    const validationStart = Date.now();
    const body = await request.json();

    // Validate CSRF token
    const csrfToken = request.headers.get('x-csrf-token') || body._csrf;
    const csrfValidation = await requireCsrfToken(csrfToken);

    if (!csrfValidation.valid) {
      logger.warn('CSRF validation failed for strategy creation', { userId });
      errorType = 'VALIDATION_ERROR';
      errorMessage = 'CSRF validation failed';

      await StrategyMetricsLogger.log({
        userId,
        strategyType: 'BASIC',
        status: 'FAILED',
        startTime,
        endTime: new Date(),
        durationMs: Date.now() - startTime.getTime(),
        errorType,
        errorMessage,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });

      return NextResponse.json(
        { success: false, error: csrfValidation.error || 'CSRF validation failed' },
        { status: 403 }
      );
    }

    // Validate input data
    const validationResult = strategyInputSchema.safeParse(body);
    if (!validationResult.success) {
      logger.error('Strategy validation failed', new Error(JSON.stringify(validationResult.error.errors)));
      timings.validation = Date.now() - validationStart;
      errorType = 'VALIDATION_ERROR';
      errorMessage = 'Validation failed';
      errorStack = JSON.stringify(validationResult.error.errors);

      await StrategyMetricsLogger.log({
        userId,
        strategyType: 'BASIC',
        status: 'FAILED',
        startTime,
        endTime: new Date(),
        durationMs: Date.now() - startTime.getTime(),
        validationMs: timings.validation,
        errorType,
        errorMessage,
        errorStack,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    strategyInput = validationResult.data;
    timings.validation = Date.now() - validationStart;

    // Verify user exists before creating strategy
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!userExists) {
      logger.error('User not found in database', new Error(`User ID: ${userId}`));
      return NextResponse.json(
        { success: false, error: 'User not found. Please sign in again.' },
        { status: 404 }
      );
    }

    logger.info('User verified for strategy creation', { email: userExists.email });

    // Check subscription and enforce free tier limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    const isFreeTier = !subscription || subscription.plan === 'FREE';

    if (isFreeTier) {
      // Free tier: limit to 1 strategy per month
      const strategyCount = await prisma.marketingStrategy.count({
        where: {
          userId: userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
          },
        },
      });

      if (strategyCount >= 1) {
        logger.warn('Free tier strategy limit exceeded', { userId, strategyCount });
        errorType = 'VALIDATION_ERROR';
        errorMessage = 'Free tier limit exceeded';

        await StrategyMetricsLogger.log({
          userId,
          strategyType: 'BASIC',
          status: 'FAILED',
          startTime,
          endTime: new Date(),
          durationMs: Date.now() - startTime.getTime(),
          errorType,
          errorMessage,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        });

        return NextResponse.json(
          {
            success: false,
            error: 'You have reached your free tier limit of 1 strategy per month. Please upgrade to Pro for unlimited strategies.',
            code: 'FREE_TIER_LIMIT_EXCEEDED',
          },
          { status: 403 }
        );
      }
    }

    // Create strategy record (without output initially)
    const dbSaveStart = Date.now();
    const strategy = await prisma.marketingStrategy.create({
      data: {
        userId: userId,
        input: JSON.stringify(strategyInput),
        generatedBy: 'AI',
      },
      select: {
        id: true,
        userId: true,
        input: true,
        output: true,
        generatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    strategyId = strategy.id;

    logger.info('Strategy created successfully', { strategyId: strategy.id });

    // Generate strategy using the strategy processor
    const generationStart = Date.now();
    const { output: strategyOutput, generatedBy } = await StrategyProcessor.processStrategy(strategyInput, userId);
    timings.generation = Date.now() - generationStart;

    // Update strategy with generated output
    const updatedStrategy = await prisma.marketingStrategy.update({
      where: { id: strategy.id },
      data: {
        output: JSON.stringify(strategyOutput),
        generatedBy,
      },
      select: {
        id: true,
        userId: true,
        input: true,
        output: true,
        generatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    timings.dbSave = Date.now() - dbSaveStart;

    // Log successful generation
    const endTime = new Date();
    await StrategyMetricsLogger.log({
      strategyId: strategy.id,
      userId,
      strategyType: 'BASIC',
      status: 'SUCCESS',
      generatedBy,
      startTime,
      endTime,
      durationMs: endTime.getTime() - startTime.getTime(),
      validationMs: timings.validation,
      generationMs: timings.generation,
      dbSaveMs: timings.dbSave,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      industry: strategyInput.industry,
      budget: strategyInput.budget,
      timeframe: strategyInput.timeframe,
      objectives: strategyInput.objectives,
    });

    // Parse JSON strings back to objects for response
    const responseStrategy = {
      ...updatedStrategy,
      input: JSON.parse(updatedStrategy.input),
      output: JSON.parse(updatedStrategy.output!),
    };

    return NextResponse.json({
      success: true,
      data: responseStrategy,
      message: 'Strategy created successfully',
    }, { status: 201 });

  } catch (error) {
    logger.error('Create strategy error', error as Error);

    // Determine error type
    if (!errorType) {
      if (error instanceof Error && error.message.includes('database')) {
        errorType = 'DB_ERROR';
      } else if (error instanceof Error && error.message.includes('timeout')) {
        errorType = 'TIMEOUT_ERROR';
      } else {
        errorType = 'GENERATION_ERROR';
      }
    }

    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errorStack = error instanceof Error ? error.stack : undefined;

    // Log failed attempt
    await StrategyMetricsLogger.log({
      strategyId,
      userId,
      strategyType: 'BASIC',
      status: 'FAILED',
      startTime,
      endTime: new Date(),
      durationMs: Date.now() - startTime.getTime(),
      validationMs: timings.validation,
      generationMs: timings.generation,
      dbSaveMs: timings.dbSave,
      errorType,
      errorMessage,
      errorStack,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
