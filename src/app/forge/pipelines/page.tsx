'use client';

import { Layers, Sparkles, ArrowRight } from 'lucide-react';

const templates = [
    {
        id: 'brief-to-storyboard',
        name: 'Brief to Storyboard',
        description: 'Transform a creative brief into a complete visual storyboard with images and copy.',
        nodes: ['Trigger', 'LLM', 'BrandGuard', 'Image', 'Notification'],
        sparksEstimate: '~25 sparks/run',
        icon: '📋',
    },
    {
        id: 'product-feed-to-ads',
        name: 'Product Feed to Ads',
        description: 'Generate ad creatives from product catalog data with brand compliance.',
        nodes: ['Trigger', 'BrandGuard', 'Image', 'HTTP'],
        sparksEstimate: '~15 sparks/run',
        icon: '🛍️',
    },
    {
        id: 'content-repurpose',
        name: 'Content Repurposer',
        description: 'Take one piece of content and generate variants for multiple platforms.',
        nodes: ['Trigger', 'LLM', 'Image', 'Video', 'Notification'],
        sparksEstimate: '~75 sparks/run',
        icon: '🔄',
    },
    {
        id: 'social-campaign',
        name: 'Social Campaign Generator',
        description: 'Create a full social media campaign from a single theme or product.',
        nodes: ['Trigger', 'LLM', 'BrandGuard', 'Image', 'Image', 'Notification'],
        sparksEstimate: '~35 sparks/run',
        icon: '📱',
    },
    {
        id: 'video-shorts',
        name: 'Video Shorts Pipeline',
        description: 'Generate short-form video content for TikTok, Reels, and Shorts.',
        nodes: ['Trigger', 'LLM', 'Video', 'Notification'],
        sparksEstimate: '~55 sparks/run',
        icon: '🎬',
    },
    {
        id: 'email-sequence',
        name: 'Email Sequence Builder',
        description: 'Create personalized email sequences with dynamic content.',
        nodes: ['Trigger', 'LLM', 'Condition', 'HTTP'],
        sparksEstimate: '~10 sparks/run',
        icon: '✉️',
    },
];

export default function PipelinesPage() {
    const handleUseTemplate = (templateId: string) => {
        // In a full implementation, this would create a flow from the template
        alert(`Creating flow from template: ${templateId}\n\nThis feature will create a pre-configured flow based on the selected template.`);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Pipeline Templates</h1>
                <p className="text-gray-400 mt-1">Pre-built automation templates to get started quickly</p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] hover:border-[#F1C40F]/30 transition-all group"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#F1C40F]/10 flex items-center justify-center text-2xl">
                                {template.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-white group-hover:text-[#F1C40F] transition-colors">
                                    {template.name}
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <Sparkles className="w-3 h-3" />
                                    {template.sparksEstimate}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">{template.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {template.nodes.map((node, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded"
                                >
                                    {node}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => handleUseTemplate(template.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#B3001B]/20 text-[#B3001B] border border-[#B3001B]/30 rounded-lg hover:bg-[#B3001B] hover:text-white transition-colors font-medium"
                        >
                            Use Template
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Custom Flow CTA */}
            <div className="mt-8 bg-gradient-to-r from-[#F1C40F]/10 to-transparent border border-[#F1C40F]/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-white">Need something custom?</h2>
                        <p className="text-gray-400 mt-1">Build your own flow from scratch with the visual editor</p>
                    </div>
                    <a
                        href="/forge/flows"
                        className="flex items-center gap-2 bg-[#F1C40F] text-black px-4 py-2.5 rounded-lg font-medium hover:bg-[#F1C40F]/90 transition-colors"
                    >
                        <Layers className="w-4 h-4" />
                        Create Custom Flow
                    </a>
                </div>
            </div>
        </div>
    );
}
