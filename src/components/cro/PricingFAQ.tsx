'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately, and we\'ll prorate any charges.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and UPI through Razorpay. Enterprise customers can also pay via invoice.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Pro and Team plans come with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial period.',
  },
  {
    question: 'What happens to my saved results if I downgrade?',
    answer: 'Your saved results are never deleted. If you downgrade to Free, you\'ll keep all your existing saved results but won\'t be able to save new ones until you upgrade again.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time from your dashboard. Your access will continue until the end of your billing period.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Save 17% when you choose annual billing on Pro or Team plans. That\'s 2 months free!',
  },
  {
    question: 'What\'s included in the Enterprise plan?',
    answer: 'Enterprise includes everything in Team plus: unlimited team members, white-label branding, API access, dedicated account manager, custom integrations, and SLA guarantees. Contact us for custom pricing.',
  },
  {
    question: 'How does the 14-day free trial work?',
    answer: 'Sign up for Pro or Team, add your payment method, and get full access for 14 days. We\'ll send you a reminder before charging. Cancel anytime during the trial for no charge.',
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate FAQ Schema (JSON-LD)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="space-y-4">
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {FAQS.map((faq, index) => (
          <div
            key={index}
            className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-hover transition-colors"
            >
              <span className="font-medium text-text-primary pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-text-tertiary flex-shrink-0 transition-transform ${openIndex === index ? 'transform rotate-180' : ''
                  }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4 text-text-secondary">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

