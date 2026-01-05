'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, AlertCircle } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function CopilotPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Strategy Copilot. I can help you with marketing strategy questions, competitive analysis, channel optimization, and strategic planning. What would you like to discuss?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setError(null);

        // Add user message immediately
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('/api/strategiser/copilot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages.slice(1), // Skip initial greeting
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (err) {
            console.error('Copilot error:', err);
            setError(err instanceof Error ? err.message : 'Failed to get response. Please try again.');
            // Add a fallback message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-violet-600" />
                    AI Strategy Copilot
                </h1>
                <p className="text-muted-foreground">Get strategic advice powered by AI</p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-violet-600" />
                                </div>
                            )}
                            <div className={`max-w-[70%] rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-violet-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800'
                                }`}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-violet-600" />
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {error && (
                    <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </p>
                    </div>
                )}

                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask about marketing strategy, competitor analysis, channel optimization..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            className="bg-violet-600 hover:bg-violet-700"
                            disabled={isLoading || !input.trim()}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Powered by AI • Ask about strategy frameworks, competitive analysis, channel mix, and more
                    </p>
                </div>
            </Card>
        </div>
    );
}

