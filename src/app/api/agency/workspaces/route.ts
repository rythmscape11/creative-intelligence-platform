import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { canAccessFeature } from '@/config/pricing';

export const dynamic = 'force-dynamic';

// GET - Fetch all client workspaces
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if user has agency tier
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userPlan = user.subscription?.plan || 'FREE';

        if (!canAccessFeature(userPlan as any, 'whiteLabel')) {
            return NextResponse.json(
                {
                    error: 'Agency plan required for client workspaces',
                    upgrade: true
                },
                { status: 403 }
            );
        }

        // Get all workspaces for this agency
        const workspaces = await prisma.clientWorkspace.findMany({
            where: { ownerId: userId },
            include: {
                strategies: {
                    select: { id: true, name: true, status: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json({
            workspaces,
            total: workspaces.length,
            limit: 10, // Agency plan limit
        });
    } catch (error) {
        console.error('Get client workspaces error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workspaces' },
            { status: 500 }
        );
    }
}

// POST - Create a new client workspace
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if user has agency tier
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userPlan = user.subscription?.plan || 'FREE';

        if (!canAccessFeature(userPlan as any, 'whiteLabel')) {
            return NextResponse.json(
                {
                    error: 'Agency plan required for client workspaces',
                    upgrade: true
                },
                { status: 403 }
            );
        }

        // Check workspace limit (10 for Agency plan)
        const existingCount = await prisma.clientWorkspace.count({
            where: { ownerId: userId },
        });

        if (existingCount >= 10) {
            return NextResponse.json(
                {
                    error: 'Client workspace limit reached (10). Upgrade to Enterprise for unlimited workspaces.',
                    upgrade: true,
                    limit: 10
                },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { clientName, clientEmail, clientCompany, clientLogoUrl, primaryColor, secondaryColor } = body;

        if (!clientName) {
            return NextResponse.json(
                { error: 'Client name is required' },
                { status: 400 }
            );
        }

        // Create workspace
        const workspace = await prisma.clientWorkspace.create({
            data: {
                ownerId: userId,
                clientName,
                clientEmail,
                clientCompany,
                clientLogoUrl,
                primaryColor,
                secondaryColor,
            },
        });

        return NextResponse.json({
            success: true,
            workspace,
            message: 'Client workspace created successfully'
        });
    } catch (error) {
        console.error('Create client workspace error:', error);
        return NextResponse.json(
            { error: 'Failed to create workspace' },
            { status: 500 }
        );
    }
}
