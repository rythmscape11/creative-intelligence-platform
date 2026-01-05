'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';

interface QuickAnswerProps {
  question: string;
  answer: string;
  className?: string;
}

/**
 * QuickAnswer Component
 *
 * Optimized for Google Featured Snippets with Schema.org markup
 *
 * Features:
 * - Structured data for search engines
 * - Clear question/answer format
 * - Optimal length for snippet extraction (40-60 words)
 * - Schema.org Question/Answer markup
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
      className={`bg-gradient-to-r from-zinc-500/10 to-gray-500/10 border-l-4 border-zinc-500 rounded-lg p-6 my-8 ${className}`}
      itemScope
      itemType="https://schema.org/Question"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Lightbulb className="w-6 h-6 text-zinc-400" />
        </div>
        <div className="flex-1">
          <h3
            className="text-lg font-bold text-text-primary mb-2"
            itemProp="name"
          >
            {question}
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
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickAnswer;

