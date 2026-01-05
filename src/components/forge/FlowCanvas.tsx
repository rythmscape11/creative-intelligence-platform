'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import {
    Zap,
    MessageSquare,
    Image,
    Video,
    Shield,
    GitBranch,
    Globe,
    Bell,
    X,
    Circle
} from 'lucide-react';

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

interface FlowCanvasProps {
    nodes: FlowNode[];
    edges: FlowEdge[];
    selectedNodeId: string | null;
    onSelectNode: (node: FlowNode | null) => void;
    onUpdateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
    onDeleteNode: (nodeId: string) => void;
    onConnect: (sourceId: string, targetId: string) => void;
    onDeleteEdge: (edgeId: string) => void;
}

const nodeIcons: Record<string, React.ElementType> = {
    trigger: Zap,
    llm: MessageSquare,
    image: Image,
    video: Video,
    brandguard: Shield,
    condition: GitBranch,
    http: Globe,
    notification: Bell,
};

const nodeColors: Record<string, string> = {
    trigger: 'border-yellow-500/50 bg-yellow-500/10',
    llm: 'border-blue-500/50 bg-blue-500/10',
    image: 'border-purple-500/50 bg-purple-500/10',
    video: 'border-pink-500/50 bg-pink-500/10',
    brandguard: 'border-green-500/50 bg-green-500/10',
    condition: 'border-orange-500/50 bg-orange-500/10',
    http: 'border-cyan-500/50 bg-cyan-500/10',
    notification: 'border-indigo-500/50 bg-indigo-500/10',
};

const iconColors: Record<string, string> = {
    trigger: 'text-yellow-400',
    llm: 'text-blue-400',
    image: 'text-purple-400',
    video: 'text-pink-400',
    brandguard: 'text-green-400',
    condition: 'text-orange-400',
    http: 'text-cyan-400',
    notification: 'text-indigo-400',
};

export function FlowCanvas({
    nodes,
    edges,
    selectedNodeId,
    onSelectNode,
    onUpdateNode,
    onDeleteNode,
    onConnect,
    onDeleteEdge,
}: FlowCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [draggingNode, setDraggingNode] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [connecting, setConnecting] = useState<{ sourceId: string; x: number; y: number } | null>(null);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    // Handle mouse move for dragging
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (draggingNode && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - dragOffset.x) / scale;
            const y = (e.clientY - rect.top - dragOffset.y) / scale;
            onUpdateNode(draggingNode, { position: { x, y } });
        }

        if (connecting && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setConnecting({
                ...connecting,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    }, [draggingNode, dragOffset, connecting, scale, onUpdateNode]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (connecting && canvasRef.current) {
            // Check if we released over a node
            const element = document.elementFromPoint(e.clientX, e.clientY);
            const nodeElement = element?.closest('[data-node-id]');
            if (nodeElement) {
                const targetId = nodeElement.getAttribute('data-node-id');
                if (targetId && targetId !== connecting.sourceId) {
                    onConnect(connecting.sourceId, targetId);
                }
            }
        }
        setDraggingNode(null);
        setConnecting(null);
    }, [connecting, onConnect]);

    const handleNodeMouseDown = (e: React.MouseEvent, node: FlowNode) => {
        e.stopPropagation();
        onSelectNode(node);

        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left - node.position.x * scale,
                y: e.clientY - rect.top - node.position.y * scale,
            });
            setDraggingNode(node.id);
        }
    };

    const startConnection = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setConnecting({
                sourceId: nodeId,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const getNodeCenter = (node: FlowNode) => ({
        x: node.position.x * scale + 80, // Half of node width (160px)
        y: node.position.y * scale + 30, // Half of node height (60px)
    });

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            onSelectNode(null);
        }
    };

    return (
        <div
            ref={canvasRef}
            className="w-full h-full bg-[#0D0D0D] cursor-grab active:cursor-grabbing relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            style={{
                backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
                backgroundSize: '20px 20px',
            }}
        >
            {/* Grid overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Draw edges */}
                {edges.map((edge) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const source = getNodeCenter(sourceNode);
                    const target = getNodeCenter(targetNode);

                    // Calculate control points for curved line
                    const midX = (source.x + target.x) / 2;
                    const midY = (source.y + target.y) / 2;
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;

                    return (
                        <g key={edge.id}>
                            <path
                                d={`M ${source.x} ${source.y} Q ${midX} ${source.y + offset}, ${target.x} ${target.y}`}
                                fill="none"
                                stroke="rgba(241, 196, 15, 0.5)"
                                strokeWidth="2"
                                className="drop-shadow-sm"
                            />
                            {/* Arrow head */}
                            <circle
                                cx={target.x}
                                cy={target.y}
                                r="4"
                                fill="#F1C40F"
                                className="cursor-pointer hover:r-6"
                                onClick={() => onDeleteEdge(edge.id)}
                            />
                        </g>
                    );
                })}

                {/* Active connection line */}
                {connecting && (
                    <line
                        x1={getNodeCenter(nodes.find(n => n.id === connecting.sourceId)!).x}
                        y1={getNodeCenter(nodes.find(n => n.id === connecting.sourceId)!).y}
                        x2={connecting.x}
                        y2={connecting.y}
                        stroke="rgba(241, 196, 15, 0.7)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                    />
                )}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
                const Icon = nodeIcons[node.type] || Zap;
                const isSelected = selectedNodeId === node.id;

                return (
                    <div
                        key={node.id}
                        data-node-id={node.id}
                        className={`absolute w-40 rounded-xl border-2 backdrop-blur-sm transition-shadow cursor-move select-none ${nodeColors[node.type]} ${isSelected ? 'ring-2 ring-[#F1C40F] shadow-lg shadow-[#F1C40F]/20' : ''
                            }`}
                        style={{
                            left: node.position.x * scale,
                            top: node.position.y * scale,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                        onMouseDown={(e) => handleNodeMouseDown(e, node)}
                    >
                        {/* Node Header */}
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
                            <Icon className={`w-4 h-4 ${iconColors[node.type]}`} />
                            <span className="text-sm font-medium text-white truncate flex-1">
                                {node.label}
                            </span>
                        </div>

                        {/* Node Body */}
                        <div className="px-3 py-2">
                            <p className="text-xs text-gray-400 truncate">
                                {node.config.prompt ? String(node.config.prompt).slice(0, 30) + '...' :
                                    node.config.url ? String(node.config.url).slice(0, 30) :
                                        'Click to configure'}
                            </p>
                        </div>

                        {/* Connection handles */}
                        <div
                            className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F1C40F] border-2 border-[#0D0D0D] cursor-crosshair hover:scale-125 transition-transform"
                            onMouseDown={(e) => startConnection(e, node.id)}
                            title="Drag to connect"
                        />
                        <div
                            className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border-2 border-[#0D0D0D]"
                            title="Input"
                        />
                    </div>
                );
            })}

            {/* Empty state */}
            {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F1C40F]/10 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-[#F1C40F]" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Start building your flow</h3>
                        <p className="text-gray-400 text-sm">Click a node type from the left panel to add it</p>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <button
                    onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded"
                >
                    -
                </button>
                <span className="w-12 text-center text-white text-sm leading-8">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={() => setScale(s => Math.min(2, s + 0.1))}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded"
                >
                    +
                </button>
            </div>
        </div>
    );
}
