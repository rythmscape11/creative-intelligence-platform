'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Calculator,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Info,
    Lightbulb,
    Zap,
    TrendingUp,
    Share2,
    Download,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getCalculatorBySlug,
    calculateResult,
    formatResult,
    CalculatorConfig,
    CalculatorInput,
} from '@/config/calculators';

export default function CalculatorPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [calculator, setCalculator] = useState<CalculatorConfig | null>(null);
    const [inputs, setInputs] = useState<Record<string, number>>({});
    const [result, setResult] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const calc = getCalculatorBySlug(slug);
        if (calc) {
            setCalculator(calc);
            // Initialize with default values
            const defaultInputs: Record<string, number> = {};
            calc.inputs.forEach(input => {
                defaultInputs[input.id] = input.defaultValue || 0;
            });
            setInputs(defaultInputs);
        } else {
            router.push('/tools');
        }
    }, [slug, router]);

    const handleInputChange = (id: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setInputs(prev => ({ ...prev, [id]: numValue }));
        setShowResult(false);
    };

    const handleCalculate = () => {
        if (calculator) {
            const calcResult = calculateResult(calculator.formula, inputs);
            setResult(calcResult);
            setShowResult(true);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({
                title: calculator?.title,
                text: calculator?.description,
                url,
            });
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formattedResult = useMemo(() => {
        if (result === null || !calculator) return '';
        return formatResult(result, calculator.resultFormat);
    }, [result, calculator]);

    if (!calculator) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Breadcrumb */}
            <div className="bg-bg-secondary border-b border-border-primary">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-text-secondary">
                        <Link href="/tools" className="hover:text-text-primary">
                            Tools
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/tools/calculators" className="hover:text-text-primary">
                            Calculators
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-text-primary">{calculator.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6">
                        <Calculator className="w-4 h-4" />
                        Free Marketing Calculator
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                        {calculator.title}
                    </h1>

                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        {calculator.description}
                    </p>
                </div>

                {/* Calculator Card */}
                <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 mb-8">
                    {/* Inputs */}
                    <div className="space-y-6 mb-8">
                        {calculator.inputs.map((input: CalculatorInput) => (
                            <div key={input.id}>
                                <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                                    {input.label}
                                    {input.helpText && (
                                        <span className="text-text-tertiary font-normal">
                                            ({input.helpText})
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    {input.type === 'currency' && (
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                                            $
                                        </span>
                                    )}
                                    <input
                                        type="number"
                                        value={inputs[input.id] || ''}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        placeholder={input.placeholder}
                                        min={input.min}
                                        max={input.max}
                                        step={input.step || 1}
                                        className={`w-full px-4 py-3 bg-bg-tertiary border border-border-primary rounded-xl text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${input.type === 'currency' ? 'pl-8' : ''
                                            }`}
                                    />
                                    {input.type === 'percentage' && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                                            %
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Calculate Button */}
                    <Button
                        onClick={handleCalculate}
                        className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white py-6 text-lg font-semibold rounded-xl"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate {calculator.resultLabel}
                    </Button>

                    {/* Result */}
                    {showResult && result !== null && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-xl text-center">
                            <p className="text-sm text-text-secondary mb-2">{calculator.resultLabel}</p>
                            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                {formattedResult}
                            </p>

                            {/* Quick Actions */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    {copied ? 'Copied!' : 'Share'}
                                </Button>
                                <Link href="/strategy-generator">
                                    <Button size="sm" className="gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Get Full Strategy
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Insights Section */}
                <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-6">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        Industry Insights
                    </div>

                    <div className="space-y-4">
                        {calculator.insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <p className="text-text-secondary">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upgrade CTA */}
                <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Zap className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-text-primary mb-2">
                                Unlock Pro Features
                            </h3>
                            <p className="text-text-secondary mb-4">
                                Get deeper insights with our Pro plan. Track trends, compare channels, and export detailed reports.
                            </p>

                            <ul className="space-y-2 mb-6">
                                {calculator.proFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2 text-text-secondary">
                                        <Star className="w-4 h-4 text-purple-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/pricing?plan=pro">
                                    <Button className="bg-purple-500 hover:bg-purple-600 gap-2">
                                        Upgrade to Pro - $49/mo
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href="/strategy-generator">
                                    <Button variant="outline" className="gap-2">
                                        Try Free Strategy
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Calculators */}
                {calculator.relatedTools.length > 0 && (
                    <div className="border-t border-border-primary pt-8">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Related Calculators
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {calculator.relatedTools.map((tool) => (
                                <Link
                                    key={tool}
                                    href={`/tools/calculators/${tool}`}
                                    className="px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-secondary hover:text-text-primary hover:border-cyan-500/50 transition-all"
                                >
                                    {tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* SEO Content */}
                <div className="mt-12 pt-8 border-t border-border-primary">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                        How to Use This {calculator.title}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-text-secondary mb-4">
                            Our free {calculator.title.toLowerCase()} helps marketers and business owners make data-driven decisions.
                            Simply enter your numbers in the fields above to calculate your {calculator.resultLabel.toLowerCase()}.
                        </p>
                        <p className="text-text-secondary mb-4">
                            Understanding your {calculator.resultLabel.toLowerCase()} is crucial for optimizing your marketing spend
                            and maximizing ROI. Use the insights provided to benchmark your performance against industry standards.
                        </p>
                        <p className="text-text-secondary">
                            Want to take your marketing to the next level? Upgrade to our Pro plan for advanced analytics,
                            trend tracking, and personalized recommendations based on your specific business goals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
