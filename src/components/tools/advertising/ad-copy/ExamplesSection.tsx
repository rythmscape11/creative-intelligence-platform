import { ContentSection } from '@/components/seo';

export function ExamplesSection() {
    return (
        <ContentSection id="examples" title="Ad Copy Examples">
            <p className="text-lg mb-4">
                See how different frameworks transform the same product into unique, compelling ad copy.
            </p>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Google Ads Examples</h3>

            <div className="space-y-6">
                <div className="bg-bg-secondary border-2 border-border-primary rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">SaaS Product - AIDA Framework</span>
                        <span className="text-xs text-text-secondary">CTR: 4.8% | CVR: 12.5%</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Headline 1</p>
                            <p className="text-lg font-bold text-blue-400">Boost Team Productivity 50%</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Headline 2</p>
                            <p className="text-lg font-bold text-blue-400">#1 Rated Project Management Tool</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Description</p>
                            <p className="text-text-secondary">Stop missing deadlines. Our AI-powered tool automates workflows so you can focus on work that matters. Start free trial today.</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-primary">
                        <p className="text-sm text-text-secondary"><strong>Why it works:</strong> Strong benefit in headline (50%), social proof (#1 Rated), clear problem/solution in description</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border-2 border-border-primary rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold bg-red-500/10 text-red-400 px-3 py-1 rounded-full">E-commerce - PAS Framework</span>
                        <span className="text-xs text-text-secondary">CTR: 6.7% | CVR: 9.8%</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Headline</p>
                            <p className="text-lg font-bold text-blue-400">Tired of Uncomfortable Shoes?</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Description</p>
                            <p className="text-text-secondary">Our ergonomic sneakers end foot pain for good. 30-day comfort guarantee. Free shipping & returns.</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Call-to-Action</p>
                            <span className="inline-block bg-red-600 text-white px-4 py-2 rounded font-medium text-sm">Shop Now</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-primary">
                        <p className="text-sm text-text-secondary"><strong>Why it works:</strong> Identifies pain point (uncomfortable shoes), promises solution, reduces risk with guarantee</p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-12 mb-4">Facebook Ads Examples</h3>

            <div className="space-y-6">
                <div className="bg-bg-secondary border-2 border-border-primary rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">Online Course - BAB Framework</span>
                        <span className="text-xs text-text-secondary">CTR: 4.3% | CVR: 15.2%</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Primary Text</p>
                            <p className="text-text-secondary">From struggling freelancer to $10K/month in 90 days 📈 Learn the exact system I used to land high-paying clients consistently. Join 5,000+ students.</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Headline</p>
                            <p className="text-lg font-bold text-blue-400">Master Freelance Success</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Call-to-Action</p>
                            <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded font-medium text-sm">Enroll Now</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-primary">
                        <p className="text-sm text-text-secondary"><strong>Why it works:</strong> Shows transformation (before/after), specific numbers ($10K, 90 days), social proof (5,000+ students)</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border-2 border-border-primary rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold bg-green-500/10 text-green-400 px-3 py-1 rounded-full">Local Service - PAS Framework</span>
                        <span className="text-xs text-text-secondary">CTR: 5.9% | CVR: 22.1%</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Primary Text</p>
                            <p className="text-text-secondary">AC broken in this heat? 🥵 Don't suffer another day. Same-day emergency repairs available. Licensed technicians, 5-star rated, 1-year warranty on all work.</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Headline</p>
                            <p className="text-lg font-bold text-blue-400">24/7 AC Repair - Call Now</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Call-to-Action</p>
                            <span className="inline-block bg-green-600 text-white px-4 py-2 rounded font-medium text-sm">Call Now</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-primary">
                        <p className="text-sm text-text-secondary"><strong>Why it works:</strong> Urgency (broken AC), immediate solution (same-day), trust signals (licensed, 5-star, warranty)</p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-12 mb-4">LinkedIn Ads Examples</h3>

            <div className="space-y-6">
                <div className="bg-bg-secondary border-2 border-border-primary rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">B2B SaaS - FAB Framework</span>
                        <span className="text-xs text-text-secondary">CTR: 2.8% | CVR: 18.5%</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Introductory Text</p>
                            <p className="text-text-secondary">CFOs: Reduce month-end close from 10 days to 2 days with automated reconciliation. Our AI-powered platform handles 95% of manual tasks, giving your team time for strategic analysis.</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Headline</p>
                            <p className="text-lg font-bold text-blue-400">Automate Financial Close Process</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Call-to-Action</p>
                            <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded font-medium text-sm">Request Demo</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border-primary">
                        <p className="text-sm text-text-secondary"><strong>Why it works:</strong> Targets specific role (CFOs), quantifies benefit (10 days to 2 days), professional tone</p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-12 mb-4">Before & After Comparisons</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-red-500/10 border-2 border-red-300 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">❌</span>
                        <h4 className="text-lg font-bold text-red-400">Weak Ad Copy</h4>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-red-700 mb-1">Headline</p>
                            <p className="font-semibold text-text-primary">Buy Our Software</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-700 mb-1">Description</p>
                            <p className="text-text-secondary text-sm">We have great features and good prices. Many customers use our product.</p>
                        </div>
                        <div>
                            <p className="text-xs text-red-700 mb-1">CTA</p>
                            <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded text-sm">Click Here</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-red-300">
                        <p className="text-sm text-red-400"><strong>Problems:</strong> Generic, no specific benefits, weak CTA, no urgency or proof</p>
                    </div>
                </div>

                <div className="bg-green-500/10 border-2 border-green-300 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✅</span>
                        <h4 className="text-lg font-bold text-green-400">Strong Ad Copy</h4>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-green-700 mb-1">Headline</p>
                            <p className="font-semibold text-text-primary">Cut Project Delays by 40%</p>
                        </div>
                        <div>
                            <p className="text-xs text-green-700 mb-1">Description</p>
                            <p className="text-text-secondary text-sm">See exactly what's blocking progress with real-time dashboards. Trusted by 10,000+ teams. Free 14-day trial.</p>
                        </div>
                        <div>
                            <p className="text-xs text-green-700 mb-1">CTA</p>
                            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm">Start Free Trial</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-300">
                        <p className="text-sm text-green-400"><strong>Strengths:</strong> Specific benefit (40%), clear value, social proof, removes risk, action-oriented CTA</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#F59E0B]/10 border-l-4 border-amber-500 p-6 mt-8">
                <h4 className="text-lg font-bold text-[#F59E0B] mb-3">📝 Copy Template Formula</h4>
                <div className="space-y-2 text-text-secondary">
                    <p><strong>Headline:</strong> [Specific Benefit] + [Number/Timeframe]</p>
                    <p><strong>Description:</strong> [How it works] + [Social Proof] + [Risk Reversal]</p>
                    <p><strong>CTA:</strong> [Action Verb] + [What They Get]</p>
                    <p className="text-sm mt-3 italic">Example: "Increase Sales by 35%" + "Our CRM automates follow-ups so you never miss opportunities. Join 5,000+ sales teams. 30-day guarantee." + "Start Free Trial"</p>
                </div>
            </div>
        </ContentSection>
    );
}
