import { Metadata } from 'next';
import Link from 'next/link';
import { Code, Book, Zap, Rocket, Terminal, Key } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Developer Documentation | Aureon Forge',
    description: 'Build with Aureon Forge APIs. Access image generation, video creation, and automation flows programmatically.',
};

export default function DevelopersPage() {
    return (
        <main className="bg-[#050709] min-h-screen">
            {/* Hero */}
            <section className="px-6 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
                        <Code className="w-4 h-4" />
                        Developer Resources
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Build with Aureon Forge
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Access Flux, Runway, Kling, and BrandGuard via simple REST APIs.
                        Everything powered by Sparks.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/forge/api-keys"
                            className="inline-flex items-center justify-center gap-2 bg-[#B3001B] hover:bg-[#8F0016] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            <Key className="w-5 h-5" />
                            Get API Key
                        </Link>
                        <Link
                            href="/developers/docs"
                            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
                        >
                            <Book className="w-5 h-5" />
                            Read Docs
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quickstart */}
            <section className="px-6 py-16 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">Quickstart</h2>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#F1C40F]/20 flex items-center justify-center text-[#F1C40F] font-bold text-sm">1</div>
                                <h3 className="text-lg font-medium text-white">Get your API key</h3>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Navigate to the Forge dashboard and generate a new API key for your environment.
                            </p>
                            <Link href="/forge/api-keys" className="text-[#F1C40F] hover:underline text-sm">
                                Go to API Keys →
                            </Link>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#F1C40F]/20 flex items-center justify-center text-[#F1C40F] font-bold text-sm">2</div>
                                <h3 className="text-lg font-medium text-white">Generate your first image</h3>
                            </div>
                            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm mb-4">
                                <code className="text-gray-300">{`curl -X POST https://api.aureon.one/v1/images \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A sleek product photo of a coffee mug"}'`}</code>
                            </pre>
                            <p className="text-gray-500 text-sm">Uses Flux.1 by default. ~10 Sparks per generation.</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#F1C40F]/20 flex items-center justify-center text-[#F1C40F] font-bold text-sm">3</div>
                                <h3 className="text-lg font-medium text-white">Create a webhook-triggered flow</h3>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Build automation pipelines in the visual editor, then call them via webhook.
                            </p>
                            <Link href="/forge/flows" className="text-[#F1C40F] hover:underline text-sm">
                                Create your first flow →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* API Categories */}
            <section className="px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">API Endpoints</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Terminal className="w-5 h-5 text-blue-400" />
                                <h3 className="font-medium text-white">/v1/images</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Generate images with Flux.1. Supports LoRA and brand profiles.</p>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">POST</span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Terminal className="w-5 h-5 text-green-400" />
                                <h3 className="font-medium text-white">/v1/videos</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Create videos with Runway (Cinema) or Kling (Social).</p>
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">POST</span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Terminal className="w-5 h-5 text-purple-400" />
                                <h3 className="font-medium text-white">/v1/flows/:id/run</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Trigger a published flow with custom input payload.</p>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">POST</span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Terminal className="w-5 h-5 text-orange-400" />
                                <h3 className="font-medium text-white">/v1/assets/:id</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">Retrieve generated assets by ID. Returns signed GCS URLs.</p>
                            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">GET</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources */}
            <section className="px-6 py-16 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8">Resources</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/developers/docs" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors group">
                            <Book className="w-8 h-8 text-[#F1C40F] mb-4" />
                            <h3 className="font-medium text-white group-hover:text-[#F1C40F] transition-colors mb-2">Documentation</h3>
                            <p className="text-gray-400 text-sm">Complete API reference and guides</p>
                        </Link>

                        <Link href="/api-docs" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors group">
                            <Code className="w-8 h-8 text-[#F1C40F] mb-4" />
                            <h3 className="font-medium text-white group-hover:text-[#F1C40F] transition-colors mb-2">API Reference</h3>
                            <p className="text-gray-400 text-sm">OpenAPI spec and interactive explorer</p>
                        </Link>

                        <Link href="/status" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors group">
                            <Rocket className="w-8 h-8 text-[#F1C40F] mb-4" />
                            <h3 className="font-medium text-white group-hover:text-[#F1C40F] transition-colors mb-2">Status</h3>
                            <p className="text-gray-400 text-sm">API uptime and incident history</p>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
