import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/optimizer/connections - List all connections for user
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const connections = await prisma.optimizerConnection.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { campaigns: true, syncJobs: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ connections });
    } catch (error) {
        console.error('[Optimizer Connections] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch connections' },
            { status: 500 }
        );
    }
}

// POST /api/optimizer/connections - Create new connection
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, accountId, accountName, accessToken, refreshToken, tokenExpiresAt } = body;

        if (!platform || !accountId || !accountName || !accessToken) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if connection already exists
        const existing = await prisma.optimizerConnection.findFirst({
            where: { userId, platform, accountId }
        });

        if (existing) {
            // Update existing connection
            const updated = await prisma.optimizerConnection.update({
                where: { id: existing.id },
                data: {
                    accessToken,
                    refreshToken,
                    tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
                    status: 'CONNECTED',
                    syncError: null,
                    updatedAt: new Date()
                }
            });
            return NextResponse.json({ connection: updated, updated: true });
        }

        // Create new connection
        const connection = await prisma.optimizerConnection.create({
            data: {
                userId,
                platform,
                accountId,
                accountName,
                accessToken,
                refreshToken,
                tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
                status: 'CONNECTED',
                permissions: []
            }
        });

        return NextResponse.json({ connection }, { status: 201 });
    } catch (error) {
        console.error('[Optimizer Connections] POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create connection' },
            { status: 500 }
        );
    }
}
