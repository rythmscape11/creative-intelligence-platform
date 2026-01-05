'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PRICING_FAQ } from '@/config/pricing';

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {PRICING_FAQ.map((faq, index) => (
        <div
          key={index}
          className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-hover transition-colors"
          >
            <span className="font-semibold text-text-primary pr-4">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          
          {openIndex === index && (
            <div className="px-6 pb-6">
              <p className="text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

