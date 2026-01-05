/**
 * Admin Billing Dashboard
 * 
 * Read-only dashboard showing:
 * - MRR calculation
 * - Active subscriptions list
 * - Recent payments table
 * - Credit usage overview
 * 
 * IMPORTANT: This is READ-ONLY. No actions mutate core data.
 */

import { prisma } from '@/lib/prisma';
import { PRICING_PLANS } from '@/config/pricing';
import { FORGE_TIERS } from '@/config/subscription-tiers';

export default async function AdminBillingPage() {
    // Fetch billing data
    const [
        activeSubscriptions,
        recentPayments,
        creditUsageStats,
        subscriptionStats,
    ] = await Promise.all([
        // Active subscriptions
        prisma.subscription.findMany({
            where: { status: 'ACTIVE' },
            include: { user: { select: { email: true, name: true } } },
            orderBy: { updatedAt: 'desc' },
            take: 50,
        }),

        // Recent payments
        prisma.payment.findMany({
            where: { status: 'SUCCEEDED' },
            include: { user: { select: { email: true, name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 20,
        }),

        // Credit usage aggregation (for yesterday)
        prisma.usageLedger.groupBy({
            by: ['product'],
            _sum: { sparksUsed: true },
            _count: true,
            where: {
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                sparksUsed: { gt: 0 },
            },
        }).catch(() => []),

        // Subscription breakdown by plan
        prisma.subscription.groupBy({
            by: ['plan'],
            _count: true,
            where: { status: 'ACTIVE' },
        }),
    ]);

    // Calculate MRR
    const mrr = activeSubscriptions.reduce((total, sub) => {
        const plan = PRICING_PLANS.find(p => p.id === sub.plan);
        if (plan) {
            return total + plan.priceInr.monthly;
        }
        return total;
    }, 0);

    // Calculate ARR
    const arr = mrr * 12;

    // Format currency
    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Revenue metrics and subscription overview (read-only)
                </p>
            </div>

            {/* MRR / ARR Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">MRR</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                        {formatINR(mrr)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Monthly Recurring Revenue</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">ARR</div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                        {formatINR(arr)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Annual Run Rate</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Subscriptions</div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                        {activeSubscriptions.length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Paying customers</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Payments</div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                        {recentPayments.length}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Last 20 successful</div>
                </div>
            </div>

            {/* Subscription Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Subscription Breakdown
                    </h2>
                    <div className="space-y-3">
                        {subscriptionStats.map((stat) => (
                            <div key={stat.plan} className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.plan}</span>
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                                    {stat._count}
                                </span>
                            </div>
                        ))}
                        {subscriptionStats.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No active subscriptions</p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Credit Usage (24h)
                    </h2>
                    <div className="space-y-3">
                        {creditUsageStats.map((stat) => (
                            <div key={stat.product} className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                                    {stat.product}
                                </span>
                                <div className="text-right">
                                    <div className="text-gray-800 dark:text-gray-200 font-medium">
                                        {stat._sum.sparksUsed?.toLocaleString() || 0} Sparks
                                    </div>
                                    <div className="text-xs text-gray-400">{stat._count} operations</div>
                                </div>
                            </div>
                        ))}
                        {creditUsageStats.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No usage in last 24 hours</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Subscriptions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Active Subscriptions
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Period Ends
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Gateway
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {activeSubscriptions.slice(0, 10).map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {sub.user.name || 'Unknown'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{sub.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                sub.plan === 'AGENCY' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    sub.plan === 'PRO' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {sub.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {sub.paymentGateway || 'stripe'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {activeSubscriptions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No active subscriptions</div>
                    )}
                </div>
            </div>

            {/* Recent Payments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Payments
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Gateway
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {payment.user.name || 'Unknown'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{payment.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {formatINR(payment.amount / 100)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(payment.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {payment.paymentGateway || 'stripe'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentPayments.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No recent payments</div>
                    )}
                </div>
            </div>
        </div>
    );
}
