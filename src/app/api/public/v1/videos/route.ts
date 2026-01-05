/**
 * Public Video Generation API
 * POST /api/public/v1/videos
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/services/forge/api-key-middleware';
import { generateVideoWithRunway, generateVideoWithKling } from '@/lib/services/forge/forge-providers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    // Validate API key
    const validation = await validateApiKey(request, ['videos']);

    if (!validation.valid) {
        return NextResponse.json(
            { error: validation.error, code: 'unauthorized' },
            { status: 401 }
        );
    }

    const apiKey = validation.key!;

    try {
        const body = await request.json();
        const { prompt, mode, duration, aspect_ratio, image_url } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required', code: 'bad_request' },
                { status: 400 }
            );
        }

        // Check sandbox mode
        const isSandbox = apiKey.id.includes('test');

        let result;

        // Route to appropriate provider based on mode
        if (mode === 'cinema') {
            // Runway for cinematic content
            result = await generateVideoWithRunway({
                prompt,
                imageUrl: image_url,
                duration: duration || 5,
            });
        } else {
            // Kling for social/short-form content
            result = await generateVideoWithKling({
                prompt,
                duration: duration || 5,
                aspectRatio: aspect_ratio || '9:16',
            });
        }

        // Log usage (only for production keys)
        if (!isSandbox) {
            await prisma.forgeUsageLog.create({
                data: {
                    orgId: apiKey.orgId,
                    nodeType: 'video',
                    provider: mode === 'cinema' ? 'runway' : 'kling',
                    sparksUsed: result.sparksUsed,
                    assetUrl: result.videoUrl,
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                video_url: result.videoUrl,
                model: result.model,
                duration: result.duration,
                mode: result.mode,
                sparks_used: result.sparksUsed,
            },
            sandbox: isSandbox,
        });
    } catch (error) {
        console.error('Video generation error:', error);
        return NextResponse.json(
            { error: 'Video generation failed', code: 'internal_error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        endpoint: '/api/public/v1/videos',
        method: 'POST',
        description: 'Generate videos using Runway (cinema) or Kling (social)',
        authentication: 'Bearer token (API key)',
        required_scopes: ['videos'],
        body: {
            prompt: { type: 'string', required: true, description: 'Video description' },
            mode: { type: 'string', required: false, default: 'social', options: ['cinema', 'social'] },
            duration: { type: 'number', required: false, default: 5, options: [5, 10] },
            aspect_ratio: { type: 'string', required: false, default: '9:16', options: ['16:9', '9:16', '1:1'] },
            image_url: { type: 'string', required: false, description: 'Source image for cinema mode' },
        },
        response: {
            video_url: 'URL to generated video',
            model: 'Model used (gen-3-alpha or kling-v1)',
            duration: 'Video duration in seconds',
            mode: 'Generation mode (cinema or social)',
            sparks_used: 'Sparks consumed',
        },
    });
}
