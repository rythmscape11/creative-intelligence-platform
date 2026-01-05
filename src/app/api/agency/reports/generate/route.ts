import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateClientReport } from '@/lib/ai/agency-reporting';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const result = await generateClientReport(json);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Report Generation Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
