import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/frameworks/[slug]/download
 * Generate secure download URLs for purchased framework assets
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = params;
        const body = await request.json();
        const { assetKey } = body;

        if (!assetKey) {
            return NextResponse.json(
                { error: 'Missing assetKey' },
                { status: 400 }
            );
        }

        // Get the framework
        const framework = await prisma.product.findUnique({
            where: { slug },
        });

        if (!framework) {
            return NextResponse.json({ error: 'Framework not found' }, { status: 404 });
        }

        // Check if user has purchased this framework
        // Get user email from Clerk
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;

        if (!userEmail) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        const purchase = await prisma.productPurchase.findFirst({
            where: {
                productId: framework.id,
                email: userEmail,
                status: 'COMPLETED',
            },
        });

        if (!purchase) {
            return NextResponse.json(
                { error: 'You have not purchased this framework' },
                { status: 403 }
            );
        }

        // Since assets are stored with public-read ACL, return the public URL directly
        const bucketName = process.env.AWS_BUCKET_NAME;
        const region = process.env.AWS_REGION || 'us-east-1';
        const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${assetKey}`;

        return NextResponse.json({
            downloadUrl: publicUrl,
        });
    } catch (error) {
        console.error('Error generating download URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate download URL' },
            { status: 500 }
        );
    }
}
