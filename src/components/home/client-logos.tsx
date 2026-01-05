'use client';

import Image from 'next/image';

/**
 * Client Logos Component
 *
 * Displays trusted client logos to build credibility and trust above the fold
 * Features premium brands: Bosch, 3M, Tally, Nestle, AMD
 */
export function ClientLogos() {
  const clients = [
    {
      name: 'Bosch',
      displayName: 'BOSCH',
      font: 'font-bold tracking-tight',
      color: 'text-text-secondary',
    },
    {
      name: '3M',
      displayName: '3M',
      font: 'font-black tracking-normal',
      color: 'text-text-secondary',
    },
    {
      name: 'Tally',
      displayName: 'TALLY',
      font: 'font-bold tracking-wide',
      color: 'text-text-secondary',
    },
    {
      name: 'Nestle',
      displayName: 'Nestlé',
      font: 'font-semibold tracking-normal',
      color: 'text-text-secondary',
    },
    {
      name: 'AMD',
      displayName: 'AMD',
      font: 'font-black tracking-tight',
      color: 'text-text-secondary',
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-bg-secondary border-y border-gray-200 dark:border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-gray-500 dark:text-text-tertiary uppercase tracking-wider">
            Trusted by Marketing Teams at
          </p>
        </div>

        {/* Logo Grid - Text-based for professional appearance */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {clients.map((client, index) => (
            <div
              key={client.name}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Logo Container */}
              <div className="relative px-6 py-4 rounded-lg bg-white/50 dark:bg-bg-elevated/50 border border-gray-200/50 dark:border-border-primary/50 hover:border-blue-500/30 dark:hover:border-[#F59E0B]/30 transition-all duration-300 group-hover:bg-white dark:group-hover:bg-bg-elevated group-hover:shadow-lg group-hover:shadow-blue-500/10 dark:group-hover:shadow-black/20">
                <span className={`text-2xl md:text-3xl ${client.font} text-gray-600 dark:text-text-secondary opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                  {client.displayName}
                </span>
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 dark:from-[#F59E0B]/0 dark:via-[#F59E0B]/5 dark:to-[#F59E0B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust indicator */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500 dark:text-text-tertiary">
            Join 10,000+ marketing professionals from leading companies worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

