/**
 * Enhanced Client Portal Page
 * White-label portal for client collaboration
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Globe,
    Users,
    FileText,
    MessageSquare,
    CheckSquare,
    Settings,
    ExternalLink,
    Copy,
    Palette,
    Lock,
    Bell,
    Eye,
    Loader2,
    Plus,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PortalClient {
    id: string;
    name: string;
    email?: string;
    company?: string;
    portalUrl: string;
    customDomain?: string;
    branding: {
        primaryColor: string;
        logo?: string;
    };
    features: string[];
    lastAccess?: string;
    strategiesCount: number;
}

const PORTAL_FEATURES = [
    { id: 'projects', label: 'Project Progress', icon: CheckSquare },
    { id: 'files', label: 'File Sharing', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'approvals', label: 'Approvals', icon: Eye },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText },
];

export default function PortalPage() {
    const [clients, setClients] = useState<PortalClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState<PortalClient | null>(null);

    // Fetch clients from API
    const fetchClients = useCallback(async () => {
        try {
            const res = await fetch('/api/agency/portal');
            if (res.ok) {
                const data = await res.json();
                setClients(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch portal clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const copyPortalLink = (url: string) => {
        navigator.clipboard.writeText(`https://${url}`);
        toast.success('Portal link copied!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Globe className="h-6 w-6 text-cyan-500" />
                        Client Portal
                    </h1>
                    <p className="text-muted-foreground">
                        White-label portals for client collaboration
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Settings className="h-4 w-4" />
                            Portal Settings
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Portal Settings</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">Enable Notifications</div>
                                    <div className="text-sm text-muted-foreground">Send email updates to clients</div>
                                </div>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">Auto-sync Projects</div>
                                    <div className="text-sm text-muted-foreground">Update portal when projects change</div>
                                </div>
                                <input type="checkbox" defaultChecked className="rounded" />
                            </div>
                            <Button className="w-full" onClick={() => toast.success('Settings saved!')}>Save Settings</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{clients.length}</div>
                        <div className="text-sm text-muted-foreground">Active Portals</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">1</div>
                        <div className="text-sm text-muted-foreground">Custom Domain</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">247</div>
                        <div className="text-sm text-muted-foreground">Client Logins</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="portals">
                <TabsList>
                    <TabsTrigger value="portals" className="gap-2">
                        <Users className="h-4 w-4" />
                        Client Portals
                    </TabsTrigger>
                    <TabsTrigger value="customize" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Customize
                    </TabsTrigger>
                    <TabsTrigger value="access" className="gap-2">
                        <Lock className="h-4 w-4" />
                        Access Control
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="portals" className="space-y-6 mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {clients.map(client => (
                            <Card
                                key={client.id}
                                className="cursor-pointer hover:border-cyan-500/50 transition-all"
                                onClick={() => setSelectedClient(client)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                                style={{ backgroundColor: client.branding.primaryColor }}
                                            >
                                                {client.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{client.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {client.customDomain ? '🔗 Custom Domain' : '🌐 Subdomain'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {client.features.map(f => (
                                            <Badge key={f} variant="secondary" className="text-xs">
                                                {f}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyPortalLink(client.customDomain || client.portalUrl);
                                            }}
                                        >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copy Link
                                        </Button>
                                        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {client.lastAccess && (
                                        <div className="text-xs text-muted-foreground mt-2">
                                            Last accessed: {client.lastAccess.toLocaleDateString()}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="customize" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Portal Branding</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Agency Logo</label>
                                <div className="mt-2 p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                                    Drag & drop or click to upload
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium">Primary Color</label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input type="color" defaultValue="#6366F1" className="w-12 h-10 rounded" />
                                        <input type="text" defaultValue="#6366F1" className="flex-1 px-3 py-2 border rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Custom Footer</label>
                                    <input
                                        type="text"
                                        placeholder="© 2025 Your Agency"
                                        className="mt-2 w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                            </div>
                            <Button>Save Branding</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Portal Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {PORTAL_FEATURES.map(feature => (
                                    <div
                                        key={feature.id}
                                        className="flex items-center gap-3 p-3 border rounded-lg"
                                    >
                                        <feature.icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="flex-1">{feature.label}</span>
                                        <input type="checkbox" defaultChecked className="rounded" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="access" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Access Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">Two-Factor Authentication</div>
                                    <div className="text-sm text-muted-foreground">Require 2FA for client logins</div>
                                </div>
                                <input type="checkbox" className="rounded" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">Session Timeout</div>
                                    <div className="text-sm text-muted-foreground">Auto-logout after inactivity</div>
                                </div>
                                <select className="px-3 py-2 border rounded-md text-sm">
                                    <option>1 hour</option>
                                    <option>4 hours</option>
                                    <option>24 hours</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <div className="font-medium">IP Restriction</div>
                                    <div className="text-sm text-muted-foreground">Limit access to specific IPs</div>
                                </div>
                                <Button variant="outline" size="sm">Configure</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
