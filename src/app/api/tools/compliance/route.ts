import { NextResponse } from 'next/server';
import { generateComplianceSummary } from '@/lib/ai/compliance-generator';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { text, industry = 'General', region = 'Global', businessSize = 'Unknown' } = await req.json();

        if (!text) {
            return new NextResponse('Missing text', { status: 400 });
        }

        // Try to get authenticated user, otherwise use a system ID for public usage
        const { userId } = await auth();
        const trackingId = userId || 'system-public-user';

        const result = await generateComplianceSummary(
            industry,
            region,
            businessSize,
            trackingId
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('Compliance analysis error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
