import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

export async function GET() {
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

        const clients = await prisma.agencyClient.findMany({
            where: { userId: userResult.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });

        return NextResponse.json(clients);
    } catch (error: unknown) {
        console.error('Failed to fetch clients:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, industry, website, status } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Ensure user exists in Prisma (sync from Clerk if needed)
        const userResult = await ensureUserInDb(userId);
        if (!userResult.success) {
            return NextResponse.json({
                error: 'User not found',
                details: userResult.error
            }, { status: 404 });
        }

        const client = await prisma.agencyClient.create({
            data: {
                userId: userResult.user!.id, // Use Prisma user ID, not Clerk ID
                name,
                industry: industry || null,
                website: website || null,
                status: status || 'ACTIVE'
            }
        });

        return NextResponse.json(client);
    } catch (error: unknown) {
        console.error('Failed to create client:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        console.error('Error details:', { message, stack });
        return NextResponse.json({
            error: 'Internal Server Error',
            details: message
        }, { status: 500 });
    }
}

