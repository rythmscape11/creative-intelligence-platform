'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart3,
    Users,
    Eye,
    Clock,
    RefreshCw,
    ExternalLink,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface GA4Metric {
    name: string;
    value: string;
}

interface GA4Row {
    dimensions?: string[];
    metrics: GA4Metric[];
}

interface GA4Report {
    rowCount?: number;
    metricHeaders: { name: string }[];
    data: GA4Row[];
}

interface GA4Integration {
    id: string;
    type: string;
    status?: string;
    settings?: {
        propertyId: string;
        measurementId: string;
    };
}

export function GA4MetricsWidget() {
    const [integration, setIntegration] = useState<GA4Integration | null>(null);
    const [reportData, setReportData] = useState<GA4Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if GA4 is connected
    useEffect(() => {
        const checkIntegration = async () => {
            try {
                const response = await fetch('/api/integrations?type=GOOGLE_ANALYTICS');
                const data = await response.json();

                if (data.success && data.integrations.length > 0) {
                    const ga = data.integrations[0];
                    if (ga.status === 'ACTIVE') {
                        setIntegration(ga);
                    }
                }
            } catch (err) {
                console.error('Failed to check GA4 integration:', err);
            } finally {
                setLoading(false);
            }
        };

        checkIntegration();
    }, []);

    // Fetch GA4 report
    const fetchReport = useCallback(async () => {
        if (!integration) return;

        try {
            setFetching(true);
            setError(null);

            const response = await fetch('/api/integrations/google-analytics/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reportType: 'standard',
                    metrics: ['activeUsers', 'sessions', 'screenPageViews', 'averageSessionDuration'],
                    dimensions: ['date'],
                    dateRange: {
                        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        endDate: new Date().toISOString().split('T')[0],
                    },
                }),
            });

            const data = await response.json();

            if (data.success && data.report) {
                setReportData(data.report);
            } else {
                setError(data.error || 'Failed to fetch GA4 data');
            }
        } catch (err) {
            setError('Failed to connect to Google Analytics');
            console.error('GA4 fetch error:', err);
        } finally {
            setFetching(false);
        }
    }, [integration]);

    // Auto-fetch when integration is available
    useEffect(() => {
        if (integration) {
            fetchReport();
        }
    }, [integration, fetchReport]);

    // Loading state
    if (loading) {
        return (
            <Card className="bg-bg-secondary border border-border-primary">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="w-6 h-6 text-text-tertiary animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Not connected state
    if (!integration) {
        return (
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20">
                <CardHeader>
                    <CardTitle className="text-text-primary text-xl font-bold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        Google Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <BarChart3 className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                        <p className="text-text-secondary mb-4">
                            Connect Google Analytics to see real traffic data
                        </p>
                        <Link
                            href="/dashboard/admin/integrations/google-analytics"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Connect GA4
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate totals from report data
    const calculateTotal = (metricIndex: number): number => {
        if (!reportData?.data) return 0;
        return reportData.data.reduce((sum, row) => {
            const value = row.metrics[metricIndex]?.value ?? '0';
            return sum + parseFloat(value || '0');
        }, 0);
    };

    const totalActiveUsers = calculateTotal(0);
    const totalSessions = calculateTotal(1);
    const totalPageViews = calculateTotal(2);
    const avgSessionDuration = reportData?.data?.length
        ? calculateTotal(3) / reportData.data.length
        : 0;

    return (
        <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-text-primary text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Google Analytics (Last 30 Days)
                </CardTitle>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchReport}
                        disabled={fetching}
                        className="p-2 rounded-lg bg-bg-tertiary border border-border-primary hover:border-border-hover transition-colors disabled:opacity-50"
                        title="Refresh data"
                    >
                        <RefreshCw className={`w-4 h-4 text-text-secondary ${fetching ? 'animate-spin' : ''}`} />
                    </button>
                    <Link
                        href="/dashboard/admin/integrations/google-analytics/reports"
                        className="p-2 rounded-lg bg-bg-tertiary border border-border-primary hover:border-border-hover transition-colors"
                        title="View full reports"
                    >
                        <ExternalLink className="w-4 h-4 text-text-secondary" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <div>
                            <p className="text-red-400 font-medium">Failed to load GA4 data</p>
                            <p className="text-text-tertiary text-sm">{error}</p>
                        </div>
                    </div>
                ) : fetching && !reportData ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-bg-tertiary/50 rounded-lg border border-border-primary">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-text-secondary">Active Users</span>
                            </div>
                            <p className="text-2xl font-bold text-text-primary">
                                {totalActiveUsers.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-bg-tertiary/50 rounded-lg border border-border-primary">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-text-secondary">Sessions</span>
                            </div>
                            <p className="text-2xl font-bold text-text-primary">
                                {totalSessions.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-bg-tertiary/50 rounded-lg border border-border-primary">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-text-secondary">Page Views</span>
                            </div>
                            <p className="text-2xl font-bold text-text-primary">
                                {totalPageViews.toLocaleString()}
                            </p>
                        </div>

                        <div className="p-4 bg-bg-tertiary/50 rounded-lg border border-border-primary">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span className="text-sm text-text-secondary">Avg. Duration</span>
                            </div>
                            <p className="text-2xl font-bold text-text-primary">
                                {Math.round(avgSessionDuration)}s
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
