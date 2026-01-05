'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toaster';
import { Loader2, Plus, Users, Briefcase, ExternalLink, MoreVertical, Search, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Client {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    status: string;
    _count: {
        projects: number;
    }
}

export default function AgencyClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', industry: '', website: '' });
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/agency/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error('Failed to fetch clients', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newClient.name) return;
        setIsCreating(true);
        try {
            const res = await fetch('/api/agency/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            });

            if (!res.ok) throw new Error('Failed to create');

            const created = await res.json();
            toast({ title: 'Success', description: 'Client workspace created.', type: 'success' });
            setClients([created, ...clients]);
            setIsCreateOpen(false);
            setNewClient({ name: '', industry: '', website: '' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create client.', type: 'error' });
        } finally {
            setIsCreating(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Workspaces</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your clients, projects, and deliverables in one place.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search clients..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> Add Client
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Client</DialogTitle>
                                <DialogDescription>Create a dedicated workspace for your client.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Client Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={newClient.name}
                                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                        placeholder="Acme Corp"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        value={newClient.industry}
                                        onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                                        placeholder="SaaS, Retail, etc."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={newClient.website}
                                        onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                                        placeholder="https://acme.com"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreate} disabled={isCreating || !newClient.name}>
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Client
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center h-40 items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredClients.length === 0 ? (
                <div className="text-center border-dashed border-2 rounded-xl p-12 bg-muted/20">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No clients found</h3>
                    <p className="text-muted-foreground mb-4">Get started by adding your first client workspace.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                        <Plus className="w-4 h-4 mr-2" /> Add Client
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((client) => (
                        <Link href={`/dashboard/agency-os/clients/${client.id}`} key={client.id} className="block group">
                            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group-hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-lg uppercase">
                                            {client.name.substring(0, 2)}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </div>
                                    <CardTitle className="mt-4 truncate">{client.name}</CardTitle>
                                    <CardDescription className="truncate">{client.industry || 'No industry specified'}</CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" />
                                            {// @ts-ignore - count might be missing in strict type check but present in runtime
                                                client._count?.projects || 0} Projects
                                        </div>
                                        {client.website && (
                                            <div className="flex items-center gap-1 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); window.open(client.website!, '_blank'); }}>
                                                <ExternalLink className="w-4 h-4" /> Website
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
