'use client';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

interface MetricsData {
    revenue: {
        total: number;
        last30Days: number;
        byFramework: { name: string; revenue: number; count: number }[];
    };
    sales: {
        total: number;
        last30Days: number;
        pending: number;
        failed: number;
    };
    topFramework: { name: string; revenue: number } | null;
}

export default function MetricsDashboardPage() {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

    useEffect(() => {
        fetchMetrics();
    }, [period]);

    const fetchMetrics = async () => {
        try {
            const res = await fetch(`/api/admin/metrics?period=${period}`);
            if (res.ok) {
                const data = await res.json();
                setMetrics(data);
            }
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount / 100);
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="grid grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Metrics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track revenue, sales, and system health</p>
                </div>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d', 'all'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {p === 'all' ? 'Lifetime' : p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(metrics?.revenue.total || 0)}
                        </p>
                    </div>
                </div>

                {/* Revenue Last 30 Days */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (30 days)</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(metrics?.revenue.last30Days || 0)}
                        </p>
                    </div>
                </div>

                {/* Total Purchases */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchases</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {metrics?.sales.total || 0}
                        </p>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending / Failed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {metrics?.sales.pending || 0} / {metrics?.sales.failed || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Revenue by Framework */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Revenue by Framework
                </h2>

                {metrics?.revenue.byFramework && metrics.revenue.byFramework.length > 0 ? (
                    <div className="space-y-4">
                        {metrics.revenue.byFramework.map((framework, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{framework.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{framework.count} sales</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(framework.revenue)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No sales data yet</p>
                )}
            </div>
        </div>
    );
}
