/**
 * Forge Provider Integrations
 * Unified interface for AI content generation providers
 */

import { ApiConfigService } from '@/lib/services/api-config.service';

// Types for provider responses
export interface ImageGenerationResult {
    imageUrl: string;
    prompt: string;
    model: string;
    width: number;
    height: number;
    sparksUsed: number;
}

export interface VideoGenerationResult {
    videoUrl: string;
    prompt: string;
    model: string;
    duration: number;
    mode: 'cinema' | 'social';
    sparksUsed: number;
}

export interface LLMGenerationResult {
    text: string;
    prompt: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    sparksUsed: number;
}

// Dynamic provider configuration using ApiConfigService
async function getProviderConfig() {
    return {
        FAL_API_KEY: await ApiConfigService.getApiKey('FAL_API_KEY') || '',
        RUNWAY_API_KEY: await ApiConfigService.getApiKey('RUNWAY_API_KEY') || '',
        KLING_API_KEY: await ApiConfigService.getApiKey('KLING_API_KEY') || '',
        GOOGLE_AI_API_KEY: await ApiConfigService.getApiKey('GOOGLE_AI_API_KEY') || '',
        VERTEX_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT || '',
        VERTEX_LOCATION: process.env.VERTEX_LOCATION || 'us-central1',
    };
}


// Sparks cost definitions - From Original Brief
// Image Standard: 5, Image LoRA: 10, Video Cinema: 75, Video Social: 40, LLM: 1
const SPARKS_COSTS = {
    llm: { base: 1, perInputToken: 0, perOutputToken: 0 }, // 1 Spark flat
    image: {
        flux_schnell: 5,  // Standard image
        flux_dev: 10,     // LoRA-enabled
    },
    video: {
        runway: 75,       // Cinema mode
        kling: 40,        // Social mode
    },
    brandguard: 3,
    upscale: 5,         // 4K upscale
};

/**
 * Fal.ai Image Generation (Flux)
 */
export async function generateImageWithFal(params: {
    prompt: string;
    model?: 'flux.1-schnell' | 'flux.1-dev';
    aspectRatio?: string;
    numImages?: number;
}): Promise<ImageGenerationResult> {
    const { prompt, model = 'flux.1-schnell', aspectRatio = '1:1', numImages = 1 } = params;
    const config = await getProviderConfig();

    // Check if API key is configured
    if (!config.FAL_API_KEY) {
        console.warn('Fal.ai API key not configured, returning mock response');
        return {
            imageUrl: `https://via.placeholder.com/512x512?text=${encodeURIComponent(prompt.slice(0, 20))}`,
            prompt,
            model,
            width: 512,
            height: 512,
            sparksUsed: SPARKS_COSTS.image[model === 'flux.1-schnell' ? 'flux_schnell' : 'flux_dev'],
        };
    }

    try {
        // Real Fal.ai API call
        const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${config.FAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                image_size: aspectRatio === '16:9' ? 'landscape_16_9' :
                    aspectRatio === '9:16' ? 'portrait_9_16' : 'square',
                num_images: numImages,
            }),
        });

        if (!response.ok) {
            throw new Error(`Fal.ai API error: ${response.status}`);
        }

        const data = await response.json();
        const image = data.images?.[0];

        return {
            imageUrl: image?.url || '',
            prompt,
            model,
            width: image?.width || 512,
            height: image?.height || 512,
            sparksUsed: SPARKS_COSTS.image[model === 'flux.1-schnell' ? 'flux_schnell' : 'flux_dev'],
        };
    } catch (error) {
        console.error('Fal.ai image generation error:', error);
        throw error;
    }
}

/**
 * Runway Video Generation
 */
export async function generateVideoWithRunway(params: {
    prompt: string;
    imageUrl?: string;
    duration?: number;
}): Promise<VideoGenerationResult> {
    const { prompt, imageUrl, duration = 5 } = params;
    const config = await getProviderConfig();

    // Check if API key is configured
    if (!config.RUNWAY_API_KEY) {
        console.warn('Runway API key not configured, returning mock response');
        return {
            videoUrl: 'https://example.com/placeholder-video.mp4',
            prompt,
            model: 'gen-3-alpha',
            duration,
            mode: 'cinema',
            sparksUsed: SPARKS_COSTS.video.runway,
        };
    }

    try {
        // Real Runway API call (Gen-3 Alpha)
        const response = await fetch('https://api.runwayml.com/v1/generation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.RUNWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                image: imageUrl,
                duration,
                model: 'gen-3-alpha',
            }),
        });

        if (!response.ok) {
            throw new Error(`Runway API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            videoUrl: data.output?.url || '',
            prompt,
            model: 'gen-3-alpha',
            duration,
            mode: 'cinema',
            sparksUsed: SPARKS_COSTS.video.runway,
        };
    } catch (error) {
        console.error('Runway video generation error:', error);
        throw error;
    }
}

/**
 * Kling Video Generation (Social/Short-form)
 */
export async function generateVideoWithKling(params: {
    prompt: string;
    duration?: number;
    aspectRatio?: string;
}): Promise<VideoGenerationResult> {
    const { prompt, duration = 5, aspectRatio = '9:16' } = params;
    const config = await getProviderConfig();

    // Check if API key is configured
    if (!config.KLING_API_KEY) {
        console.warn('Kling API key not configured, returning mock response');
        return {
            videoUrl: 'https://example.com/placeholder-video.mp4',
            prompt,
            model: 'kling-v1',
            duration,
            mode: 'social',
            sparksUsed: SPARKS_COSTS.video.kling,
        };
    }

    try {
        // Real Kling API call
        const response = await fetch('https://api.kling.ai/v1/videos/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.KLING_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                duration,
                aspect_ratio: aspectRatio,
            }),
        });

        if (!response.ok) {
            throw new Error(`Kling API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            videoUrl: data.video_url || '',
            prompt,
            model: 'kling-v1',
            duration,
            mode: 'social',
            sparksUsed: SPARKS_COSTS.video.kling,
        };
    } catch (error) {
        console.error('Kling video generation error:', error);
        throw error;
    }
}

/**
 * Vertex AI LLM Generation (Gemini)
 */
export async function generateTextWithVertexAI(params: {
    prompt: string;
    model?: 'gemini-pro' | 'gemini-pro-vision';
    maxTokens?: number;
    temperature?: number;
}): Promise<LLMGenerationResult> {
    const { prompt, model = 'gemini-pro', maxTokens = 1024, temperature = 0.7 } = params;
    const config = await getProviderConfig();

    try {
        // Using Google AI SDK (simpler than full Vertex AI setup)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.GOOGLE_AI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: maxTokens,
                        temperature,
                    },
                }),
            }
        );

        if (!response.ok) {
            console.warn('Google AI API error, returning mock response');
            return {
                text: `[Mock Response] Generated content for: ${prompt.slice(0, 50)}...`,
                prompt,
                model,
                inputTokens: Math.ceil(prompt.length / 4),
                outputTokens: 100,
                sparksUsed: SPARKS_COSTS.llm.base,
            };
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const inputTokens = data.usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4);
        const outputTokens = data.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);

        const sparksUsed = Math.ceil(
            SPARKS_COSTS.llm.base +
            inputTokens * SPARKS_COSTS.llm.perInputToken +
            outputTokens * SPARKS_COSTS.llm.perOutputToken
        );

        return {
            text,
            prompt,
            model,
            inputTokens,
            outputTokens,
            sparksUsed,
        };
    } catch (error) {
        console.error('Vertex AI text generation error:', error);
        // Return mock response on error
        return {
            text: `[Mock Response] Generated content for: ${prompt.slice(0, 50)}...`,
            prompt,
            model,
            inputTokens: Math.ceil(prompt.length / 4),
            outputTokens: 100,
            sparksUsed: SPARKS_COSTS.llm.base,
        };
    }
}

/**
 * Unified provider router
 */
export async function executeProviderAction(
    action: 'image' | 'video' | 'llm',
    params: Record<string, unknown>
): Promise<ImageGenerationResult | VideoGenerationResult | LLMGenerationResult> {
    switch (action) {
        case 'image':
            return generateImageWithFal({
                prompt: params.prompt as string,
                model: params.model as 'flux.1-schnell' | 'flux.1-dev',
                aspectRatio: params.aspect_ratio as string,
                numImages: params.num_images as number,
            });

        case 'video':
            const mode = params.mode as string;
            if (mode === 'cinema') {
                return generateVideoWithRunway({
                    prompt: params.prompt as string,
                    imageUrl: params.image_url as string,
                    duration: params.duration as number,
                });
            } else {
                return generateVideoWithKling({
                    prompt: params.prompt as string,
                    duration: params.duration as number,
                    aspectRatio: params.aspect_ratio as string,
                });
            }

        case 'llm':
            return generateTextWithVertexAI({
                prompt: params.prompt as string,
                model: params.model as 'gemini-pro' | 'gemini-pro-vision',
                maxTokens: params.max_tokens as number,
                temperature: params.temperature as number,
            });

        default:
            throw new Error(`Unknown action: ${action}`);
    }
}
