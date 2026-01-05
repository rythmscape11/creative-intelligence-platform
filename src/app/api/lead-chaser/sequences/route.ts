import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // In a real app, we should check if the user is an admin
        // For now, we assume dashboard access implies admin or we filter by user if applicable
        // But LeadSequence is global for the app owner usually.

        const sequences = await prisma.leadSequence.findMany({
            include: {
                leadCapture: true,
                emailsSent: {
                    orderBy: { sentAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(sequences);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
