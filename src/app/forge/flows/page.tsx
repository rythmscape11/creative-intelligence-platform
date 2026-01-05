'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Workflow, Plus, Play, Archive, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';

interface Flow {
    id: string;
    name: string;
    description: string | null;
    status: 'draft' | 'published' | 'archived';
    version: number;
    createdAt: string;
    updatedAt: string;
}

export default function FlowsPage() {
    const [flows, setFlows] = useState<Flow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
    const [showNewModal, setShowNewModal] = useState(false);
    const [newFlowName, setNewFlowName] = useState('');
    const [newFlowDesc, setNewFlowDesc] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchFlows();
    }, [filter]);

    const fetchFlows = async () => {
        setLoading(true);
        try {
            const status = filter !== 'all' ? `&status=${filter}` : '';
            const res = await fetch(`/api/forge/flows?limit=50${status}`);
            if (res.ok) {
                const data = await res.json();
                setFlows(data.flows);
            }
        } catch (error) {
            console.error('Failed to fetch flows:', error);
        } finally {
            setLoading(false);
        }
    };

    const createFlow = async () => {
        if (!newFlowName) return;
        setCreating(true);
        try {
            const res = await fetch('/api/forge/flows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFlowName, description: newFlowDesc }),
            });
            if (res.ok) {
                const data = await res.json();
                setShowNewModal(false);
                setNewFlowName('');
                setNewFlowDesc('');
                // Navigate to the new flow
                window.location.href = `/forge/flows/${data.flow.id}`;
            }
        } catch (error) {
            console.error('Failed to create flow:', error);
        } finally {
            setCreating(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'draft': return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'published': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'archived': return <Archive className="w-4 h-4 text-gray-400" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-yellow-500/20 text-yellow-400';
            case 'published': return 'bg-green-500/20 text-green-400';
            case 'archived': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Automation Flows</h1>
                    <p className="text-gray-400 mt-1">Build and manage visual automation pipelines</p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex items-center gap-2 bg-[#B3001B] hover:bg-[#8F0016] text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Flow
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-gray-400" />
                {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === status
                                ? 'bg-[#F1C40F]/20 text-[#F1C40F]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Flows Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
                            <div className="h-4 bg-white/10 rounded w-2/3 mb-4" />
                            <div className="h-3 bg-white/10 rounded w-full mb-2" />
                            <div className="h-3 bg-white/10 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : flows.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <Workflow className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h2 className="text-lg font-medium text-white mb-2">No flows yet</h2>
                    <p className="text-gray-400 mb-6">Create your first automation flow to get started</p>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="inline-flex items-center gap-2 bg-[#B3001B] hover:bg-[#8F0016] text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Flow
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flows.map((flow) => (
                        <Link
                            key={flow.id}
                            href={`/forge/flows/${flow.id}`}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] hover:border-[#F1C40F]/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Workflow className="w-5 h-5 text-[#F1C40F]" />
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(flow.status)}`}>
                                        {flow.status}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">v{flow.version}</span>
                            </div>
                            <h3 className="text-lg font-medium text-white group-hover:text-[#F1C40F] transition-colors mb-2">
                                {flow.name}
                            </h3>
                            {flow.description && (
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{flow.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Updated {new Date(flow.updatedAt).toLocaleDateString()}</span>
                                {flow.status === 'published' && (
                                    <span className="flex items-center gap-1 text-green-400">
                                        <Play className="w-3 h-3" />
                                        Active
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Flow Modal */}
            {showNewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Flow</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Flow Name</label>
                                <input
                                    type="text"
                                    value={newFlowName}
                                    onChange={(e) => setNewFlowName(e.target.value)}
                                    placeholder="e.g., Brief to Social Campaign"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description (optional)</label>
                                <textarea
                                    value={newFlowDesc}
                                    onChange={(e) => setNewFlowDesc(e.target.value)}
                                    placeholder="What does this flow do?"
                                    rows={3}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowNewModal(false)}
                                className="flex-1 px-4 py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createFlow}
                                disabled={!newFlowName || creating}
                                className="flex-1 px-4 py-2.5 bg-[#B3001B] text-white rounded-lg hover:bg-[#8F0016] transition-colors disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Create & Edit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
