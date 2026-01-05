'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft, Calendar, DollarSign, Trash2, Target,
    Megaphone, BarChart3, PieChart, FileText, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';

interface ChannelAllocation {
    id: string;
    channel: string;
    percentage: number;
    allocatedBudget: number;
}

interface ContentPost {
    id: string;
    title: string;
    status: string;
    platform: string;
    scheduledFor: string | null;
}

interface Report {
    id: string;
    name: string;
    status: string;
    createdAt: string;
}

interface Campaign {
    id: string;
    name: string;
    description: string | null;
    objective: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    budget: number;
    currency: string;
    spentAmount: number;
    channels: string[];
    tags: string[];
    project: {
        id: string;
        name: string;
        client: { name: string; id: string } | null;
    } | null;
    channelAllocations: ChannelAllocation[];
    contentPosts: ContentPost[];
    reports: Report[];
    _count?: {
        contentPosts: number;
        reports: number;
    };
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

export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: '',
        objective: '',
        budget: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (params.id) {
            fetchCampaign();
        }
    }, [params.id]);

    const fetchCampaign = async () => {
        try {
            const res = await fetch(`/api/agency/campaigns/${params.id}`);
            if (!res.ok) {
                if (res.status === 404) {
                    toast.error('Campaign not found');
                    return;
                }
                throw new Error('Failed to fetch campaign');
            }
            const data = await res.json();
            setCampaign(data.campaign);
            setFormData({
                name: data.campaign.name,
                description: data.campaign.description || '',
                status: data.campaign.status,
                objective: data.campaign.objective,
                budget: data.campaign.budget ? data.campaign.budget.toString() : '',
                startDate: data.campaign.startDate ? data.campaign.startDate.split('T')[0] : '',
                endDate: data.campaign.endDate ? data.campaign.endDate.split('T')[0] : ''
            });
        } catch (error) {
            console.error(error);
            toast.error('Error loading campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/agency/campaigns/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: formData.budget ? parseFloat(formData.budget) : undefined
                })
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Campaign updated');
            setIsEditing(false);
            fetchCampaign();
        } catch (error) {
            toast.error('Failed to update campaign');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure? This will delete the campaign and all related data.')) return;

        try {
            const res = await fetch(`/api/agency/campaigns/${params.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Campaign deleted');
            router.push('/agency/campaigns');
        } catch (error) {
            toast.error('Failed to delete campaign');
        }
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <AgencyListSkeleton />;
    if (!campaign) return <div className="p-8 text-center">Campaign not found</div>;

    const spentPercentage = campaign.budget > 0
        ? Math.min(100, (campaign.spentAmount / campaign.budget) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/agency/campaigns">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                            <Badge className={`${STATUS_COLORS[campaign.status]} text-white`}>
                                {campaign.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            {OBJECTIVE_ICONS[campaign.objective]}
                            <span className="capitalize">{campaign.objective.toLowerCase()}</span>
                            {campaign.project && (
                                <>
                                    <span>•</span>
                                    <Link href={`/agency/projects/${campaign.project.id}`} className="hover:underline">
                                        {campaign.project.name}
                                    </Link>
                                    {campaign.project.client && (
                                        <>
                                            <span>•</span>
                                            <span>{campaign.project.client.name}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Campaign'}
                    </Button>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Edit Mode */}
            {isEditing && (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Campaign Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Campaign Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="PAUSED">Paused</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Objective</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.objective}
                                    onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                >
                                    <option value="AWARENESS">Awareness</option>
                                    <option value="LEADS">Leads</option>
                                    <option value="SALES">Sales</option>
                                    <option value="ENGAGEMENT">Engagement</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Budget</Label>
                                <Input type="number" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleUpdate}>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="budget">Budget ({campaign.channelAllocations?.length || 0})</TabsTrigger>
                    <TabsTrigger value="content">Content ({campaign.contentPosts?.length || 0})</TabsTrigger>
                    <TabsTrigger value="reports">Reports ({campaign.reports?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {formatCurrency(campaign.budget, campaign.currency)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Spent</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold flex items-center text-amber-600">
                                    {formatCurrency(campaign.spentAmount, campaign.currency)}
                                </div>
                                <Progress value={spentPercentage} className="h-2 mt-2" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Start Date</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-lg font-bold flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {formatDate(campaign.startDate)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">End Date</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-lg font-bold flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {formatDate(campaign.endDate)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description || 'No description provided.'}</p>
                        </CardContent>
                    </Card>

                    {campaign.channels && campaign.channels.length > 0 && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Channels</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {campaign.channels.map((channel, idx) => (
                                        <Badge key={idx} variant="secondary">{channel}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="budget">
                    <div className="space-y-4">
                        {campaign.channelAllocations && campaign.channelAllocations.map(allocation => (
                            <Card key={allocation.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base font-semibold">{allocation.channel}</CardTitle>
                                        <Badge variant="secondary">{allocation.percentage}%</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Allocated Budget</span>
                                        <span className="font-semibold">{formatCurrency(allocation.allocatedBudget, campaign.currency)}</span>
                                    </div>
                                    <Progress value={allocation.percentage} className="h-2 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                        {(!campaign.channelAllocations || campaign.channelAllocations.length === 0) && (
                            <div className="text-center text-muted-foreground py-10">No budget allocations yet.</div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="content">
                    <div className="grid gap-4 md:grid-cols-2">
                        {campaign.contentPosts && campaign.contentPosts.map(post => (
                            <Card key={post.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-base font-semibold">{post.title}</CardTitle>
                                        <Badge variant="secondary">{post.status}</Badge>
                                    </div>
                                    <CardDescription>
                                        {post.platform} • {post.scheduledFor ? formatDate(post.scheduledFor) : 'Not scheduled'}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                        {(!campaign.contentPosts || campaign.contentPosts.length === 0) && (
                            <div className="col-span-full text-center text-muted-foreground py-10">No content posts yet.</div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reports">
                    <div className="space-y-4">
                        {campaign.reports && campaign.reports.map(report => (
                            <Card key={report.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <CardTitle className="text-base font-semibold">{report.name}</CardTitle>
                                        </div>
                                        <Badge variant="secondary">{report.status}</Badge>
                                    </div>
                                    <CardDescription>
                                        Created {formatDate(report.createdAt)}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                        {(!campaign.reports || campaign.reports.length === 0) && (
                            <div className="text-center text-muted-foreground py-10">No reports generated yet.</div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
