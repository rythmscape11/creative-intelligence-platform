'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, FolderKanban, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    client: { name: string, industry: string | null } | null;
    status: string;
    priority: string;
    endDate: string | null;
    _count: { jobs: number } | null;
}

interface Client {
    id: string;
    name: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        clientId: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PLANNED',
        startDate: '',
        endDate: '',
    });

    const fetchData = async () => {
        try {
            console.log('[Projects] Fetching data from API...');
            const [projectsRes, clientsRes] = await Promise.all([
                fetch('/api/agency/projects'),
                fetch('/api/agency/clients')
            ]);

            console.log('[Projects] Projects API status:', projectsRes.status);
            console.log('[Projects] Clients API status:', clientsRes.status);

            if (projectsRes.ok) {
                const projectsData = await projectsRes.json();
                console.log('[Projects] Projects data received:', projectsData?.length, 'projects');
                console.log('[Projects] First project sample:', projectsData?.[0]);
                setProjects(projectsData || []);
            } else {
                const errorData = await projectsRes.json();
                console.error('[Projects] Projects API error:', errorData);
                toast.error('Failed to load projects: ' + (errorData.message || 'Unknown error'));
            }

            if (clientsRes.ok) {
                const clientsData = await clientsRes.json();
                console.log('[Projects] Clients data received:', clientsData?.length, 'clients');
                setClients(clientsData || []);
            }
        } catch (error) {
            console.error('[Projects] Fetch error:', error);
            toast.error('Failed to load data: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!formData.clientId) {
                toast.error('Please select a client');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/agency/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Failed to create project');
            }

            toast.success('Project created');
            setIsDialogOpen(false);
            setFormData({
                name: '',
                clientId: '',
                description: '',
                priority: 'MEDIUM',
                status: 'PLANNED',
                startDate: '',
                endDate: '',
            });
            await fetchData();
        } catch (error) {
            console.error('Create project error:', error);
            toast.error(error instanceof Error ? error.message : 'Error creating project');
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ErrorBoundary>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Projects</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track campaigns, tech builds, and creative work.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={clients.length === 0}>
                                <Plus className="h-4 w-4 mr-2" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g. Q4 Marketing Campaign"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="client">Client</Label>
                                    <Select
                                        value={formData.clientId}
                                        onValueChange={val => setFormData({ ...formData, clientId: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map(client => (
                                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={val => setFormData({ ...formData, status: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PLANNED">Planned</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="REVIEW">Review</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={val => setFormData({ ...formData, priority: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea
                                        id="desc"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Project goals and scope..."
                                    />
                                </div>

                                <Button type="submit" className="w-full">Create Project</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full md:w-96">
                    <Search className="h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border-none bg-transparent focus-visible:ring-0 h-auto p-0"
                    />
                </div>

                {loading ? (
                    <AgencyListSkeleton count={6} />
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                        <FolderKanban className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No projects yet</h3>
                        <p className="text-zinc-500 mb-4">Start by creating a project for one of your clients.</p>
                        <Button onClick={() => setIsDialogOpen(true)} variant="outline" disabled={clients.length === 0}>
                            {clients.length === 0 ? 'Add Client First' : 'Create Project'}
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <Link key={project.id} href={`/agency/projects/${project.id}`}>
                                <Card className="group hover:border-indigo-500 transition-colors cursor-pointer h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-xs font-medium text-zinc-500 mb-1">{project.client?.name || 'No Client'}</div>
                                                <CardTitle className="font-semibold text-lg">{project.name}</CardTitle>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full font-medium ${project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    'bg-zinc-100 text-zinc-700'
                                                }`}>
                                                {(project.status || 'PLANNED').replace('_', ' ')}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div className="flex items-center justify-between text-sm text-zinc-500">
                                                <div className="flex items-center gap-1">
                                                    <FolderKanban className="h-4 w-4" />
                                                    <span>{project._count?.jobs || 0} Jobs</span>
                                                </div>
                                                {project.endDate && !isNaN(new Date(project.endDate).getTime()) && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{format(new Date(project.endDate), 'MMM d')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 w-1/3 rounded-full" />
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                View Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
