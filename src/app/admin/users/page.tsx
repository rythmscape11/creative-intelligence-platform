'use client';

import { useState, useEffect } from 'react';
import {
    Users, Search, Mail, Calendar, Shield,
    MoreVertical, RefreshCw, ChevronLeft, ChevronRight,
    Building2, TrendingUp, Lightbulb
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    subscriptions: {
        product: string;
        tier: string;
        status: string;
    }[];
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users?page=${page}&search=${search}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
            } else {
                // Demo data
                setUsers([
                    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', createdAt: '2024-10-15', subscriptions: [{ product: 'AGENCY_OS', tier: 'PRO', status: 'ACTIVE' }] },
                    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', createdAt: '2024-11-01', subscriptions: [{ product: 'OPTIMISER', tier: 'AGENCY', status: 'ACTIVE' }] },
                    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'ADMIN', createdAt: '2024-09-20', subscriptions: [{ product: 'ANALYSER', tier: 'PRO', status: 'ACTIVE' }, { product: 'STRATEGISER', tier: 'PRO', status: 'ACTIVE' }] },
                    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'USER', createdAt: '2024-12-01', subscriptions: [] },
                    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'USER', createdAt: '2024-11-15', subscriptions: [{ product: 'STRATEGISER', tier: 'STARTER', status: 'TRIALING' }] },
                ]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }

    const roleColors: Record<string, string> = {
        ADMIN: 'bg-red-500/10 text-red-400 ring-red-500/20',
        USER: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    };

    const statusColors: Record<string, string> = {
        ACTIVE: 'bg-emerald-500/10 text-emerald-400',
        TRIALING: 'bg-blue-500/10 text-blue-400',
        PAST_DUE: 'bg-red-500/10 text-red-400',
        CANCELED: 'bg-slate-500/10 text-slate-400',
    };

    const productColors: Record<string, string> = {
        AGENCY_OS: 'text-indigo-400',
        OPTIMISER: 'text-emerald-400',
        ANALYSER: 'text-amber-400',
        STRATEGISER: 'text-violet-400',
    };

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
                        <h1 className="text-3xl font-bold text-white">User Management</h1>
                        <p className="text-slate-400 mt-1">View and manage user accounts</p>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 hover:bg-slate-700 transition-colors"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-800/50 rounded-xl ring-1 ring-slate-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Subscriptions</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Joined</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-sm text-slate-400 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ${roleColors[user.role] || roleColors.USER}`}>
                                            <Shield className="h-3 w-3" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.subscriptions.length === 0 ? (
                                            <span className="text-slate-500 text-sm">No subscriptions</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {user.subscriptions.map((sub, i) => (
                                                    <span
                                                        key={i}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${statusColors[sub.status] || statusColors.ACTIVE}`}
                                                    >
                                                        <span className={productColors[sub.product]}>{sub.product.replace('_', ' ')}</span>
                                                        <span className="text-slate-500">·</span>
                                                        <span>{sub.tier}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-400 text-sm flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                            <MoreVertical className="h-4 w-4 text-slate-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        Showing page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="p-2 bg-slate-800 rounded-lg border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-400" />
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="p-2 bg-slate-800 rounded-lg border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
