'use client';

import { useState } from 'react';
import { X, Trash2, Save } from 'lucide-react';

interface FlowNode {
    id: string;
    type: string;
    label: string;
    config: Record<string, unknown>;
    position: { x: number; y: number };
}

interface NodeConfigPanelProps {
    node: FlowNode;
    onUpdate: (updates: Partial<FlowNode>) => void;
    onDelete: () => void;
    onClose: () => void;
}

const nodeConfigFields: Record<string, { label: string; type: 'text' | 'textarea' | 'select' | 'number'; options?: string[]; placeholder?: string }[]> = {
    trigger: [
        { label: 'Trigger Type', type: 'select', options: ['manual', 'webhook', 'scheduled'] },
        { label: 'Schedule (cron)', type: 'text', placeholder: '0 9 * * *' },
    ],
    llm: [
        { label: 'Prompt', type: 'textarea', placeholder: 'Enter your prompt...' },
        { label: 'Model', type: 'select', options: ['gemini-pro', 'gemini-pro-vision'] },
        { label: 'Max Tokens', type: 'number', placeholder: '1024' },
        { label: 'Temperature', type: 'number', placeholder: '0.7' },
    ],
    image: [
        { label: 'Prompt', type: 'textarea', placeholder: 'Describe the image...' },
        { label: 'Model', type: 'select', options: ['flux.1-schnell', 'flux.1-dev'] },
        { label: 'Aspect Ratio', type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4'] },
        { label: 'Number of Images', type: 'number', placeholder: '1' },
    ],
    video: [
        { label: 'Prompt', type: 'textarea', placeholder: 'Describe the video...' },
        { label: 'Mode', type: 'select', options: ['cinema', 'social'] },
        { label: 'Duration', type: 'select', options: ['5s', '10s'] },
        { label: 'Aspect Ratio', type: 'select', options: ['16:9', '9:16', '1:1'] },
    ],
    brandguard: [
        { label: 'Brand Profile', type: 'text', placeholder: 'Brand ID or name' },
        { label: 'Strictness', type: 'select', options: ['low', 'medium', 'high'] },
        { label: 'Auto-rewrite', type: 'select', options: ['true', 'false'] },
    ],
    condition: [
        { label: 'Field Path', type: 'text', placeholder: 'e.g., output.score' },
        { label: 'Operator', type: 'select', options: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'exists'] },
        { label: 'Value', type: 'text', placeholder: 'Comparison value' },
    ],
    http: [
        { label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
        { label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
        { label: 'Headers (JSON)', type: 'textarea', placeholder: '{"Authorization": "Bearer ..."}' },
        { label: 'Body (JSON)', type: 'textarea', placeholder: '{"key": "value"}' },
    ],
    notification: [
        { label: 'Channel', type: 'select', options: ['email', 'slack', 'webhook'] },
        { label: 'Recipient', type: 'text', placeholder: 'email@example.com or #channel' },
        { label: 'Subject/Title', type: 'text', placeholder: 'Notification subject' },
        { label: 'Message', type: 'textarea', placeholder: 'Notification message...' },
    ],
};

export function NodeConfigPanel({ node, onUpdate, onDelete, onClose }: NodeConfigPanelProps) {
    const [label, setLabel] = useState(node.label);
    const [config, setConfig] = useState<Record<string, unknown>>(node.config);

    const fields = nodeConfigFields[node.type] || [];

    const handleConfigChange = (field: string, value: unknown) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        onUpdate({ config: newConfig });
    };

    const handleLabelChange = (newLabel: string) => {
        setLabel(newLabel);
        onUpdate({ label: newLabel });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="font-medium text-white">Configure Node</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Node Label */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Node Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => handleLabelChange(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50"
                    />
                </div>

                {/* Node Type Info */}
                <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400">
                        <span className="font-medium text-white">Type:</span> {node.type.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        <span className="font-medium text-white">ID:</span> {node.id}
                    </p>
                </div>

                {/* Configuration Fields */}
                {fields.map((field) => (
                    <div key={field.label}>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                            {field.label}
                        </label>

                        {field.type === 'text' && (
                            <input
                                type="text"
                                value={(config[field.label.toLowerCase().replace(/\s+/g, '_')] as string) || ''}
                                onChange={(e) => handleConfigChange(field.label.toLowerCase().replace(/\s+/g, '_'), e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50"
                            />
                        )}

                        {field.type === 'number' && (
                            <input
                                type="number"
                                value={(config[field.label.toLowerCase().replace(/\s+/g, '_')] as number) || ''}
                                onChange={(e) => handleConfigChange(field.label.toLowerCase().replace(/\s+/g, '_'), parseFloat(e.target.value))}
                                placeholder={field.placeholder}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50"
                            />
                        )}

                        {field.type === 'textarea' && (
                            <textarea
                                value={(config[field.label.toLowerCase().replace(/\s+/g, '_')] as string) || ''}
                                onChange={(e) => handleConfigChange(field.label.toLowerCase().replace(/\s+/g, '_'), e.target.value)}
                                placeholder={field.placeholder}
                                rows={3}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F1C40F]/50 resize-none"
                            />
                        )}

                        {field.type === 'select' && (
                            <select
                                value={(config[field.label.toLowerCase().replace(/\s+/g, '_')] as string) || ''}
                                onChange={(e) => handleConfigChange(field.label.toLowerCase().replace(/\s+/g, '_'), e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F1C40F]/50"
                            >
                                <option value="">Select...</option>
                                {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onDelete}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Node
                </button>
            </div>
        </div>
    );
}
