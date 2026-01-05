import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { StrategyView } from '@/components/strategy/strategy-view';
import { EnhancedStrategyView } from '@/components/strategy/enhanced-strategy-view';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return {
      title: 'Strategy | Aureon One',
    };
  }

  try {
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        input: true,
      },
    });

    if (strategy) {
      const input = JSON.parse(strategy.input);
      return {
        title: `${input.businessName} Strategy | Aureon One`,
        description: `Marketing strategy for ${input.businessName} in the ${input.industry} industry`,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Strategy | Aureon One',
  };
}

export default async function StrategyPage({ params }: PageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    notFound();
  }

  try {
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        userId: true,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!strategy) {
      notFound();
    }

    // Parse JSON strings back to objects
    const parsedInput = JSON.parse(strategy.input);
    const parsedOutput = strategy.output ? JSON.parse(strategy.output) : null;

    const strategyData = {
      ...strategy,
      name: strategy.name || undefined,
      notes: strategy.notes || undefined,
      input: parsedInput,
      output: parsedOutput,
      generatedBy: (strategy.generatedBy as 'AI' | 'FALLBACK') || 'FALLBACK',
      status: (strategy.status as 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED') || 'DRAFT',
      tags: strategy.tags ? strategy.tags.split(',').map(t => t.trim()) : [],
      createdAt: strategy.createdAt.toISOString(),
      updatedAt: strategy.updatedAt.toISOString(),
    };

    // Detect if this is an enhanced strategy by checking for enhanced-specific fields
    const isEnhancedStrategy = parsedOutput && (
      'situationAnalysis' in parsedOutput ||
      'brandPositioning' in parsedOutput ||
      'customerJourneyMapping' in parsedOutput
    );

    // Use the appropriate view component based on strategy type
    if (isEnhancedStrategy) {
      return <EnhancedStrategyView strategy={strategyData} />;
    }

    return <StrategyView strategy={strategyData} />;
  } catch (error) {
    console.error('Error loading strategy:', error);
    notFound();
  }
}
