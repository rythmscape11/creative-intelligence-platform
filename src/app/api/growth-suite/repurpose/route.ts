import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

const REPURPOSE_PROMPT = `You are a social media content expert. Transform the following content for {{platform}}.

Platform requirements:
{{requirements}}

Source content:
{{content}}

Generate ONLY the repurposed content, optimized for {{platform}}. Include relevant hashtags and emojis where appropriate. Keep within character limits.`;

const PLATFORM_REQUIREMENTS: Record<string, { name: string; requirements: string; maxLength: number }> = {
    twitter: {
        name: 'Twitter/X',
        requirements: 'Max 280 characters. Use 1-3 hashtags. Be punchy and engaging. Can include thread suggestion.',
        maxLength: 280,
    },
    linkedin: {
        name: 'LinkedIn',
        requirements: 'Professional tone. Max 3000 characters. Use 3-5 hashtags. Include call-to-action. Good for thought leadership.',
        maxLength: 3000,
    },
    instagram: {
        name: 'Instagram',
        requirements: 'Conversational, visual focus. Max 2200 characters. Use 5-10 relevant hashtags at end. Use emojis.',
        maxLength: 2200,
    },
    facebook: {
        name: 'Facebook',
        requirements: 'Friendly, engaging tone. Max 500 characters ideal. Use 1-2 hashtags. Encourage engagement.',
        maxLength: 500,
    },
    youtube: {
        name: 'YouTube Description',
        requirements: 'Include key points, timestamps placeholder. Max 5000 characters. Include subscribe CTA.',
        maxLength: 5000,
    },
    tiktok: {
        name: 'TikTok',
        requirements: 'Very short and catchy. Max 150 characters. Use trending hashtags style. Hook first.',
        maxLength: 150,
    },
};

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, platforms } = await request.json();

        if (!content || !platforms || platforms.length === 0) {
            return NextResponse.json(
                { error: 'Content and platforms are required' },
                { status: 400 }
            );
        }

        // Check for Gemini API key
        if (!GEMINI_API_KEY) {
            // Return template-based fallback
            return NextResponse.json({
                results: generateTemplateBased(content, platforms),
                source: 'template',
            });
        }

        // Generate AI-powered repurposed content for each platform
        const results: Record<string, string> = {};

        for (const platform of platforms) {
            const config = PLATFORM_REQUIREMENTS[platform];
            if (!config) continue;

            const prompt = REPURPOSE_PROMPT
                .replace(/{{platform}}/g, config.name)
                .replace('{{requirements}}', config.requirements)
                .replace('{{content}}', content.substring(0, 2000)); // Limit input

            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: 'user', parts: [{ text: prompt }] }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 500,
                            },
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        // Trim to platform limit
                        results[platform] = text.substring(0, config.maxLength);
                    }
                }
            } catch (aiError) {
                console.error(`[Repurposer] Error for ${platform}:`, aiError);
            }
        }

        // Fill any missing with template-based
        const templateResults = generateTemplateBased(content, platforms);
        for (const platform of platforms) {
            if (!results[platform]) {
                results[platform] = templateResults[platform];
            }
        }

        return NextResponse.json({
            results,
            source: 'ai',
        });
    } catch (error) {
        console.error('[Repurposer API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to repurpose content' },
            { status: 500 }
        );
    }
}

function generateTemplateBased(content: string, platforms: string[]): Record<string, string> {
    const results: Record<string, string> = {};
    const firstSentence = content.split(/[.!?]/)[0] + '.';
    const keyPoints = content.split(/[.!?]/).filter(s => s.trim().length > 20).slice(0, 3);

    for (const platform of platforms) {
        const config = PLATFORM_REQUIREMENTS[platform];
        if (!config) continue;

        switch (platform) {
            case 'twitter':
                results[platform] = `${firstSentence.substring(0, 200)}\n\n#marketing #content #strategy`;
                break;
            case 'linkedin':
                results[platform] = `🎯 ${firstSentence}\n\n${keyPoints.join('\n\n')}\n\nWhat are your thoughts on this? Let me know in the comments! 👇\n\n#Marketing #Strategy #Business`;
                break;
            case 'instagram':
                results[platform] = `✨ ${firstSentence}\n\n${keyPoints.slice(0, 2).join('\n\n')}\n\nDouble tap if you agree! 💡\n\n#marketing #digitalmarketing #business #strategy #growth #success #entrepreneur`;
                break;
            case 'facebook':
                results[platform] = `${firstSentence}\n\n${keyPoints[0] || ''}\n\nShare your thoughts below! 💬`;
                break;
            case 'youtube':
                results[platform] = `📺 ${firstSentence}\n\nIn this video:\n00:00 - Introduction\n01:00 - Main Points\n05:00 - Key Takeaways\n\n${keyPoints.join('\n')}\n\n👍 Like & Subscribe for more content!`;
                break;
            case 'tiktok':
                results[platform] = `${firstSentence.substring(0, 100)} 🔥 #fyp #marketing`;
                break;
        }

        // Trim to max length
        if (results[platform]) {
            results[platform] = results[platform].substring(0, config.maxLength);
        }
    }

    return results;
}
