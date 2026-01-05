import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import OpenAIStrategyService from '@/lib/services/openai-client';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        await requireAdminApi();

        // 1. Fetch COMPLETED strategies to use as training data
        const strategies = await prisma.marketingStrategy.findMany({
            where: {
                status: 'COMPLETED',
                output: { not: null } // Ensure there is an output to train on
            },
            take: 50, // Limit for initial testing/cost control
            orderBy: { createdAt: 'desc' }
        });

        if (strategies.length < 10) {
            return NextResponse.json({
                status: 'FAILED',
                error: 'Insufficient data. Need at least 10 completed strategies to start fine-tuning.'
            }, { status: 400 });
        }

        // 2. Format data into JSONL for Chat Models
        // Format: {"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
        const trainingData = strategies.map(strategy => {
            try {
                const input = JSON.parse(strategy.input);
                const output = JSON.parse(strategy.output!); // We checked for null above

                // Reconstruct the prompt (simplified for training)
                const userPrompt = `
Company: ${input.businessName}
Industry: ${input.industry}
Audience: ${input.targetAudience}
Budget: $${input.budget}
Objectives: ${input.objectives.join(', ')}
        `.trim();

                return JSON.stringify({
                    messages: [
                        { role: "system", content: "You are an expert marketing strategist." },
                        { role: "user", content: userPrompt },
                        { role: "assistant", content: JSON.stringify(output) }
                    ]
                });
            } catch (e) {
                return null;
            }
        }).filter(Boolean).join('\n');

        // 3. Upload file to OpenAI
        const fileId = await OpenAIStrategyService.uploadTrainingFile(trainingData);

        // 4. Trigger Fine-Tuning Job
        const jobId = await OpenAIStrategyService.createFineTuningJob(fileId);

        return NextResponse.json({
            jobId,
            status: 'STARTED',
            metadata: {
                trainingSetSize: strategies.length,
                validationSetSize: 0, // OpenAI handles validation split automatically
                features: ['industry', 'budget', 'objectives', 'channels'],
                fileId: fileId
            }
        });

    } catch (error) {
        console.error('MLOps pipeline error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET() {
    try {
        await requireAdminApi();

        // List recent jobs to show status
        const jobs = await OpenAIStrategyService.listFineTuningJobs(1);
        const latestJob = jobs[0];

        return NextResponse.json({
            modelVersion: latestJob?.fine_tuned_model || 'gpt-3.5-turbo (base)',
            lastRun: latestJob?.created_at ? new Date(latestJob.created_at * 1000).toISOString() : null,
            status: latestJob?.status || 'IDLE',
            jobId: latestJob?.id
        });
    } catch (error) {
        console.error('Failed to fetch MLOps status:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
