'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
  keywords?: string[]; // For SEO tracking
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQItem[];
  toolName: string;
  className?: string;
}

export function FAQSection({ title = 'Frequently Asked Questions', faqs, toolName, className = '' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  // Generate FAQ Schema (JSON-LD)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-12 ${className}`}>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          {title}
        </h2>
        <p className="text-lg text-text-secondary mb-8">
          Get answers to common questions about {toolName}
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-bg-tertiary border border-border-primary rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-bg-hover transition-colors rounded-lg"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-text-primary flex-1">
                  {faq.question}
                </h3>
                <span className="flex-shrink-0 text-text-tertiary mt-1">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-5 text-text-secondary leading-relaxed"
                >
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Export for use in other components
export default FAQSection;

