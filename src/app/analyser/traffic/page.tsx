'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Globe,
    Monitor,
    Smartphone,
    Clock,
    MousePointer,
} from 'lucide-react';

const trafficOverview = {
    totalVisits: 560000,
    change: '+12.5%',
    trend: 'up',
    avgDuration: '2m 45s',
    bounceRate: '42%',
    pagesPerVisit: 3.2,
};

const trafficSources = [
    { source: 'Organic Search', visits: 245000, share: 43.8, change: '+15%', color: 'bg-emerald-500' },
    { source: 'Direct', visits: 134000, share: 23.9, change: '+5%', color: 'bg-blue-500' },
    { source: 'Referral', visits: 89000, share: 15.9, change: '+8%', color: 'bg-purple-500' },
    { source: 'Social', visits: 56000, share: 10.0, change: '-2%', color: 'bg-pink-500' },
    { source: 'Paid Search', visits: 28000, share: 5.0, change: '+25%', color: 'bg-amber-500' },
    { source: 'Email', visits: 8000, share: 1.4, change: '+3%', color: 'bg-gray-500' },
];

const topCountries = [
    { country: 'United States', visits: 224000, share: 40, flag: '🇺🇸' },
    { country: 'United Kingdom', visits: 84000, share: 15, flag: '🇬🇧' },
    { country: 'Canada', visits: 56000, share: 10, flag: '🇨🇦' },
    { country: 'Germany', visits: 44800, share: 8, flag: '🇩🇪' },
    { country: 'Australia', visits: 33600, share: 6, flag: '🇦🇺' },
];

const deviceBreakdown = [
    { device: 'Desktop', visits: 336000, share: 60, icon: Monitor },
    { device: 'Mobile', visits: 196000, share: 35, icon: Smartphone },
    { device: 'Tablet', visits: 28000, share: 5, icon: Monitor },
];

const monthlyTrend = [
    { month: 'Jul', visits: 420000 },
    { month: 'Aug', visits: 445000 },
    { month: 'Sep', visits: 480000 },
    { month: 'Oct', visits: 510000 },
    { month: 'Nov', visits: 535000 },
    { month: 'Dec', visits: 560000 },
];

export default function TrafficPage() {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        return num.toString();
    };

    const maxVisits = Math.max(...monthlyTrend.map(m => m.visits));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-emerald-500" />
                    Traffic Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                    Website traffic, sources, and audience insights
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <Globe className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className={`flex items-center text-sm ${trafficOverview.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {trafficOverview.trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {trafficOverview.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{formatNumber(trafficOverview.totalVisits)}</p>
                            <p className="text-sm text-muted-foreground">Total Visits</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="p-2 rounded-lg bg-blue-500/10 w-fit">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{trafficOverview.avgDuration}</p>
                            <p className="text-sm text-muted-foreground">Avg. Duration</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="p-2 rounded-lg bg-amber-500/10 w-fit">
                            <MousePointer className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{trafficOverview.bounceRate}</p>
                            <p className="text-sm text-muted-foreground">Bounce Rate</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="p-2 rounded-lg bg-purple-500/10 w-fit">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold">{trafficOverview.pagesPerVisit}</p>
                            <p className="text-sm text-muted-foreground">Pages/Visit</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Traffic Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Traffic Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48 flex items-end gap-4">
                        {monthlyTrend.map((month) => (
                            <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-emerald-500 rounded-t transition-all"
                                    style={{ height: `${(month.visits / maxVisits) * 100}%` }}
                                />
                                <span className="text-xs text-muted-foreground">{month.month}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {trafficSources.map((source) => (
                                <div key={source.source} className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${source.color}`} />
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{source.source}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatNumber(source.visits)} ({source.share}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${source.color} transition-all`}
                                                style={{ width: `${source.share}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Badge
                                        className={source.change.startsWith('+')
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }
                                    >
                                        {source.change}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Countries */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Countries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCountries.map((country) => (
                                <div key={country.country} className="flex items-center gap-4">
                                    <span className="text-2xl">{country.flag}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{country.country}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatNumber(country.visits)} ({country.share}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all"
                                                style={{ width: `${country.share}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Device Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {deviceBreakdown.map((device) => (
                            <div key={device.device} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                                <div className="p-3 rounded-lg bg-emerald-500/10">
                                    <device.icon className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{device.share}%</p>
                                    <p className="text-sm text-muted-foreground">
                                        {device.device} ({formatNumber(device.visits)})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
