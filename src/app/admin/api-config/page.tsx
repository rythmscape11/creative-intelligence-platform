'use client';

import { useState, useEffect } from 'react';
import {
    Key,
    Shield,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff,
    RefreshCw,
    Trash2,
    Save,
    Database,
    Cloud
} from 'lucide-react';

interface ApiConfig {
    key: string;
    product: string;
    description: string;
    isConfigured: boolean;
    maskedValue?: string;
    source: 'database' | 'environment' | 'none';
    lastUpdated?: string;
}

interface TestResult {
    success: boolean;
    message: string;
    statusCode?: number;
}

export default function ApiConfigPage() {
    const [configs, setConfigs] = useState<ApiConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [newValue, setNewValue] = useState('');
    const [showValue, setShowValue] = useState<Record<string, boolean>>({});
    const [testingKey, setTestingKey] = useState<string | null>(null);
    const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/admin/api-config');
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch configurations');
            }

            setConfigs(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load API configurations');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string) => {
        if (!newValue.trim()) {
            return;
        }

        try {
            setSavingKey(key);
            const response = await fetch('/api/admin/api-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: newValue }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            setEditingKey(null);
            setNewValue('');
            await fetchConfigs();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save API key');
        } finally {
            setSavingKey(null);
        }
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Delete ${key} from database? It will fall back to environment variable if set.`)) {
            return;
        }

        try {
            setDeletingKey(key);
            const response = await fetch(`/api/admin/api-config?key=${encodeURIComponent(key)}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            await fetchConfigs();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete API key');
        } finally {
            setDeletingKey(null);
        }
    };

    const handleTest = async (key: string) => {
        try {
            setTestingKey(key);
            setTestResults(prev => ({ ...prev, [key]: { success: false, message: 'Testing...' } }));

            const response = await fetch('/api/admin/api-config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            setTestResults(prev => ({ ...prev, [key]: data.data }));
        } catch (err) {
            setTestResults(prev => ({
                ...prev,
                [key]: { success: false, message: err instanceof Error ? err.message : 'Test failed' }
            }));
        } finally {
            setTestingKey(null);
        }
    };

    const getStatusIcon = (config: ApiConfig) => {
        if (!config.isConfigured) {
            return <XCircle className="w-5 h-5 text-red-500" />;
        }

        const testResult = testResults[config.key];
        if (testResult) {
            return testResult.success
                ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                : <AlertCircle className="w-5 h-5 text-amber-500" />;
        }

        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    };

    const getSourceBadge = (source: string) => {
        if (source === 'database') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300">
                    <Database className="w-3 h-3" />
                    Database
                </span>
            );
        }
        if (source === 'environment') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                    <Cloud className="w-3 h-3" />
                    Environment
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400">
                Not Set
            </span>
        );
    };

    // Group configs by product
    const groupedConfigs = configs.reduce((acc, config) => {
        if (!acc[config.product]) {
            acc[config.product] = [];
        }
        acc[config.product].push(config);
        return acc;
    }, {} as Record<string, ApiConfig[]>);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <span className="ml-3 text-gray-400">Loading API configurations...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Key className="w-6 h-6 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            API Configuration
                        </h1>
                    </div>
                    <p className="text-gray-400 ml-12">
                        Manage API keys for all products. Keys stored in the database are encrypted and take priority over environment variables.
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-red-300">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Info Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-300">
                            <p className="font-medium text-purple-300 mb-1">Encryption & Security</p>
                            <p>API keys are encrypted using AES-256 before storage. Environment variables are used as fallback when database keys are not set.</p>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={fetchConfigs}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* API Configurations by Product */}
                {Object.entries(groupedConfigs).map(([product, productConfigs]) => (
                    <div key={product} className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            {product}
                        </h2>

                        <div className="space-y-3">
                            {productConfigs.map((config) => (
                                <div
                                    key={config.key}
                                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Left side - Key info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusIcon(config)}
                                                <code className="text-sm font-mono text-purple-300">{config.key}</code>
                                                {getSourceBadge(config.source)}
                                            </div>
                                            <p className="text-sm text-gray-400 ml-8">{config.description}</p>

                                            {/* Masked value */}
                                            {config.isConfigured && config.maskedValue && (
                                                <div className="mt-2 ml-8 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Value:</span>
                                                    <code className="text-xs font-mono text-gray-400">
                                                        {showValue[config.key] ? config.maskedValue : '••••••••••••••••'}
                                                    </code>
                                                    <button
                                                        onClick={() => setShowValue(prev => ({ ...prev, [config.key]: !prev[config.key] }))}
                                                        className="text-gray-500 hover:text-gray-300"
                                                    >
                                                        {showValue[config.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Test result */}
                                            {testResults[config.key] && (
                                                <div className={`mt-2 ml-8 text-xs ${testResults[config.key].success ? 'text-green-400' : 'text-amber-400'}`}>
                                                    {testResults[config.key].message}
                                                    {testResults[config.key].statusCode && ` (${testResults[config.key].statusCode})`}
                                                </div>
                                            )}

                                            {/* Edit mode */}
                                            {editingKey === config.key && (
                                                <div className="mt-3 ml-8 flex items-center gap-2">
                                                    <input
                                                        type="password"
                                                        value={newValue}
                                                        onChange={(e) => setNewValue(e.target.value)}
                                                        placeholder="Enter new API key..."
                                                        className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm font-mono focus:outline-none focus:border-purple-500"
                                                    />
                                                    <button
                                                        onClick={() => handleSave(config.key)}
                                                        disabled={savingKey === config.key || !newValue.trim()}
                                                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {savingKey === config.key ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Save className="w-4 h-4" />
                                                        )}
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingKey(null); setNewValue(''); }}
                                                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right side - Actions */}
                                        <div className="flex items-center gap-2">
                                            {/* Test button */}
                                            <button
                                                onClick={() => handleTest(config.key)}
                                                disabled={!config.isConfigured || testingKey === config.key}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Test API Key"
                                            >
                                                {testingKey === config.key ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="w-4 h-4" />
                                                )}
                                            </button>

                                            {/* Edit button */}
                                            {editingKey !== config.key && (
                                                <button
                                                    onClick={() => { setEditingKey(config.key); setNewValue(''); }}
                                                    className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                                >
                                                    {config.isConfigured ? 'Update' : 'Set Key'}
                                                </button>
                                            )}

                                            {/* Delete button (only for database-stored keys) */}
                                            {config.source === 'database' && (
                                                <button
                                                    onClick={() => handleDelete(config.key)}
                                                    disabled={deletingKey === config.key}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg disabled:opacity-50 transition-colors"
                                                    title="Delete from database"
                                                >
                                                    {deletingKey === config.key ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {configs.filter(c => c.isConfigured).length}
                        </div>
                        <div className="text-sm text-gray-400">Configured</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">
                            {configs.filter(c => c.source === 'database').length}
                        </div>
                        <div className="text-sm text-gray-400">In Database</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">
                            {configs.filter(c => !c.isConfigured).length}
                        </div>
                        <div className="text-sm text-gray-400">Missing</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
