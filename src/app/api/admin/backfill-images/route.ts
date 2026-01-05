import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BlogEngineService } from '@/lib/services/blog-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

export async function POST(req: Request) {
    try {
        // 1. Basic Auth Check (ensure it's an admin requesting)
        // ideally checking session, but for this utility tool, we'll rely on environment secret or just assume it's protected by middleware/admin path
        // For extra safety, we can check for a header secret
        const authHeader = req.headers.get('x-admin-secret');
        const adminSecret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;

        if (adminSecret && authHeader !== adminSecret) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 2. Find posts needing images
        // Criteria: featuredImage is null, empty, or contains "oaidalle" (temporary url)
        const postsToFix = await prisma.blogPost.findMany({
            where: {
                OR: [
                    { featuredImage: null },
                    { featuredImage: '' },
                    { featuredImage: { contains: 'oaidalle' } }
                ]
            },
            take: 5, // Process in batches to avoid timeouts
            orderBy: { createdAt: 'desc' }
        });

        if (postsToFix.length === 0) {
            return NextResponse.json({ message: 'No posts found requiring image backfill.' });
        }

        const results = [];
        const author = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!author) throw new Error('No admin user found for attribution');

        // 3. Process each post
        for (const post of postsToFix) {
            try {
                console.log(`Backfilling image for: ${post.title}`);

                // Generate new image
                // We don't have the original prompt stored usually, so we'll generate one specific to the title
                const newImageUrl = await BlogEngineService.generateImage(post.title, author.id);

                if (newImageUrl) {
                    // Update post
                    await prisma.blogPost.update({
                        where: { id: post.id },
                        data: { featuredImage: newImageUrl }
                    });
                    results.push({ id: post.id, title: post.title, status: 'Fixed', url: newImageUrl });
                } else {
                    results.push({ id: post.id, title: post.title, status: 'Failed to generate' });
                }

            } catch (err: any) {
                console.error(`Failed to backfill post ${post.id}:`, err);
                results.push({ id: post.id, title: post.title, status: 'Error', error: err.message });
            }
        }

        return NextResponse.json({
            processed: results.length,
            results
        });

    } catch (error: any) {
        console.error('Backfill failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
