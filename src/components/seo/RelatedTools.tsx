'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface RelatedTool {
  name: string;
  description: string;
  url: string;
  category: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
  className?: string;
}

export function RelatedTools({ tools, title = 'Related Tools', className = '' }: RelatedToolsProps) {
  return (
    <section className={`py-12 bg-bg-tertiary rounded-lg border border-border-primary ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          {title}
        </h2>
        <p className="text-lg text-text-secondary mb-8">
          Explore complementary tools to enhance your marketing workflow
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.url}
              className="bg-bg-secondary border border-border-primary rounded-lg p-6 hover:shadow-lg hover:border-[#F59E0B] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-full">
                  {tool.category}
                </span>
                <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-[#F59E0B] group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-[#F59E0B] transition-colors">
                {tool.name}
              </h3>

              <p className="text-text-secondary text-sm leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedTools;

