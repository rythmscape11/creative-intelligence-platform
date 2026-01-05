import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user exists and get their Prisma ID
        const userResult = await ensureUserInDb(userId);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const reports = await prisma.competitionReport.findMany({
            where: { userId: userResult.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                industry: true,
                focusArea: true,
                competitors: true,
                createdAt: true,
            }
        });

        return NextResponse.json(reports);
    } catch (error: any) {
        console.error('Failed to fetch reports:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

