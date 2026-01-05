import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await prisma.agencyProject.findMany({
            where: {
                client: {
                    userId: userId,
                },
            },
            include: {
                client: {
                    select: {
                        name: true,
                        industry: true,
                    },
                },
                _count: {
                    select: {
                        jobs: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(projects);
    } catch (error: unknown) {
        console.error('Failed to fetch projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { clientId, name, description, status } = await req.json();

        if (!clientId || !name) {
            return NextResponse.json({ error: 'Client ID and Name are required' }, { status: 400 });
        }

        // Verify client belongs to user
        const client = await prisma.agencyClient.findFirst({
            where: { id: clientId, userId }
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found or unauthorized' }, { status: 404 });
        }

        const project = await prisma.agencyProject.create({
            data: {
                clientId,
                name,
                description,
                status: status || 'PLANNED',
                // agencyId is optional, we focus on client-project link for now
            }
        });

        return NextResponse.json(project);
    } catch (error: any) {
        console.error('Failed to create project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
