import { NextResponse } from 'next/server';
import { leadChaserService } from '@/lib/services/lead-chaser';

export const dynamic = 'force-dynamic'; // Ensure it's not cached

export async function GET(request: Request) {
    try {
        // Verify authentication (Vercel Cron)
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const results = await leadChaserService.processDueSequences();

        return NextResponse.json({
            success: true,
            processed: results.length,
            results,
        });
    } catch (error: any) {
        console.error('Lead Chaser Cron Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
