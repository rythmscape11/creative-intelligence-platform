'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    PRODUCTS,
    ProductType,
    formatPrice,
    getProductPlan
} from '@/config/product-plans';
import {
    Building2, TrendingUp, Search, Lightbulb,
    Check, CreditCard, Calendar, ArrowUpRight,
    RefreshCw, AlertCircle, Plus
} from 'lucide-react';

interface Subscription {
    product: ProductType;
    tier: string;
    status: string;
    interval: string;
    currentPeriodEnd: string;
}

const productIcons = {
    AGENCY_OS: Building2,
    OPTIMISER: TrendingUp,
    ANALYSER: Search,
    STRATEGISER: Lightbulb,
};

const productColors = {
    AGENCY_OS: 'bg-indigo-600',
    OPTIMISER: 'bg-emerald-600',
    ANALYSER: 'bg-amber-600',
    STRATEGISER: 'bg-violet-600',
};

const statusColors = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    TRIALING: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    PAST_DUE: 'bg-red-500/10 text-red-400 ring-red-500/20',
    CANCELED: 'bg-slate-500/10 text-slate-400 ring-slate-500/20',
    INCOMPLETE: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
};

export default function BillingPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    async function fetchSubscriptions() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/checkout/product');
            if (response.ok) {
                const data = await response.json();
                setSubscriptions(data.subscriptions || []);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load subscriptions');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }

    const products = Object.keys(PRODUCTS) as ProductType[];
    const activeProducts = subscriptions.filter(s => s.status === 'ACTIVE' || s.status === 'TRIALING');
    const inactiveProducts = products.filter(p => !activeProducts.find(s => s.product === p));

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Billing & Subscriptions</h1>
                    <p className="text-slate-400 mt-1">Manage your product subscriptions and billing</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Active Subscriptions */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-400" />
                        Active Subscriptions
                    </h2>

                    {activeProducts.length === 0 ? (
                        <div className="bg-slate-800/50 rounded-xl p-8 text-center ring-1 ring-slate-700">
                            <p className="text-slate-400 mb-4">You don't have any active subscriptions yet.</p>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Browse Plans
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {activeProducts.map((sub) => {
                                const product = PRODUCTS[sub.product];
                                const Icon = productIcons[sub.product];
                                const color = productColors[sub.product];
                                const plan = getProductPlan(sub.product, sub.tier as any);
                                const renewDate = new Date(sub.currentPeriodEnd).toLocaleDateString();

                                return (
                                    <div
                                        key={sub.product}
                                        className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-slate-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`${color} p-3 rounded-lg`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-400">
                                                        {plan?.name || sub.tier} · {sub.interval === 'yearly' ? 'Annual' : 'Monthly'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ${statusColors[sub.status as keyof typeof statusColors] || statusColors.INCOMPLETE}`}>
                                                {sub.status}
                                            </span>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-sm text-slate-500">Current Plan</p>
                                                    <p className="text-white font-medium">{plan?.name || sub.tier}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Next Billing</p>
                                                    <p className="text-white font-medium flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        {renewDate}
                                                    </p>
                                                </div>
                                                {plan && (
                                                    <div>
                                                        <p className="text-sm text-slate-500">Amount</p>
                                                        <p className="text-white font-medium">
                                                            {formatPrice(plan.price.usd[sub.interval as 'monthly' | 'yearly'], 'usd')}
                                                            /{sub.interval === 'yearly' ? 'yr' : 'mo'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                                                    Cancel
                                                </button>
                                                <Link
                                                    href="/pricing"
                                                    className="px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-1"
                                                >
                                                    Upgrade <ArrowUpRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Available Products */}
                {inactiveProducts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-emerald-400" />
                            Add More Products
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {inactiveProducts.map((productKey) => {
                                const product = PRODUCTS[productKey];
                                const Icon = productIcons[productKey];
                                const color = productColors[productKey];

                                return (
                                    <div
                                        key={productKey}
                                        className="bg-slate-800/30 rounded-xl p-6 ring-1 ring-slate-700/50"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`${color}/20 p-3 rounded-lg`}>
                                                <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-').replace('-600', '-400')}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-slate-400">
                                                    {product.subheadline}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/pricing`}
                                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${color} text-white hover:opacity-90`}
                                        >
                                            Add to Subscription
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Payment Method */}
                <section className="mt-12 pt-8 border-t border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                    <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-700 p-3 rounded-lg">
                                    <CreditCard className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Razorpay</p>
                                    <p className="text-sm text-slate-400">
                                        Payments processed securely via Razorpay
                                    </p>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                                Update
                            </button>
                        </div>
                    </div>
                </section>

                {/* Billing History Link */}
                <section className="mt-8">
                    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                        <p className="text-slate-400">Need invoices or billing history?</p>
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                            View Billing History →
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
