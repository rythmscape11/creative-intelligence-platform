import { ContentSection } from '@/components/seo';

export function GlossarySection() {
    return (
        <ContentSection id="glossary" title="Ad Copy Terminology">
            <p className="text-lg mb-4">
                Understanding key advertising and copywriting terms helps you create more effective campaigns and communicate better with your marketing team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary border-l-4 border-amber-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Click-Through Rate (CTR)</h4>
                    <p className="text-sm text-text-secondary">Percentage of people who click your ad after seeing it. Formula: (Clicks ÷ Impressions) × 100. Industry average: 2-5% for search ads, 0.5-1.5% for display ads.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Conversion Rate (CVR)</h4>
                    <p className="text-sm text-text-secondary">Percentage of ad clicks that result in desired action (purchase, signup, download). Formula: (Conversions ÷ Clicks) × 100. Good CVR varies by industry: 2-5% for e-commerce, 10-15% for B2B.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Call-to-Action (CTA)</h4>
                    <p className="text-sm text-text-secondary">The specific action you want users to take (e.g., "Buy Now," "Start Free Trial," "Learn More"). Strong CTAs use action verbs and create urgency.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-purple-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Value Proposition</h4>
                    <p className="text-sm text-text-secondary">The unique benefit or solution your product provides. Answers "Why should I choose you?" Should be clear, specific, and differentiated from competitors.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Ad Fatigue</h4>
                    <p className="text-sm text-text-secondary">When your audience sees the same ad too many times, causing declining performance. Symptoms: dropping CTR, rising CPC. Solution: Refresh copy every 2-4 weeks.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-indigo-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Quality Score (Google Ads)</h4>
                    <p className="text-sm text-text-secondary">Google's 1-10 rating of ad relevance, landing page experience, and expected CTR. Higher scores = lower costs and better ad positions. Improve with relevant copy and message match.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-pink-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Power Words</h4>
                    <p className="text-sm text-text-secondary">Emotionally charged words that trigger psychological responses (e.g., "Free," "Proven," "Guaranteed," "Exclusive"). Use 2-3 per ad for maximum impact without oversaturation.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-orange-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Social Proof</h4>
                    <p className="text-sm text-text-secondary">Evidence that others trust your product (testimonials, user counts, ratings, certifications). Examples: "Join 50,000+ users," "4.8/5 stars," "As seen in Forbes."</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-teal-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">A/B Testing (Split Testing)</h4>
                    <p className="text-sm text-text-secondary">Running two ad variations simultaneously to determine which performs better. Test one element at a time (headline, description, or CTA) for clear insights.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-cyan-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Cost Per Acquisition (CPA)</h4>
                    <p className="text-sm text-text-secondary">How much you spend to acquire one customer. Formula: Total Ad Spend ÷ Conversions. Lower CPA = more efficient campaigns. Improve with better targeting and copy.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-lime-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">FOMO (Fear of Missing Out)</h4>
                    <p className="text-sm text-text-secondary">Psychological trigger using scarcity and urgency to motivate action. Examples: "Limited time," "Only 5 left," "Sale ends tonight." Must be genuine to maintain trust.</p>
                </div>

                <div className="bg-bg-secondary border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-bold text-text-primary mb-2">Message Match</h4>
                    <p className="text-sm text-text-secondary">Consistency between ad copy and landing page messaging. If ad says "Free Trial," landing page should prominently feature free trial. Improves conversion rates and Quality Score.</p>
                </div>
            </div>
        </ContentSection>
    );
}
