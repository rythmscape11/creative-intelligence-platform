import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type InfoHighlight = {
  label: string;
  value: string;
  detail?: string;
};

type InfoSection = {
  title: string;
  description?: string;
  items?: string[];
};

type InfoCTA = {
  label: string;
  href: string;
  variant?: 'default' | 'secondary';
};

interface InfoPageProps {
  badge?: string;
  title: string;
  description: string;
  highlights?: InfoHighlight[];
  sections?: InfoSection[];
  primaryCta?: InfoCTA;
  secondaryCta?: InfoCTA;
  children?: ReactNode;
  footerNote?: string;
}

/**
 * Shared marketing shell for footer-linked informational pages.
 * Keeps typography, spacing, and background tokens consistent across light/dark mode.
 */
export function InfoPage({
  badge,
  title,
  description,
  highlights,
  sections,
  primaryCta,
  secondaryCta,
  children,
  footerNote,
}: InfoPageProps) {
  return (
    <div className="min-h-screen bg-bg-light-primary dark:bg-bg-primary text-text-light-primary dark:text-text-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-border-light-primary dark:border-border-primary bg-white dark:bg-bg-secondary shadow-2xl shadow-primary/5 p-8 sm:p-12">
          {badge && (
            <span className="inline-flex items-center rounded-full border border-border-light-primary dark:border-border-primary bg-bg-light-secondary dark:bg-bg-tertiary px-4 py-1 text-xs font-semibold uppercase tracking-widest text-text-light-secondary dark:text-text-secondary">
              {badge}
            </span>
          )}

          <header className="mt-6 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
            <p className="text-lg text-text-light-secondary dark:text-text-secondary leading-relaxed">
              {description}
            </p>
          </header>

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {primaryCta && (
                <Link href={primaryCta.href} className="sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    {primaryCta.label}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="sm:w-auto">
                  <Button
                    size="lg"
                    variant={secondaryCta.variant === 'secondary' ? 'outline' : 'secondary'}
                    className="w-full sm:w-auto"
                  >
                    {secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
          )}

          {highlights && highlights.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border-light-primary dark:border-border-primary bg-bg-light-secondary/80 dark:bg-bg-tertiary/60 p-5"
                >
                  <p className="text-sm font-medium text-text-light-tertiary dark:text-text-secondary">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold mt-2">{item.value}</p>
                  {item.detail && (
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary mt-1">
                      {item.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {sections && sections.length > 0 && (
            <div className="mt-12 space-y-10">
              {sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                  {section.description && (
                    <p className="text-text-light-secondary dark:text-text-secondary leading-relaxed">
                      {section.description}
                    </p>
                  )}
                  {section.items && (
                    <ul className="space-y-2 text-text-light-secondary dark:text-text-secondary">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 h-2 w-2 rounded-full bg-accent-highlight dark:bg-accent-secondary" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          {children && <div className="mt-12">{children}</div>}

          {footerNote && (
            <p className="mt-12 text-sm text-text-light-tertiary dark:text-text-secondary">
              {footerNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

