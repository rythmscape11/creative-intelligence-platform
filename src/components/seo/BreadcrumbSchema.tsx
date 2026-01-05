'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbSchema({ items, className = '' }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.aureonone.in${item.url}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-text-tertiary" />}
              {index === items.length - 1 ? (
                <span className="font-medium text-text-primary">{item.name}</span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-zinc-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export default BreadcrumbSchema;

