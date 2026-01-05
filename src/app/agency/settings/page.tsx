'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Building2,
    Palette,
    Bell,
    Shield,
    Link2,
    CheckCircle2,
    XCircle,
    Loader2,
    ExternalLink,
    Eye,
    EyeOff,
} from 'lucide-react';

// Ad Platform Icons (using Unicode/Emoji as placeholders)
const PLATFORM_ICONS: Record<string, string> = {
    google_ads: '🔴',
    meta_ads: '📘',
    linkedin_ads: '🔗',
    tiktok_ads: '🎵',
    twitter_ads: '🐦',
    pinterest_ads: '📌',
    snapchat_ads: '👻',
    amazon_ads: '📦',
    microsoft_ads: '🪟',
};

interface PlatformConnection {
    id: string;
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
    envVars: string[];
    docsUrl: string;
    color: string;
}

const AD_PLATFORMS: PlatformConnection[] = [
    {
        id: 'google_ads',
        name: 'Google Ads',
        description: 'Connect to Google Ads for search, display, and video campaigns',
        status: 'disconnected',
        envVars: ['GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_REFRESH_TOKEN'],
        docsUrl: 'https://developers.google.com/google-ads/api/docs/start',
        color: 'bg-red-500',
    },
    {
        id: 'meta_ads',
        name: 'Meta (Facebook) Ads',
        description: 'Manage Facebook and Instagram ad campaigns',
        status: 'disconnected',
        envVars: ['META_ADS_ACCESS_TOKEN', 'META_ADS_APP_ID', 'META_ADS_ACCOUNT_ID'],
        docsUrl: 'https://developers.facebook.com/docs/marketing-api',
        color: 'bg-blue-600',
    },
    {
        id: 'linkedin_ads',
        name: 'LinkedIn Ads',
        description: 'B2B advertising on LinkedIn platform',
        status: 'disconnected',
        envVars: ['LINKEDIN_ADS_CLIENT_ID', 'LINKEDIN_ADS_CLIENT_SECRET', 'LINKEDIN_ADS_ACCESS_TOKEN'],
        docsUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/',
        color: 'bg-blue-700',
    },
    {
        id: 'tiktok_ads',
        name: 'TikTok Ads',
        description: 'Short-form video advertising on TikTok',
        status: 'disconnected',
        envVars: ['TIKTOK_ADS_APP_ID', 'TIKTOK_ADS_SECRET', 'TIKTOK_ADS_ACCESS_TOKEN'],
        docsUrl: 'https://business-api.tiktok.com/portal/docs',
        color: 'bg-zinc-900',
    },
    {
        id: 'twitter_ads',
        name: 'X (Twitter) Ads',
        description: 'Advertising on X/Twitter platform',
        status: 'disconnected',
        envVars: ['TWITTER_ADS_API_KEY', 'TWITTER_ADS_API_SECRET', 'TWITTER_ADS_ACCESS_TOKEN'],
        docsUrl: 'https://developer.twitter.com/en/docs/twitter-ads-api',
        color: 'bg-sky-500',
    },
    {
        id: 'pinterest_ads',
        name: 'Pinterest Ads',
        description: 'Visual discovery and shopping ads',
        status: 'disconnected',
        envVars: ['PINTEREST_ADS_ACCESS_TOKEN', 'PINTEREST_ADS_AD_ACCOUNT_ID'],
        docsUrl: 'https://developers.pinterest.com/docs/getting-started/introduction/',
        color: 'bg-red-600',
    },
    {
        id: 'snapchat_ads',
        name: 'Snapchat Ads',
        description: 'Reach Gen Z with Snap Ads',
        status: 'disconnected',
        envVars: ['SNAPCHAT_ADS_ACCESS_TOKEN', 'SNAPCHAT_ADS_AD_ACCOUNT_ID'],
        docsUrl: 'https://developers.snap.com/marketing-api',
        color: 'bg-yellow-400',
    },
    {
        id: 'amazon_ads',
        name: 'Amazon Ads',
        description: 'Sponsored products and display ads',
        status: 'disconnected',
        envVars: ['AMAZON_ADS_CLIENT_ID', 'AMAZON_ADS_CLIENT_SECRET', 'AMAZON_ADS_REFRESH_TOKEN'],
        docsUrl: 'https://advertising.amazon.com/API/docs',
        color: 'bg-orange-500',
    },
    {
        id: 'microsoft_ads',
        name: 'Microsoft Ads (Bing)',
        description: 'Search advertising on Bing and Microsoft network',
        status: 'disconnected',
        envVars: ['MICROSOFT_ADS_CLIENT_ID', 'MICROSOFT_ADS_DEVELOPER_TOKEN', 'MICROSOFT_ADS_REFRESH_TOKEN'],
        docsUrl: 'https://learn.microsoft.com/en-us/advertising/guides/',
        color: 'bg-cyan-600',
    },
];

export default function SettingsPage() {
    const [platforms, setPlatforms] = useState<PlatformConnection[]>(AD_PLATFORMS);
    const [checking, setChecking] = useState<string | null>(null);
    const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});

    useEffect(() => {
        checkPlatformConnections();
    }, []);

    const checkPlatformConnections = async () => {
        // Check Google Ads
        try {
            const googleRes = await fetch('/api/agency/ads/google');
            const googleData = await googleRes.json();
            updatePlatformStatus('google_ads', googleData.configured ? 'connected' : 'disconnected');
        } catch { updatePlatformStatus('google_ads', 'error'); }

        // Check Meta Ads
        try {
            const metaRes = await fetch('/api/agency/ads/meta');
            const metaData = await metaRes.json();
            updatePlatformStatus('meta_ads', metaData.configured ? 'connected' : 'disconnected');
        } catch { updatePlatformStatus('meta_ads', 'error'); }
    };

    const updatePlatformStatus = (id: string, status: 'connected' | 'disconnected' | 'error') => {
        setPlatforms(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const toggleCredentials = (id: string) => {
        setShowCredentials(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const testConnection = async (platformId: string) => {
        setChecking(platformId);
        await new Promise(r => setTimeout(r, 1500)); // Simulate check
        setChecking(null);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Settings className="h-8 w-8 text-zinc-500" />
                    Settings
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Configure your Agency OS workspace and ad platform connections.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Ad Platform Connections - NEW */}
                <Card className="border-2 border-blue-200 dark:border-blue-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="h-5 w-5 text-blue-600" />
                            Ad Platform Connections
                            <Badge variant="secondary" className="ml-2">
                                {platforms.filter(p => p.status === 'connected').length} / {platforms.length}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Connect your advertising platforms to sync campaigns and metrics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3">
                            {platforms.map((platform) => (
                                <div
                                    key={platform.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                                            {PLATFORM_ICONS[platform.id]}
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-2">
                                                {platform.name}
                                                {platform.status === 'connected' && (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                )}
                                                {platform.status === 'error' && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{platform.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleCredentials(platform.id)}
                                        >
                                            {showCredentials[platform.id] ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <a href={platform.docsUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" size="sm">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </a>
                                        <Button
                                            variant={platform.status === 'connected' ? 'outline' : 'default'}
                                            size="sm"
                                            onClick={() => testConnection(platform.id)}
                                            disabled={checking === platform.id}
                                        >
                                            {checking === platform.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : platform.status === 'connected' ? (
                                                'Reconnect'
                                            ) : (
                                                'Connect'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>How to connect:</strong> Add the required environment variables to your deployment (Vercel, etc.)
                                or <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code> file.
                                Click the eye icon to see required variables for each platform.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Agency Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Agency Profile
                        </CardTitle>
                        <CardDescription>Basic information about your agency.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Agency Name</Label>
                                <Input placeholder="Acme Agency" defaultValue="" />
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input placeholder="https://acme.agency" defaultValue="" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Agency Email</Label>
                            <Input placeholder="hello@acme.agency" defaultValue="" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize the look of your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Theme</p>
                                <p className="text-sm text-zinc-500">System preference is currently in use.</p>
                            </div>
                            <Button variant="outline" disabled>Coming Soon</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Manage email and in-app notifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Email Reports</p>
                                <p className="text-sm text-zinc-500">Receive weekly summary emails.</p>
                            </div>
                            <Button variant="outline" disabled>Coming Soon</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security
                        </CardTitle>
                        <CardDescription>Manage team access and permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Team Members</p>
                                <p className="text-sm text-zinc-500">Invite team members and manage roles.</p>
                            </div>
                            <Button variant="outline" disabled>Coming Soon</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
