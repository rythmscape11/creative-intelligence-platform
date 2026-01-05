'use client';

import { useEffect, useState } from 'react';
import { Key, Plus, Eye, EyeOff, Trash2, Copy, Check, AlertCircle } from 'lucide-react';

interface ApiKey {
    id: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    status: 'active' | 'revoked';
    createdAt: string;
    lastUsedAt: string | null;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyEnv, setNewKeyEnv] = useState<'sandbox' | 'production'>('sandbox');
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/forge/api-keys');
            if (res.ok) {
                const data = await res.json();
                setKeys(data.keys);
            }
        } catch (error) {
            console.error('Failed to fetch keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const createKey = async () => {
        if (!newKeyName) return;
        setCreating(true);
        try {
            const res = await fetch('/api/forge/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName, environmentName: newKeyEnv }),
            });
            if (res.ok) {
                const data = await res.json();
                setCreatedKey(data.plainTextKey);
                fetchKeys();
            }
        } catch (error) {
            console.error('Failed to create key:', error);
        } finally {
            setCreating(false);
        }
    };

    const revokeKey = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/forge/api-keys/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchKeys();
            }
        } catch (error) {
            console.error('Failed to revoke key:', error);
        }
    };

    const copyKey = () => {
        if (createdKey) {
            navigator.clipboard.writeText(createdKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const closeModal = () => {
        setShowNewKeyModal(false);
        setNewKeyName('');
        setCreatedKey(null);
        setCopied(false);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">API Keys</h1>
                    <p className="text-gray-400 mt-1">Manage API keys for programmatic access to Forge</p>
                </div>
                <button
                    onClick={() => setShowNewKeyModal(true)}
                    className="flex items-center gap-2 bg-[#B3001B] hover:bg-[#8F0016] text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Generate New Key
                </button>
            </div>

            {/* Keys Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Name</th>
                            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Key</th>
                            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Environment</th>
                            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Created</th>
                            <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Last Used</th>
                            <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-400 py-12">Loading...</td>
                            </tr>
                        ) : keys.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-400 py-12">
                                    <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No API keys yet</p>
                                    <p className="text-sm mt-1">Generate your first key to get started</p>
                                </td>
                            </tr>
                        ) : (
                            keys.map((key) => (
                                <tr key={key.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-white">{key.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-sm text-gray-400 bg-black/20 px-2 py-1 rounded">
                                            {key.keyPrefix}••••••••••••
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${key.keyPrefix.includes('live')
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {key.keyPrefix.includes('live') ? 'Production' : 'Sandbox'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${key.status === 'active'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {key.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(key.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {key.status === 'active' && (
                                            <button
                                                onClick={() => revokeKey(key.id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Revoke Key"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Key Modal */}
            {showNewKeyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-md p-6">
                        {!createdKey ? (
                            <>
                                <h2 className="text-xl font-bold text-white mb-4">Generate API Key</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Key Name</label>
                                        <input
                                            type="text"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            placeholder="e.g., Production Server"
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Environment</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="env"
                                                    checked={newKeyEnv === 'sandbox'}
                                                    onChange={() => setNewKeyEnv('sandbox')}
                                                    className="text-[#F1C40F]"
                                                />
                                                <span className="text-white">Sandbox</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="env"
                                                    checked={newKeyEnv === 'production'}
                                                    onChange={() => setNewKeyEnv('production')}
                                                    className="text-[#F1C40F]"
                                                />
                                                <span className="text-white">Production</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createKey}
                                        disabled={!newKeyName || creating}
                                        className="flex-1 px-4 py-2.5 bg-[#B3001B] text-white rounded-lg hover:bg-[#8F0016] transition-colors disabled:opacity-50"
                                    >
                                        {creating ? 'Generating...' : 'Generate Key'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-4">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <h2 className="text-xl font-bold text-white">API Key Created</h2>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-yellow-200">
                                            Copy this key now. You won't be able to see it again!
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-black/30 border border-white/10 rounded-lg p-4 font-mono text-sm text-white break-all">
                                    {createdKey}
                                </div>
                                <button
                                    onClick={copyKey}
                                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="w-full mt-3 px-4 py-2.5 bg-[#B3001B] text-white rounded-lg hover:bg-[#8F0016] transition-colors"
                                >
                                    Done
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
