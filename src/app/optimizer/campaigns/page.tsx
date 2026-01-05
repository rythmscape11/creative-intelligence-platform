'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Megaphone,
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Play,
    Pause,
    MoreHorizontal,
    Zap,
    ChevronDown,
} from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
    platform: string;
    status: string;
    objective: string;
    dailyBudget: number;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
    cpa: number;
    change7d: number;
    aiScore: number;
}

const DEMO_CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        name: 'Holiday Sale 2024',
        platform: 'META',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        dailyBudget: 500,
        spend: 3250,
        impressions: 450000,
        clicks: 12500,
        conversions: 320,
        roas: 4.2,
        cpa: 10.15,
        change7d: 15.3,
        aiScore: 92,
    },
    {
        id: '2',
        name: 'Brand Awareness Q4',
        platform: 'META',
        status: 'ACTIVE',
        objective: 'AWARENESS',
        dailyBudget: 300,
        spend: 1950,
        impressions: 890000,
        clicks: 25000,
        conversions: 45,
        roas: 0.8,
        cpa: 43.33,
        change7d: -8.5,
        aiScore: 45,
    },
    {
        id: '3',
        name: 'Search - Brand',
        platform: 'GOOGLE_ADS',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        dailyBudget: 200,
        spend: 1400,
        impressions: 85000,
        clicks: 8500,
        conversions: 180,
        roas: 5.8,
        cpa: 7.77,
        change7d: 22.1,
        aiScore: 98,
    },
    {
        id: '4',
        name: 'Retargeting - Cart Abandoners',
        platform: 'META',
        status: 'PAUSED',
        objective: 'CONVERSIONS',
        dailyBudget: 150,
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roas: 0,
        cpa: 0,
        change7d: 0,
        aiScore: 75,
    },
    {
        id: '5',
        name: 'Display - Remarketing',
        platform: 'GOOGLE_ADS',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        dailyBudget: 100,
        spend: 680,
        impressions: 320000,
        clicks: 4200,
        conversions: 28,
        roas: 2.1,
        cpa: 24.28,
        change7d: -3.2,
        aiScore: 62,
    },
];

const PLATFORM_COLORS: Record<string, string> = {
    META: 'bg-blue-500',
    GOOGLE_ADS: 'bg-red-500',
};

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-green-500',
    PAUSED: 'bg-amber-500',
    DELETED: 'bg-red-500',
};

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO_CAMPAIGNS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [platformFilter, setPlatformFilter] = useState<string>('');

    const filteredCampaigns = campaigns.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || c.status === statusFilter;
        const matchesPlatform = !platformFilter || c.platform === platformFilter;
        return matchesSearch && matchesStatus && matchesPlatform;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
        if (score >= 60) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Megaphone className="h-8 w-8 text-indigo-500" />
                        Campaigns
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        All campaigns across connected platforms
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Zap className="h-4 w-4" />
                        Bulk Actions
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{campaigns.length}</div>
                        <div className="text-sm text-muted-foreground">Total Campaigns</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {campaigns.filter(c => c.status === 'ACTIVE').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                            {formatCurrency(campaigns.reduce((sum, c) => sum + c.spend, 0))}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Spend (7d)</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-indigo-600">
                            {(campaigns.reduce((sum, c) => sum + c.spend * c.roas, 0) /
                                campaigns.reduce((sum, c) => sum + c.spend, 0) || 0).toFixed(2)}x
                        </div>
                        <div className="text-sm text-muted-foreground">Avg ROAS</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search campaigns..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                </select>
                <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                >
                    <option value="">All Platforms</option>
                    <option value="META">Meta</option>
                    <option value="GOOGLE_ADS">Google Ads</option>
                </select>
            </div>

            {/* Campaigns Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Campaign</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Spend</TableHead>
                                <TableHead className="text-right">Impressions</TableHead>
                                <TableHead className="text-right">Conversions</TableHead>
                                <TableHead className="text-right">ROAS</TableHead>
                                <TableHead className="text-right">CPA</TableHead>
                                <TableHead className="text-center">AI Score</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map((campaign) => (
                                <TableRow key={campaign.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[campaign.platform]}`} />
                                            <div>
                                                <div className="font-medium">{campaign.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {campaign.platform.replace('_', ' ')} • {campaign.objective}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${STATUS_COLORS[campaign.status]} text-white text-xs`}>
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div>{formatCurrency(campaign.spend)}</div>
                                        <div className={`text-xs ${campaign.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {campaign.change7d >= 0 ? '+' : ''}{campaign.change7d}%
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatNumber(campaign.impressions)}</TableCell>
                                    <TableCell className="text-right">{campaign.conversions}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={campaign.roas >= 2 ? 'text-green-600 font-medium' : campaign.roas >= 1 ? 'text-amber-600' : 'text-red-600'}>
                                            {campaign.roas.toFixed(1)}x
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {campaign.cpa > 0 ? formatCurrency(campaign.cpa) : '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-medium ${getScoreColor(campaign.aiScore)}`}>
                                            {campaign.aiScore}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
