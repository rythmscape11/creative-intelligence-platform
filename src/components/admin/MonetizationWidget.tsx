'use client';

/**
 * Monetization Widget
 * 
 * Shows conversion signals for the admin dashboard.
 * Displays upgrade clicks, paywall hits, trial status, etc.
 */

import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Users, Mail, Zap, BarChart } from 'lucide-react';

interface MonetizationData {
    summary: {
        upgradeClicks: number;
        paywallHits: number;
        limitsReached: number;
        nudgesShown: number;
        emailsCaptured: number;
        trialExpiringSoon: number;
        freeUsersAtLimit: number;
    };
    period: string;
}

export function MonetizationWidget() {
    const [data, setData] = useState<MonetizationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/admin/monetization-events?days=7');
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError('Failed to load monetization data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
                <div className="animate-pulse">
                    <div className="h-6 w-48 bg-slate-700 rounded mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 bg-slate-700 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
                <p className="text-red-400">{error || 'No data available'}</p>
            </div>
        );
    }

    const metrics = [
        {
            label: 'Upgrade Clicks',
            value: data.summary.upgradeClicks,
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20',
        },
        {
            label: 'Paywall Hits',
            value: data.summary.paywallHits,
            icon: Zap,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/20',
        },
        {
            label: 'Limits Reached',
            value: data.summary.limitsReached,
            icon: AlertTriangle,
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
        },
        {
            label: 'Emails Captured',
            value: data.summary.emailsCaptured,
            icon: Mail,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
        },
    ];

    const alerts = [
        {
            label: 'Trials Expiring (3 days)',
            value: data.summary.trialExpiringSoon,
            urgent: data.summary.trialExpiringSoon > 0,
        },
        {
            label: 'Free Users at Limit',
            value: data.summary.freeUsersAtLimit,
            urgent: data.summary.freeUsersAtLimit > 5,
        },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-white">Conversion Signals</h3>
                </div>
                <span className="text-sm text-slate-400">Last {data.period}</span>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="bg-slate-900/50 rounded-lg p-4"
                    >
                        <div className={`${metric.bgColor} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-white">{metric.value}</p>
                        <p className="text-sm text-slate-400">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Alerts */}
            <div className="border-t border-slate-700 pt-4">
                <p className="text-sm font-medium text-slate-400 mb-3">Attention Required</p>
                <div className="flex flex-wrap gap-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.label}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${alert.urgent
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">{alert.value}</span>
                            <span className="text-sm">{alert.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
