import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

type RouteProps = {
    params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteProps) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Await params for Next.js 15+ compatibility
        const { id } = await params;

        // Ensure user exists and get their Prisma ID
        const userResult = await ensureUserInDb(userId);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const client = await prisma.agencyClient.findUnique({
            where: {
                id,
                userId: userResult.user.id // Use Prisma user ID
            },
            include: {
                projects: {
                    orderBy: { updatedAt: 'desc' }
                },
                contacts: true,
                _count: {
                    select: { projects: true }
                }
            }
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error: unknown) {
        console.error('Failed to fetch client:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Await params for Next.js 15+ compatibility
        const { id } = await params;

        const userResult = await ensureUserInDb(userId);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { name, industry, website, status } = body;

        // Verify ownership first
        const existingClient = await prisma.agencyClient.findUnique({
            where: {
                id,
                userId: userResult.user.id
            }
        });

        if (!existingClient) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const updatedClient = await prisma.agencyClient.update({
            where: { id },
            data: {
                name,
                industry,
                website,
                status
            }
        });

        return NextResponse.json(updatedClient);
    } catch (error: unknown) {
        console.error('Failed to update client:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Await params for Next.js 15+ compatibility
        const { id } = await params;

        const userResult = await ensureUserInDb(userId);
        if (!userResult.success || !userResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify ownership first
        const client = await prisma.agencyClient.findUnique({
            where: {
                id,
                userId: userResult.user.id
            }
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        await prisma.agencyClient.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Failed to delete client:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
