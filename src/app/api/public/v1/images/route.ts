/**
 * Public Image Generation API
 * POST /api/public/v1/images
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/services/forge/api-key-middleware';
import { generateImageWithFal } from '@/lib/services/forge/forge-providers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    // Validate API key
    const validation = await validateApiKey(request, ['images']);

    if (!validation.valid) {
        return NextResponse.json(
            { error: validation.error, code: 'unauthorized' },
            { status: 401 }
        );
    }

    const apiKey = validation.key!;

    try {
        const body = await request.json();
        const { prompt, model, aspect_ratio, num_images } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required', code: 'bad_request' },
                { status: 400 }
            );
        }

        // Check sandbox mode
        const isSandbox = apiKey.id.includes('test');

        // Generate image
        const result = await generateImageWithFal({
            prompt,
            model: model || 'flux.1-schnell',
            aspectRatio: aspect_ratio || '1:1',
            numImages: num_images || 1,
        });

        // Log usage (only for production keys)
        if (!isSandbox) {
            await prisma.forgeUsageLog.create({
                data: {
                    orgId: apiKey.orgId,
                    nodeType: 'image',
                    provider: 'fal',
                    sparksUsed: result.sparksUsed,
                    assetUrl: result.imageUrl,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                image_url: result.imageUrl,
                model: result.model,
                width: result.width,
                height: result.height,
                sparks_used: result.sparksUsed,
            },
            sandbox: isSandbox,
        });
    } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json(
            { error: 'Image generation failed', code: 'internal_error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        endpoint: '/api/public/v1/images',
        method: 'POST',
        description: 'Generate images using Flux.1',
        authentication: 'Bearer token (API key)',
        required_scopes: ['images'],
        body: {
            prompt: { type: 'string', required: true, description: 'Image description' },
            model: { type: 'string', required: false, default: 'flux.1-schnell', options: ['flux.1-schnell', 'flux.1-dev'] },
            aspect_ratio: { type: 'string', required: false, default: '1:1', options: ['1:1', '16:9', '9:16', '4:3'] },
            num_images: { type: 'number', required: false, default: 1, max: 4 },
        },
        response: {
            image_url: 'URL to generated image',
            model: 'Model used',
            width: 'Image width',
            height: 'Image height',
            sparks_used: 'Sparks consumed',
        },
    });
}
