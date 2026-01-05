'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    MousePointer,
    Target,
    Users,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Briefcase,
    FileText,
    PieChart,
    Activity,
} from 'lucide-react';

interface ReportMetrics {
    overview: {
        totalRevenue: number;
        totalSpend: number;
        profit: number;
        profitMargin: number;
        clients: number;
        projects: number;
    };
    adPerformance: {
        impressions: number;
        clicks: number;
        conversions: number;
        spend: number;
        ctr: number;
        cpc: number;
        roas: number;
    };
    timeTracking: {
        totalHours: number;
        billableHours: number;
        billableValue: number;
        utilizationRate: number;
    };
    projectHealth: {
        onTrack: number;
        atRisk: number;
        delayed: number;
    };
}

const MOCK_METRICS: ReportMetrics = {
    overview: {
        totalRevenue: 125000,
        totalSpend: 45000,
        profit: 80000,
        profitMargin: 64,
        clients: 12,
        projects: 18,
    },
    adPerformance: {
        impressions: 4500000,
        clicks: 125000,
        conversions: 3200,
        spend: 28500,
        ctr: 2.78,
        cpc: 0.23,
        roas: 4.2,
    },
    timeTracking: {
        totalHours: 680,
        billableHours: 520,
        billableValue: 78000,
        utilizationRate: 76.5,
    },
    projectHealth: {
        onTrack: 12,
        atRisk: 4,
        delayed: 2,
    },
};

const CHANNEL_DATA = [
    { name: 'Google Ads', spend: 12500, conversions: 1500, roas: 4.5, color: 'bg-red-500' },
    { name: 'Meta Ads', spend: 9800, conversions: 1100, roas: 3.8, color: 'bg-blue-600' },
    { name: 'LinkedIn', spend: 4200, conversions: 450, roas: 5.2, color: 'bg-blue-700' },
    { name: 'TikTok', spend: 1200, conversions: 120, roas: 2.8, color: 'bg-black' },
    { name: 'Other', spend: 800, conversions: 30, roas: 1.5, color: 'bg-zinc-500' },
];

export default function ReportsDashboard() {
    const [metrics, setMetrics] = useState<ReportMetrics>(MOCK_METRICS);
    const [dateRange, setDateRange] = useState('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/agency/reports');
            if (res.ok) {
                const data = await res.json();
                if (data.metrics) {
                    setMetrics(data.metrics);
                }
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        await fetchReports();
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const totalSpend = CHANNEL_DATA.reduce((sum, c) => sum + c.spend, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        Reports & Analytics
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Comprehensive performance insights across all channels
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-lg bg-background text-sm"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="12m">Last 12 Months</option>
                    </select>
                    <Button variant="outline" onClick={refreshData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <DollarSign className="h-8 w-8 opacity-80" />
                            <Badge className="bg-white/20 text-white border-0">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                12%
                            </Badge>
                        </div>
                        <div className="text-3xl font-bold mt-4">{formatCurrency(metrics.overview.totalRevenue)}</div>
                        <p className="text-emerald-100 text-sm">Total Revenue</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <Target className="h-8 w-8 opacity-80" />
                            <Badge className="bg-white/20 text-white border-0">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                8%
                            </Badge>
                        </div>
                        <div className="text-3xl font-bold mt-4">{formatCurrency(metrics.overview.profit)}</div>
                        <p className="text-blue-100 text-sm">Net Profit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Activity className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="text-2xl font-bold">{metrics.overview.profitMargin}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Profit Margin</p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mt-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${metrics.overview.profitMargin}%` }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-2xl font-bold">{metrics.adPerformance.roas}x</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Overall ROAS</p>
                        <p className="text-xs text-emerald-600 mt-1">+0.5x from last period</p>
                    </CardContent>
                </Card>
            </div>

            {/* Ad Performance Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Channel Breakdown */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Channel Performance</CardTitle>
                        <CardDescription>Spend and ROI across advertising platforms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {CHANNEL_DATA.map((channel) => (
                                <div key={channel.name} className="flex items-center gap-4">
                                    <div className={`w-3 h-3 ${channel.color} rounded-full`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{channel.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatCurrency(channel.spend)} ({((channel.spend / totalSpend) * 100).toFixed(0)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                            <div
                                                className={`${channel.color} h-2 rounded-full transition-all`}
                                                style={{ width: `${(channel.spend / totalSpend) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <div className="font-semibold text-sm">{channel.roas}x</div>
                                        <div className="text-xs text-muted-foreground">ROAS</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Impressions</span>
                            </div>
                            <span className="font-bold">{formatNumber(metrics.adPerformance.impressions)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                            <div className="flex items-center gap-3">
                                <MousePointer className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Clicks</span>
                            </div>
                            <span className="font-bold">{formatNumber(metrics.adPerformance.clicks)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Target className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">CTR</span>
                            </div>
                            <span className="font-bold">{metrics.adPerformance.ctr}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">CPC</span>
                            </div>
                            <span className="font-bold">${metrics.adPerformance.cpc.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                                <span className="text-sm font-medium">Conversions</span>
                            </div>
                            <span className="font-bold text-emerald-600">{formatNumber(metrics.adPerformance.conversions)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Time & Project Health */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Time Tracking Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Time Tracking Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
                                <div className="text-3xl font-bold">{metrics.timeTracking.totalHours}</div>
                                <p className="text-sm text-muted-foreground">Total Hours</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
                                <div className="text-3xl font-bold text-emerald-600">{metrics.timeTracking.billableHours}</div>
                                <p className="text-sm text-muted-foreground">Billable Hours</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
                                <div className="text-3xl font-bold">{formatCurrency(metrics.timeTracking.billableValue)}</div>
                                <p className="text-sm text-muted-foreground">Billable Value</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
                                <div className="text-3xl font-bold text-blue-600">{metrics.timeTracking.utilizationRate}%</div>
                                <p className="text-sm text-muted-foreground">Utilization</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Health */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Project Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1">
                                <div className="flex h-4 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500"
                                        style={{ width: `${(metrics.projectHealth.onTrack / 18) * 100}%` }}
                                    />
                                    <div
                                        className="bg-amber-500"
                                        style={{ width: `${(metrics.projectHealth.atRisk / 18) * 100}%` }}
                                    />
                                    <div
                                        className="bg-red-500"
                                        style={{ width: `${(metrics.projectHealth.delayed / 18) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                    <span className="text-2xl font-bold">{metrics.projectHealth.onTrack}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">On Track</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                    <span className="text-2xl font-bold">{metrics.projectHealth.atRisk}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">At Risk</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                                    <span className="text-2xl font-bold">{metrics.projectHealth.delayed}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Delayed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Client Revenue & Recent Reports */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Top Clients by Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Acme Corp', revenue: 35000, projects: 4 },
                                { name: 'TechStart Inc', revenue: 28000, projects: 3 },
                                { name: 'Global Brands', revenue: 24000, projects: 5 },
                                { name: 'Innovate Labs', revenue: 18000, projects: 2 },
                                { name: 'Creative Co', revenue: 12000, projects: 2 },
                            ].map((client, i) => (
                                <div key={client.name} className="flex items-center gap-4 p-3 border rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{client.name}</p>
                                        <p className="text-xs text-muted-foreground">{client.projects} projects</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatCurrency(client.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Generated Reports
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Monthly Performance Summary', date: 'Dec 1, 2024', type: 'PDF' },
                                { name: 'Q4 Ad Campaign Analysis', date: 'Nov 30, 2024', type: 'PDF' },
                                { name: 'Client Revenue Report', date: 'Nov 28, 2024', type: 'Excel' },
                                { name: 'Time Tracking Export', date: 'Nov 25, 2024', type: 'CSV' },
                            ].map((report) => (
                                <div key={report.name} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{report.name}</p>
                                        <p className="text-xs text-muted-foreground">{report.date}</p>
                                    </div>
                                    <Badge variant="outline">{report.type}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            Generate New Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
