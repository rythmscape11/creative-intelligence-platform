'use client';

import { HelpCircle } from 'lucide-react';

interface QuickAnswerProps {
  question: string;
  answer: string;
  className?: string;
}

/**
 * QuickAnswer Component
 * 
 * Optimized for Google Featured Snippets
 * 
 * Features:
 * - Structured data for search engines
 * - Clear question/answer format
 * - Optimal length for snippet extraction (40-60 words)
 * - Schema.org markup ready
 * 
 * Usage:
 * ```tsx
 * <QuickAnswer
 *   question="What is a Headline Analyzer?"
 *   answer="A headline analyzer is a tool that scores your headlines 0-100 based on emotional impact, power words, and SEO best practices to help you write more engaging titles that drive clicks."
 * />
 * ```
 */
export function QuickAnswer({ question, answer, className = '' }: QuickAnswerProps) {
  return (
    <div
      className={`bg-gradient-to-br from-zinc-500/10 to-gray-500/10 border-2 border-zinc-500/30 rounded-lg p-6 mb-8 ${className}`}
      itemScope
      itemType="https://schema.org/Question"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 bg-zinc-500 rounded-full flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h2
            className="text-xl font-bold text-text-primary mb-3"
            itemProp="name"
          >
            {question}
          </h2>
          <div
            className="text-text-secondary leading-relaxed"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <p itemProp="text">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * QuickAnswerList Component
 * 
 * For multiple Q&A pairs (FAQ format)
 * Optimized for FAQ schema markup
 */
interface QuickAnswerListProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
}

export function QuickAnswerList({ items, className = '' }: QuickAnswerListProps) {
  return (
    <div
      className={`space-y-4 ${className}`}
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-bg-secondary border border-border-primary rounded-lg p-5 hover:border-zinc-400 transition-colors"
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
        >
          <h3
            className="text-lg font-semibold text-text-primary mb-2"
            itemProp="name"
          >
            {item.question}
          </h3>
          <div
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <p
              className="text-text-secondary leading-relaxed"
              itemProp="text"
            >
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * HowToStep Component
 * 
 * Optimized for HowTo schema markup and step-by-step snippets
 */
interface HowToStepProps {
  steps: Array<{
    name: string;
    text: string;
  }>;
  title?: string;
  className?: string;
}

export function HowToSteps({ steps, title = "How to Use", className = '' }: HowToStepProps) {
  return (
    <div
      className={`bg-bg-secondary border border-border-primary rounded-lg p-6 ${className}`}
      itemScope
      itemType="https://schema.org/HowTo"
    >
      {title && (
        <h2
          className="text-2xl font-bold text-text-primary mb-6"
          itemProp="name"
        >
          {title}
        </h2>
      )}
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex gap-4"
            itemScope
            itemProp="step"
            itemType="https://schema.org/HowToStep"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-zinc-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <h3
                className="font-semibold text-text-primary mb-1"
                itemProp="name"
              >
                {step.name}
              </h3>
              <p
                className="text-text-secondary leading-relaxed"
                itemProp="text"
              >
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * DefinitionBox Component
 * 
 * Optimized for definition snippets
 */
interface DefinitionBoxProps {
  term: string;
  definition: string;
  className?: string;
}

export function DefinitionBox({ term, definition, className = '' }: DefinitionBoxProps) {
  return (
    <div
      className={`bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-l-4 border-purple-500 rounded-r-lg p-5 mb-6 ${className}`}
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <dt
        className="text-lg font-bold text-text-primary mb-2"
        itemProp="name"
      >
        {term}
      </dt>
      <dd
        className="text-text-secondary leading-relaxed"
        itemProp="description"
      >
        {definition}
      </dd>
    </div>
  );
}

/**
 * ComparisonTable Component
 * 
 * Optimized for comparison snippets
 */
interface ComparisonTableProps {
  title?: string;
  items: Array<{
    feature: string;
    option1: string;
    option2: string;
  }>;
  option1Label: string;
  option2Label: string;
  className?: string;
}

export function ComparisonTable({
  title,
  items,
  option1Label,
  option2Label,
  className = ''
}: ComparisonTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-text-primary mb-4">{title}</h2>
      )}
      <table className="min-w-full bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-zinc-900 to-zinc-700 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Feature</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">{option1Label}</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">{option2Label}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-bg-hover transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-text-primary">{item.feature}</td>
              <td className="px-6 py-4 text-sm text-text-secondary">{item.option1}</td>
              <td className="px-6 py-4 text-sm text-text-secondary">{item.option2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

