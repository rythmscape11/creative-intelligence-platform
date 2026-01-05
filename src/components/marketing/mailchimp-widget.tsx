'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Users, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface MailchimpStats {
    totalSubscribers: number;
    successRate: number;
    totalSyncs: number;
    lastSync: {
        status: string;
        date: string;
        records: number;
    } | null;
}

export function MailchimpWidget() {
    const [stats, setStats] = useState<MailchimpStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            // In a real implementation, we would fetch from a dedicated stats endpoint
            // For now, we'll simulate it or use the analytics endpoint if available
            // Let's assume we have an endpoint /api/marketing/stats
            // Since we don't, we'll mock it for now to show the UI structure
            // or try to fetch from the integration analytics

            const response = await fetch('/api/integrations?type=MAILCHIMP');
            const data = await response.json();

            if (data.success && data.integrations.length > 0) {
                const integration = data.integrations[0];
                // Fetch real analytics
                const analyticsRes = await fetch(`/api/integrations/${integration.id}/analytics?days=30`);
                const analyticsData = await analyticsRes.json();

                if (analyticsData.success) {
                    const recentLogs = analyticsData.analytics.recentLogs || [];
                    const lastSyncLog = recentLogs.find((log: any) => log.type === 'SYNC');

                    setStats({
                        totalSubscribers: analyticsData.analytics.totalContactsSynced || 0,
                        successRate: Math.round(analyticsData.analytics.successRate || 0),
                        totalSyncs: analyticsData.analytics.totalSyncs || 0,
                        lastSync: lastSyncLog ? {
                            status: lastSyncLog.status,
                            date: lastSyncLog.createdAt,
                            records: lastSyncLog.recordsProcessed || 0
                        } : null
                    });
                }
            } else {
                setError('Mailchimp not connected');
            }
        } catch (err) {
            console.error('Failed to fetch Mailchimp stats:', err);
            setError('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-amber-500" />
                        Email Marketing
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-amber-500" />
                        Email Marketing
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/admin/integrations/mailchimp">Connect Mailchimp</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-amber-500" />
                        Email Marketing
                    </CardTitle>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/marketing">
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <CardDescription>Audience sync status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Synced Contacts</p>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-2xl font-bold">{stats?.totalSubscribers.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Sync Success</p>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-2xl font-bold">{stats?.successRate}%</span>
                        </div>
                    </div>
                </div>

                {stats?.lastSync && (
                    <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-muted-foreground">LAST SYNC</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${stats.lastSync.status === 'SUCCESS'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {stats.lastSync.status}
                            </span>
                        </div>
                        <p className="font-medium truncate mb-1">
                            {new Date(stats.lastSync.date).toLocaleDateString()} at {new Date(stats.lastSync.date).toLocaleTimeString()}
                        </p>
                        <div className="text-sm text-muted-foreground">
                            {stats.lastSync.records} records processed
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" asChild>
                        <Link href="/dashboard/marketing/campaigns">Create Campaign</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
