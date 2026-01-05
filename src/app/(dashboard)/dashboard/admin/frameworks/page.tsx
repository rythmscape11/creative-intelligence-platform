'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

interface Framework {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    status: string;
    isActive: boolean;
    updatedAt: string;
    _count?: { purchases: number };
}

export default function FrameworksAdminPage() {
    const [frameworks, setFrameworks] = useState<Framework[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFrameworks();
    }, []);

    const fetchFrameworks = async () => {
        try {
            const res = await fetch('/api/admin/frameworks');
            if (res.ok) {
                const data = await res.json();
                setFrameworks(data.frameworks || []);
            }
        } catch (error) {
            console.error('Failed to fetch frameworks:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
            await fetch(`/api/admin/frameworks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchFrameworks();
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    const deleteFramework = async (id: string) => {
        if (!confirm('Are you sure you want to delete this framework?')) return;
        try {
            await fetch(`/api/admin/frameworks/${id}`, { method: 'DELETE' });
            fetchFrameworks();
        } catch (error) {
            console.error('Failed to delete framework:', error);
        }
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(price / 100);
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Framework Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your digital products and frameworks</p>
                </div>
                <Link
                    href="/dashboard/admin/frameworks/new"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Framework
                </Link>
            </div>

            {frameworks.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No frameworks created yet</p>
                    <Link
                        href="/dashboard/admin/frameworks/new"
                        className="text-indigo-600 hover:underline"
                    >
                        Create your first framework
                    </Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Framework</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sales</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {frameworks.map((framework) => (
                                <tr key={framework.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{framework.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">/{framework.slug}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                                        {formatPrice(framework.price, framework.currency)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                                        {framework._count?.purchases || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(framework.id, framework.status)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${framework.status === 'published'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}
                                        >
                                            {framework.status === 'published' ? (
                                                <ToggleRight className="w-3 h-3 mr-1" />
                                            ) : (
                                                <ToggleLeft className="w-3 h-3 mr-1" />
                                            )}
                                            {framework.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            href={`/frameworks/${framework.slug}`}
                                            target="_blank"
                                            className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/admin/frameworks/${framework.id}/edit`}
                                            className="inline-flex items-center p-2 text-gray-400 hover:text-indigo-600"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteFramework(framework.id)}
                                            className="inline-flex items-center p-2 text-gray-400 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
