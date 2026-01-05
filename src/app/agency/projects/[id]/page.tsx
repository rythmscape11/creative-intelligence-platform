'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, DollarSign, CheckCircle2, Clock, Trash2, Briefcase, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import { AgencyBreadcrumb } from '@/components/agency/AgencyBreadcrumb';

interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
}

interface Job {
    id: string;
    title: string;
    status: string;
    tasks: Task[];
}

interface Campaign {
    id: string;
    name: string;
    status: string;
}

interface Project {
    id: string;
    name: string;
    description: string | null;
    status: string;
    priority: string;
    budget: number | null;
    startDate: string | null;
    endDate: string | null;
    client: { name: string; id: string };
    jobs: Job[];
    campaigns: Campaign[];
    _count: { jobs: number };
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: '',
        priority: '',
        budget: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/agency/projects/${params.id}`);
            if (!res.ok) {
                if (res.status === 404) {
                    toast.error('Project not found');
                    // router.push('/agency/projects'); // Optional: stay to show 404
                    return;
                }
                throw new Error('Failed to fetch project');
            }
            const data = await res.json();
            setProject(data);
            setFormData({
                name: data.name,
                description: data.description || '',
                status: data.status,
                priority: data.priority,
                budget: data.budget ? data.budget.toString() : '',
                startDate: data.startDate ? data.startDate.split('T')[0] : '',
                endDate: data.endDate ? data.endDate.split('T')[0] : ''
            });
        } catch (error) {
            console.error(error);
            toast.error('Error loading project');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/agency/projects/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Project updated');
            setIsEditing(false);
            fetchProject();
        } catch (error) {
            toast.error('Failed to update project');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure? This will delete the project and all related jobs/tasks.')) return;

        try {
            const res = await fetch(`/api/agency/projects/${params.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            toast.success('Project deleted');
            router.push('/agency/projects');
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) return <AgencyListSkeleton />;
    if (!project) return <div className="p-8 text-center">Project not found</div>;

    const priorityColors: Record<string, string> = {
        HIGH: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        LOW: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400',
        URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/agency/projects">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                            <Badge className={priorityColors[project.priority]}>{project.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="font-medium">{project.client.name}</span>
                            <span>•</span>
                            <span className="capitalize">{project.status.replace('_', ' ').toLowerCase()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Project'}
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
                        <CardTitle>Edit Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Project Name</Label>
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
                                    <option value="PLANNED">Planned</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="ON_HOLD">On Hold</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
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
                    <TabsTrigger value="jobs">Jobs ({project.jobs.length})</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
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
                                    {project.budget?.toLocaleString() || '0'}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Start Date</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-lg font-bold flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
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
                                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Jobs</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {project._count.jobs}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{project.description || 'No description provided.'}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="jobs">
                    <div className="space-y-4">
                        {project.jobs.map(job => (
                            <Card key={job.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-base font-semibold">{job.title}</CardTitle>
                                        <Badge variant="secondary">{job.status}</Badge>
                                    </div>
                                    <CardDescription>
                                        {job.tasks.length} Tasks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {job.tasks.map(task => (
                                            <div key={task.id} className="flex justify-between items-center text-sm border-b last:border-0 pb-2 last:pb-0">
                                                <div className="flex items-center gap-2">
                                                    {task.status === 'DONE' ?
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                                                        <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                                                    }
                                                    <span className={task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                                                </div>
                                                <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {project.jobs.length === 0 && <div className="text-center text-muted-foreground py-10">No jobs created yet.</div>}
                    </div>
                </TabsContent>

                <TabsContent value="campaigns">
                    <div className="grid gap-4 md:grid-cols-2">
                        {project.campaigns.map(camp => (
                            <Card key={camp.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{camp.name}</CardTitle>
                                    <Badge>{camp.status}</Badge>
                                </CardHeader>
                            </Card>
                        ))}
                        {project.campaigns.length === 0 && <div className="col-span-full text-center text-muted-foreground py-10">No campaigns linked.</div>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
