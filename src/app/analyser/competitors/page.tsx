'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowUpDown,
} from 'lucide-react';

const competitors = [
    {
        domain: 'competitor1.com',
        name: 'Competitor One',
        monthlyVisits: 890000,
        authorityScore: 78,
        organicKeywords: 12500,
        backlinks: 45000,
        overlapScore: 65,
        trend: 'up',
        trendValue: '+8%',
    },
    {
        domain: 'competitor2.com',
        name: 'Competitor Two',
        monthlyVisits: 560000,
        authorityScore: 72,
        organicKeywords: 8900,
        backlinks: 32000,
        overlapScore: 52,
        trend: 'up',
        trendValue: '+12%',
    },
    {
        domain: 'competitor3.com',
        name: 'Competitor Three',
        monthlyVisits: 340000,
        authorityScore: 65,
        organicKeywords: 5600,
        backlinks: 18000,
        overlapScore: 48,
        trend: 'down',
        trendValue: '-3%',
    },
    {
        domain: 'competitor4.com',
        name: 'Competitor Four',
        monthlyVisits: 1200000,
        authorityScore: 85,
        organicKeywords: 18000,
        backlinks: 78000,
        overlapScore: 72,
        trend: 'up',
        trendValue: '+5%',
    },
];

const yourSite = {
    domain: 'acme.com',
    name: 'Your Site',
    monthlyVisits: 560000,
    authorityScore: 72,
    organicKeywords: 8900,
    backlinks: 12400,
};

const keywordGaps = [
    { keyword: 'marketing automation platform', yourRank: null, competitorRank: 3, volume: 8400 },
    { keyword: 'best crm software', yourRank: null, competitorRank: 5, volume: 14200 },
    { keyword: 'email marketing tools', yourRank: 45, competitorRank: 8, volume: 12500 },
    { keyword: 'lead generation software', yourRank: 32, competitorRank: 4, volume: 6800 },
    { keyword: 'sales automation', yourRank: null, competitorRank: 7, volume: 5400 },
];

export default function CompetitorsPage() {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-8 w-8 text-emerald-500" />
                        Competitor Analysis
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Benchmark against competitors and find opportunities
                    </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                </Button>
            </div>

            {/* Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Competitive Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium text-muted-foreground">Domain</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">
                                        <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground">
                                            Visits/mo
                                            <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                    </th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Authority</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Keywords</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Backlinks</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Overlap</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Your site row */}
                                <tr className="border-b bg-emerald-50 dark:bg-emerald-950/20">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                                                Y
                                            </div>
                                            <div>
                                                <div className="font-medium">{yourSite.domain}</div>
                                                <div className="text-xs text-muted-foreground">{yourSite.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-medium">{formatNumber(yourSite.monthlyVisits)}</td>
                                    <td className="p-4 text-right">
                                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            {yourSite.authorityScore}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">{formatNumber(yourSite.organicKeywords)}</td>
                                    <td className="p-4 text-right">{formatNumber(yourSite.backlinks)}</td>
                                    <td className="p-4 text-right">-</td>
                                    <td className="p-4 text-right">-</td>
                                </tr>
                                {/* Competitor rows */}
                                {competitors.map((comp) => (
                                    <tr key={comp.domain} className="border-b hover:bg-muted/50 cursor-pointer">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                                                    {comp.domain[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{comp.domain}</div>
                                                    <div className="text-xs text-muted-foreground">{comp.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-medium">{formatNumber(comp.monthlyVisits)}</td>
                                        <td className="p-4 text-right">
                                            <Badge variant="secondary">{comp.authorityScore}</Badge>
                                        </td>
                                        <td className="p-4 text-right">{formatNumber(comp.organicKeywords)}</td>
                                        <td className="p-4 text-right">{formatNumber(comp.backlinks)}</td>
                                        <td className="p-4 text-right">
                                            <Badge variant="outline">{comp.overlapScore}%</Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className={`flex items-center justify-end gap-1 ${comp.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {comp.trend === 'up' ? (
                                                    <TrendingUp className="h-4 w-4" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4" />
                                                )}
                                                {comp.trendValue}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Keyword Gap Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Keyword Gap Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium text-muted-foreground">Keyword</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Volume</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Your Rank</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Competitor Rank</th>
                                    <th className="text-right p-4 font-medium text-muted-foreground">Opportunity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keywordGaps.map((gap, idx) => (
                                    <tr key={idx} className="border-b hover:bg-muted/50">
                                        <td className="p-4 font-medium">{gap.keyword}</td>
                                        <td className="p-4 text-right text-muted-foreground">
                                            {gap.volume.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            {gap.yourRank ? (
                                                <span>#{gap.yourRank}</span>
                                            ) : (
                                                <Badge variant="outline" className="text-amber-600">Not ranking</Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-medium text-green-600">
                                            #{gap.competitorRank}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                High
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
