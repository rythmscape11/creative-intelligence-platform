import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const toolId = req.nextUrl.searchParams.get('toolId');

    if (toolId) {
      // Get stats for specific tool
      const toolUsage = await prisma.toolUsage.findMany({
        where: { toolId },
        select: {
          userId: true,
          usedAt: true
        }
      });

      const uniqueUsers = new Set(toolUsage.map(u => u.userId)).size;
      const totalUses = toolUsage.length;
      const avgUsesPerUser = uniqueUsers > 0 ? totalUses / uniqueUsers : 0;

      return NextResponse.json({
        totalUses,
        uniqueUsers,
        avgUsesPerUser: parseFloat(avgUsesPerUser.toFixed(2))
      });
    } else {
      // Get overall stats
      const toolUsage = await prisma.toolUsage.findMany({
        select: {
          userId: true,
          toolId: true,
          toolName: true
        }
      });

      const uniqueUsers = new Set(toolUsage.map(u => u.userId)).size;
      const totalUses = toolUsage.length;
      const avgUsesPerUser = uniqueUsers > 0 ? totalUses / uniqueUsers : 0;

      // Get top tools
      const toolCounts = toolUsage.reduce((acc, usage) => {
        const key = `${usage.toolId}:${usage.toolName}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topTools = Object.entries(toolCounts)
        .map(([key, count]) => {
          const [toolId, toolName] = key.split(':');
          return { toolId, toolName, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return NextResponse.json({
        totalUses,
        uniqueUsers,
        avgUsesPerUser: parseFloat(avgUsesPerUser.toFixed(2)),
        topTools
      });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
