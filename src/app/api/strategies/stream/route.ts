import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { enhancedStrategyInputSchema } from '@/lib/validations/enhanced-strategy';
import { strategySchema } from '@/lib/ai/strategy-schema';
import { getSystemPrompt, buildUserPrompt } from '@/lib/ai/strategy-prompts';

import { ensureUserInDb } from '@/lib/ensure-user';

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Ensure user exists in our DB (sync check)
        const userSync = await ensureUserInDb(userId);
        if (!userSync.success) {
            return new Response('User sync failed. Please refresh page.', { status: 500 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return new Response('User not found. Please refresh page.', { status: 404 });
        }

        const json = await req.json();
        const input = enhancedStrategyInputSchema.parse(json);

        // Create initial DB record
        const strategy = await prisma.marketingStrategy.create({
            data: {
                userId: user.id,
                name: input.businessName,
                input: JSON.stringify(input),
                status: 'ACTIVE', // Mark as active immediately so user can see it
                generatedBy: 'AI',
                version: 1,
            },
        });

        const result = streamObject({
            model: openai('gpt-4o'),
            schema: strategySchema as any,
            system: getSystemPrompt(),
            prompt: buildUserPrompt(input, strategy.id),
            onFinish: async ({ object, usage }) => {
                if (!object) return;

                try {
                    // Update DB with final result
                    await prisma.marketingStrategy.update({
                        where: { id: strategy.id },
                        data: {
                            output: JSON.stringify(object),
                            status: 'COMPLETED',
                        },
                    });

                    // Track usage
                    // Import dynamically to avoid circular dependencies
                    const { GovernorService } = await import('@/lib/governor');
                    if (usage) {
                        await GovernorService.trackUsage(
                            user.id,
                            'gpt-4o',
                            (usage as any).promptTokens || 0,
                            (usage as any).completionTokens || 0,
                            'strategy-generator-stream'
                        );
                    }
                } catch (err) {
                    console.error('Failed to save strategy output:', err);
                }
            },
        });

        // Return the stream response
        // Pass the strategyId in headers so frontend can reference it
        return result.toTextStreamResponse({
            headers: {
                'x-strategy-id': strategy.id
            }
        });

    } catch (error) {
        console.error('Strategy generation error:', error);
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 400 });
        }
        return new Response(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 });
    }
}
