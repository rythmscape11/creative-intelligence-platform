'use client';

import { useEffect, useState } from 'react';
import { Zap, Workflow, Key, Webhook, Activity, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface DashboardStats {
    totalFlows: number;
    publishedFlows: number;
    totalRuns: number;
    runsLast24h: number;
    runsLast7d: number;
    sparksUsedLast24h: number;
    sparksUsedLast7d: number;
    successRate: number;
    activeApiKeys: number;
    activeWebhooks: number;
}

export default function ForgePage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/forge/metrics?type=dashboard');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats ? [
        {
            label: 'Total Flows',
            value: stats.totalFlows,
            subValue: `${stats.publishedFlows} published`,
            icon: Workflow,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
        {
            label: 'Runs (24h)',
            value: stats.runsLast24h,
            subValue: `${stats.runsLast7d} this week`,
            icon: Activity,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
        },
        {
            label: 'Sparks Used (24h)',
            value: stats.sparksUsedLast24h,
            subValue: `${stats.sparksUsedLast7d} this week`,
            icon: Zap,
            color: 'text-[#3B82F6]',
            bgColor: 'bg-[#3B82F6]/10',
        },
        {
            label: 'Success Rate',
            value: `${stats.successRate}%`,
            subValue: 'Last 7 days',
            icon: stats.successRate >= 90 ? CheckCircle : TrendingUp,
            color: stats.successRate >= 90 ? 'text-emerald-400' : 'text-orange-400',
            bgColor: stats.successRate >= 90 ? 'bg-emerald-500/10' : 'bg-orange-500/10',
        },
        {
            label: 'Active API Keys',
            value: stats.activeApiKeys,
            subValue: 'Across environments',
            icon: Key,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
        },
        {
            label: 'Active Webhooks',
            value: stats.activeWebhooks,
            subValue: 'Ready to trigger',
            icon: Webhook,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
        },
    ] : [];

    return (
        <div className="p-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#A78BFA]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#F1F5F9]">Aureon Forge</h1>
                        <p className="text-sm text-[#94A3B8]">Agentic Dev & Automation Studio</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
                            <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
                            <div className="h-8 bg-white/10 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <p className="text-sm font-medium text-[#94A3B8]">{card.label}</p>
                                <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                                    <card.icon className={`w-4 h-4 ${card.color}`} />
                                </div>
                            </div>
                            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                            <p className="text-xs text-[#64748B] mt-1">{card.subValue}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-[#F1F5F9] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/forge/flows"
                        className="flex items-center gap-4 bg-gradient-to-r from-[#3B82F6]/20 to-transparent border border-[#3B82F6]/30 rounded-xl p-4 hover:bg-[#3B82F6]/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
                            <Workflow className="w-6 h-6 text-[#3B82F6]" />
                        </div>
                        <div>
                            <p className="font-medium text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors">Create Flow</p>
                            <p className="text-sm text-[#94A3B8]">Build automation pipelines</p>
                        </div>
                    </a>

                    <a
                        href="/forge/api-keys"
                        className="flex items-center gap-4 bg-gradient-to-r from-[#A78BFA]/20 to-transparent border border-[#A78BFA]/30 rounded-xl p-4 hover:bg-[#A78BFA]/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#A78BFA]/20 flex items-center justify-center">
                            <Key className="w-6 h-6 text-[#A78BFA]" />
                        </div>
                        <div>
                            <p className="font-medium text-[#F1F5F9] group-hover:text-[#A78BFA] transition-colors">Generate API Key</p>
                            <p className="text-sm text-[#94A3B8]">Access Forge APIs</p>
                        </div>
                    </a>

                    <a
                        href="/developers/docs"
                        className="flex items-center gap-4 bg-gradient-to-r from-[#10B981]/20 to-transparent border border-[#10B981]/30 rounded-xl p-4 hover:bg-[#10B981]/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-[#F1F5F9] group-hover:text-[#10B981] transition-colors">View Docs</p>
                            <p className="text-sm text-[#94A3B8]">API reference & guides</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
