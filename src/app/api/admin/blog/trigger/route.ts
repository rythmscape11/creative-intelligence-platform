import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth-utils';
import { BlogEngineService } from '@/lib/services/blog-engine';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const admin = await requireAdminApi();

        // 1. Load Config
        const config = await prisma.blogAutomationConfig.findFirst();
        if (!config) {
            return NextResponse.json({ status: 'Failed', reason: 'Configuration not found' });
        }

        // 2. Research
        await prisma.automationLog.create({
            data: { action: 'RESEARCH', status: 'IN_PROGRESS', message: 'Starting trend research...' }
        });

        // Fetch all available categories
        const categories = await prisma.category.findMany();

        let selectedCategory;
        let niche = 'Marketing';

        if (categories.length > 0) {
            // Pick a random category
            selectedCategory = categories[Math.floor(Math.random() * categories.length)];
            niche = selectedCategory.name;
        } else if (config.topics.length > 0) {
            niche = config.topics.join(', ');
        }

        const trends = await BlogEngineService.researchTrends(niche, admin.id);

        if (trends.length === 0) {
            await prisma.automationLog.create({
                data: { action: 'RESEARCH', status: 'FAILED', message: 'No trends found.' }
            });
            return NextResponse.json({ status: 'Skipped', reason: 'No trends found' });
        }

        const topic = trends[0];
        await prisma.automationLog.create({
            data: { action: 'RESEARCH', status: 'SUCCESS', message: `Found trending topic: ${topic}` }
        });

        // 3. Generate
        await prisma.automationLog.create({
            data: { action: 'GENERATE', status: 'IN_PROGRESS', message: 'Generating content and image...' }
        });

        const content = await BlogEngineService.generateContent(topic, admin.id, config.wordCount);
        const imageUrl = await BlogEngineService.generateImage(topic, admin.id, content.imagePrompt);

        // 4. Publish
        await prisma.automationLog.create({
            data: { action: 'PUBLISH', status: 'IN_PROGRESS', message: 'Publishing post...' }
        });

        const post = await BlogEngineService.publishPost({
            ...content,
            imageUrl
        }, admin.id, selectedCategory?.id);

        // Update Last Run
        await prisma.blogAutomationConfig.update({
            where: { id: config.id },
            data: { lastRunAt: new Date() }
        });

        await prisma.automationLog.create({
            data: { action: 'PUBLISH', status: 'SUCCESS', message: `Published: ${post.title}`, metadata: { slug: post.slug } }
        });

        return NextResponse.json({
            status: 'Success',
            post: {
                title: post.title,
                slug: post.slug,
                category: selectedCategory?.name || 'Uncategorized'
            }
        });

    } catch (error: any) {
        console.error('Manual trigger failed:', error);
        await prisma.automationLog.create({
            data: { action: 'ERROR', status: 'FAILED', message: error.message || 'Unknown error' }
        });
        return NextResponse.json({ status: 'Failed', error: error.message }, { status: 500 });
    }
}
