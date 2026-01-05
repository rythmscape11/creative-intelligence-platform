import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id } = await params;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        if (!['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const sequence = await prisma.leadSequence.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(sequence);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
