'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign, Users, TrendingUp, TrendingDown,
    Building2, Lightbulb, Search as SearchIcon, BarChart3,
    ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';

// Types
interface ProductMetrics {
    product: string;
    mrr: number;
    arr: number;
    activeSubscriptions: {
        starter: number;
        pro: number;
        agency: number;
        total: number;
    };
    changes: {
        newSignups: number;
        churned: number;
        upgrades: number;
        downgrades: number;
    };
}

interface OverallMetrics {
    totalMrr: number;
    totalArr: number;
    totalSubscriptions: number;
    arpu: number;
    churnRate: number;
    mrrGrowth: number;
}

const productColors = {
    AGENCY_OS: 'bg-indigo-600',
    OPTIMISER: 'bg-emerald-600',
    ANALYSER: 'bg-amber-600',
    STRATEGISER: 'bg-violet-600',
};

const productIcons = {
    AGENCY_OS: Building2,
    OPTIMISER: TrendingUp,
    ANALYSER: SearchIcon,
    STRATEGISER: Lightbulb,
};

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [overall, setOverall] = useState<OverallMetrics | null>(null);
    const [products, setProducts] = useState<ProductMetrics[]>([]);
    const [period, setPeriod] = useState('30d');

    useEffect(() => {
        fetchMetrics();
    }, [period]);

    async function fetchMetrics() {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/analytics?period=${period}`);
            if (response.ok) {
                const data = await response.json();
                setOverall(data.overall);
                setProducts(data.products);
            } else {
                // Use demo data if API not ready
                setOverall({
                    totalMrr: 24850,
                    totalArr: 298200,
                    totalSubscriptions: 342,
                    arpu: 72.66,
                    churnRate: 3.2,
                    mrrGrowth: 12.5,
                });
                setProducts([
                    {
                        product: 'AGENCY_OS',
                        mrr: 8500,
                        arr: 102000,
                        activeSubscriptions: { starter: 45, pro: 78, agency: 23, total: 146 },
                        changes: { newSignups: 12, churned: 3, upgrades: 8, downgrades: 2 },
                    },
                    {
                        product: 'OPTIMISER',
                        mrr: 7200,
                        arr: 86400,
                        activeSubscriptions: { starter: 32, pro: 54, agency: 18, total: 104 },
                        changes: { newSignups: 9, churned: 2, upgrades: 5, downgrades: 1 },
                    },
                    {
                        product: 'ANALYSER',
                        mrr: 5400,
                        arr: 64800,
                        activeSubscriptions: { starter: 28, pro: 42, agency: 12, total: 82 },
                        changes: { newSignups: 7, churned: 2, upgrades: 4, downgrades: 1 },
                    },
                    {
                        product: 'STRATEGISER',
                        mrr: 3750,
                        arr: 45000,
                        activeSubscriptions: { starter: 65, pro: 38, agency: 7, total: 110 },
                        changes: { newSignups: 15, churned: 4, upgrades: 6, downgrades: 2 },
                    },
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Analytics</h1>
                        <p className="text-slate-400 mt-1">Revenue, subscriptions, and usage metrics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="365d">Last 12 months</option>
                        </select>
                        <button
                            onClick={fetchMetrics}
                            className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 hover:bg-slate-700 transition-colors"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Overall KPIs */}
                {overall && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                        <KPICard
                            title="Total MRR"
                            value={`$${overall.totalMrr.toLocaleString()}`}
                            change={overall.mrrGrowth}
                            icon={DollarSign}
                        />
                        <KPICard
                            title="Total ARR"
                            value={`$${overall.totalArr.toLocaleString()}`}
                            icon={BarChart3}
                        />
                        <KPICard
                            title="Active Subs"
                            value={overall.totalSubscriptions.toString()}
                            icon={Users}
                        />
                        <KPICard
                            title="ARPU"
                            value={`$${overall.arpu.toFixed(2)}`}
                            icon={TrendingUp}
                        />
                        <KPICard
                            title="Churn Rate"
                            value={`${overall.churnRate}%`}
                            isNegative
                            icon={TrendingDown}
                        />
                        <KPICard
                            title="MRR Growth"
                            value={`${overall.mrrGrowth}%`}
                            change={overall.mrrGrowth}
                            icon={TrendingUp}
                        />
                    </div>
                )}

                {/* Product Breakdown */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">By Product</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {products.map((product) => {
                            const Icon = productIcons[product.product as keyof typeof productIcons] || Building2;
                            const color = productColors[product.product as keyof typeof productColors] || 'bg-slate-600';

                            return (
                                <div
                                    key={product.product}
                                    className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`${color} p-2 rounded-lg`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {product.product.replace('_', ' ')}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm text-slate-400">MRR</p>
                                            <p className="text-2xl font-bold text-white">
                                                ${product.mrr.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">ARR</p>
                                            <p className="text-2xl font-bold text-white">
                                                ${product.arr.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-sm text-slate-400 mb-2">Subscriptions by Tier</p>
                                        <div className="flex gap-4">
                                            <div className="text-center">
                                                <p className="text-xl font-semibold text-white">{product.activeSubscriptions.starter}</p>
                                                <p className="text-xs text-slate-500">Starter</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-semibold text-white">{product.activeSubscriptions.pro}</p>
                                                <p className="text-xs text-slate-500">Pro</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-semibold text-white">{product.activeSubscriptions.agency}</p>
                                                <p className="text-xs text-slate-500">Agency</p>
                                            </div>
                                            <div className="text-center border-l border-slate-700 pl-4">
                                                <p className="text-xl font-bold text-white">{product.activeSubscriptions.total}</p>
                                                <p className="text-xs text-slate-500">Total</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-700">
                                        <MetricBadge label="New" value={product.changes.newSignups} positive />
                                        <MetricBadge label="Churned" value={product.changes.churned} negative />
                                        <MetricBadge label="Upgrades" value={product.changes.upgrades} positive />
                                        <MetricBadge label="Downgrades" value={product.changes.downgrades} negative />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Revenue Distribution */}
                <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h2>
                    <div className="flex h-8 rounded-lg overflow-hidden">
                        {products.map((product) => {
                            const color = productColors[product.product as keyof typeof productColors] || 'bg-slate-600';
                            const percentage = overall ? (product.mrr / overall.totalMrr) * 100 : 0;

                            return (
                                <div
                                    key={product.product}
                                    className={`${color} flex items-center justify-center text-xs font-medium text-white`}
                                    style={{ width: `${percentage}%` }}
                                    title={`${product.product.replace('_', ' ')}: ${percentage.toFixed(1)}%`}
                                >
                                    {percentage > 10 && `${percentage.toFixed(0)}%`}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-4">
                        {products.map((product) => {
                            const color = productColors[product.product as keyof typeof productColors] || 'bg-slate-600';
                            return (
                                <div key={product.product} className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded ${color}`} />
                                    <span className="text-xs text-slate-400">{product.product.replace('_', ' ')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/users"
                        className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700 hover:ring-indigo-500 transition-all"
                    >
                        <h3 className="text-lg font-semibold text-white">User Management</h3>
                        <p className="text-sm text-slate-400 mt-2">View and manage user accounts</p>
                    </a>
                    <a
                        href="/admin/subscriptions"
                        className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700 hover:ring-indigo-500 transition-all"
                    >
                        <h3 className="text-lg font-semibold text-white">Subscription Management</h3>
                        <p className="text-sm text-slate-400 mt-2">View and manage subscriptions</p>
                    </a>
                    <a
                        href="/admin/pricing"
                        className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700 hover:ring-indigo-500 transition-all"
                    >
                        <h3 className="text-lg font-semibold text-white">Pricing Configuration</h3>
                        <p className="text-sm text-slate-400 mt-2">Adjust plans and pricing</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

// Components

function KPICard({
    title,
    value,
    change,
    isNegative,
    icon: Icon,
}: {
    title: string;
    value: string;
    change?: number;
    isNegative?: boolean;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="bg-slate-800 rounded-xl p-4 ring-1 ring-slate-700">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{title}</span>
                <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change !== undefined && (
                <div className={`flex items-center gap-1 mt-1 text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(change)}%
                </div>
            )}
            {isNegative && !change && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-400">
                    <TrendingDown className="h-4 w-4" />
                </div>
            )}
        </div>
    );
}

function MetricBadge({
    label,
    value,
    positive,
    negative,
}: {
    label: string;
    value: number;
    positive?: boolean;
    negative?: boolean;
}) {
    return (
        <div className="text-center">
            <p className={`text-lg font-semibold ${positive ? 'text-emerald-400' : negative ? 'text-red-400' : 'text-white'}`}>
                {positive && '+'}{value}
            </p>
            <p className="text-xs text-slate-500">{label}</p>
        </div>
    );
}
