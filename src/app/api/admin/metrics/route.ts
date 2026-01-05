import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || '30d';

        // Calculate date range
        let startDate: Date | undefined;
        const now = new Date();

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = undefined; // all time
        }

        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Get all completed purchases
        const completedPurchases = await prisma.productPurchase.findMany({
            where: {
                status: 'COMPLETED',
                ...(startDate && { createdAt: { gte: startDate } }),
            },
            include: {
                product: true,
            },
        });

        // Get purchases last 30 days
        const recentPurchases = await prisma.productPurchase.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: { gte: thirtyDaysAgo },
            },
        });

        // Get pending/failed counts
        const pendingCount = await prisma.productPurchase.count({
            where: { status: 'PENDING' },
        });

        const failedCount = await prisma.productPurchase.count({
            where: { status: 'FAILED' },
        });

        // Calculate totals
        const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);
        const recentRevenue = recentPurchases.reduce((sum, p) => sum + p.amount, 0);

        // Revenue by framework
        const revenueByFramework = completedPurchases.reduce((acc, purchase) => {
            const name = purchase.product.name;
            if (!acc[name]) {
                acc[name] = { name, revenue: 0, count: 0 };
            }
            acc[name].revenue += purchase.amount;
            acc[name].count += 1;
            return acc;
        }, {} as Record<string, { name: string; revenue: number; count: number }>);

        const byFrameworkArray = Object.values(revenueByFramework).sort(
            (a, b) => b.revenue - a.revenue
        );

        // Top framework
        const topFramework = byFrameworkArray.length > 0 ? byFrameworkArray[0] : null;

        return NextResponse.json({
            revenue: {
                total: totalRevenue,
                last30Days: recentRevenue,
                byFramework: byFrameworkArray,
            },
            sales: {
                total: completedPurchases.length,
                last30Days: recentPurchases.length,
                pending: pendingCount,
                failed: failedCount,
            },
            topFramework,
        });
    } catch (error: any) {
        console.error('[Metrics API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
