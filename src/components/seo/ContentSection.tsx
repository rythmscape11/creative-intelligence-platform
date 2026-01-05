'use client';

import React from 'react';

interface ContentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  level?: 2 | 3;
  className?: string;
}

export function ContentSection({ id, title, children, level = 2, className = '' }: ContentSectionProps) {
  const HeadingTag = `h${level}` as React.ElementType;

  const headingClasses = level === 2
    ? 'text-3xl sm:text-4xl font-bold text-text-primary mb-6'
    : 'text-2xl sm:text-3xl font-bold text-text-primary mb-4';

  return (
    <section id={id} className={`py-8 scroll-mt-24 ${className}`}>
      <HeadingTag className={headingClasses}>
        {title}
      </HeadingTag>
      <div className="prose prose-lg max-w-none text-text-secondary leading-relaxed dark:prose-invert">
        {children}
      </div>
    </section>
  );
}

export default ContentSection;

