import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { OptimizerAIService } from '@/lib/optimizer/ai-service';

// POST /api/optimizer/copilot - Process AI copilot query
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { message, conversationId } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 });
        }

        // Get or create conversation
        let conversation;
        if (conversationId) {
            conversation = await prisma.optimizerCopilotConversation.findFirst({
                where: { id: conversationId, userId }
            });
        }

        if (!conversation) {
            conversation = await prisma.optimizerCopilotConversation.create({
                data: {
                    userId,
                    title: message.slice(0, 50),
                }
            });
        }

        // Save user message
        await prisma.optimizerCopilotMessage.create({
            data: {
                conversationId: conversation.id,
                role: 'USER',
                content: message,
            }
        });

        // Get user's campaign data for context
        const connections = await prisma.optimizerConnection.findMany({
            where: { userId },
            select: { id: true }
        });

        const campaigns = await prisma.optimizerCampaign.findMany({
            where: {
                connectionId: { in: connections.map(c => c.id) }
            },
            include: {
                connection: { select: { platform: true } },
                metrics: {
                    take: 7,
                    orderBy: { date: 'desc' }
                }
            },
            take: 20
        });

        // Transform campaigns for AI context
        const campaignData = campaigns.map(c => {
            const metrics = c.metrics;
            const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0);
            const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
            const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
            const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
            const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);

            return {
                id: c.id,
                name: c.name,
                platform: c.connection.platform,
                dailyBudget: c.dailyBudget || 0,
                spend: totalSpend,
                revenue: totalRevenue,
                conversions: totalConversions,
                clicks: totalClicks,
                impressions: totalImpressions,
                roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
                cpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
                ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
            };
        });

        // Get recent actions for context
        const recentActions = await prisma.optimizerActionLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { actionType: true, createdAt: true }
        });

        // Process with AI
        const aiResponse = await OptimizerAIService.processCopilotQuery(
            message,
            {
                campaigns: campaignData,
                recentActions: recentActions.map(a =>
                    `${a.actionType} at ${a.createdAt.toISOString()}`
                ),
            }
        );

        // Save assistant response
        const assistantMessage = await prisma.optimizerCopilotMessage.create({
            data: {
                conversationId: conversation.id,
                role: 'ASSISTANT',
                content: aiResponse.response,
                suggestedActions: aiResponse.suggestedActions || null,
            }
        });

        return NextResponse.json({
            conversationId: conversation.id,
            message: {
                id: assistantMessage.id,
                role: 'ASSISTANT',
                content: aiResponse.response,
                suggestedActions: aiResponse.suggestedActions,
                createdAt: assistantMessage.createdAt,
            }
        });
    } catch (error) {
        console.error('[Optimizer Copilot] Error:', error);
        return NextResponse.json(
            { error: 'Failed to process query' },
            { status: 500 }
        );
    }
}

// GET /api/optimizer/copilot - Get conversations
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (conversationId) {
            // Get specific conversation with messages
            const conversation = await prisma.optimizerCopilotConversation.findFirst({
                where: { id: conversationId, userId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });

            if (!conversation) {
                return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
            }

            return NextResponse.json({ conversation });
        }

        // Get all conversations
        const conversations = await prisma.optimizerCopilotConversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            },
            take: 20
        });

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error('[Optimizer Copilot] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}
