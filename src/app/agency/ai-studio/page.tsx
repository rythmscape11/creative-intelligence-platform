/**
 * AI Studio Page - Enhanced
 * Hub for AI-powered features
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistant } from '@/components/agency/AIAssistant';
import {
    Sparkles,
    MessageSquare,
    FileText,
    Zap,
    TrendingUp,
    Brain,
    Palette,
    BarChart3,
} from 'lucide-react';

const AI_FEATURES = [
    {
        id: 'content',
        icon: <FileText className="h-5 w-5" />,
        title: 'Content Generator',
        description: 'Generate blog posts, social copy, and ad creatives',
        status: 'available',
    },
    {
        id: 'insights',
        icon: <TrendingUp className="h-5 w-5" />,
        title: 'Smart Insights',
        description: 'AI-powered project analytics and predictions',
        status: 'available',
    },
    {
        id: 'strategy',
        icon: <Brain className="h-5 w-5" />,
        title: 'Strategy Advisor',
        description: 'Get strategic recommendations for campaigns',
        status: 'available',
    },
    {
        id: 'creative',
        icon: <Palette className="h-5 w-5" />,
        title: 'Creative Brief',
        description: 'Auto-generate creative briefs from inputs',
        status: 'coming',
    },
];

export default function AIStudioPage() {
    const [selectedFeature, setSelectedFeature] = useState('assistant');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-amber-500" />
                        AI Studio
                    </h1>
                    <p className="text-muted-foreground">
                        AI-powered tools to supercharge your workflow
                    </p>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Powered by OpenAI
                </Badge>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="assistant" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="assistant" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Assistant
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="gap-2">
                        <Zap className="h-4 w-4" />
                        AI Tools
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Usage
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assistant" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <AIAssistant />
                        </div>
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Smart Suggestions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <div className="font-medium text-sm mb-1">3 Tasks at Risk</div>
                                        <p className="text-xs text-muted-foreground">
                                            May miss deadline at current velocity
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="font-medium text-sm mb-1">Workload Imbalance</div>
                                        <p className="text-xs text-muted-foreground">
                                            Consider redistributing 2 tasks
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="font-medium text-sm mb-1">Meeting Time</div>
                                        <p className="text-xs text-muted-foreground">
                                            Tuesday 2 PM works for all
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tools" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {AI_FEATURES.map((feature) => (
                            <Card
                                key={feature.id}
                                className={`cursor-pointer transition-all hover:border-amber-500/50 ${feature.status === 'coming' ? 'opacity-60' : ''
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4 text-amber-600">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {feature.description}
                                    </p>
                                    {feature.status === 'coming' ? (
                                        <Badge variant="secondary">Coming Soon</Badge>
                                    ) : (
                                        <Button size="sm" className="w-full">
                                            Launch
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-2xl font-bold">1,247</div>
                                <div className="text-sm text-muted-foreground">Total Queries</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-2xl font-bold text-green-600">89%</div>
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-2xl font-bold">~42h</div>
                                <div className="text-sm text-muted-foreground">Time Saved</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="text-2xl font-bold">156</div>
                                <div className="text-sm text-muted-foreground">Tasks Created</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { action: 'Created task via AI', time: '2 min ago' },
                                    { action: 'Generated content brief', time: '15 min ago' },
                                    { action: 'Analyzed project risks', time: '1 hour ago' },
                                    { action: 'Scheduled team meeting', time: '2 hours ago' },
                                    { action: 'Summarized project status', time: '3 hours ago' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <span className="text-sm">{item.action}</span>
                                        <span className="text-xs text-muted-foreground">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
