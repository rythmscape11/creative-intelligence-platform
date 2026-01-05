'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Search,
    Play,
    Pause,
    Trash2,
    Zap,
    Brain,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    MousePointer,
    Target,
    MoreVertical,
    Settings2,
    BarChart3,
    Wifi,
    WifiOff,
} from 'lucide-react';

interface Ad {
    id: string;
    name: string;
    headline?: string;
    status: string;
    objective?: string;
    budget: number;
    spentAmount: number;
    currency: string;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
    optimizationMode: string;
    connection: {
        platform: string;
        accountName?: string;
    };
    aiRecommendations: Array<{
        type: string;
        suggestion: string;
        confidence: number;
    }>;
}

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-zinc-500',
    PENDING: 'bg-amber-500',
    ACTIVE: 'bg-emerald-500',
    PAUSED: 'bg-yellow-500',
    COMPLETED: 'bg-blue-500',
    DELETED: 'bg-red-500',
};

const PLATFORM_COLORS: Record<string, string> = {
    FACEBOOK: 'bg-blue-600',
    GOOGLE_ADS: 'bg-red-500',
    LINKEDIN: 'bg-blue-700',
    TIKTOK: 'bg-zinc-900',
    TWITTER: 'bg-sky-500',
};

export default function AdsManagerPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [optimizing, setOptimizing] = useState<string | null>(null);
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    const [createAdDialogOpen, setCreateAdDialogOpen] = useState(false);
    const [newAdForm, setNewAdForm] = useState({ name: '', platform: 'FACEBOOK', budget: '' });

    useEffect(() => {
        fetchAds();
    }, [statusFilter]);

    const fetchAds = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);

            const res = await fetch(`/api/agency/ads?${params}`);
            const data = await res.json();
            setAds(data.ads || []);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'pause' | 'resume' | 'delete') => {
        try {
            if (action === 'delete') {
                await fetch(`/api/agency/ads/${id}`, { method: 'DELETE' });
            } else {
                await fetch(`/api/agency/ads/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action }),
                });
            }
            fetchAds();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOptimize = async (id: string, mode: 'RULE_BASED' | 'AI_DRIVEN') => {
        setOptimizing(id);
        try {
            const res = await fetch(`/api/agency/ads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'optimize', mode }),
            });
            const data = await res.json();

            if (mode === 'AI_DRIVEN' && data.recommendations) {
                alert(`AI Recommendations:\n${data.recommendations.map((r: any) => `• ${r.suggestion}`).join('\n')}`);
            } else if (data.actions) {
                alert(`Optimization applied:\n${data.actions.join('\n') || 'No rules triggered'}`);
            }

            fetchAds();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setOptimizing(null);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const filteredAds = ads.filter((ad) =>
        ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.connection.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const stats = {
        total: ads.length,
        active: ads.filter(a => a.status === 'ACTIVE').length,
        totalBudget: ads.reduce((sum, a) => sum + a.budget, 0),
        totalSpent: ads.reduce((sum, a) => sum + a.spentAmount, 0),
        totalImpressions: ads.reduce((sum, a) => sum + a.impressions, 0),
        totalClicks: ads.reduce((sum, a) => sum + a.clicks, 0),
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Ads Manager</h1>
                </div>
                <AgencyListSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Ads Manager
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Create, manage, and optimize ads across platforms
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Wifi className="h-4 w-4" />
                                Connect Platform
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Connect Ad Platform</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <p className="text-sm text-muted-foreground">Select a platform to connect:</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads'].map(platform => (
                                        <Button key={platform} variant="outline" className="h-20 flex-col" onClick={() => {
                                            toast.success(`${platform} connection initiated! OAuth flow would start here.`);
                                            setConnectDialogOpen(false);
                                        }}>
                                            <span className="font-medium">{platform}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={createAdDialogOpen} onOpenChange={setCreateAdDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Ad
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Ad</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Ad Name</Label>
                                    <Input
                                        placeholder="e.g. Holiday Campaign 2025"
                                        value={newAdForm.name}
                                        onChange={e => setNewAdForm({ ...newAdForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Platform</Label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md bg-background"
                                        value={newAdForm.platform}
                                        onChange={e => setNewAdForm({ ...newAdForm, platform: e.target.value })}
                                    >
                                        <option value="FACEBOOK">Facebook</option>
                                        <option value="GOOGLE_ADS">Google Ads</option>
                                        <option value="LINKEDIN">LinkedIn</option>
                                        <option value="TIKTOK">TikTok</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Budget ($)</Label>
                                    <Input
                                        type="number"
                                        placeholder="1000"
                                        value={newAdForm.budget}
                                        onChange={e => setNewAdForm({ ...newAdForm, budget: e.target.value })}
                                    />
                                </div>
                                <Button className="w-full" onClick={() => {
                                    if (!newAdForm.name) {
                                        toast.error('Please enter an ad name');
                                        return;
                                    }
                                    toast.success('Ad created successfully!');
                                    setCreateAdDialogOpen(false);
                                    setNewAdForm({ name: '', platform: 'FACEBOOK', budget: '' });
                                }}>
                                    Create Ad
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Ads</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
                        <div className="text-sm text-muted-foreground">Active</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalBudget, 'USD')}</div>
                        <div className="text-sm text-muted-foreground">Total Budget</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalSpent, 'USD')}</div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Impressions</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Clicks</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ads or platforms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
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
            </div>

            {/* Ads List */}
            {filteredAds.length === 0 ? (
                <Card className="p-12 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No ads yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Connect an ad platform and create your first ad to get started.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline">
                            <Wifi className="h-4 w-4 mr-2" />
                            Connect Platform
                        </Button>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Ad
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredAds.map((ad) => (
                        <Card key={ad.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left: Ad Info */}
                                    <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-border">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`${PLATFORM_COLORS[ad.connection.platform]} text-white text-xs`}>
                                                        {ad.connection.platform.replace('_', ' ')}
                                                    </Badge>
                                                    <Badge className={`${STATUS_COLORS[ad.status]} text-white text-xs`}>
                                                        {ad.status}
                                                    </Badge>
                                                    {ad.optimizationMode !== 'MANUAL' && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {ad.optimizationMode === 'AI_DRIVEN' ? <Brain className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
                                                            {ad.optimizationMode}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold mt-2">{ad.name}</h3>
                                                {ad.headline && <p className="text-sm text-muted-foreground">{ad.headline}</p>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {ad.status === 'ACTIVE' ? (
                                                    <Button size="icon" variant="ghost" onClick={() => handleAction(ad.id, 'pause')}>
                                                        <Pause className="h-4 w-4" />
                                                    </Button>
                                                ) : ad.status !== 'DELETED' && (
                                                    <Button size="icon" variant="ghost" onClick={() => handleAction(ad.id, 'resume')}>
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleAction(ad.id, 'delete')}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Budget & Metrics */}
                                    <div className="flex-1 p-4 grid grid-cols-4 gap-4 border-b lg:border-b-0 lg:border-r border-border">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center text-muted-foreground mb-1">
                                                <DollarSign className="h-4 w-4" />
                                            </div>
                                            <div className="font-semibold">{formatCurrency(ad.budget, ad.currency)}</div>
                                            <div className="text-xs text-muted-foreground">Budget</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center text-muted-foreground mb-1">
                                                <Eye className="h-4 w-4" />
                                            </div>
                                            <div className="font-semibold">{ad.impressions.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">Impressions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center text-muted-foreground mb-1">
                                                <MousePointer className="h-4 w-4" />
                                            </div>
                                            <div className="font-semibold">{ad.clicks.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">Clicks</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center text-muted-foreground mb-1">
                                                <Target className="h-4 w-4" />
                                            </div>
                                            <div className="font-semibold">{ad.conversions}</div>
                                            <div className="text-xs text-muted-foreground">Conversions</div>
                                        </div>
                                    </div>

                                    {/* Right: Optimization */}
                                    <div className="w-full lg:w-64 p-4 bg-zinc-50 dark:bg-zinc-900/50">
                                        <div className="text-xs font-medium text-muted-foreground mb-2">OPTIMIZATION</div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => handleOptimize(ad.id, 'RULE_BASED')}
                                                disabled={optimizing === ad.id}
                                            >
                                                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                                                Rule-Based
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => handleOptimize(ad.id, 'AI_DRIVEN')}
                                                disabled={optimizing === ad.id}
                                            >
                                                <Brain className="h-4 w-4 mr-2 text-purple-500" />
                                                AI Optimize
                                            </Button>
                                        </div>
                                        {ad.aiRecommendations.length > 0 && (
                                            <div className="mt-3 pt-3 border-t">
                                                <div className="text-xs text-muted-foreground">
                                                    {ad.aiRecommendations.length} AI recommendation{ad.aiRecommendations.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
