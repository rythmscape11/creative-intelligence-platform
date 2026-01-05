/**
 * Growth Suite Experiment Report API
 * 
 * GET /api/growth-suite/experiments/[id]/report
 * 
 * Returns statistical analysis of experiment performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface VariantStats {
  variantId: string;
  views: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

/**
 * Calculate Bayesian probability that variant B is better than variant A
 * Simplified Beta distribution approximation
 */
function calculateBayesianProbability(
  conversionsA: number,
  viewsA: number,
  conversionsB: number,
  viewsB: number
): number {
  // Using Beta distribution approximation
  // P(B > A) ≈ probability that variant B has higher conversion rate

  const alpha_a = conversionsA + 1;
  const beta_a = viewsA - conversionsA + 1;
  const alpha_b = conversionsB + 1;
  const beta_b = viewsB - conversionsB + 1;

  // Simplified calculation (for production, use proper Beta distribution)
  const mean_a = alpha_a / (alpha_a + beta_a);
  const mean_b = alpha_b / (alpha_b + beta_b);

  const var_a = (alpha_a * beta_a) / ((alpha_a + beta_a) ** 2 * (alpha_a + beta_a + 1));
  const var_b = (alpha_b * beta_b) / ((alpha_b + beta_b) ** 2 * (alpha_b + beta_b + 1));

  const z = (mean_b - mean_a) / Math.sqrt(var_a + var_b);

  // Convert z-score to probability (approximation)
  const probability = 0.5 * (1 + Math.tanh(z / Math.sqrt(2)));

  return Math.min(Math.max(probability, 0), 1);
}

/**
 * Calculate frequentist p-value using chi-square test
 */
function calculatePValue(
  conversionsA: number,
  viewsA: number,
  conversionsB: number,
  viewsB: number
): number {
  const n1 = viewsA;
  const n2 = viewsB;
  const p1 = conversionsA / n1;
  const p2 = conversionsB / n2;
  const p = (conversionsA + conversionsB) / (n1 + n2);

  // Handle edge case where p is 0 or 1
  if (p === 0 || p === 1) {
    return 1; // No difference when both have 0% or 100% conversion
  }

  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  const z = Math.abs(p1 - p2) / se;

  // Approximate p-value from z-score (two-tailed)
  const pValue = 2 * (1 - 0.5 * (1 + Math.tanh(z / Math.sqrt(2))));

  return Math.min(Math.max(pValue, 0), 1);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get experiment
    const experiment = await prisma.experiment.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    const variants = JSON.parse(experiment.variants);

    // Get events for each variant
    const variantStats: VariantStats[] = [];

    for (const variant of variants) {
      const views = await prisma.experimentEvent.count({
        where: {
          experimentId: id,
          variantId: variant.id,
          eventType: 'view',
        },
      });

      const conversions = await prisma.experimentEvent.count({
        where: {
          experimentId: id,
          variantId: variant.id,
          eventType: 'conversion',
        },
      });

      // Calculate revenue (sum of revenue from conversion events)
      const revenueEvents = await prisma.experimentEvent.findMany({
        where: {
          experimentId: id,
          variantId: variant.id,
          eventType: 'conversion',
        },
        select: {
          properties: true,
        },
      });

      const revenue = revenueEvents.reduce((sum, event) => {
        const props = event.properties ? JSON.parse(event.properties) : {};
        return sum + (props.revenue || 0);
      }, 0);

      const conversionRate = views > 0 ? (conversions / views) * 100 : 0;

      variantStats.push({
        variantId: variant.id,
        views,
        conversions,
        conversionRate,
        revenue,
      });
    }

    // Calculate uplift (comparing first variant to control)
    const control = variantStats[0];
    const comparisons = variantStats.slice(1).map(variant => {
      const uplift = control.conversionRate > 0
        ? ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100
        : 0;

      const bayesianProbability = calculateBayesianProbability(
        control.conversions,
        control.views,
        variant.conversions,
        variant.views
      );

      const pValue = calculatePValue(
        control.conversions,
        control.views,
        variant.conversions,
        variant.views
      );

      return {
        variantId: variant.variantId,
        uplift,
        bayesianProbability,
        pValue,
        isSignificant: pValue < 0.05,
        confidence: (1 - pValue) * 100,
      };
    });

    // Overall stats
    const totalViews = variantStats.reduce((sum, v) => sum + v.views, 0);
    const totalConversions = variantStats.reduce((sum, v) => sum + v.conversions, 0);
    const totalRevenue = variantStats.reduce((sum, v) => sum + v.revenue, 0);
    const overallCVR = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    return NextResponse.json({
      success: true,
      experiment: {
        id: experiment.id,
        name: experiment.name,
        status: experiment.status,
        startDate: experiment.startDate,
        endDate: experiment.endDate,
      },
      overall: {
        totalViews,
        totalConversions,
        totalRevenue,
        overallCVR,
      },
      variants: variantStats,
      comparisons,
      recommendation: comparisons.length > 0 && comparisons[0].isSignificant
        ? comparisons[0].uplift > 0
          ? `Variant ${comparisons[0].variantId} shows significant improvement. Consider implementing.`
          : `Control performs better. Consider stopping the test.`
        : 'Not enough data for statistical significance. Continue running the test.',
    });

  } catch (error) {
    console.error('Experiment report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
