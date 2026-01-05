/**
 * Integrations Hub Page
 * Connect Agency OS with external tools
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Plug,
    Search,
    Check,
    ExternalLink,
    Settings,
    Plus,
    Zap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Integration {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    connected: boolean;
    popular: boolean;
}

const INTEGRATIONS: Integration[] = [
    // Communication
    { id: 'slack', name: 'Slack', description: 'Send notifications and updates to Slack channels', category: 'Communication', icon: '💬', connected: true, popular: true },
    { id: 'teams', name: 'Microsoft Teams', description: 'Sync with Teams for collaboration', category: 'Communication', icon: '👥', connected: false, popular: true },
    { id: 'discord', name: 'Discord', description: 'Connect to Discord servers', category: 'Communication', icon: '🎮', connected: false, popular: false },

    // Productivity
    { id: 'google', name: 'Google Workspace', description: 'Sync with Drive, Calendar, and Gmail', category: 'Productivity', icon: '📊', connected: true, popular: true },
    { id: 'notion', name: 'Notion', description: 'Sync pages and databases', category: 'Productivity', icon: '📝', connected: false, popular: true },
    { id: 'figma', name: 'Figma', description: 'Import designs and assets', category: 'Design', icon: '🎨', connected: true, popular: true },

    // Marketing
    { id: 'hubspot', name: 'HubSpot', description: 'Sync contacts and campaigns', category: 'CRM', icon: '🔶', connected: false, popular: true },
    { id: 'salesforce', name: 'Salesforce', description: 'Connect to Salesforce CRM', category: 'CRM', icon: '☁️', connected: false, popular: true },
    { id: 'mailchimp', name: 'Mailchimp', description: 'Sync email campaigns', category: 'Marketing', icon: '📧', connected: false, popular: true },

    // Ads
    { id: 'google-ads', name: 'Google Ads', description: 'Manage Google Ads campaigns', category: 'Advertising', icon: '📢', connected: true, popular: true },
    { id: 'meta-ads', name: 'Meta Ads', description: 'Facebook & Instagram ads', category: 'Advertising', icon: '📱', connected: true, popular: true },
    { id: 'linkedin-ads', name: 'LinkedIn Ads', description: 'LinkedIn advertising', category: 'Advertising', icon: '💼', connected: false, popular: false },

    // Analytics
    { id: 'ga4', name: 'Google Analytics 4', description: 'Track website analytics', category: 'Analytics', icon: '📈', connected: true, popular: true },
    { id: 'mixpanel', name: 'Mixpanel', description: 'Product analytics', category: 'Analytics', icon: '🔬', connected: false, popular: false },

    // Development
    { id: 'github', name: 'GitHub', description: 'Sync with repositories', category: 'Development', icon: '🐙', connected: false, popular: true },
    { id: 'jira', name: 'Jira', description: 'Sync with Jira issues', category: 'Development', icon: '🎯', connected: false, popular: true },

    // Automation
    { id: 'zapier', name: 'Zapier', description: 'Connect 5000+ apps', category: 'Automation', icon: '⚡', connected: false, popular: true },
    { id: 'make', name: 'Make (Integromat)', description: 'Visual automation workflows', category: 'Automation', icon: '🔄', connected: false, popular: false },
];

const CATEGORIES = [...new Set(INTEGRATIONS.map(i => i.category))];

export default function IntegrationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [integrations, setIntegrations] = useState(INTEGRATIONS);

    const filteredIntegrations = integrations.filter(int => {
        const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            int.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || int.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const connectedCount = integrations.filter(i => i.connected).length;

    const toggleConnection = (id: string) => {
        setIntegrations(prev => prev.map(int =>
            int.id === id ? { ...int, connected: !int.connected } : int
        ));
        const integration = integrations.find(i => i.id === id);
        if (integration?.connected) {
            toast.success(`Disconnected from ${integration.name}`);
        } else {
            toast.success(`Connected to ${integration?.name}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Plug className="h-6 w-6 text-purple-500" />
                        Integrations
                    </h1>
                    <p className="text-muted-foreground">
                        {connectedCount} connected • {integrations.length} available
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Request Integration
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{integrations.length}</div>
                        <div className="text-sm text-muted-foreground">Available</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
                        <div className="text-sm text-muted-foreground">Connected</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{CATEGORIES.length}</div>
                        <div className="text-sm text-muted-foreground">Categories</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-amber-600">5000+</div>
                        <div className="text-sm text-muted-foreground">Via Zapier</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search integrations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Connected Integrations */}
            {!searchQuery && !selectedCategory && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Connected</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {integrations.filter(i => i.connected).map(int => (
                            <Card key={int.id} className="border-green-500/30 bg-green-50/30 dark:bg-green-950/10">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{int.icon}</div>
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {int.name}
                                                    <Check className="h-4 w-4 text-green-600" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">{int.description}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* All Integrations */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                    {searchQuery || selectedCategory ? 'Results' : 'All Integrations'}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredIntegrations.map(int => (
                        <Card
                            key={int.id}
                            className={`transition-all hover:border-purple-500/50 ${int.connected ? 'border-green-500/30' : ''
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{int.icon}</div>
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                {int.name}
                                                {int.popular && (
                                                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="text-xs mt-1">
                                                {int.category}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{int.description}</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant={int.connected ? 'outline' : 'default'}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => toggleConnection(int.id)}
                                    >
                                        {int.connected ? 'Disconnect' : 'Connect'}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
