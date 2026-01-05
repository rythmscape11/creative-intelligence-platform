import { ContentSection } from '@/components/seo';

export function FrameworksSection() {
    return (
        <ContentSection id="frameworks" title="Copywriting Frameworks Explained">
            <p className="text-lg mb-4">
                Our generator uses proven psychological frameworks to structure your ad copy. Understanding these frameworks helps you choose the right one for your specific campaign goals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center font-bold text-blue-500">AIDA</div>
                        <h4 className="text-xl font-bold text-text-primary">Attention, Interest, Desire, Action</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        The classic marketing model. Grabs attention with a hook, builds interest with facts, creates desire with benefits, and prompts action.
                    </p>
                    <div className="bg-bg-tertiary p-3 rounded text-sm">
                        <p className="text-text-secondary"><strong>Best for:</strong> General awareness, new product launches, cold audiences.</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center font-bold text-red-500">PAS</div>
                        <h4 className="text-xl font-bold text-text-primary">Problem, Agitate, Solution</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Identifies a pain point, makes it feel urgent/uncomfortable, then presents your product as the perfect solution. Highly effective for conversion.
                    </p>
                    <div className="bg-bg-tertiary p-3 rounded text-sm">
                        <p className="text-text-secondary"><strong>Best for:</strong> Problem-aware audiences, service businesses, high-competition markets.</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center font-bold text-green-500">BAB</div>
                        <h4 className="text-xl font-bold text-text-primary">Before, After, Bridge</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Shows the current negative state (Before), the positive future state (After), and how your product gets them there (Bridge).
                    </p>
                    <div className="bg-bg-tertiary p-3 rounded text-sm">
                        <p className="text-text-secondary"><strong>Best for:</strong> Transformational products, fitness/health, coaching, software tools.</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center font-bold text-purple-500">FAB</div>
                        <h4 className="text-xl font-bold text-text-primary">Features, Advantages, Benefits</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Lists a feature, explains its advantage, and translates it into a tangible benefit for the user. Great for technical products.
                    </p>
                    <div className="bg-bg-tertiary p-3 rounded text-sm">
                        <p className="text-text-secondary"><strong>Best for:</strong> Tech products, gadgets, SaaS, complex services.</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center font-bold text-amber-500">4Ps</div>
                        <h4 className="text-xl font-bold text-text-primary">Picture, Promise, Prove, Push</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Paints a picture of success, promises a result, proves it with evidence, and pushes for action. Very persuasive and visual.
                    </p>
                    <div className="bg-bg-tertiary p-3 rounded text-sm">
                        <p className="text-text-secondary"><strong>Best for:</strong> Lifestyle brands, luxury goods, emotional purchases.</p>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center font-bold text-indigo-500">QUEST</div>
                        <h4 className="text-xl font-bold text-text-primary">Qualify, Understand, Educate, Stimulate, Transition</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-3">
                        Qualifies the reader, shows understanding, educates on the solution, stimulates interest, and transitions to the sale.
                    </p>
                    <div className="bg-bg-tertiary p-3 rounded text-sm">
                        <p className="text-text-secondary"><strong>Best for:</strong> B2B sales, high-ticket items, long sales cycles.</p>
                    </div>
                </div>
            </div>
        </ContentSection>
    );
}
