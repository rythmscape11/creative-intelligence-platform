import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, Download, ExternalLink, ShoppingBag, ArrowRight } from 'lucide-react';

export default async function FrameworksDashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/auth/signin');
    }

    // Get user's email from database
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
    });

    // Fetch user's purchased frameworks
    const purchases = await prisma.productPurchase.findMany({
        where: {
            email: user?.email || '',
            status: 'COMPLETED',
        },
        include: {
            product: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Fetch all available frameworks for browsing
    const allFrameworks = await prisma.product.findMany({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
    });

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(price / 100);
    };

    return (
        <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Link href="/dashboard" className="hover:text-gray-700 dark:hover:text-gray-200">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span>Frameworks</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-600" />
                        My Frameworks
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Access and download your purchased marketing frameworks
                    </p>
                </div>
                <Link
                    href="/frameworks"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Browse Frameworks
                </Link>
            </div>

            {/* Purchased Frameworks */}
            {purchases.length > 0 ? (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Your Purchased Frameworks ({purchases.length})
                    </h2>
                    <div className="grid gap-6">
                        {purchases.map((purchase) => {
                            const assets = JSON.parse(purchase.product.assets || '[]') as { name: string; url: string }[];

                            return (
                                <div
                                    key={purchase.id}
                                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {purchase.product.name}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                                {purchase.product.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                                                <span>Purchased {new Date(purchase.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{formatPrice(purchase.amount, purchase.currency)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/frameworks/${purchase.product.slug}`}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                title="View Details"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Download Assets */}
                                    {assets.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                Download Your Assets
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {assets.map((asset, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={asset.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        {asset.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Access Link */}
                                    {purchase.accessKey && (
                                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                                <strong>Access Key:</strong> {purchase.accessKey}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                                Keep this safe. Use it to re-download your assets anytime.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 mb-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No frameworks purchased yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        Browse our collection of AI-first marketing frameworks designed to accelerate your growth.
                    </p>
                    <Link
                        href="/frameworks"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        Explore Frameworks
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            )}

            {/* All Available Frameworks */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Available Frameworks
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allFrameworks.map((framework) => {
                        const isPurchased = purchases.some(p => p.productId === framework.id);

                        return (
                            <Link
                                key={framework.id}
                                href={`/frameworks/${framework.slug}`}
                                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500/50 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    {isPurchased && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                            Owned
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {framework.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                    {framework.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatPrice(framework.price, framework.currency)}
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">
                                        {isPurchased ? 'View Details' : 'Learn More'} →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
