import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getBucket } from '@/lib/gcp/storage';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { projectId, type, content, name } = await req.json();

        if (!projectId || !content) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Verify project access
        const project = await prisma.agencyProject.findUnique({
            where: { id: projectId }
        });

        if (!project) return new NextResponse('Project not found', { status: 404 });

        // Save content to GCS (Optional: disabled if no bucket configured)
        let storagePath = `projects/${projectId}/${Date.now()}_${type.toLowerCase()}.json`;
        const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

        if (bucketName) {
            const bucket = getBucket(bucketName);
            if (bucket) {
                const file = bucket.file(storagePath);
                await file.save(JSON.stringify(content));
            } else {
                storagePath = 'local-only'; // Fallback
            }
        } else {
            storagePath = 'local-only';
        }

        // Create Asset Record
        const asset = await prisma.agencyAsset.create({
            data: {
                projectId,
                name: name || `AI Generated ${type}`,
                type: 'DOCUMENT', // Should refine based on input
                storagePath,
                mimeType: 'application/json',
                size: JSON.stringify(content).length,
                uploadedBy: userId,
            }
        });

        return NextResponse.json(asset);
    } catch (error) {
        console.error('Save AI Result Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
