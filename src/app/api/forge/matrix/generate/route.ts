import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateImageWithFal } from '@/lib/services/forge/forge-providers';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { prompt, xValue, yValue } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Construct enhanced prompt with matrix parameters
        const enhancedPrompt = `${prompt}, ${xValue?.toLowerCase() || ''}, ${yValue?.toLowerCase() || ''}`.trim();

        // Generate image using Fal.ai
        const result = await generateImageWithFal({
            prompt: enhancedPrompt,
            model: 'flux.1-schnell',
            aspectRatio: '1:1',
            numImages: 1,
        });

        return NextResponse.json({
            imageUrl: result.imageUrl,
            prompt: enhancedPrompt,
            xValue,
            yValue,
            sparksUsed: result.sparksUsed,
        });
    } catch (error) {
        console.error('Matrix generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
