import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

const SYSTEM_PROMPT = `You are a world-class marketing strategy consultant with 20+ years of experience at top agencies like McKinsey, WPP, and Google. You help marketing professionals with:

1. **Strategy Development**: Creating comprehensive marketing strategies
2. **Competitive Analysis**: Analyzing competitors and market positioning
3. **Channel Optimization**: Recommending the right marketing channels
4. **Budget Allocation**: Helping allocate budgets effectively
5. **Campaign Planning**: Planning and optimizing campaigns
6. **Performance Analysis**: Interpreting marketing metrics and KPIs

Be practical, specific, and actionable in your advice. Use frameworks like:
- SOSTAC (Situation, Objectives, Strategy, Tactics, Action, Control)
- RACE (Reach, Act, Convert, Engage)
- Porter's Five Forces
- SWOT Analysis

Keep responses concise but insightful. Ask clarifying questions when needed.`;

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check for API key
        if (!GEMINI_API_KEY) {
            console.error('[Copilot API] GOOGLE_AI_API_KEY not configured');
            return NextResponse.json(
                { error: 'AI service not configured. Please contact support.' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { messages } = body as { messages: ChatMessage[] };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages are required' },
                { status: 400 }
            );
        }

        // Format messages for Gemini API
        const formattedContents = messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Add system context as first user message if not already present
        const contents = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }],
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I'm ready to help with marketing strategy questions. What would you like to discuss?" }],
            },
            ...formattedContents,
        ];

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                        topP: 0.95,
                        topK: 40,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[Copilot API] Gemini error:', errorData);
            return NextResponse.json(
                { error: 'Failed to generate response' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!assistantMessage) {
            return NextResponse.json(
                { error: 'No response generated' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: assistantMessage,
            usage: {
                promptTokens: data.usageMetadata?.promptTokenCount || 0,
                completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
            },
        });
    } catch (error) {
        console.error('[Copilot API] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
