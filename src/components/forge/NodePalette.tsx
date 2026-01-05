'use client';

import {
    Zap,
    MessageSquare,
    Image,
    Video,
    Shield,
    GitBranch,
    Globe,
    Bell,
    Plus
} from 'lucide-react';

interface NodeTypeConfig {
    type: string;
    label: string;
    icon: React.ElementType;
    color: string;
    description: string;
    sparksCost: number;
}

const nodeTypes: NodeTypeConfig[] = [
    {
        type: 'trigger',
        label: 'Trigger',
        icon: Zap,
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        description: 'Start point for the flow',
        sparksCost: 0,
    },
    {
        type: 'llm',
        label: 'LLM',
        icon: MessageSquare,
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        description: 'Generate text with AI',
        sparksCost: 5,
    },
    {
        type: 'image',
        label: 'Image',
        icon: Image,
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        description: 'Generate images with Flux',
        sparksCost: 10,
    },
    {
        type: 'video',
        label: 'Video',
        icon: Video,
        color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        description: 'Create videos with Runway/Kling',
        sparksCost: 50,
    },
    {
        type: 'brandguard',
        label: 'BrandGuard',
        icon: Shield,
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        description: 'Check brand compliance',
        sparksCost: 3,
    },
    {
        type: 'condition',
        label: 'Condition',
        icon: GitBranch,
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        description: 'Branch based on conditions',
        sparksCost: 0,
    },
    {
        type: 'http',
        label: 'HTTP',
        icon: Globe,
        color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        description: 'Call external APIs',
        sparksCost: 1,
    },
    {
        type: 'notification',
        label: 'Notify',
        icon: Bell,
        color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        description: 'Send notifications',
        sparksCost: 1,
    },
];

interface NodePaletteProps {
    onAddNode: (type: string, label: string) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
    return (
        <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Node Types
            </h3>
            <div className="space-y-2">
                {nodeTypes.map((node) => (
                    <button
                        key={node.type}
                        onClick={() => onAddNode(node.type, node.label)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02] ${node.color}`}
                    >
                        <node.icon className="w-5 h-5" />
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{node.label}</p>
                            <p className="text-xs opacity-70">{node.description}</p>
                        </div>
                        {node.sparksCost > 0 && (
                            <span className="text-xs opacity-70 flex items-center gap-0.5">
                                <Zap className="w-3 h-3" />
                                {node.sparksCost}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">
                    Drag nodes to the canvas or click to add them.
                </p>
            </div>
        </div>
    );
}
