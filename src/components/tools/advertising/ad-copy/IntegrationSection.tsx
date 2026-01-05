import { ContentSection } from '@/components/seo';

export function IntegrationSection() {
    return (
        <ContentSection id="integration" title="Integration with Your Marketing Workflow">
            <p className="text-lg mb-4">
                The Ad Copy Generator seamlessly integrates into your existing marketing workflow, enhancing efficiency at every stage of campaign development.
            </p>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Campaign Planning Phase</h3>
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-6">
                <p className="text-text-secondary leading-relaxed mb-4">
                    During initial campaign planning, use the generator to explore different messaging angles quickly. Generate 20-30 variations across multiple frameworks to identify which approaches resonate with your value proposition. This helps inform your overall campaign strategy before investing in creative assets.
                </p>
                <div className="bg-blue-500/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-400 mb-2">Workflow Integration:</p>
                    <ol className="text-sm text-blue-400 space-y-1 ml-4 list-decimal">
                        <li>Define campaign goals and target audience</li>
                        <li>Generate 5-10 variations per framework (AIDA, PAS, BAB)</li>
                        <li>Review with team and select top 3-5 approaches</li>
                        <li>Refine selected copy and align with creative brief</li>
                        <li>Use winning angles to guide visual creative development</li>
                    </ol>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Ad Creation & Launch</h3>
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-6">
                <p className="text-text-secondary leading-relaxed mb-4">
                    When creating ads in Google Ads, Facebook Ads Manager, or LinkedIn Campaign Manager, use the generator to quickly produce multiple variations for A/B testing. Export to CSV and import directly into your ad platform, or copy individual ads as needed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-bg-tertiary p-4 rounded-lg">
                        <h4 className="font-semibold text-text-primary mb-2">Google Ads</h4>
                        <p className="text-sm text-text-secondary">Generate responsive search ads with multiple headline and description variations. Export and upload via Google Ads Editor.</p>
                    </div>
                    <div className="bg-bg-tertiary p-4 rounded-lg">
                        <h4 className="font-semibold text-text-primary mb-2">Facebook Ads</h4>
                        <p className="text-sm text-text-secondary">Create primary text, headlines, and descriptions optimized for News Feed and Stories placements.</p>
                    </div>
                    <div className="bg-bg-tertiary p-4 rounded-lg">
                        <h4 className="font-semibold text-text-primary mb-2">LinkedIn Ads</h4>
                        <p className="text-sm text-text-secondary">Generate professional B2B copy with appropriate tone and terminology for decision-maker audiences.</p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Testing & Optimization</h3>
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-6">
                <p className="text-text-secondary leading-relaxed mb-4">
                    Use the generator to continuously create new test variations. When ad performance plateaus, generate fresh copy with different frameworks or angles. This keeps your campaigns performing optimally and prevents ad fatigue.
                </p>
                <div className="bg-green-500/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-green-400 mb-2">Optimization Cycle:</p>
                    <div className="space-y-2 text-sm text-green-400">
                        <p><strong>Week 1-2:</strong> Launch initial variations, gather baseline data</p>
                        <p><strong>Week 3:</strong> Analyze performance, identify winning elements</p>
                        <p><strong>Week 4:</strong> Generate new variations incorporating winning elements</p>
                        <p><strong>Week 5+:</strong> Test new variations against current champion</p>
                        <p><strong>Ongoing:</strong> Repeat cycle every 2-4 weeks to prevent ad fatigue</p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mt-8 mb-4">Complementary Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">→ Headline Analyzer</h4>
                    <p className="text-sm text-text-secondary">Score and optimize your generated headlines for maximum impact before launching campaigns.</p>
                </div>
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">→ Landing Page Analyzer</h4>
                    <p className="text-sm text-text-secondary">Ensure your landing page messaging matches your ad copy for better conversion rates.</p>
                </div>
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">→ ROI Calculator</h4>
                    <p className="text-sm text-text-secondary">Calculate expected returns and set appropriate budgets for your ad campaigns.</p>
                </div>
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">→ UTM Builder</h4>
                    <p className="text-sm text-text-secondary">Create tracking URLs to measure which ad copy variations drive the best results.</p>
                </div>
            </div>
        </ContentSection>
    );
}
