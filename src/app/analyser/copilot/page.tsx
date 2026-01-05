'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Bot,
    Send,
    Sparkles,
    User,
    Search,
    TrendingUp,
    Link2,
    Loader2,
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: "👋 Hi! I'm your SEO Intelligence Copilot. I can help you analyze domains, research keywords, find content opportunities, and understand your competitive landscape.\n\nTry asking me:\n• \"What keywords should I target for my SaaS website?\"\n• \"Analyze backlink profile of competitor.com\"\n• \"Find content gaps between us and our top competitors\"",
        timestamp: new Date(),
    },
];

const SAMPLE_RESPONSES: Record<string, string> = {
    'keywords': "Based on my analysis of your domain and competitors, here are the top keyword opportunities:\n\n**High-Impact Keywords:**\n1. **marketing automation software** (Vol: 8,400 | KD: 65)\n   - Competitors rank #3-5, you're not ranking\n   - Estimated traffic potential: 2,100/mo\n\n2. **best crm for small business** (Vol: 12,500 | KD: 58)\n   - Low difficulty, high commercial intent\n   - Suggested content: Comparison guide\n\n3. **lead generation tools** (Vol: 6,200 | KD: 52)\n   - You rank #32, competitor #4\n   - Quick win potential with content optimization\n\n📊 **Total opportunity:** ~15,000 monthly visits\n\nWant me to create content briefs for any of these?",
    'backlink': "I've analyzed the backlink profile. Here's what I found:\n\n**Profile Summary:**\n- Total Backlinks: 12,400\n- Referring Domains: 890\n- Domain Authority: 72\n\n**Strengths:**\n✅ Strong editorial links from Forbes, TechCrunch\n✅ Good anchor text diversity\n✅ 78% dofollow ratio\n\n**Areas for Improvement:**\n⚠️ Low links from .edu/.gov domains\n⚠️ Competitors have 3x more referring domains\n\n**Recommended Actions:**\n1. Target guest posts on industry publications\n2. Create linkable assets (original research, tools)\n3. Pursue broken link opportunities on competitor domains\n\nShall I find specific link-building prospects?",
    'content gap': "I've compared your content against your top 3 competitors. Here are the gaps:\n\n**Topics Competitors Cover That You Don't:**\n\n1. **Email Marketing Automation** (45 competitor pages)\n   - Potential traffic: 12,500/mo\n   - Content type: Ultimate guide + tool comparison\n\n2. **Sales Pipeline Management** (32 competitor pages)\n   - Potential traffic: 8,200/mo\n   - Content type: How-to guides + templates\n\n3. **Customer Journey Mapping** (28 competitor pages)\n   - Potential traffic: 5,600/mo\n   - Content type: Visual guides + case studies\n\n**Quick Wins (Low effort, high impact):**\n- Add FAQ sections to existing pages\n- Create comparison vs specific competitors\n- Build topic clusters around \"marketing automation\"\n\nWant me to prioritize these and create a content calendar?",
    'competitor': "Analyzing competitive landscape...\n\n**Your Position:**\n- You're #4 in organic traffic among tracked competitors\n- Growing faster than 2 of 4 competitors (+12% MoM)\n\n**Top Competitor Insights:**\n\n1. **competitor4.com** (Market Leader)\n   - 2x your traffic\n   - Strength: Strong brand keywords, many backlinks\n   - Weakness: Slow content production\n\n2. **competitor1.com** (Fast Grower)\n   - Similar traffic level\n   - Strength: Aggressive content marketing\n   - Weakness: Lower domain authority\n\n**Opportunities to Outrank:**\n1. Target long-tail keywords they're ignoring\n2. Build topical authority in \"marketing automation\"\n3. Improve page speed (theirs is slower)\n\nWould you like a detailed analysis of any specific competitor?",
};

export default function AnalyserCopilotPage() {
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
            // Try real API first
            const response = await fetch('/api/analyser/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: currentInput }),
            });

            if (response.ok) {
                const data = await response.json();
                const assistantMessage: Message = {
                    id: data.message?.id || (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.message?.content || 'I understand. Let me help you with that.',
                    timestamp: new Date(data.message?.timestamp || Date.now()),
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error('API failed');
            }
        } catch (error) {
            // Fallback to sample responses
            let response = "I'm analyzing your request... Based on the data, I can help you with SEO analysis, keyword research, backlink audits, and competitive intelligence. Could you be more specific about what you'd like to know?";
            const lowerInput = currentInput.toLowerCase();

            for (const [key, value] of Object.entries(SAMPLE_RESPONSES)) {
                if (lowerInput.includes(key)) {
                    response = value;
                    break;
                }
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Bot className="h-8 w-8 text-emerald-500" />
                    SEO Copilot
                </h1>
                <p className="text-muted-foreground mt-1">
                    Your AI-powered SEO intelligence assistant
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
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-muted'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                <div className="text-xs text-white/60 dark:text-muted-foreground mt-2">
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
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
                            placeholder="Ask about SEO, keywords, competitors..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setInput('What keywords should I target?')}
                        >
                            <Search className="h-3 w-3 mr-1" />
                            Keyword Ideas
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setInput('Analyze backlink profile')}
                        >
                            <Link2 className="h-3 w-3 mr-1" />
                            Backlink Analysis
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setInput('Find content gaps vs competitors')}
                        >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Content Gaps
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
