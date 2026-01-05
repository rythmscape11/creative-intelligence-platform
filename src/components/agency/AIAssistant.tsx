/**
 * AI Project Assistant
 * Natural language interface for Agency OS
 * 
 * Features:
 * - Natural language task creation
 * - Smart scheduling suggestions
 * - Project health analysis
 * - Risk prediction
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sparkles,
    Send,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    Calendar,
    Target,
    BarChart3,
    User,
    Bot,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    actions?: { label: string; action: () => void }[];
    timestamp: Date;
}

interface Suggestion {
    type: 'task' | 'schedule' | 'risk' | 'insight';
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: () => void;
}

const QUICK_PROMPTS = [
    "Create a task for website redesign",
    "What's overdue this week?",
    "Show me team workload",
    "Schedule a campaign review",
    "Summarize project status",
];

const DEMO_SUGGESTIONS: Suggestion[] = [
    {
        type: 'risk',
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        title: '3 Tasks at Risk',
        description: 'Q1 Campaign tasks may miss deadline based on current velocity',
    },
    {
        type: 'insight',
        icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
        title: 'Workload Imbalance',
        description: 'Sarah is at 120% capacity. Consider redistributing 2 tasks.',
    },
    {
        type: 'schedule',
        icon: <Calendar className="h-5 w-5 text-green-500" />,
        title: 'Optimal Meeting Time',
        description: 'Tuesday 2 PM works best for all stakeholders',
    },
];

export function AIAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your AI project assistant. I can help you create tasks, analyze project health, and provide smart suggestions. What would you like to do?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processMessage = async (userMessage: string) => {
        // Add user message
        const userMsg: Message = {
            id: `msg_${Date.now()}`,
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate response based on input
        let response = '';
        let actions: { label: string; action: () => void }[] | undefined;

        const lowerInput = userMessage.toLowerCase();

        if (lowerInput.includes('create') && lowerInput.includes('task')) {
            response = `I'll create a new task for you:\n\n**Website Redesign - Homepage**\n- Priority: High\n- Due: Next Friday\n- Assignee: Suggested based on workload\n\nWould you like me to create this task?`;
            actions = [
                { label: 'Create Task', action: () => toast.success('Task created!') },
                { label: 'Modify', action: () => setInput('Modify the task to...') },
            ];
        } else if (lowerInput.includes('overdue') || lowerInput.includes('risk')) {
            response = `📊 **Risk Analysis**\n\nI found **3 tasks** at risk of missing their deadlines:\n\n1. **Social Media Campaign** - 2 days overdue\n2. **Client Presentation** - Due tomorrow, 60% complete\n3. **Design Review** - Blocked by missing assets\n\nWould you like me to help prioritize these?`;
            actions = [
                { label: 'View Details', action: () => toast.success('Opening tasks...') },
                { label: 'Reassign', action: () => toast.success('Opening reassignment...') },
            ];
        } else if (lowerInput.includes('workload') || lowerInput.includes('team')) {
            response = `👥 **Team Workload Summary**\n\n- **Alex**: 85% capacity (6 tasks)\n- **Sarah**: 120% capacity ⚠️ (8 tasks) \n- **Mike**: 60% capacity (4 tasks)\n- **Emma**: 75% capacity (5 tasks)\n\n**Recommendation**: Move 2 tasks from Sarah to Mike.`;
            actions = [
                { label: 'Rebalance', action: () => toast.success('Rebalancing workload...') },
                { label: 'View Details', action: () => toast.success('Opening workload view...') },
            ];
        } else if (lowerInput.includes('schedule') || lowerInput.includes('meeting')) {
            response = `📅 **Smart Scheduling**\n\nBased on everyone's calendars, here are the best times:\n\n1. **Tuesday 2:00 PM** - All available\n2. **Wednesday 10:00 AM** - 4/5 available\n3. **Thursday 3:00 PM** - All available\n\nShall I schedule a meeting?`;
            actions = [
                { label: 'Schedule for Tuesday', action: () => toast.success('Meeting scheduled!') },
                { label: 'More Options', action: () => setInput('Show me more time slots') },
            ];
        } else if (lowerInput.includes('status') || lowerInput.includes('summary')) {
            response = `📈 **Project Status Summary**\n\n**Active Projects**: 12\n**Tasks This Week**: 47 total\n- ✅ Completed: 23\n- 🔄 In Progress: 18\n- ⏳ Pending: 6\n\n**Overall Health**: Good 🟢\n\nBurn rate is on track for sprint completion.`;
        } else {
            response = `I'd be happy to help with that! Here are some things I can do:\n\n• Create tasks from natural language\n• Analyze project risks and bottlenecks\n• Show team workload and suggest rebalancing\n• Find optimal meeting times\n• Summarize project status\n\nTry asking something specific!`;
        }

        const assistantMsg: Message = {
            id: `msg_${Date.now() + 1}`,
            role: 'assistant',
            content: response,
            actions,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        processMessage(input.trim());
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        AI Assistant
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Powered by AI
                    </Badge>
                </div>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-muted'
                                }`}
                        >
                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            {message.actions && (
                                <div className="flex gap-2 mt-3">
                                    {message.actions.map((action, i) => (
                                        <Button
                                            key={i}
                                            size="sm"
                                            variant={i === 0 ? 'default' : 'outline'}
                                            onClick={action.action}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                        key={i}
                        onClick={() => processMessage(prompt)}
                        className="whitespace-nowrap text-xs px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default AIAssistant;
