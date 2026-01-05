'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface Insight {
    type: 'opportunity' | 'risk' | 'warning';
    title: string;
    description: string;
}

export default function InsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [source, setSource] = useState<'ai' | 'default'>('default');

    const fetchInsights = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const res = await fetch('/api/strategiser/insights');
            if (res.ok) {
                const data = await res.json();
                setInsights(data.insights || []);
                setSource(data.source || 'default');
            }
        } catch (error) {
            console.error('Failed to fetch insights:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />;
            case 'risk': return <AlertTriangle className="h-5 w-5 text-amber-600" />;
            case 'warning': return <TrendingDown className="h-5 w-5 text-red-600" />;
            default: return <Lightbulb className="h-5 w-5 text-blue-600" />;
        }
    };

    const getBackground = (type: string) => {
        switch (type) {
            case 'opportunity': return 'bg-green-100 dark:bg-green-900/50';
            case 'risk': return 'bg-amber-100 dark:bg-amber-900/50';
            case 'warning': return 'bg-red-100 dark:bg-red-900/50';
            default: return 'bg-blue-100 dark:bg-blue-900/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-violet-600" />
                        Strategic Insights
                    </h1>
                    <p className="text-muted-foreground">
                        {source === 'ai' ? 'AI-generated insights based on your strategies' : 'Marketing insights and recommendations'}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => fetchInsights(true)}
                    disabled={refreshing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
            ) : (
                <div className="space-y-4">
                    {insights.map((insight, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getBackground(insight.type)}`}>
                                        {getIcon(insight.type)}
                                    </div>
                                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{insight.description}</p>
                            </CardContent>
                        </Card>
                    ))}

                    {insights.length === 0 && (
                        <Card className="p-8 text-center">
                            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No insights available. Create some strategies to get personalized insights.</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

