import { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Workflow, Key, Webhook, BarChart3, Shield, Cpu, Cloud, ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Aureon Forge - Agentic Dev & Automation Studio | Aureon One',
    description: 'Build programmable pipelines on top of Flux, Runway, Kling, and BrandGuard with full Sparks-aware observability. The automation layer for creative teams.',
    openGraph: {
        title: 'Aureon Forge - Agentic Dev & Automation Studio',
        description: 'Build programmable pipelines on top of Flux, Runway, Kling, and BrandGuard.',
    },
};

const features = [
    {
        icon: Key,
        title: 'API-First Access',
        description: 'Generate secure API keys for sandbox and production environments. Full control over scopes and rate limits.',
    },
    {
        icon: Workflow,
        title: 'Visual Flow Builder',
        description: 'Build automation pipelines with a drag-and-drop interface. Connect LLM, image, video, and notification nodes.',
    },
    {
        icon: Webhook,
        title: 'Webhooks & Events',
        description: 'Trigger flows from external systems with secure webhooks. HMAC signature verification included.',
    },
    {
        icon: BarChart3,
        title: 'Observability',
        description: 'Track Sparks usage, run history, and node-level execution logs. Debug with detailed timelines.',
    },
    {
        icon: Shield,
        title: 'BrandGuard Integration',
        description: 'Every generation passes through your brand compliance rules. Automatic prompt rewriting and policy enforcement.',
    },
    {
        icon: Cloud,
        title: 'Enterprise Ready',
        description: 'Built on Google Cloud with VPC support, SOC2 compliance path, and dedicated solutions architecture.',
    },
];

const nodeTypes = [
    { name: 'Trigger', desc: 'Webhook, Scheduled, Manual' },
    { name: 'LLM', desc: 'Gemini / Vertex AI' },
    { name: 'Image', desc: 'Flux.1 via Fal.ai' },
    { name: 'Video', desc: 'Runway / Kling' },
    { name: 'BrandGuard', desc: 'Compliance checks' },
    { name: 'Condition', desc: 'Branching logic' },
    { name: 'HTTP', desc: 'External API calls' },
    { name: 'Notification', desc: 'Email / Slack / Webhook' },
];

export default function ForgeProductPage() {
    return (
        <main className="bg-[#050709] min-h-screen">
            {/* Hero */}
            <section className="px-6 py-24 lg:py-32">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-[#F1C40F]/10 border border-[#F1C40F]/30 text-[#F1C40F] text-sm font-medium px-4 py-2 rounded-full mb-8">
                        <Zap className="w-4 h-4" />
                        Now Available
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Aureon Forge
                        <span className="block text-[#F1C40F]">Agentic Dev & Automation Studio</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                        Build programmable pipelines on top of Flux, Runway, Kling, and BrandGuard
                        with full Sparks-aware observability. The automation layer for creative teams.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 bg-[#B3001B] hover:bg-[#8F0016] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            Talk to Sales
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/developers/docs"
                            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-colors"
                        >
                            View Developer Docs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-6 py-20 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Agents that understand your creative stack
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Forge flows orchestrate briefs, images, videos, and compliance—all while tracking every Spark.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F1C40F]/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-[#F1C40F]" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Flows Section */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Visual flows, real APIs
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Design automation pipelines visually, then trigger them via API or webhook.
                                Each node executes in order, deducting Sparks and logging outputs.
                            </p>

                            <div className="space-y-3">
                                {nodeTypes.map((node, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#B3001B]/20 flex items-center justify-center">
                                            <Cpu className="w-4 h-4 text-[#B3001B]" />
                                        </div>
                                        <div>
                                            <span className="text-white font-medium">{node.name}</span>
                                            <span className="text-gray-500 ml-2 text-sm">{node.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="text-xs font-mono text-gray-400 mb-2">cURL Example</div>
                            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
                                <code className="text-gray-300">{`curl -X POST \\
  https://api.aureon.one/v1/flows/run \\
  -H "Authorization: Bearer frg_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "flowId": "flow_abc123",
    "input": {
      "brief": "Summer sale campaign",
      "brand": "brand_xyz"
    }
  }'`}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Governance Section */}
            <section className="px-6 py-20 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Governance & Compliance Built In
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-12">
                        Every flow run is logged, every Spark tracked. BrandGuard ensures all generations
                        comply with your brand guidelines.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <Shield className="w-10 h-10 text-[#F1C40F] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">BrandGuard</h3>
                            <p className="text-gray-400 text-sm">Automatic prompt rewriting to enforce brand compliance</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <BarChart3 className="w-10 h-10 text-[#F1C40F] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Sparks Tracking</h3>
                            <p className="text-gray-400 text-sm">Per-node cost tracking with org-level budgets</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <Cloud className="w-10 h-10 text-[#F1C40F] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Google Cloud</h3>
                            <p className="text-gray-400 text-sm">Enterprise-grade security with VPC deployment options</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to automate your creative stack?
                    </h2>
                    <p className="text-gray-400 mb-10">
                        Get started with Forge today. All plans include API access and basic flows.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 bg-[#F1C40F] hover:bg-[#F1C40F]/90 text-black px-8 py-4 rounded-lg font-semibold transition-colors"
                        >
                            View Pricing
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-colors"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
