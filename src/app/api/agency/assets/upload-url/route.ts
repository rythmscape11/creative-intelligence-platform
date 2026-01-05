
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { StorageService } from '@/lib/storage-service';
import { v4 as uuidv4 } from 'uuid';
import { aj } from '@/lib/arcjet';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Arcjet Rate Limiting
        if (aj) {
            const decision = await aj.protect(request);
            if (decision.isDenied()) {
                return NextResponse.json({ error: 'Too many requests', reason: decision.reason }, { status: 429 });
            }
        }

        const body = await request.json();
        const { filename, contentType, projectId } = body;

        if (!filename || !contentType || !projectId) {
            return NextResponse.json(
                { error: 'filename, contentType, and projectId are required' },
                { status: 400 }
            );
        }

        // Generate a unique key: agency/{userId}/{projectId}/{uuid}-{filename}
        const uniqueId = uuidv4();
        // Sanitize filename
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `uploads/${projectId}/${uniqueId}-${sanitizedFilename}`;

        const { uploadUrl, publicUrl } = await StorageService.getPresignedUploadUrl(key, contentType);

        return NextResponse.json({
            uploadUrl,
            publicUrl,
            key,
            filename: `${uniqueId}-${sanitizedFilename}`
        });
    } catch (error) {
        console.error('[Upload URL API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload URL' },
            { status: 500 }
        );
    }
}
