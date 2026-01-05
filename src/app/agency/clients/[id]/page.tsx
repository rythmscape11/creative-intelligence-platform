'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Globe, Building2, Calendar, MoreVertical, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import { AgencyBreadcrumb } from '@/components/agency/AgencyBreadcrumb';

interface ClientProject {
    id: string;
    name: string;
    status: string;
    priority: string;
    endDate: string | null;
    budget: number | null;
    _count: { jobs: number };
}

interface Client {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    status: string;
    createdAt: string;
    projects: ClientProject[];
    _count: { projects: number };
}

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (params.id) {
            fetchClient();
        }
    }, [params.id]);

    const fetchClient = async () => {
        try {
            const res = await fetch(`/api/agency/clients/${params.id}`);
            if (!res.ok) {
                if (res.status === 404) {
                    toast.error('Client not found');
                    router.push('/agency/clients');
                    return;
                }
                throw new Error('Failed to fetch client');
            }
            const data = await res.json();
            setClient(data);
            setFormData({
                name: data.name,
                industry: data.industry || '',
                website: data.website || '',
                status: data.status
            });
        } catch (error) {
            console.error(error);
            toast.error('Error loading client details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/agency/clients/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Client updated');
            setIsEditing(false);
            fetchClient();
        } catch (error) {
            toast.error('Failed to update client');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure? This will delete all projects and data for this client.')) return;

        try {
            const res = await fetch(`/api/agency/clients/${params.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Client deleted');
            router.push('/agency/clients');
        } catch (error) {
            toast.error('Failed to delete client');
        }
    };

    if (loading) return <AgencyListSkeleton />;
    if (!client) return <div>Client not found</div>;

    const statusColors: Record<string, string> = {
        ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        INACTIVE: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400',
        LEAD: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/agency/clients">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                            <div className="flex items-center gap-1 text-sm">
                                <Building2 className="h-3.5 w-3.5" />
                                {client.industry || 'No Industry'}
                            </div>
                            {client.website && (
                                <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                                    <Globe className="h-3.5 w-3.5" />
                                    {client.website}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={statusColors[client.status] || 'bg-zinc-100'}>
                        {client.status}
                    </Badge>
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Client'}
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
                        <CardTitle>Edit Client Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Client Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Industry</Label>
                                <Input value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="LEAD">Lead</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleUpdate}>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects ({client.projects.length})</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{client._count.projects}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Client Since</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Date(client.createdAt).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-muted-foreground">-</div>
                                <p className="text-xs text-muted-foreground">No recent survey</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="projects">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {client.projects.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-muted-foreground">
                                No projects found for this client.
                            </div>
                        ) : (
                            client.projects.map(project => (
                                <Link key={project.id} href={`/agency/projects/${project.id}`}>
                                    <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base">{project.name}</CardTitle>
                                                <Badge variant="outline">{project.status}</Badge>
                                            </div>
                                            <CardDescription>
                                                {project._count.jobs} Jobs • {project.priority} Priority
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {project.endDate && (
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Due {new Date(project.endDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="invoices">
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Billing and invoicing module coming soon.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
