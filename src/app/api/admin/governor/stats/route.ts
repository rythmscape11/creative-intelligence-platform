import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { GovernorService } from '@/lib/governor';

export async function GET() {
    try {
        const user = await requireAdmin();

        const stats = await GovernorService.getBudgetStats(user.id);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Governor stats error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
