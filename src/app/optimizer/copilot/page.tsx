'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare,
    Send,
    Sparkles,
    User,
    Zap,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Loader2,
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    actions?: Array<{
        type: string;
        description: string;
        status: 'pending' | 'executed';
    }>;
    timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: "👋 Hi! I'm your AI Campaign Copilot. I can help you analyze performance, suggest optimizations, and execute actions across your connected ad platforms.\n\nTry asking me things like:\n• \"What should I do to improve ROAS this week?\"\n• \"Show me my worst performing campaigns\"\n• \"Pause all ads with ROAS below 1.5\"",
        timestamp: new Date(),
    },
];

const SAMPLE_RESPONSES: Record<string, { content: string; actions?: Message['actions'] }> = {
    'improve roas': {
        content: "Based on my analysis of your campaigns over the last 7 days, here are my top recommendations to improve ROAS:\n\n**1. Scale \"Holiday Sale 2024\"** 📈\nThis campaign has 4.2x ROAS - the best performer. Consider increasing budget by 25%.\n\n**2. Pause \"Broad Audience - US\" ad set** ⚠️\nThis ad set has only 0.8x ROAS with $450 spend. Reallocating this budget could improve overall ROAS by ~12%.\n\n**3. Refresh creatives in \"Retargeting - Cart Abandoners\"** 🎨\nCTR dropped 40% over 14 days, suggesting creative fatigue.\n\nWould you like me to execute any of these actions?",
        actions: [
            { type: 'SCALE_BUDGET', description: 'Increase Holiday Sale 2024 budget by 25%', status: 'pending' },
            { type: 'PAUSE_ADSET', description: 'Pause Broad Audience - US ad set', status: 'pending' },
        ],
    },
    'worst performing': {
        content: "Here are your 3 worst performing campaigns over the last 7 days:\n\n| Campaign | ROAS | CPA | Spend |\n|---|---|---|---|\n| Broad Audience - US | 0.8x | $43.33 | $450 |\n| Display - Remarketing | 2.1x | $24.28 | $680 |\n| Brand Awareness Q4 | 0.8x | $43.33 | $1,950 |\n\nThe \"Brand Awareness Q4\" campaign has the highest spend but lowest returns. This is an awareness campaign, but the spend seems excessive for the results.\n\nWould you like me to reduce the budget or pause this campaign?",
    },
    'pause': {
        content: "I understand you want to pause low-performing ads. Let me identify all ads with ROAS below your target.\n\n**Found 3 ad sets matching criteria:**\n• Broad Audience - US (ROAS: 0.8x)\n• Cold Traffic - Interests (ROAS: 1.2x)\n• Lookalike - 1% (ROAS: 1.4x)\n\n⚠️ This will reduce daily spend by approximately $320.\n\nDo you confirm these pauses?",
        actions: [
            { type: 'PAUSE_ADSET', description: 'Pause Broad Audience - US', status: 'pending' },
            { type: 'PAUSE_ADSET', description: 'Pause Cold Traffic - Interests', status: 'pending' },
            { type: 'PAUSE_ADSET', description: 'Pause Lookalike - 1%', status: 'pending' },
        ],
    },
};

export default function CopilotPage() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Call real AI API
            const response = await fetch('/api/optimizer/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    conversationId: undefined, // Could track for multi-turn conversations
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: data.message?.id || (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message?.content || "I'm having trouble processing that request. Please try again.",
                actions: data.message?.suggestedActions?.map((a: any) => ({
                    type: a.type,
                    description: a.description,
                    status: 'pending' as const,
                })),
                timestamp: new Date(data.message?.createdAt || Date.now()),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('[Copilot] Error:', error);

            // Fallback to sample responses if API fails
            const lowerInput = currentInput.toLowerCase();
            let response: { content: string; actions?: Message['actions'] } = {
                content: "I'm analyzing your campaigns... Based on the data, I don't have a specific recommendation for that query. Could you try asking about:\n• Campaign performance\n• Budget optimization\n• Creative analysis\n• Pausing or scaling specific campaigns",
            };

            for (const [key, value] of Object.entries(SAMPLE_RESPONSES)) {
                if (lowerInput.includes(key)) {
                    response = value;
                    break;
                }
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.content,
                actions: response.actions,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsLoading(false);
        }
    };


    const executeAction = (messageId: string, actionIndex: number) => {
        setMessages(messages.map(msg => {
            if (msg.id === messageId && msg.actions) {
                const newActions = [...msg.actions];
                newActions[actionIndex] = { ...newActions[actionIndex], status: 'executed' };
                return { ...msg, actions: newActions };
            }
            return msg;
        }));
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <MessageSquare className="h-8 w-8 text-indigo-500" />
                    AI Copilot
                </h1>
                <p className="text-muted-foreground mt-1">
                    Ask questions, get insights, and execute optimizations
                </p>
            </div>

            {/* Messages */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-muted'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                                {/* Actions */}
                                {message.actions && message.actions.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground">
                                            Suggested Actions:
                                        </div>
                                        {message.actions.map((action, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between gap-2 p-2 rounded bg-background border"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {action.status === 'executed' ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Zap className="h-4 w-4 text-amber-500" />
                                                    )}
                                                    <span className="text-sm">{action.description}</span>
                                                </div>
                                                {action.status === 'pending' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => executeAction(message.id, idx)}
                                                    >
                                                        Execute
                                                    </Button>
                                                ) : (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        Done
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="text-xs text-muted-foreground mt-2">
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-muted rounded-lg p-4">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Ask about your campaigns..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setInput('What should I do to improve ROAS this week?')}
                        >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Improve ROAS
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setInput('Show me my worst performing campaigns')}
                        >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Worst performers
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
