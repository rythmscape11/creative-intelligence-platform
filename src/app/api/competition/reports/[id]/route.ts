import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const report = await prisma.competitionReport.findUnique({
            where: {
                id: params.id,
                userId // Ensure ownership
            }
        });

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        return NextResponse.json(report);
    } catch (error: any) {
        console.error('Failed to fetch report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const report = await prisma.competitionReport.delete({
            where: {
                id: params.id,
                userId // Ensure ownership
            }
        });

        return NextResponse.json({ success: true, id: report.id });
    } catch (error: any) {
        console.error('Failed to delete report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
