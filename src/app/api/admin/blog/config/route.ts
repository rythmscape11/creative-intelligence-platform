import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        await requireAdmin();

        let config = await prisma.blogAutomationConfig.findFirst();

        if (!config) {
            config = await prisma.blogAutomationConfig.create({
                data: {
                    isActive: false,
                    frequency: 'DAILY',
                    wordCount: 2000,
                    topics: ['Marketing', 'AI', 'Business'],
                }
            });
        }

        // Fetch recent posts for dashboard
        const recentPosts = await prisma.blogPost.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                category: {
                    select: { name: true }
                }
            }
        });

        // Fetch recent logs
        const logs = await prisma.automationLog.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            ...config,
            recentPosts,
            logs
        });
    } catch (error) {
        console.error('Failed to fetch blog config:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await requireAdmin();
        const body = await req.json();
        const { isActive, frequency, wordCount, topics } = body;

        let config = await prisma.blogAutomationConfig.findFirst();

        if (config) {
            config = await prisma.blogAutomationConfig.update({
                where: { id: config.id },
                data: { isActive, frequency, wordCount, topics }
            });
        } else {
            config = await prisma.blogAutomationConfig.create({
                data: { isActive, frequency, wordCount, topics }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Failed to update blog config:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
