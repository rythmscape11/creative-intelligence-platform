'use client';

import { Check, X, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/contexts/currency-context';
import { PRICING_PLANS } from '@/config/pricing';

interface ComparisonFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  highlight?: boolean;
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    name: 'Strategy Sections',
    free: '5 Basic Sections',
    premium: '17 Comprehensive Sections',
    highlight: true,
  },
  {
    name: 'Executive Summary',
    free: true,
    premium: true,
  },
  {
    name: 'Target Audience Analysis',
    free: 'Basic',
    premium: 'Detailed Personas',
  },
  {
    name: 'Channel Strategy',
    free: 'Basic Recommendations',
    premium: 'Detailed Channel Mix',
  },
  {
    name: 'Budget Allocation',
    free: 'Simple Breakdown',
    premium: 'Detailed by Channel & Timeline',
  },
  {
    name: 'Implementation Timeline',
    free: false,
    premium: '90-Day Roadmap',
    highlight: true,
  },
  {
    name: 'Competitive Analysis',
    free: false,
    premium: true,
    highlight: true,
  },
  {
    name: 'Content Strategy',
    free: false,
    premium: true,
  },
  {
    name: 'SEO Strategy',
    free: false,
    premium: true,
  },
  {
    name: 'Social Media Strategy',
    free: false,
    premium: true,
  },
  {
    name: 'Email Marketing Strategy',
    free: false,
    premium: true,
  },
  {
    name: 'Paid Advertising Strategy',
    free: false,
    premium: true,
  },
  {
    name: 'KPIs & Success Metrics',
    free: 'Basic',
    premium: 'Comprehensive Dashboard',
  },
  {
    name: 'Risk Assessment',
    free: false,
    premium: true,
  },
  {
    name: 'Save Strategies',
    free: false,
    premium: 'Unlimited',
    highlight: true,
  },
  {
    name: 'Export to PDF',
    free: false,
    premium: true,
    highlight: true,
  },
  {
    name: 'Export to PowerPoint',
    free: false,
    premium: true,
  },
  {
    name: 'Export to Word',
    free: false,
    premium: true,
  },
  {
    name: 'Export to Excel',
    free: false,
    premium: true,
  },
  {
    name: 'Share Strategies',
    free: false,
    premium: true,
  },
  {
    name: 'Version History',
    free: false,
    premium: true,
  },
  {
    name: 'AI-Powered Insights',
    free: false,
    premium: true,
    highlight: true,
  },
  {
    name: 'Strategy Comparison',
    free: false,
    premium: true,
  },
  {
    name: 'Priority Support',
    free: false,
    premium: true,
  },
];

export function FreeVsPremiumComparison() {
  const { currency, formatPrice } = useCurrency();
  const proPlan = PRICING_PLANS.find(p => p.id === 'PRO');

  // Get monthly price
  const monthlyPrice = proPlan?.price.monthly || 20;
  // If currency is INR and we have explicit INR price, use it
  const priceToFormat = currency === 'INR' && proPlan?.priceInr?.monthly
    ? proPlan.priceInr.monthly
    : monthlyPrice;

  // If using explicit INR price, formatPrice handles it if we pass the number, 
  // but formatPrice assumes USD input and converts if currency is INR.
  // We need to check how formatPrice works.
  // Looking at previous learnings: "The formatPrice function within this context is used to display prices in the selected currency, converting USD amounts using a fixed USD_TO_INR_RATE of 85."
  // So if I pass INR amount to formatPrice, it might double convert if I'm not careful.
  // Let's check `src/lib/currency.ts` again or `src/contexts/currency-context.tsx`.
  // Actually, I should probably just use `formatPrice(monthlyPrice)` and let it handle conversion if I don't have explicit INR handling in `formatPrice` yet.
  // But wait, I added `priceInr` to `PRICING_PLANS`.
  // If `formatPrice` converts USD to INR, then passing USD `monthlyPrice` is correct.
  // BUT the user wants "uniform price". `pricing.ts` has explicit INR price ₹1,699.
  // $20 * 85 = ₹1,700. The explicit price is ₹1,699.
  // So I should use the explicit price.

  // Let's assume I need to handle the display manually if `formatPrice` doesn't support explicit override.
  // Or I can update `formatPrice` to support it, but that's a bigger change.
  // For now, I will implement logic here to display correctly.

  const displayPrice = currency === 'INR' && proPlan?.priceInr?.monthly
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(proPlan.priceInr.monthly)
    : formatPrice(monthlyPrice);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#0A0A0A] dark:to-[#1A1A1A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free vs Premium Strategy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start with our free strategy builder and upgrade anytime to unlock comprehensive features,
            export options, and AI-powered insights.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-gray-200 dark:border-[#2A2A2A] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#2A2A2A]">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features</h3>
            </div>
            <div className="col-span-1 text-center">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2A2A2A]">
                <Sparkles className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="font-semibold text-gray-900 dark:text-white">Free</span>
              </div>
            </div>
            <div className="col-span-1 text-center">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-700">
                <Crown className="w-5 h-5 text-white mr-2" />
                <span className="font-semibold text-white">Premium</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-[#2A2A2A]">
            {COMPARISON_FEATURES.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-4 transition-colors ${feature.highlight
                  ? 'bg-zinc-50/30 dark:bg-zinc-500/5'
                  : 'hover:bg-gray-50 dark:hover:bg-[#0A0A0A]'
                  }`}
              >
                {/* Feature Name */}
                <div className="col-span-1 flex items-center">
                  <span className={`text-sm md:text-base ${feature.highlight
                    ? 'font-semibold text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {feature.name}
                  </span>
                  {feature.highlight && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-500/20 text-zinc-800 dark:text-zinc-400">
                      Popular
                    </span>
                  )}
                </div>

                {/* Free Column */}
                <div className="col-span-1 flex items-center justify-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {feature.free}
                    </span>
                  )}
                </div>

                {/* Premium Column */}
                <div className="col-span-1 flex items-center justify-center">
                  {typeof feature.premium === 'boolean' ? (
                    feature.premium ? (
                      <Check className="w-5 h-5 text-zinc-900" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    )
                  ) : (
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center">
                      {feature.premium}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#2A2A2A]">
            <div className="col-span-1"></div>
            <div className="col-span-1 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Forever free</p>
              <button
                disabled
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>
            <div className="col-span-1 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {displayPrice}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Billed monthly</p>
              <Link
                href="/pricing"
                className="inline-block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-800 text-white font-semibold hover:from-zinc-800 hover:to-zinc-700 transition-all shadow-lg hover:shadow-xl"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 <strong>Pro Tip:</strong> Try the free version first, then upgrade when you need advanced features like export,
            save, and AI-powered insights.
          </p>
        </div>
      </div>
    </div>
  );
}
