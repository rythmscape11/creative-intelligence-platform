import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/optimizer/suggestions - Get AI suggestions for user
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'PENDING';
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: any = {
            userId,
            status
        };

        if (category) {
            where.category = category;
        }

        const suggestions = await prisma.optimizerSuggestion.findMany({
            where,
            include: {
                campaign: {
                    select: {
                        id: true,
                        name: true,
                        connection: {
                            select: {
                                platform: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ],
            take: limit
        });

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('[Optimizer Suggestions] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch suggestions' },
            { status: 500 }
        );
    }
}

// POST /api/optimizer/suggestions/[id]/apply - Apply a suggestion
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { suggestionId } = body;

        if (!suggestionId) {
            return NextResponse.json(
                { error: 'Suggestion ID required' },
                { status: 400 }
            );
        }

        const suggestion = await prisma.optimizerSuggestion.findFirst({
            where: { id: suggestionId, userId }
        });

        if (!suggestion) {
            return NextResponse.json(
                { error: 'Suggestion not found' },
                { status: 404 }
            );
        }

        if (suggestion.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Suggestion already processed' },
                { status: 400 }
            );
        }

        // Mark suggestion as applied
        const updated = await prisma.optimizerSuggestion.update({
            where: { id: suggestionId },
            data: {
                status: 'APPLIED',
                appliedAt: new Date(),
                appliedBy: userId
            }
        });

        // Create action log
        await prisma.optimizerActionLog.create({
            data: {
                userId,
                campaignId: suggestion.campaignId,
                actionType: suggestion.type,
                source: 'SUGGESTION',
                sourceId: suggestionId,
                newState: suggestion.action as any,
                status: 'SUCCESS',
                executedAt: new Date()
            }
        });

        return NextResponse.json({
            suggestion: updated,
            message: 'Suggestion applied successfully'
        });
    } catch (error) {
        console.error('[Optimizer Suggestions] POST error:', error);
        return NextResponse.json(
            { error: 'Failed to apply suggestion' },
            { status: 500 }
        );
    }
}
