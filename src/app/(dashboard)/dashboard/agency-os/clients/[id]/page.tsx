'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { Loader2, Trash2, ArrowLeft, Briefcase, Plus, FolderOpen, Calendar, Mail, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import Link from 'next/link';

interface Project {
    id: string;
    name: string;
    status: string;
    updatedAt: string;
}

interface ClientDetail {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    projects: Project[];
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
    const [client, setClient] = useState<ClientDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await fetch(`/api/agency/clients/${params.id}`);
                if (!res.ok) throw new Error('Client not found');
                const data = await res.json();
                setClient(data);
            } catch (error) {
                console.error(error);
                router.push('/dashboard/agency-os/clients');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClient();
    }, [params.id, router]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this client workspace? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/agency/clients/${params.id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: 'Deleted', description: 'Client workspace removed.', type: 'success' });
                router.push('/dashboard/agency-os/clients');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Could not delete client.', type: 'error' });
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (!client) return null;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', status: 'PLANNED' });
    const [isCreating, setIsCreating] = useState(false);

    // ... existing handleDelete ...

    const handleCreateProject = async () => {
        if (!newProject.name) return;
        setIsCreating(true);
        try {
            const res = await fetch('/api/agency/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newProject, clientId: params.id })
            });

            if (!res.ok) throw new Error('Failed to create');

            const created = await res.json();
            toast({ title: 'Success', description: 'Project created.', type: 'success' });

            // Optimistic update or refetch
            if (client) {
                setClient({
                    ...client,
                    projects: [created, ...client.projects]
                });
            }
            setIsCreateOpen(false);
            setNewProject({ name: '', description: '', status: 'PLANNED' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create project.', type: 'error' });
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (!client) return null;

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard/agency-os/clients" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-muted-foreground">/ Clients /</span>
                        <span className="font-medium">{client.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{client.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {client.industry && <span>{client.industry}</span>}
                        {client.website && (
                            <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                                <Globe className="w-3 h-3" /> {client.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={handleDelete} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 border">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Client
                    </Button>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Project</DialogTitle>
                                <DialogDescription>Create a new project for {client.name}.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="p-name">Project Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="p-name"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="Q3 Marketing Campaign"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="p-desc">Description</Label>
                                    <Input
                                        id="p-desc"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        placeholder="Project goals and scope..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateProject} disabled={isCreating || !newProject.name}>
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Project
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Overview Stats (Placeholder) */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{client.projects.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Assets Store</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0 MB</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Client Portal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-green-500 font-medium">Active</div>
                    </CardContent>
                </Card>
            </div>

            {/* Projects List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                {client.projects.length === 0 ? (
                    <div className="text-center border-dashed border-2 rounded-xl p-12 bg-muted/20">
                        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No projects yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
                        <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {client.projects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">{project.name}</h3>
                                        <p className="text-xs text-muted-foreground">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{project.status}</span>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
