import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { analyserAIService } from '@/lib/analyser/ai-service';

// POST /api/analyser/copilot - Process copilot query
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { query, conversationId, projectId } = body;

        if (!query) {
            return NextResponse.json({ error: 'Query required' }, { status: 400 });
        }

        // Get or create conversation
        let conversation;
        if (conversationId) {
            conversation = await prisma.analyserCopilotConversation.findUnique({
                where: { id: conversationId },
            });
        }

        if (!conversation) {
            conversation = await prisma.analyserCopilotConversation.create({
                data: {
                    userId,
                    projectId,
                    title: query.slice(0, 50),
                },
            });
        }

        // Build context from project data if available
        let context: {
            domain?: string;
            competitors?: string[];
            recentKeywords?: string[];
            metrics?: Record<string, number>;
        } = {};

        if (projectId) {
            const project = await prisma.analyserProject.findFirst({
                where: { id: projectId, userId },
                include: {
                    competitors: { take: 5 },
                    keywordSets: {
                        include: {
                            keywords: { take: 10, orderBy: { searchVolume: 'desc' } },
                        },
                    },
                },
            });

            if (project) {
                context = {
                    domain: project.domain,
                    competitors: project.competitors.map(c => c.domain),
                    recentKeywords: project.keywordSets
                        .flatMap(s => s.keywords.map(k => k.keyword))
                        .slice(0, 10),
                    metrics: {
                        authority: project.authorityScore || 0,
                        traffic: project.monthlyVisits || 0,
                        keywords: project.organicKeywords || 0,
                        backlinks: project.backlinksCount || 0,
                    },
                };
            }
        }

        // Save user message
        await prisma.analyserCopilotMessage.create({
            data: {
                conversationId: conversation.id,
                role: 'USER',
                content: query,
            },
        });

        // Get AI response
        const aiResult = await analyserAIService.processCopilotQuery(query, context);

        // Save assistant message
        const assistantMessage = await prisma.analyserCopilotMessage.create({
            data: {
                conversationId: conversation.id,
                role: 'ASSISTANT',
                content: aiResult.response,
                suggestedActions: aiResult.suggestedActions || null,
            },
        });

        return NextResponse.json({
            conversationId: conversation.id,
            message: {
                id: assistantMessage.id,
                role: 'assistant',
                content: aiResult.response,
                suggestedActions: aiResult.suggestedActions,
                timestamp: assistantMessage.createdAt,
            },
        });
    } catch (error) {
        console.error('[Analyser Copilot POST]', error);
        return NextResponse.json(
            { error: 'Failed to process query' },
            { status: 500 }
        );
    }
}

// GET /api/analyser/copilot - Get conversation history
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (conversationId) {
            const conversation = await prisma.analyserCopilotConversation.findFirst({
                where: { id: conversationId, userId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });

            if (!conversation) {
                return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
            }

            return NextResponse.json({ conversation });
        }

        // List all conversations
        const conversations = await prisma.analyserCopilotConversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: 20,
            include: {
                _count: {
                    select: { messages: true },
                },
            },
        });

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error('[Analyser Copilot GET]', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}
