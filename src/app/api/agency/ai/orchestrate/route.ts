import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateCreativeBrief, draftMediaPlan } from '@/lib/ai/agency-generators';

export const maxDuration = 60; // Allow 60s for AI generation

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const { type, payload } = json;

        if (!type || !payload) {
            return new NextResponse('Missing type or payload', { status: 400 });
        }

        let result;

        switch (type) {
            case 'CREATIVE_BRIEF':
                result = await generateCreativeBrief(
                    payload.clientName,
                    payload.projectName,
                    payload.objective,
                    payload.audience,
                    payload.keyMessage
                );
                break;

            case 'MEDIA_PLAN':
                result = await draftMediaPlan(
                    payload.budget,
                    payload.currency,
                    payload.duration,
                    payload.objective,
                    payload.targetAudience
                );
                break;

            default:
                return new NextResponse('Invalid AI task type', { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('AI Orchestration Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
