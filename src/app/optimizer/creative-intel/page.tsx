'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Palette,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Eye,
    Image,
    Video,
    LayoutGrid,
    Sparkles,
    RefreshCw,
} from 'lucide-react';

interface Creative {
    id: string;
    name: string;
    format: string;
    campaign: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
    ctr: number;
    performanceScore: number;
    fatigueScore: number;
    thumbnail?: string;
}

const DEMO_CREATIVES: Creative[] = [
    {
        id: '1',
        name: 'Holiday Video - Gift Guide',
        format: 'VIDEO',
        campaign: 'Holiday Sale 2024',
        spend: 1250,
        impressions: 180000,
        clicks: 5400,
        conversions: 145,
        roas: 4.8,
        ctr: 3.0,
        performanceScore: 92,
        fatigueScore: 25,
    },
    {
        id: '2',
        name: 'Product Carousel - Winter Collection',
        format: 'CAROUSEL',
        campaign: 'Holiday Sale 2024',
        spend: 850,
        impressions: 120000,
        clicks: 3600,
        conversions: 92,
        roas: 3.9,
        ctr: 3.0,
        performanceScore: 85,
        fatigueScore: 40,
    },
    {
        id: '3',
        name: 'Static - 20% Off Banner',
        format: 'IMAGE',
        campaign: 'Brand Awareness Q4',
        spend: 650,
        impressions: 95000,
        clicks: 1900,
        conversions: 28,
        roas: 1.5,
        ctr: 2.0,
        performanceScore: 58,
        fatigueScore: 72,
    },
    {
        id: '4',
        name: 'UGC Video - Customer Review',
        format: 'VIDEO',
        campaign: 'Retargeting - Cart Abandoners',
        spend: 420,
        impressions: 45000,
        clicks: 1350,
        conversions: 65,
        roas: 5.2,
        ctr: 3.0,
        performanceScore: 95,
        fatigueScore: 15,
    },
];

const FORMAT_ICONS: Record<string, any> = {
    VIDEO: Video,
    IMAGE: Image,
    CAROUSEL: LayoutGrid,
};

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
};

const getFatigueColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-green-500';
};

export default function CreativeIntelPage() {
    const [creatives, setCreatives] = useState<Creative[]>(DEMO_CREATIVES);
    const [sortBy, setSortBy] = useState<string>('performanceScore');

    const sortedCreatives = [...creatives].sort((a, b) => {
        if (sortBy === 'performanceScore') return b.performanceScore - a.performanceScore;
        if (sortBy === 'roas') return b.roas - a.roas;
        if (sortBy === 'fatigueScore') return b.fatigueScore - a.fatigueScore;
        return 0;
    });

    const avgPerformance = Math.round(creatives.reduce((sum, c) => sum + c.performanceScore, 0) / creatives.length);
    const fatigueAlerts = creatives.filter(c => c.fatigueScore >= 60).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Palette className="h-8 w-8 text-purple-500" />
                        Creative Intelligence
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        AI-powered creative analysis and fatigue detection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh Analysis
                    </Button>
                    <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate Variations
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{creatives.length}</div>
                        <div className="text-sm text-muted-foreground">Active Creatives</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className={`text-2xl font-bold ${getScoreColor(avgPerformance)}`}>
                            {avgPerformance}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Performance Score</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{fatigueAlerts}</div>
                        <div className="text-sm text-muted-foreground">Fatigue Alerts</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {creatives.filter(c => c.performanceScore >= 80).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Top Performers</div>
                    </CardContent>
                </Card>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border rounded-md bg-background text-sm"
                >
                    <option value="performanceScore">Performance Score</option>
                    <option value="roas">ROAS</option>
                    <option value="fatigueScore">Fatigue Level</option>
                </select>
            </div>

            {/* Creatives Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {sortedCreatives.map((creative) => {
                    const FormatIcon = FORMAT_ICONS[creative.format] || Image;
                    return (
                        <Card key={creative.id} className="hover:border-purple-500/50 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {/* Thumbnail placeholder */}
                                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <FormatIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-medium truncate">{creative.name}</h3>
                                                <p className="text-xs text-muted-foreground">{creative.campaign}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {creative.format}
                                            </Badge>
                                        </div>

                                        {/* Metrics Row */}
                                        <div className="grid grid-cols-4 gap-2 text-sm mb-3">
                                            <div>
                                                <div className="text-muted-foreground text-xs">ROAS</div>
                                                <div className={`font-medium ${creative.roas >= 2 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {creative.roas.toFixed(1)}x
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground text-xs">CTR</div>
                                                <div className="font-medium">{creative.ctr.toFixed(1)}%</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground text-xs">Spend</div>
                                                <div className="font-medium">${creative.spend}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground text-xs">Conv.</div>
                                                <div className="font-medium">{creative.conversions}</div>
                                            </div>
                                        </div>

                                        {/* Scores */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground w-20">Performance</span>
                                                <Progress value={creative.performanceScore} className="flex-1 h-2" />
                                                <span className={`text-xs font-medium w-8 ${getScoreColor(creative.performanceScore)}`}>
                                                    {creative.performanceScore}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground w-20">Fatigue</span>
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getFatigueColor(creative.fatigueScore)}`}
                                                        style={{ width: `${creative.fatigueScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium w-8">
                                                    {creative.fatigueScore}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Alert */}
                                        {creative.fatigueScore >= 60 && (
                                            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                                                <AlertTriangle className="h-3 w-3" />
                                                Creative showing fatigue - consider refreshing
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
