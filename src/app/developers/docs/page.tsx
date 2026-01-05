import { Metadata } from 'next';
import Link from 'next/link';
import { Book, Key, Workflow, Webhook, Shield, Zap, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'API Documentation | Aureon Forge',
    description: 'Complete documentation for the Aureon Forge API. Learn how to integrate image generation, video creation, and automation flows.',
};

const docSections = [
    {
        title: 'Authentication',
        description: 'Learn how to authenticate with the Forge API using API keys.',
        icon: Key,
        href: '#authentication',
    },
    {
        title: 'Rate Limits',
        description: 'Understand rate limiting and how to optimize your requests.',
        icon: Zap,
        href: '#rate-limits',
    },
    {
        title: 'Image Generation',
        description: 'Generate images with Flux.1, including LoRA and brand profiles.',
        icon: '🖼️',
        href: '#images',
    },
    {
        title: 'Video Generation',
        description: 'Create videos with Runway (Cinema) or Kling (Social) modes.',
        icon: '🎬',
        href: '#videos',
    },
    {
        title: 'Flows & Automation',
        description: 'Trigger and manage automation flows programmatically.',
        icon: Workflow,
        href: '#flows',
    },
    {
        title: 'Webhooks',
        description: 'Set up inbound webhooks to trigger flows from external systems.',
        icon: Webhook,
        href: '#webhooks',
    },
    {
        title: 'BrandGuard',
        description: 'Use BrandGuard for automatic prompt compliance and rewriting.',
        icon: Shield,
        href: '#brandguard',
    },
];

export default function DocsPage() {
    return (
        <main className="bg-[#050709] min-h-screen">
            {/* Header */}
            <section className="px-6 py-16 border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link href="/developers" className="hover:text-white">Developers</Link>
                        <span>/</span>
                        <span className="text-white">Documentation</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-4">Forge API Documentation</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Everything you need to integrate Aureon Forge into your applications.
                        Generate images, videos, and automate creative workflows.
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid gap-4">
                        {docSections.map((section, i) => (
                            <a
                                key={i}
                                href={section.href}
                                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] hover:border-[#F1C40F]/30 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F1C40F]/10 flex items-center justify-center text-xl">
                                    {typeof section.icon === 'string' ? section.icon : <section.icon className="w-6 h-6 text-[#F1C40F]" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-white group-hover:text-[#F1C40F] transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">{section.description}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#F1C40F] transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Authentication Section */}
            <section id="authentication" className="px-6 py-12 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>

                    <p className="text-gray-400 mb-6">
                        All API requests require an API key in the Authorization header. Generate keys in the
                        <Link href="/forge/api-keys" className="text-[#F1C40F] hover:underline mx-1">Forge dashboard</Link>.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Request Header</h3>
                        <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
                            <code className="text-gray-300">Authorization: Bearer frg_live_your_api_key_here</code>
                        </pre>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-200 text-sm">
                            <strong>Note:</strong> Sandbox keys (frg_test_*) are for testing and don't consume Sparks.
                            Production keys (frg_live_*) consume Sparks from your account.
                        </p>
                    </div>
                </div>
            </section>

            {/* Rate Limits Section */}
            <section id="rate-limits" className="px-6 py-12 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Rate Limits</h2>

                    <p className="text-gray-400 mb-6">
                        Rate limits are applied per API key. Default limits can be customized in the dashboard.
                    </p>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-white/10">
                                <th className="py-3 pr-4">Tier</th>
                                <th className="py-3 pr-4">Requests/min</th>
                                <th className="py-3">Concurrent</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            <tr className="border-b border-white/5">
                                <td className="py-3 pr-4">Freelancer</td>
                                <td className="py-3 pr-4">30</td>
                                <td className="py-3">5</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-3 pr-4">Studio</td>
                                <td className="py-3 pr-4">60</td>
                                <td className="py-3">10</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-3 pr-4">Agency</td>
                                <td className="py-3 pr-4">120</td>
                                <td className="py-3">20</td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4">Enterprise</td>
                                <td className="py-3 pr-4">Custom</td>
                                <td className="py-3">Custom</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* More sections would follow... */}
        </main>
    );
}
