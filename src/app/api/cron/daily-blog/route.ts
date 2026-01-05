import { NextResponse } from 'next/server';
import { BlogEngineService } from '@/lib/services/blog-engine';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout for long-running AI tasks

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 1. Load Config
        const config = await prisma.blogAutomationConfig.findFirst();
        if (!config || !config.isActive) {
            return NextResponse.json({ status: 'Skipped', reason: 'Automation disabled or not configured' });
        }

        // 2. Check Schedule
        const now = new Date();
        if (config.nextRunAt && now < config.nextRunAt) {
            return NextResponse.json({ status: 'Skipped', reason: 'Not scheduled yet', nextRun: config.nextRunAt });
        }

        // 3. Get Admin User (Author) - Moved up to track usage
        const author = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
            orderBy: { createdAt: 'asc' }
        });

        if (!author) {
            throw new Error('No admin user found to attribute post to');
        }

        // 4. Select Topic & Category
        await prisma.automationLog.create({
            data: { action: 'RESEARCH', status: 'IN_PROGRESS', message: 'Starting daily trend research...' }
        });

        // Fetch all available categories
        const categories = await prisma.category.findMany();

        let selectedCategory;
        let niche = 'Marketing, AI, and Machine Learning';

        if (categories.length > 0) {
            // Pick a random category
            selectedCategory = categories[Math.floor(Math.random() * categories.length)];
            niche = selectedCategory.name;
            console.log(`🤖 Selected category for auto-blog: ${niche}`);
        } else if (config.topics.length > 0) {
            // Fallback to configured topics
            niche = config.topics.join(', ');
        }

        // Research trends for the selected niche/category
        const trends = await BlogEngineService.researchTrends(niche, author.id);

        if (trends.length === 0) {
            await prisma.automationLog.create({
                data: { action: 'RESEARCH', status: 'FAILED', message: 'No trends found.' }
            });
            return NextResponse.json({ status: 'Skipped', reason: 'No trends found' });
        }

        // Pick the first trend
        const topic = trends[0];
        await prisma.automationLog.create({
            data: { action: 'RESEARCH', status: 'SUCCESS', message: `Found trending topic: ${topic}` }
        });

        // 5. Generate Content (using configured word count)
        await prisma.automationLog.create({
            data: { action: 'GENERATE', status: 'IN_PROGRESS', message: 'Generating content and image...' }
        });

        const content = await BlogEngineService.generateContent(topic, author.id, config.wordCount);

        // 6. Generate Image
        const imageUrl = await BlogEngineService.generateImage(topic, author.id, content.imagePrompt);

        // 7. Publish
        await prisma.automationLog.create({
            data: { action: 'PUBLISH', status: 'IN_PROGRESS', message: 'Publishing post...' }
        });

        const post = await BlogEngineService.publishPost({
            ...content,
            imageUrl
        }, author.id, selectedCategory?.id);

        await prisma.automationLog.create({
            data: { action: 'PUBLISH', status: 'SUCCESS', message: `Published: ${post.title}`, metadata: { slug: post.slug } }
        });

        // 7. Update Schedule
        let nextRun = new Date();
        if (config.frequency === 'DAILY') nextRun.setDate(nextRun.getDate() + 1);
        else if (config.frequency === 'WEEKLY') nextRun.setDate(nextRun.getDate() + 7);
        else if (config.frequency === 'BIWEEKLY') nextRun.setDate(nextRun.getDate() + 14);

        // Set to 9 AM next day/week
        nextRun.setHours(9, 0, 0, 0);

        await prisma.blogAutomationConfig.update({
            where: { id: config.id },
            data: {
                lastRunAt: new Date(),
                nextRunAt: nextRun
            }
        });

        return NextResponse.json({
            status: 'Success',
            post: {
                id: post.id,
                title: post.title,
                slug: post.slug,
                url: `/blog/${post.slug}`
            },
            nextRun
        });

    } catch (error: any) {
        console.error('Daily blog cron failed:', error);
        return NextResponse.json({ status: 'Failed', error: error.message }, { status: 500 });
    }
}
