'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Save,
    Loader2,
    Target,
    Calendar,
    DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { AgencyBreadcrumb } from '@/components/agency/AgencyBreadcrumb';

interface Project {
    id: string;
    name: string;
    client: { name: string };
}

const OBJECTIVES = [
    { value: 'AWARENESS', label: 'Brand Awareness', description: 'Increase visibility and reach' },
    { value: 'LEADS', label: 'Lead Generation', description: 'Capture potential customers' },
    { value: 'SALES', label: 'Sales', description: 'Drive conversions and revenue' },
    { value: 'ENGAGEMENT', label: 'Engagement', description: 'Boost interactions and community' },
    { value: 'RETENTION', label: 'Retention', description: 'Keep existing customers engaged' },
    { value: 'TRAFFIC', label: 'Website Traffic', description: 'Drive visits to your site' },
];

const CHANNELS = [
    'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'TWITTER', 'YOUTUBE',
    'GOOGLE_ADS', 'GOOGLE_DISPLAY', 'EMAIL', 'SMS', 'TIKTOK',
    'PINTEREST', 'PROGRAMMATIC', 'INFLUENCER',
];

export default function NewCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const [formData, setFormData] = useState({
        projectId: '',
        name: '',
        description: '',
        objective: 'AWARENESS',
        startDate: '',
        endDate: '',
        budget: '',
        currency: 'USD',
        channels: [] as string[],
        tags: '',
        notes: '',
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/agency/projects');
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            // Handle both array response and {projects: [...]} format
            setProjects(Array.isArray(data) ? data : data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/agency/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: parseFloat(formData.budget) || 0,
                    startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                    endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create campaign');
            }

            const data = await res.json();
            router.push(`/agency/campaigns/${data.campaign.id}`);
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    const toggleChannel = (channel: string) => {
        setFormData(prev => ({
            ...prev,
            channels: prev.channels.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...prev.channels, channel],
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/agency/campaigns">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        New Campaign
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create a new marketing campaign
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Campaign Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="projectId">Project *</Label>
                                <select
                                    id="projectId"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.client.name} - {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Campaign Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Q1 Brand Awareness Campaign"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Campaign goals, target audience, key messages..."
                                className="w-full min-h-[100px] px-3 py-2 border rounded-md bg-background resize-y"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Objective</Label>
                            <div className="grid gap-3 md:grid-cols-3">
                                {OBJECTIVES.map((obj) => (
                                    <button
                                        key={obj.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, objective: obj.value })}
                                        className={`p-4 border rounded-lg text-left transition-all ${formData.objective === obj.value
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                                            : 'hover:border-zinc-400'
                                            }`}
                                    >
                                        <div className="font-medium">{obj.label}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {obj.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline & Budget */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Timeline & Budget
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Total Budget</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="budget"
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        placeholder="50000"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                    id="currency"
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Channels */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Marketing Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {CHANNELS.map((channel) => (
                                <button
                                    key={channel}
                                    type="button"
                                    onClick={() => toggleChannel(channel)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${formData.channels.includes(channel)
                                        ? 'bg-indigo-500 text-white border-indigo-500'
                                        : 'hover:border-indigo-300'
                                        }`}
                                >
                                    {channel.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="seasonal, product-launch, holiday"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Internal notes about this campaign..."
                                className="w-full min-h-[80px] px-3 py-2 border rounded-md bg-background resize-y"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link href="/agency/campaigns">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Create Campaign
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
