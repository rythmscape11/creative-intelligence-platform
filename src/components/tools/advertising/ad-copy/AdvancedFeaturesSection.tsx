import { ContentSection } from '@/components/seo';
import { BookOpen, Target, Zap, Award, TrendingUp } from 'lucide-react';

export function AdvancedFeaturesSection() {
    return (
        <ContentSection id="advanced-features" title="Advanced Features">
            <p className="text-lg mb-4">
                Beyond basic ad copy generation, our tool includes powerful features that help you optimize, test, and scale your advertising campaigns effectively.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="text-xl font-bold text-text-primary">Multi-Variant Generation</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Generate up to 10 unique variations in a single click, each with different angles, benefits, or emotional triggers. Perfect for A/B testing and finding your winning message.
                    </p>
                    <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Different headline approaches</li>
                        <li>• Varied benefit focuses</li>
                        <li>• Multiple CTA styles</li>
                        <li>• Tone variations</li>
                    </ul>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-400" />
                        </div>
                        <h4 className="text-xl font-bold text-text-primary">Platform Optimization</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Automatically adjusts copy to meet platform-specific requirements including character limits, formatting guidelines, and best practices for each advertising channel.
                    </p>
                    <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Google Ads: 30/90 character limits</li>
                        <li>• Facebook: 125 character primary text</li>
                        <li>• LinkedIn: Professional tone</li>
                        <li>• Twitter: 280 character total</li>
                    </ul>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-bold text-text-primary">Real-Time Character Count</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        See exactly how many characters you're using and get warnings when approaching platform limits. Ensures your ads meet requirements before you launch.
                    </p>
                    <ul className="text-sm text-text-secondary space-y-1">
                        <li>• Live character counting</li>
                        <li>• Platform limit warnings</li>
                        <li>• Optimization suggestions</li>
                        <li>• Mobile preview</li>
                    </ul>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-amber-600" />
                        </div>
                        <h4 className="text-xl font-bold text-text-primary">Framework Recommendations</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Get intelligent suggestions on which copywriting framework works best for your specific product, audience, and campaign goals based on historical performance data.
                    </p>
                    <ul className="text-sm text-text-secondary space-y-1">
                        <li>• AI-powered suggestions</li>
                        <li>• Industry-specific recommendations</li>
                        <li>• Audience awareness matching</li>
                        <li>• Goal-based selection</li>
                    </ul>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                        </div>
                        <h4 className="text-xl font-bold text-text-primary">Performance Tracking</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Premium users can track which generated ads perform best, building a library of winning formulas specific to their business and audience.
                    </p>
                    <ul className="text-sm text-text-secondary space-y-1">
                        <li>• CTR tracking</li>
                        <li>• Conversion monitoring</li>
                        <li>• Framework performance</li>
                        <li>• Historical comparisons</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-500/30 rounded-lg p-6 mt-8">
                <h4 className="text-lg font-bold text-purple-400 mb-3">🚀 Coming Soon: AI Learning</h4>
                <p className="text-purple-400 leading-relaxed">
                    Our upcoming AI learning feature will analyze your best-performing ads and automatically adapt future generations to match your winning patterns. The more you use the tool, the better it gets at creating copy that resonates with your specific audience.
                </p>
            </div>
        </ContentSection>
    );
}
