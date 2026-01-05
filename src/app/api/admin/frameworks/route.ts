import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET all frameworks
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const frameworks = await prisma.product.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { purchases: true }
                }
            }
        });

        return NextResponse.json({ frameworks });
    } catch (error: any) {
        console.error('[Frameworks API] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create new framework
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const framework = await prisma.product.create({
            data: {
                slug: body.slug,
                name: body.name,
                description: body.description,
                shortDescription: body.shortDescription,
                longDescription: body.longDescription,
                problemStatement: body.problemStatement,
                outcomes: body.outcomes,
                idealFor: body.idealFor,
                notIdealFor: body.notIdealFor,
                deliverables: body.deliverables,
                howToUse: body.howToUse,
                credibilityText: body.credibilityText,
                price: body.price,
                currency: body.currency || 'INR',
                assets: body.assets || '[]',
                razorpayProductId: body.razorpayProductId,
                razorpayPriceId: body.razorpayPriceId,
                seoTitle: body.seoTitle,
                seoDescription: body.seoDescription,
                status: body.status || 'draft',
                isActive: true,
            },
        });

        return NextResponse.json({ framework });
    } catch (error: any) {
        console.error('[Frameworks API] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
