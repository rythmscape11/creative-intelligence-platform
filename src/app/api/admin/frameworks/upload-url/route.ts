import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { StorageService } from '@/lib/storage-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/admin/frameworks/upload-url
 * Generate a presigned URL for uploading framework assets to S3
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // TODO: Add admin role check here if you have role-based access
        // const user = await db.user.findUnique({ where: { clerkId: userId } });
        // if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await request.json();
        const { filename, contentType, frameworkId } = body;

        if (!filename || !contentType) {
            return NextResponse.json(
                { error: 'Missing required fields: filename, contentType' },
                { status: 400 }
            );
        }

        // Generate unique key for the file
        const uniqueId = uuidv4().slice(0, 8);
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = frameworkId
            ? `frameworks/${frameworkId}/${uniqueId}-${sanitizedFilename}`
            : `frameworks/temp/${uniqueId}-${sanitizedFilename}`;

        // Generate presigned upload URL (valid for 5 minutes)
        const { uploadUrl, publicUrl } = await StorageService.getPresignedUploadUrl(
            key,
            contentType,
            300 // 5 minutes
        );

        return NextResponse.json({
            uploadUrl,
            publicUrl,
            key,
            filename: sanitizedFilename,
        });
    } catch (error) {
        console.error('Error generating upload URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL' },
            { status: 500 }
        );
    }
}
