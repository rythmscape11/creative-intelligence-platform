'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    TrendingUp,
    TrendingDown,
    ExternalLink,
} from 'lucide-react';

const pages = [
    {
        url: '/marketing-automation',
        title: 'Marketing Automation Guide',
        visits: 12500,
        keywords: 45,
        backlinks: 128,
        bounceRate: 35,
        trend: 'up',
    },
    {
        url: '/seo-tools',
        title: 'Best SEO Tools 2024',
        visits: 9800,
        keywords: 38,
        backlinks: 95,
        bounceRate: 42,
        trend: 'up',
    },
    {
        url: '/email-marketing',
        title: 'Email Marketing Tips',
        visits: 7500,
        keywords: 32,
        backlinks: 67,
        bounceRate: 48,
        trend: 'down',
    },
    {
        url: '/content-strategy',
        title: 'Content Strategy Template',
        visits: 6200,
        keywords: 28,
        backlinks: 54,
        bounceRate: 38,
        trend: 'up',
    },
    {
        url: '/lead-generation',
        title: 'Lead Generation Strategies',
        visits: 5800,
        keywords: 25,
        backlinks: 43,
        bounceRate: 45,
        trend: 'up',
    },
];

export default function PagesPage() {
    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="h-8 w-8 text-emerald-500" />
                    Top Pages
                </h1>
                <p className="text-muted-foreground mt-1">
                    Performance metrics for your top-performing pages
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Pages</p>
                        <p className="text-2xl font-bold">1,245</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Indexed Pages</p>
                        <p className="text-2xl font-bold">1,198</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Top 10 Traffic</p>
                        <p className="text-2xl font-bold">45.2K</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Avg. Bounce Rate</p>
                        <p className="text-2xl font-bold">41.6%</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Pages by Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-medium text-muted-foreground">Page</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Visits</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Keywords</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Backlinks</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Bounce</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map((page) => (
                                <tr key={page.url} className="border-b hover:bg-muted/50 cursor-pointer">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">{page.title}</div>
                                                <div className="text-xs text-muted-foreground">{page.url}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-medium">{formatNumber(page.visits)}</td>
                                    <td className="p-4 text-right">{page.keywords}</td>
                                    <td className="p-4 text-right">{page.backlinks}</td>
                                    <td className="p-4 text-right">{page.bounceRate}%</td>
                                    <td className="p-4 text-right">
                                        {page.trend === 'up' ? (
                                            <TrendingUp className="h-4 w-4 text-green-500 inline" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-500 inline" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
