import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET single framework
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const framework = await prisma.product.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { purchases: true }
                }
            }
        });

        if (!framework) {
            return NextResponse.json({ error: 'Framework not found' }, { status: 404 });
        }

        return NextResponse.json({ framework });
    } catch (error: any) {
        console.error('[Frameworks API] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH update framework
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const framework = await prisma.product.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ framework });
    } catch (error: any) {
        console.error('[Frameworks API] PATCH Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE framework
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check if framework has purchases
        const purchaseCount = await prisma.productPurchase.count({
            where: { productId: id }
        });

        if (purchaseCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete framework with existing purchases. Unpublish instead.' },
                { status: 400 }
            );
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Frameworks API] DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
