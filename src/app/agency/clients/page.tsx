'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Building2, ExternalLink, Database, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgencyListSkeleton } from '@/components/agency/AgencySkeletons';
import Link from 'next/link';

interface Client {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'LEAD';
    createdAt: string;
    _count: { projects: number };
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        status: 'ACTIVE',
    });

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/agency/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error('Failed to fetch clients', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/agency/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Failed to create client');
            }

            toast.success('Client added successfully');
            setIsDialogOpen(false);
            setFormData({ name: '', industry: '', website: '', status: 'ACTIVE' });

            // Refetch clients to update the list
            await fetchClients();
        } catch (error) {
            console.error('Create client error:', error);
            toast.error(error instanceof Error ? error.message : 'Error creating client');
            setLoading(false);
        }
    };

    const handleSeedDemoData = async () => {
        setSeeding(true);
        try {
            const res = await fetch('/api/agency/seed-demo', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to seed demo data');
            }

            toast.success(`Demo data created! ${data.summary}`);
            await fetchClients();
        } catch (error) {
            console.error('Seed demo data error:', error);
            toast.error(error instanceof Error ? error.message : 'Error seeding demo data');
        } finally {
            setSeeding(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Clients</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your agency&apos;s client roster.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Seed Demo Data Button */}
                    <Button
                        variant="outline"
                        onClick={handleSeedDemoData}
                        disabled={seeding}
                    >
                        {seeding ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Seeding...
                            </>
                        ) : (
                            <>
                                <Database className="h-4 w-4 mr-2" />
                                Seed Demo Data
                            </>
                        )}
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" /> Add Client
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Client</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Acme Corp"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        value={formData.industry}
                                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                        placeholder="Technology"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://acme.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={val => setFormData({ ...formData, status: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="LEAD">Lead</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full">Create Client</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full md:w-96">
                <Search className="h-4 w-4 text-zinc-400" />
                <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border-none bg-transparent focus-visible:ring-0 h-auto p-0"
                />
            </div>

            {loading ? (
                <AgencyListSkeleton count={6} />
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <Building2 className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No clients found</h3>
                    <p className="text-zinc-500 mb-4">Get started by adding your first client or seed demo data.</p>
                    <div className="flex items-center justify-center gap-2">
                        <Button onClick={handleSeedDemoData} variant="outline" disabled={seeding}>
                            {seeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                            Seed Demo Data
                        </Button>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Client
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((client) => (
                        <Link key={client.id} href={`/agency/clients/${client.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="font-semibold text-lg truncate">
                                        {client.name}
                                    </CardTitle>
                                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        client.status === 'LEAD' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-zinc-100 text-zinc-700'
                                        }`}>
                                        {client.status}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-2 text-sm text-zinc-500">
                                        <div className="flex items-center justify-between">
                                            <span>Industry:</span>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-200">{client.industry || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Active Projects:</span>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-200">{client._count?.projects || 0}</span>
                                        </div>
                                        {client.website && (
                                            <a
                                                href={client.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-500 mt-2 text-xs"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Visit Website <ExternalLink className="h-3 w-3" />
                                            </a>
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
