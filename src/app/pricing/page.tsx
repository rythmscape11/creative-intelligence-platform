import { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingHero, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Pricing that Scales with Your Team | Aureon One',
  description: 'Start with what you need today and add modules and usage as you grow.',
};

import { getFeatureFlags, FeatureKey } from '@/lib/features';

// ... metadata ...

export default async function PricingPage() {
  const flags = await getFeatureFlags();

  const getFeatureLabel = (featureName: string, key?: FeatureKey) => {
    if (!key) return featureName;
    const status = flags[key];
    if (status === 'COMING_SOON') return `${featureName} (Coming Soon)`;
    return featureName;
  };

  const plans = [
    {
      name: 'Starter',
      description: 'For solo marketers and small teams.',
      price: 'Free',
      period: '',
      features: [
        getFeatureLabel('Agency OS (basic)', 'agency_os'),
        getFeatureLabel('Strategiser (basic)', 'strategiser'),
        getFeatureLabel('Limited Analyser usage', 'analyser'),
        getFeatureLabel('Limited GEO Engine usage', 'geo_engine'),
      ],
      cta: { text: 'Start free', href: '/auth/signup' },
      highlight: false,
    },
    {
      name: 'Growth',
      description: 'For agencies and growing brands.',
      price: '₹4,999',
      period: '/month',
      features: [
        getFeatureLabel('Full Agency OS', 'agency_os'),
        getFeatureLabel('The Optimiser', 'optimiser'),
        getFeatureLabel('The Analyser (standard)', 'analyser'),
        getFeatureLabel('The Strategiser', 'strategiser'),
        getFeatureLabel('GEO Engine (standard)', 'geo_engine'),
        'Priority support',
      ],
      cta: { text: 'Talk to sales', href: '/contact' },
      highlight: true,
    },
    {
      name: 'Enterprise',
      description: 'For large teams and custom workflows.',
      price: 'Custom',
      period: '',
      features: [
        'All modules',
        'Custom usage limits',
        'Dedicated onboarding',
        'Custom integrations',
        'SLA & enterprise support',
      ],
      cta: { text: 'Contact us', href: '/contact' },
      highlight: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I switch plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.',
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer: 'Your data is preserved, but access to premium features (like advanced analytics or AI limits) may be restricted based on your new plan.',
    },
    {
      question: 'Do you offer a free trial for the Growth plan?',
      answer: 'We offer a 14-day free trial for the Growth plan so you can experience the full power of Aureon One.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption and follow strict security protocols to keep your marketing data safe.',
    },
  ];

  return (
    <main className="bg-[#0F172A] min-h-screen">
      {/* ... Hero ... */}
      <MarketingHero
        title="Pricing that scales with your team."
        subtitle="Start with what you need today and add modules and usage as you grow."
        primaryCta={{ text: 'Start free', href: '/auth/signup' }}
        secondaryCta={{ text: 'Talk to sales', href: '/contact' }}
      />

      {/* Plans */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border ${plan.highlight
                  ? 'bg-gradient-to-b from-[#3B82F6]/10 to-[#A78BFA]/5 border-[#3B82F6]/30'
                  : 'bg-white/5 border-white/10'
                  }`}
              >
                {/* ... Plan content ... */}
                {plan.highlight && (
                  <div className="text-xs font-medium text-[#3B82F6] uppercase tracking-wide mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[#F1F5F9] mb-2">{plan.name}</h3>
                <p className="text-[#94A3B8] mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#F1F5F9]">{plan.price}</span>
                  <span className="text-[#94A3B8]">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-[#94A3B8]">
                      <Check className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-6 ${plan.highlight
                    ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  asChild
                >
                  <Link href={plan.cta.href}>{plan.cta.text}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... FAQ and CTA ... */}


      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-[#0F172A] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[#F1F5F9] text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">{faq.question}</h3>
                <p className="text-[#94A3B8]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <CtaBand
        title="Ready to get started?"
        subtitle="Join modern marketing teams using Aureon One."
        primaryCta={{ text: 'Start free', href: '/auth/signup' }}
        secondaryCta={{ text: 'Book a demo', href: '/contact' }}
      />
    </main>
  );
}
