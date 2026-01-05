import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger-service';
import OpenAI from 'openai';
import { slugify } from '@/lib/utils';

const openai = new OpenAI({
    apiKey: (process.env.OPENAI_API_KEY || '').trim(),
});

/**
 * POST /api/admin/blog/fix-images
 * Regenerates images for blog posts that have expired DALL-E URLs
 * or no featured image at all.
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, message: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const { postIds, fixAll } = body;

        // Find posts that need image fixes
        let postsToFix;

        if (postIds && Array.isArray(postIds) && postIds.length > 0) {
            // Fix specific posts
            postsToFix = await prisma.blogPost.findMany({
                where: {
                    id: { in: postIds },
                },
                select: {
                    id: true,
                    title: true,
                    featuredImage: true,
                },
            });
        } else if (fixAll) {
            // Find all posts with DALL-E URLs (temporary) or no image
            postsToFix = await prisma.blogPost.findMany({
                where: {
                    OR: [
                        { featuredImage: null },
                        { featuredImage: '' },
                        { featuredImage: { contains: 'oaidalleapiprodscus.blob.core.windows.net' } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    featuredImage: true,
                },
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide postIds array or set fixAll: true'
                },
                { status: 400 }
            );
        }

        if (postsToFix.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No posts need image fixes',
                fixed: 0,
            });
        }

        logger.info(`Starting image regeneration for ${postsToFix.length} posts`, { userId: user.id });

        const results: { postId: string; title: string; status: string; newImageUrl?: string }[] = [];

        for (const post of postsToFix) {
            try {
                console.log(`Regenerating image for: ${post.title}`);

                // Generate new image using DALL-E 3
                const prompt = `A professional, modern, and abstract representation of "${post.title}". 
                Style: Minimalist, sophisticated, tech-focused. 
                Colors: Use a harmonious color palette with amber (#F59E0B), deep navy, and subtle gradients.
                Quality: High-end, suitable for a premium marketing blog header.
                Do NOT include any text or words in the image.`;

                const response = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: "1792x1024", // Landscape for blog headers
                    quality: "hd",
                });

                const dalleUrl = response.data?.[0]?.url;

                if (!dalleUrl) {
                    results.push({
                        postId: post.id,
                        title: post.title,
                        status: 'failed',
                    });
                    continue;
                }

                // Upload to S3 for persistence
                let finalUrl = dalleUrl;

                try {
                    const { S3Service } = await import('@/lib/services/s3-service');
                    const s3Service = new S3Service();

                    const imageRes = await fetch(dalleUrl);
                    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.statusText}`);

                    const buffer = Buffer.from(await imageRes.arrayBuffer());
                    const filename = `blog-images/${slugify(post.title)}-${Date.now()}.png`;

                    const uploadResult = await s3Service.uploadFile(filename, buffer, {
                        contentType: 'image/png',
                        acl: 'public-read'
                    });

                    finalUrl = uploadResult.location;
                    console.log(`Image uploaded to S3: ${finalUrl}`);
                } catch (uploadError) {
                    console.error('S3 upload failed, using DALL-E URL:', uploadError);
                    // Will use dalleUrl as fallback
                }

                // Update the post with new image URL
                await prisma.blogPost.update({
                    where: { id: post.id },
                    data: { featuredImage: finalUrl },
                });

                results.push({
                    postId: post.id,
                    title: post.title,
                    status: 'success',
                    newImageUrl: finalUrl,
                });

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`Failed to regenerate image for post ${post.id}:`, error);
                results.push({
                    postId: post.id,
                    title: post.title,
                    status: 'error',
                });
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const failCount = results.filter(r => r.status !== 'success').length;

        // Log activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'FIX_BLOG_IMAGES',
                entityType: 'BLOG_POST',
                entityId: 'batch',
                details: JSON.stringify({
                    total: postsToFix.length,
                    success: successCount,
                    failed: failCount
                }),
            },
        });

        return NextResponse.json({
            success: true,
            message: `Fixed ${successCount} of ${postsToFix.length} posts`,
            fixed: successCount,
            failed: failCount,
            results,
        });

    } catch (error) {
        logger.error('Fix blog images error', error as Error);
        return NextResponse.json(
            { success: false, message: 'Failed to fix blog images' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/admin/blog/fix-images
 * Returns posts that need image fixes
 */
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, message: 'Admin access required' },
                { status: 403 }
            );
        }

        // Find posts with broken images
        const postsNeedingFix = await prisma.blogPost.findMany({
            where: {
                OR: [
                    { featuredImage: null },
                    { featuredImage: '' },
                    { featuredImage: { contains: 'oaidalleapiprodscus.blob.core.windows.net' } },
                ],
            },
            select: {
                id: true,
                title: true,
                slug: true,
                featuredImage: true,
                publishedAt: true,
            },
            orderBy: {
                publishedAt: 'desc',
            },
        });

        return NextResponse.json({
            success: true,
            count: postsNeedingFix.length,
            posts: postsNeedingFix,
        });

    } catch (error) {
        logger.error('Get posts needing image fix error', error as Error);
        return NextResponse.json(
            { success: false, message: 'Failed to get posts' },
            { status: 500 }
        );
    }
}
