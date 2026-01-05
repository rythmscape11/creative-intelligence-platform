import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const project = await prisma.agencyProject.findUnique({
            where: {
                id: id,
            },
            include: {
                client: {
                    select: { name: true, id: true }
                },
                jobs: {
                    include: {
                        tasks: true
                    }
                },
                campaigns: true,
                _count: {
                    select: {
                        jobs: true,
                    }
                }
            }
        });

        if (!project) {
            return new NextResponse('Project not found', { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECT_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, description, status, priority, budget, startDate, endDate } = body;

        const project = await prisma.agencyProject.update({
            where: {
                id: id,
            },
            data: {
                name,
                description,
                status,
                priority,
                budget: budget ? parseFloat(budget) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECT_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const project = await prisma.agencyProject.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECT_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
