import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/admin/leads/analytics - Get lead source analytics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30'; // days
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        capturedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    } else {
      const daysAgo = parseInt(dateRange);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      dateFilter = {
        capturedAt: {
          gte: date,
        },
      };
    }

    // Get total leads count
    const totalLeads = await prisma.leadCapture.count({
      where: dateFilter,
    });

    // Get leads grouped by source
    const leadsBySource = await prisma.leadCapture.groupBy({
      by: ['source'],
      where: dateFilter,
      _count: {
        source: true,
      },
      orderBy: {
        _count: {
          source: 'desc',
        },
      },
    });

    // Calculate percentages and format data
    const sourceData = leadsBySource.map((item) => ({
      source: item.source,
      count: item._count.source,
      percentage: totalLeads > 0 ? (item._count.source / totalLeads) * 100 : 0,
    }));

    // Get UTM source data
    const utmSourceData = await prisma.leadCapture.groupBy({
      by: ['utmSource'],
      where: {
        ...dateFilter,
        utmSource: {
          not: null,
        },
      },
      _count: {
        utmSource: true,
      },
      orderBy: {
        _count: {
          utmSource: 'desc',
        },
      },
    });

    const formattedUtmSourceData = utmSourceData.map((item) => ({
      utmSource: item.utmSource || undefined,
      count: item._count.utmSource,
    }));

    // Get UTM medium data
    const utmMediumData = await prisma.leadCapture.groupBy({
      by: ['utmMedium'],
      where: {
        ...dateFilter,
        utmMedium: {
          not: null,
        },
      },
      _count: {
        utmMedium: true,
      },
      orderBy: {
        _count: {
          utmMedium: 'desc',
        },
      },
    });

    const formattedUtmMediumData = utmMediumData.map((item) => ({
      utmMedium: item.utmMedium || undefined,
      count: item._count.utmMedium,
    }));

    // Get UTM campaign data
    const utmCampaignData = await prisma.leadCapture.groupBy({
      by: ['utmCampaign'],
      where: {
        ...dateFilter,
        utmCampaign: {
          not: null,
        },
      },
      _count: {
        utmCampaign: true,
      },
      orderBy: {
        _count: {
          utmCampaign: 'desc',
        },
      },
    });

    const formattedUtmCampaignData = utmCampaignData.map((item) => ({
      utmCampaign: item.utmCampaign || undefined,
      count: item._count.utmCampaign,
    }));

    // Get time series data for trend analysis (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeSeriesData = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT 
        DATE(captured_at) as date,
        COUNT(*) as count
      FROM lead_captures
      WHERE captured_at >= ${thirtyDaysAgo}
      GROUP BY DATE(captured_at)
      ORDER BY date ASC
    `;

    const formattedTimeSeriesData = timeSeriesData.map((item) => ({
      date: item.date.toISOString().split('T')[0],
      count: Number(item.count),
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        sourceData,
        utmSourceData: formattedUtmSourceData,
        utmMediumData: formattedUtmMediumData,
        utmCampaignData: formattedUtmCampaignData,
        timeSeriesData: formattedTimeSeriesData,
        dateRange: startDate && endDate 
          ? `${startDate} to ${endDate}` 
          : `Last ${dateRange} days`,
      },
    });
  } catch (error) {
    console.error('Lead analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead analytics' },
      { status: 500 }
    );
  }
}

