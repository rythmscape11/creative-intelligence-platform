import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

const INSIGHTS_PROMPT = `You are a marketing analytics AI. Based on the user's strategy data, generate 4 actionable marketing insights.

For each insight, provide:
1. type: "opportunity", "risk", or "warning"
2. title: Short title (max 6 words)
3. description: One sentence explanation with specific recommendation

Format your response as a JSON array:
[{"type": "opportunity", "title": "...", "description": "..."}]

User has:
- {{strategyCount}} marketing strategies
- {{recentStrategies}} strategies created this month
- Industry focus areas: general marketing

Generate insights that are specific, actionable, and relevant to a digital marketing professional.`;

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user's strategy data
        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({
                insights: getDefaultInsights(),
            });
        }

        const strategyCount = await prisma.marketingStrategy.count({
            where: { userId: user.id },
        });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const recentStrategies = await prisma.marketingStrategy.count({
            where: {
                userId: user.id,
                createdAt: { gte: startOfMonth },
            },
        });

        // If no Gemini API key, return default insights
        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                insights: getDefaultInsights(),
                source: 'default',
            });
        }

        // Generate AI insights
        const prompt = INSIGHTS_PROMPT
            .replace('{{strategyCount}}', String(strategyCount))
            .replace('{{recentStrategies}}', String(recentStrategies));

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
                            maxOutputTokens: 1024,
                        },
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                // Extract JSON from response
                const jsonMatch = text?.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const insights = JSON.parse(jsonMatch[0]);
                    return NextResponse.json({
                        insights,
                        source: 'ai',
                    });
                }
            }
        } catch (aiError) {
            console.error('[Insights API] AI error:', aiError);
        }

        // Fallback to default insights
        return NextResponse.json({
            insights: getDefaultInsights(),
            source: 'default',
        });
    } catch (error) {
        console.error('[Insights API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate insights' },
            { status: 500 }
        );
    }
}

function getDefaultInsights() {
    return [
        {
            type: 'opportunity',
            title: 'Video Content Gap',
            description: 'Your competitors invest 30% more in video marketing. Consider increasing video production for better engagement.'
        },
        {
            type: 'risk',
            title: 'Seasonal Trend Alert',
            description: 'Q1 typically sees 20% lower engagement. Plan campaigns accordingly to maintain momentum.'
        },
        {
            type: 'opportunity',
            title: 'LinkedIn B2B Opportunity',
            description: 'LinkedIn Ads showing 40% better B2B ROI this quarter. Consider increasing investment.'
        },
        {
            type: 'warning',
            title: 'Budget Efficiency',
            description: 'Current ad spend efficiency may be below industry benchmark. Review targeting and creative performance.'
        },
    ];
}
