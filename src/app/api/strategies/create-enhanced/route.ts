import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { enhancedStrategyInputSchema } from '@/lib/validations/enhanced-strategy';
import { EnhancedStrategyGenerator } from '@/lib/services/enhanced-strategy-generator';
import { StrategyMetricsLogger } from '@/lib/services/strategy-metrics-logger';

/**
 * POST /api/strategies/create-enhanced
 * Create a new enhanced marketing strategy
 */
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

  try {
    // Check authentication
    const { userId } = await auth();

    console.log('=== Enhanced Strategy Creation Debug ===');
    console.log('User ID:', userId);
    console.log('User ID type:', typeof userId);

    if (!userId) {
      console.error('No user ID found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user exists and check subscription status
    console.log('Looking up user with ID:', userId);
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
    });

    console.log('User lookup result:', user);

    if (!user) {
      console.warn('User not found in database:', userId);
      return NextResponse.json(
        {
          success: false,
          error: 'User not found. Please sign in again.',
        },
        { status: 401 }
      );
    }

    console.log('User verified successfully:', user.email);

    // Parse and validate request body
    const validationStart = Date.now();
    const body = await request.json();

    let validatedInput;
    try {
      validatedInput = enhancedStrategyInputSchema.parse(body);
      timings.validation = Date.now() - validationStart;
    } catch (error: any) {
      console.error('Validation error:', error);
      errorType = 'VALIDATION_ERROR';
      errorMessage = error.message || 'Invalid input data';
      errorStack = error.stack;

      // Log failed attempt
      await StrategyMetricsLogger.log({
        userId,
        strategyType: 'ENHANCED',
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
          error: 'Invalid input data',
          details: error.errors || error.message,
        },
        { status: 400 }
      );
    }

    // Determine if user has paid subscription
    const isPaid = user.subscription?.plan === 'PRO' || user.subscription?.plan === 'ENTERPRISE';
    console.log('User subscription plan:', user.subscription?.plan, '- isPaid:', isPaid);

    // Generate comprehensive strategy
    console.log('Generating enhanced strategy for user:', userId);
    const generationStart = Date.now();
    const strategyOutput = await EnhancedStrategyGenerator.generateStrategy(validatedInput, userId, isPaid);
    timings.generation = Date.now() - generationStart;

    // Create strategy in database
    const dbSaveStart = Date.now();
    const strategy = await prisma.marketingStrategy.create({
      data: {
        userId: userId,
        input: JSON.stringify(validatedInput),
        output: JSON.stringify(strategyOutput),
        status: 'DRAFT',
        generatedBy: 'AI',
      },
    });
    timings.dbSave = Date.now() - dbSaveStart;
    strategyId = strategy.id;

    console.log('Enhanced strategy created successfully:', strategy.id);

    // Log successful generation
    const endTime = new Date();
    await StrategyMetricsLogger.log({
      strategyId: strategy.id,
      userId,
      strategyType: 'ENHANCED',
      status: 'SUCCESS',
      generatedBy: 'AI',
      startTime,
      endTime,
      durationMs: endTime.getTime() - startTime.getTime(),
      validationMs: timings.validation,
      generationMs: timings.generation,
      dbSaveMs: timings.dbSave,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      industry: validatedInput.industry,
      budget: validatedInput.budget,
      timeframe: validatedInput.timeframe,
      objectives: validatedInput.marketingObjectives,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: strategy.id,
        status: strategy.status,
        createdAt: strategy.createdAt,
      },
    });

  } catch (error) {
    console.error('Enhanced strategy creation error:', error);

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
      strategyType: 'ENHANCED',
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
      {
        success: false,
        error: 'Failed to create strategy',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

