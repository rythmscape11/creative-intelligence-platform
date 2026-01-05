'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Play, ArrowLeft, Trash2, Check, AlertCircle, Zap } from 'lucide-react';
import { NodePalette } from '@/components/forge/NodePalette';
import { FlowCanvas } from '@/components/forge/FlowCanvas';
import { NodeConfigPanel } from '@/components/forge/NodeConfigPanel';

interface FlowNode {
    id: string;
    type: string;
    label: string;
    config: Record<string, unknown>;
    position: { x: number; y: number };
}

interface FlowEdge {
    id: string;
    source: string;
    target: string;
}

interface Flow {
    id: string;
    name: string;
    description: string | null;
    status: 'draft' | 'published' | 'archived';
    version: number;
    definitionJson: {
        nodes: FlowNode[];
        edges: FlowEdge[];
    };
}

export default function FlowEditorPage() {
    const params = useParams();
    const router = useRouter();
    const flowId = params.id as string;

    const [flow, setFlow] = useState<Flow | null>(null);
    const [nodes, setNodes] = useState<FlowNode[]>([]);
    const [edges, setEdges] = useState<FlowEdge[]>([]);
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchFlow();
    }, [flowId]);

    const fetchFlow = async () => {
        try {
            const res = await fetch(`/api/forge/flows/${flowId}`);
            if (!res.ok) throw new Error('Flow not found');
            const data = await res.json();
            setFlow(data.flow);
            setNodes(data.flow.definitionJson?.nodes || []);
            setEdges(data.flow.definitionJson?.edges || []);
        } catch (err) {
            setError('Failed to load flow');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/forge/flows/${flowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    definitionJson: { nodes, edges },
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Save failed');
            }
            setHasChanges(false);
            setSuccess('Flow saved!');
            setTimeout(() => setSuccess(null), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (hasChanges) {
            await handleSave();
        }
        setPublishing(true);
        setError(null);
        try {
            const res = await fetch(`/api/forge/flows/${flowId}/publish`, {
                method: 'POST',
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Publish failed');
            }
            const data = await res.json();
            setFlow(data.flow);
            setSuccess('Flow published!');
            setTimeout(() => setSuccess(null), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Publish failed');
        } finally {
            setPublishing(false);
        }
    };

    const handleAddNode = (type: string, label: string) => {
        const newNode: FlowNode = {
            id: `node_${Date.now()}`,
            type,
            label,
            config: {},
            position: { x: 250 + Math.random() * 100, y: 150 + nodes.length * 80 },
        };
        setNodes([...nodes, newNode]);
        setSelectedNode(newNode);
        setHasChanges(true);
    };

    const handleUpdateNode = (nodeId: string, updates: Partial<FlowNode>) => {
        setNodes(nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n));
        if (selectedNode?.id === nodeId) {
            setSelectedNode({ ...selectedNode, ...updates });
        }
        setHasChanges(true);
    };

    const handleDeleteNode = (nodeId: string) => {
        setNodes(nodes.filter(n => n.id !== nodeId));
        setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
        if (selectedNode?.id === nodeId) {
            setSelectedNode(null);
        }
        setHasChanges(true);
    };

    const handleConnect = (sourceId: string, targetId: string) => {
        // Prevent duplicate edges
        if (edges.some(e => e.source === sourceId && e.target === targetId)) return;
        // Prevent self-loops
        if (sourceId === targetId) return;

        const newEdge: FlowEdge = {
            id: `edge_${Date.now()}`,
            source: sourceId,
            target: targetId,
        };
        setEdges([...edges, newEdge]);
        setHasChanges(true);
    };

    const handleDeleteEdge = (edgeId: string) => {
        setEdges(edges.filter(e => e.id !== edgeId));
        setHasChanges(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#050709]">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!flow) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#050709]">
                <p className="text-gray-400 mb-4">Flow not found</p>
                <button onClick={() => router.push('/forge/flows')} className="text-[#F1C40F] hover:underline">
                    Back to Flows
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#050709]">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0A0A0A]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/forge/flows')}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-medium text-white">{flow.name}</h1>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${flow.status === 'published'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {flow.status}
                            </span>
                            <span className="text-gray-500">v{flow.version}</span>
                            {hasChanges && <span className="text-orange-400">• Unsaved changes</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-1.5 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-1.5 rounded-lg">
                            <Check className="w-4 h-4" />
                            {success}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className="flex items-center gap-2 px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={publishing || (flow.status === 'published' && !hasChanges)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#B3001B] text-white rounded-lg hover:bg-[#8F0016] disabled:opacity-50 transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        {publishing ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Node Palette */}
                <aside className="w-[220px] border-r border-white/10 bg-[#0A0A0A] overflow-y-auto">
                    <NodePalette onAddNode={handleAddNode} />
                </aside>

                {/* Canvas */}
                <main className="flex-1 relative overflow-hidden">
                    <FlowCanvas
                        nodes={nodes}
                        edges={edges}
                        selectedNodeId={selectedNode?.id || null}
                        onSelectNode={(node) => setSelectedNode(node)}
                        onUpdateNode={handleUpdateNode}
                        onDeleteNode={handleDeleteNode}
                        onConnect={handleConnect}
                        onDeleteEdge={handleDeleteEdge}
                    />
                </main>

                {/* Right Sidebar - Node Config */}
                {selectedNode && (
                    <aside className="w-[300px] border-l border-white/10 bg-[#0A0A0A] overflow-y-auto">
                        <NodeConfigPanel
                            node={selectedNode}
                            onUpdate={(updates) => handleUpdateNode(selectedNode.id, updates)}
                            onDelete={() => handleDeleteNode(selectedNode.id)}
                            onClose={() => setSelectedNode(null)}
                        />
                    </aside>
                )}
            </div>
        </div>
    );
}
