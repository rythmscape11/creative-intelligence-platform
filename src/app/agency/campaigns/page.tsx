'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import {
    Plus,
    Search,
    Target,
    Calendar,
    DollarSign,
    BarChart3,
    Filter,
    LayoutGrid,
    List,
    Megaphone,
} from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
    description?: string;
    objective: string;
    status: string;
    startDate?: string;
    endDate?: string;
    budget: number;
    currency: string;
    spentAmount: number;
    channels: string[];
    tags: string[];
    project: {
        name: string;
        client: { name: string } | null;
    } | null;
    _count?: {
        contentPosts: number;
        reports: number;
    };
}

interface Stats {
    total: number;
    active: number;
    draft: number;
    completed: number;
    totalBudget: number;
    totalSpent: number;
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-zinc-500',
    ACTIVE: 'bg-emerald-500',
    PAUSED: 'bg-amber-500',
    COMPLETED: 'bg-blue-500',
    ARCHIVED: 'bg-zinc-400',
};

const OBJECTIVE_ICONS: Record<string, React.ReactNode> = {
    AWARENESS: <Megaphone className="h-4 w-4" />,
    LEADS: <Target className="h-4 w-4" />,
    SALES: <DollarSign className="h-4 w-4" />,
    ENGAGEMENT: <BarChart3 className="h-4 w-4" />,
};

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchCampaigns();
        fetchStats();
    }, [statusFilter]);

    const fetchCampaigns = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/agency/campaigns?${params}`);
            const data = await res.json();
            setCampaigns(data.campaigns || []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/agency/campaigns/stats');
            const data = await res.json();
            setStats(data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const filteredCampaigns = campaigns.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campaign.project?.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                        <p className="text-muted-foreground mt-1">Manage your marketing campaigns</p>
                    </div>
                </div>
                <AgencyListSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Campaigns
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage your marketing campaigns across all clients
                    </p>
                </div>
                <Link href="/agency/campaigns/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Campaigns
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Budget
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.totalBudget, 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Spent
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">
                                {formatCurrency(stats.totalSpent, 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search campaigns or clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PAUSED">Paused</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Campaigns Grid/List */}
            {filteredCampaigns.length === 0 ? (
                <Card className="p-12 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first campaign to start managing your marketing efforts.
                    </p>
                    <Link href="/agency/campaigns/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Campaign
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
                    {filteredCampaigns.map((campaign) => (
                        <Link key={campaign.id} href={`/agency/campaigns/${campaign.id}`}>
                            <Card className="hover:border-indigo-500/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg truncate">
                                                {campaign.name}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {campaign.project?.client?.name || 'No Client'} • {campaign.project?.name || 'No Project'}
                                            </p>
                                        </div>
                                        <Badge
                                            className={`${STATUS_COLORS[campaign.status]} text-white text-xs`}
                                        >
                                            {campaign.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        {OBJECTIVE_ICONS[campaign.objective] || <Target className="h-4 w-4" />}
                                        <span className="capitalize">
                                            {campaign.objective.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-emerald-500" />
                                            {formatCurrency(campaign.budget, campaign.currency)}
                                        </div>
                                        <span className="text-muted-foreground">
                                            {campaign.channels.length} channel{campaign.channels.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {campaign.channels.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {campaign.channels.slice(0, 3).map((channel) => (
                                                <Badge key={channel} variant="secondary" className="text-xs">
                                                    {channel.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                            {campaign.channels.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{campaign.channels.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
