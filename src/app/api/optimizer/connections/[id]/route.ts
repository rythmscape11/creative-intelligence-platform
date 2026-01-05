import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/optimizer/connections/[id] - Get single connection
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const connection = await prisma.optimizerConnection.findFirst({
            where: { id, userId },
            include: {
                campaigns: {
                    take: 10,
                    orderBy: { updatedAt: 'desc' }
                },
                syncJobs: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { campaigns: true }
                }
            }
        });

        if (!connection) {
            return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
        }

        return NextResponse.json({ connection });
    } catch (error) {
        console.error('[Optimizer Connection] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch connection' },
            { status: 500 }
        );
    }
}

// DELETE /api/optimizer/connections/[id] - Delete connection
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const connection = await prisma.optimizerConnection.findFirst({
            where: { id, userId }
        });

        if (!connection) {
            return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
        }

        await prisma.optimizerConnection.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Optimizer Connection] DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete connection' },
            { status: 500 }
        );
    }
}

// POST /api/optimizer/connections/[id]/sync - Trigger sync for connection
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const connection = await prisma.optimizerConnection.findFirst({
            where: { id, userId }
        });

        if (!connection) {
            return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
        }

        // Create sync job
        const syncJob = await prisma.optimizerSyncJob.create({
            data: {
                connectionId: id,
                jobType: 'CAMPAIGNS',
                status: 'PENDING'
            }
        });

        // Update connection last sync attempt
        await prisma.optimizerConnection.update({
            where: { id },
            data: { lastSyncAt: new Date() }
        });

        // In a real implementation, this would trigger a background job
        // For now, we'll simulate by marking it as running
        await prisma.optimizerSyncJob.update({
            where: { id: syncJob.id },
            data: {
                status: 'RUNNING',
                startedAt: new Date()
            }
        });

        return NextResponse.json({ syncJob, message: 'Sync started' });
    } catch (error) {
        console.error('[Optimizer Connection] SYNC error:', error);
        return NextResponse.json(
            { error: 'Failed to start sync' },
            { status: 500 }
        );
    }
}
