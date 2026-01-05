'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    MousePointer,
    Target,
    Zap,
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowRight,
    Sparkles,
    RefreshCw,
    Plus,
    Link2,
} from 'lucide-react';

// Types for dashboard data
interface DashboardStats {
    totalSpend: number;
    totalRevenue: number;
    roas: number;
    cpa: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    spendChange: number;
    roasChange: number;
}

interface Suggestion {
    id: string;
    type: string;
    category: string;
    title: string;
    description: string;
    priority: number;
    impactValue: number;
    confidence: number;
    campaignName?: string;
}

interface Connection {
    id: string;
    platform: string;
    accountName: string;
    status: string;
}

const PLATFORM_COLORS: Record<string, string> = {
    META: 'bg-blue-500',
    GOOGLE_ADS: 'bg-red-500',
    YOUTUBE: 'bg-red-600',
    LINKEDIN: 'bg-blue-700',
    TIKTOK: 'bg-zinc-900',
};

const CATEGORY_COLORS: Record<string, string> = {
    BUDGET: 'bg-green-500',
    PERFORMANCE: 'bg-amber-500',
    CREATIVE: 'bg-purple-500',
    AUDIENCE: 'bg-cyan-500',
};

const AVAILABLE_PLATFORMS = [
    { id: 'meta', name: 'Meta Ads', description: 'Facebook & Instagram advertising', icon: '📘' },
    { id: 'google', name: 'Google Ads', description: 'Search, Display & YouTube', icon: '🔍' },
    { id: 'linkedin', name: 'LinkedIn Ads', description: 'B2B advertising platform', icon: '💼' },
    { id: 'tiktok', name: 'TikTok Ads', description: 'Short-form video advertising', icon: '🎵' },
];

export default function OptimizerDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Try to fetch real connections from API
            const res = await fetch('/api/optimizer/connections');
            if (res.ok) {
                const data = await res.json();
                if (data.connections && data.connections.length > 0) {
                    setConnections(data.connections);
                    // If we have connections, fetch real stats
                    const statsRes = await fetch('/api/optimizer/stats');
                    if (statsRes.ok) {
                        const statsData = await statsRes.json();
                        setStats(statsData.stats);
                        setSuggestions(statsData.suggestions || []);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch optimizer data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleRefresh = () => {
        fetchData();
        setLastRefresh(new Date());
    };

    const handleDismiss = (id: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    const handleApply = (suggestion: Suggestion) => {
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        alert(`Applied: ${suggestion.title}`);
    };

    // Show onboarding state when no connections exist
    if (!loading && connections.length === 0) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Sparkles className="h-8 w-8 text-indigo-500" />
                            The Optimiser
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            AI-powered campaign optimization
                        </p>
                    </div>
                </div>

                {/* Connect Platforms CTA */}
                <Card className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <Link2 className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Connect Your Ad Platforms</h2>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            Link your advertising accounts to unlock AI-powered optimization, cross-channel analytics, and automated recommendations.
                        </p>
                        <Link href="/optimizer/connections">
                            <Button size="lg" className="gap-2">
                                <Plus className="h-5 w-5" />
                                Connect First Platform
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Available Platforms */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Supported Platforms</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {AVAILABLE_PLATFORMS.map((platform) => (
                            <Card key={platform.id} className="hover:border-indigo-300 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{platform.icon}</span>
                                        <div>
                                            <p className="font-medium">{platform.name}</p>
                                            <p className="text-xs text-muted-foreground">{platform.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* What You'll Get */}
                <Card>
                    <CardHeader>
                        <CardTitle>What You'll Get</CardTitle>
                        <CardDescription>Once connected, The Optimiser will automatically:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Real-Time Analytics</p>
                                    <p className="text-sm text-muted-foreground">Cross-channel performance in one dashboard</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                    <Zap className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-medium">AI Recommendations</p>
                                    <p className="text-sm text-muted-foreground">Smart suggestions to improve ROAS</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Target className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Automated Rules</p>
                                    <p className="text-sm text-muted-foreground">Scale winners, pause losers automatically</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Sparkles className="h-8 w-8 text-indigo-500" />
                            Command Center
                        </h1>
                        <p className="text-muted-foreground mt-1">Loading...</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-muted rounded w-3/4"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Connected state with real data - only show if we have stats
    // Add null check for stats
    if (!stats) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No campaign data available. Please connect an ad platform.</p>
                    <Link href="/optimizer/connections">
                        <Button className="mt-4">Connect Platform</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-indigo-500" />
                        Command Center
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Cross-channel performance overview • Last 7 days
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        Last refresh: {lastRefresh.toLocaleTimeString()}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Link href="/optimizer/connections">
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Connect Platform
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Connected Platforms */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Connected:</span>
                {connections.map((conn) => (
                    <Badge
                        key={conn.id}
                        variant="secondary"
                        className="gap-1"
                    >
                        <span className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[conn.platform]}`} />
                        {conn.platform.replace('_', ' ')} • {conn.accountName}
                    </Badge>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalSpend)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className={`flex items-center mt-2 text-sm ${stats.spendChange > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {stats.spendChange > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {Math.abs(stats.spendChange)}% vs last week
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            18.2% vs last week
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200 dark:border-indigo-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">ROAS</p>
                                <p className="text-2xl font-bold">{stats.roas.toFixed(1)}x</p>
                            </div>
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                <Target className="h-5 w-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {stats.roasChange}% vs last week
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">CPA</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.cpa)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                                <MousePointer className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-green-600">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            5.2% vs last week
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Impressions</p>
                            <p className="font-semibold">{formatNumber(stats.impressions)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <MousePointer className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Clicks</p>
                            <p className="font-semibold">{formatNumber(stats.clicks)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Conversions</p>
                            <p className="font-semibold">{formatNumber(stats.conversions)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">CTR</p>
                            <p className="font-semibold">{stats.ctr.toFixed(2)}%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Action Inbox */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            Action Inbox
                            <Badge variant="secondary" className="ml-2">
                                {suggestions.length} pending
                            </Badge>
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/optimizer/campaigns'}>
                            View All <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        AI-generated optimization suggestions ranked by impact
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={suggestion.id}
                                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={`${CATEGORY_COLORS[suggestion.category]} text-white text-xs`}>
                                            {suggestion.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {(suggestion.confidence * 100).toFixed(0)}% confidence
                                        </span>
                                    </div>
                                    <h4 className="font-medium">{suggestion.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                                    {suggestion.campaignName && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Campaign: {suggestion.campaignName}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-sm font-medium text-green-600">
                                        +{(suggestion.impactValue * 100).toFixed(0)}% impact
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleDismiss(suggestion.id)}>
                                            Dismiss
                                        </Button>
                                        <Button size="sm" onClick={() => handleApply(suggestion)}>
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
