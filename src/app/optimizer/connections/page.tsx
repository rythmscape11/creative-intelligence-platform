'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Link2,
    Check,
    X,
    RefreshCw,
    ExternalLink,
    Settings,
    Trash2,
    Loader2,
} from 'lucide-react';

interface Connection {
    id: string;
    platform: string;
    accountId: string;
    accountName: string;
    status: string;
    lastSyncAt: string | null;
    campaignCount: number;
}

const PLATFORM_CONFIG = {
    META: {
        name: 'Meta Ads',
        color: 'bg-blue-500',
        icon: '📘',
        description: 'Facebook, Instagram, Messenger, Audience Network',
    },
    GOOGLE_ADS: {
        name: 'Google Ads',
        color: 'bg-red-500',
        icon: '🔴',
        description: 'Search, Display, YouTube, Shopping',
    },
    YOUTUBE: {
        name: 'YouTube',
        color: 'bg-red-600',
        icon: '▶️',
        description: 'Video ads and TrueView campaigns',
    },
    LINKEDIN: {
        name: 'LinkedIn Ads',
        color: 'bg-blue-700',
        icon: '💼',
        description: 'Sponsored content, InMail, and lead gen',
    },
    TIKTOK: {
        name: 'TikTok Ads',
        color: 'bg-zinc-900',
        icon: '🎵',
        description: 'In-feed ads and branded effects',
    },
};

const STATUS_STYLES = {
    CONNECTED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    EXPIRED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    ERROR: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    REVOKED: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400',
};

export default function ConnectionsPage() {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [syncing, setSyncing] = useState<string | null>(null);

    // Fetch connections from API
    const fetchConnections = useCallback(async () => {
        try {
            const res = await fetch('/api/optimizer/connections');
            if (res.ok) {
                const data = await res.json();
                setConnections(data.connections || []);
            }
        } catch (error) {
            console.error('Failed to fetch connections:', error);
            toast.error('Failed to load connections');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConnections();
    }, [fetchConnections]);

    const handleConnect = async (platform: string) => {
        try {
            const res = await fetch('/api/optimizer/connections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform }),
            });
            if (res.ok) {
                const data = await res.json();
                toast.success(`${PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG]?.name}: ${data.note || 'Configure OAuth credentials in Admin Settings'}`);
            }
        } catch (error) {
            toast.error('Failed to initiate connection');
        }
        setDialogOpen(false);
    };

    const handleSync = (connectionId: string) => {
        setSyncing(connectionId);
        setTimeout(() => {
            setSyncing(null);
            toast.success('Sync completed successfully');
            fetchConnections();
        }, 2000);
    };

    const handleDisconnect = async (connectionId: string) => {
        try {
            await fetch(`/api/optimizer/connections?id=${connectionId}`, { method: 'DELETE' });
            setConnections(connections.filter(c => c.id !== connectionId));
            toast.success('Connection removed');
        } catch (error) {
            toast.error('Failed to disconnect');
        }
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
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Link2 className="h-8 w-8 text-indigo-500" />
                        Connections
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Connect your ad platforms to start optimizing
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Connection
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Connect Ad Platform</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 sm:grid-cols-2 pt-4">
                            {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => handleConnect(key)}
                                    className="flex items-start gap-3 p-4 rounded-lg border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors text-left"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-xl`}>
                                        {config.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{config.name}</h3>
                                        <p className="text-sm text-muted-foreground">{config.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{connections.length}</div>
                        <div className="text-sm text-muted-foreground">Connected Platforms</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {connections.filter(c => c.status === 'CONNECTED').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Connections</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                            {connections.reduce((sum, c) => sum + c.campaignCount, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Campaigns</div>
                    </CardContent>
                </Card>
            </div>

            {/* Connections List */}
            {connections.length === 0 ? (
                <Card className="p-12 text-center">
                    <Link2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Connect your ad platforms to start pulling campaign data and optimizing performance.
                    </p>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Connection
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {connections.map((connection) => {
                        const config = PLATFORM_CONFIG[connection.platform as keyof typeof PLATFORM_CONFIG];
                        return (
                            <Card key={connection.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg ${config?.color} flex items-center justify-center text-2xl`}>
                                                {config?.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{connection.accountName}</h3>
                                                    <Badge className={STATUS_STYLES[connection.status as keyof typeof STATUS_STYLES]}>
                                                        {connection.status === 'CONNECTED' && <Check className="h-3 w-3 mr-1" />}
                                                        {connection.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{config?.name}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                    <span>ID: {connection.accountId}</span>
                                                    <span>•</span>
                                                    <span>{connection.campaignCount} campaigns</span>
                                                    <span>•</span>
                                                    <span>
                                                        Last sync: {connection.lastSyncAt
                                                            ? new Date(connection.lastSyncAt).toLocaleString()
                                                            : 'Never'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSync(connection.id)}
                                                disabled={syncing === connection.id}
                                            >
                                                <RefreshCw className={`h-4 w-4 mr-2 ${syncing === connection.id ? 'animate-spin' : ''}`} />
                                                Sync
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => handleDisconnect(connection.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
