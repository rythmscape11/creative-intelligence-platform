import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ExportService } from '@/lib/services/export-service';

// POST /api/strategies/[id]/export - Export strategy
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscription: {
          select: {
            plan: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has paid subscription (PRO or ENTERPRISE)
    const isPaid = user.subscription?.plan === 'PRO' || user.subscription?.plan === 'ENTERPRISE';

    if (!isPaid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Export feature is only available for PRO and ENTERPRISE users',
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Check if strategy exists and user has access
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        OR: [
          { userId: user.id },
          {
            shares: {
              some: {
                isActive: true,
                OR: [
                  { sharedWith: user.email },
                  { sharedWith: null },
                ],
              },
            },
          },
        ],
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, message: 'Strategy not found or access denied' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { format = 'pptx', customization } = body;

    if (!['pptx', 'docx', 'xlsx'].includes(format)) {
      return NextResponse.json(
        { success: false, message: 'Invalid export format' },
        { status: 400 }
      );
    }

    // Parse strategy data
    const input = JSON.parse(strategy.input);
    const output = strategy.output ? JSON.parse(strategy.output) : null;

    if (!output) {
      return NextResponse.json(
        { success: false, message: 'Strategy has no generated output' },
        { status: 400 }
      );
    }

    // Prepare strategy data for export
    let strategyData;

    // Check if this is an enhanced strategy
    if ('targetAudiencePersonas' in output) {
      // Enhanced Strategy Mapping
      strategyData = {
        input,
        output,
        executiveSummary: output.executiveSummary?.overview || '',
        targetAudience: output.targetAudiencePersonas || [],
        channels: output.channelStrategy || [],
        tactics: output.contentStrategy?.contentPillars || [],
        budget: output.budgetBreakdown || {},
        timeline: output.implementationTimeline || [],
        kpis: (output.marketingObjectivesAndKPIs || []).flatMap((obj: any) =>
          (obj.primaryMetrics || []).map((metric: string, i: number) => ({
            metric,
            target: obj.targetValues?.[i] || 'N/A',
            timeframe: obj.timeline || 'N/A'
          }))
        ),
      };
    } else {
      // Basic Strategy Mapping (Legacy)
      strategyData = {
        input,
        output,
        executiveSummary: output.executiveSummary?.summary || '',
        targetAudience: output.targetAudience?.segments || [],
        channels: output.channelStrategy?.channels || [],
        tactics: output.contentStrategy?.contentPillars || [],
        budget: output.budgetAllocation || {},
        timeline: output.implementationTimeline?.phases || [],
        kpis: output.kpiFramework?.kpis || [],
      };
    }

    const businessName = input.businessName || 'Business';

    // Export strategy
    const result = await ExportService.exportStrategy(
      strategyData,
      businessName,
      {
        format: format as 'pptx' | 'docx' | 'xlsx',
        customization,
      }
    );

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'EXPORT_STRATEGY',
        entityType: 'STRATEGY',
        entityId: id,
        details: JSON.stringify({ format }),
      },
    });

    // Return file as download
    return new NextResponse(result.buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Export strategy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export strategy', error: String(error) },
      { status: 500 }
    );
  }
}

