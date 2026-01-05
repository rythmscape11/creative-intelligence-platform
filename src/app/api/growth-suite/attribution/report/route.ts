/**
 * Growth Suite Attribution Report API
 * 
 * GET /api/growth-suite/attribution/report
 * 
 * Returns attribution analysis with different models
 * 
 * Query params:
 * - model: first-touch | last-touch | linear | position-based | time-decay
 * - startDate: ISO date string
 * - endDate: ISO date string
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

type AttributionModel = 'first-touch' | 'last-touch' | 'linear' | 'position-based' | 'time-decay';

interface TouchPoint {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  timestamp: Date;
}

interface ConversionPath {
  sessionId: string;
  touchpoints: TouchPoint[];
  revenue: number;
  conversionDate: Date;
}

/**
 * Calculate attribution credit for a conversion path based on model
 */
function calculateAttribution(
  touchpoints: TouchPoint[],
  model: AttributionModel
): Map<string, number> {
  const credits = new Map<string, number>();

  if (touchpoints.length === 0) return credits;

  touchpoints.forEach((tp, index) => {
    const channel = getChannelName(tp);
    let credit = 0;

    switch (model) {
      case 'first-touch':
        credit = index === 0 ? 1 : 0;
        break;

      case 'last-touch':
        credit = index === touchpoints.length - 1 ? 1 : 0;
        break;

      case 'linear':
        credit = 1 / touchpoints.length;
        break;

      case 'position-based':
        if (touchpoints.length === 1) {
          credit = 1;
        } else if (touchpoints.length === 2) {
          credit = 0.5;
        } else {
          if (index === 0 || index === touchpoints.length - 1) {
            credit = 0.4;
          } else {
            credit = 0.2 / (touchpoints.length - 2);
          }
        }
        break;

      case 'time-decay':
        // Exponential decay with half-life of 7 days
        const daysSinceTouch = (new Date().getTime() - tp.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        const weight = Math.pow(0.5, daysSinceTouch / 7);
        const totalWeight = touchpoints.reduce((sum, t) => {
          const days = (new Date().getTime() - t.timestamp.getTime()) / (1000 * 60 * 60 * 24);
          return sum + Math.pow(0.5, days / 7);
        }, 0);
        credit = weight / totalWeight;
        break;
    }

    credits.set(channel, (credits.get(channel) || 0) + credit);
  });

  return credits;
}

/**
 * Get channel name from touchpoint
 */
function getChannelName(tp: TouchPoint): string {
  if (tp.utmSource) {
    if (tp.utmMedium) {
      return `${tp.utmSource} / ${tp.utmMedium}`;
    }
    return tp.utmSource;
  }
  return 'Direct';
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const model = (searchParams.get('model') || 'first-touch') as AttributionModel;
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date();

    // Get all sessions in date range
    const sessions = await prisma.growthSession.findMany({
      where: {
        userId: userId,
        firstEventAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get conversion events separately
    const conversionEvents = await prisma.growthEvent.findMany({
      where: {
        userId: userId,
        eventType: 'conversion',
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Build conversion paths
    const conversionPaths: ConversionPath[] = [];

    // Group conversion events by session
    const eventsBySession = new Map<string, typeof conversionEvents>();
    for (const event of conversionEvents) {
      const sessionEvents = eventsBySession.get(event.sessionId || '') || [];
      sessionEvents.push(event);
      eventsBySession.set(event.sessionId || '', sessionEvents);
    }

    for (const sess of sessions) {
      const sessionEvents = eventsBySession.get(sess.sessionId) || [];
      if (sessionEvents.length === 0) continue;

      // Get all touchpoints for this session
      const touchpoints: TouchPoint[] = [{
        utmSource: sess.utmSource,
        utmMedium: sess.utmMedium,
        utmCampaign: sess.utmCampaign,
        timestamp: sess.firstEventAt,
      }];

      // Add conversion events
      for (const event of sessionEvents) {
        conversionPaths.push({
          sessionId: sess.sessionId,
          touchpoints,
          revenue: event.revenue || 0,
          conversionDate: event.timestamp,
        });
      }
    }

    // Calculate attribution for each conversion
    const channelStats = new Map<string, {
      conversions: number;
      revenue: number;
      credit: number;
    }>();

    for (const path of conversionPaths) {
      const credits = calculateAttribution(path.touchpoints, model);

      credits.forEach((credit, channel) => {
        const stats = channelStats.get(channel) || { conversions: 0, revenue: 0, credit: 0 };
        stats.conversions += credit;
        stats.revenue += path.revenue * credit;
        stats.credit += credit;
        channelStats.set(channel, stats);
      });
    }

    // Get session counts by channel
    const sessionCounts = new Map<string, number>();
    for (const sess of sessions) {
      const channel = getChannelName({
        utmSource: sess.utmSource,
        utmMedium: sess.utmMedium,
        utmCampaign: sess.utmCampaign,
        timestamp: sess.firstEventAt,
      });
      sessionCounts.set(channel, (sessionCounts.get(channel) || 0) + 1);
    }

    // Format results
    const channels = Array.from(channelStats.entries()).map(([channel, stats]) => ({
      channel,
      sessions: sessionCounts.get(channel) || 0,
      conversions: Math.round(stats.conversions * 100) / 100,
      revenue: Math.round(stats.revenue * 100) / 100,
      cvr: sessionCounts.get(channel)
        ? (stats.conversions / sessionCounts.get(channel)!) * 100
        : 0,
    }));

    // Sort by revenue
    channels.sort((a, b) => b.revenue - a.revenue);

    // Calculate totals
    const totalSessions = sessions.length;
    const totalConversions = conversionPaths.length;
    const totalRevenue = conversionPaths.reduce((sum, p) => sum + p.revenue, 0);
    const conversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    return NextResponse.json({
      success: true,
      model,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      overall: {
        totalSessions,
        totalConversions,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      channels,
    });

  } catch (error) {
    console.error('Attribution report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
