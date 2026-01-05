import { Metadata } from 'next';
import Link from 'next/link';
import { Book, FileText, History, Globe } from 'lucide-react';
import { MarketingHero } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Resources | Aureon One',
  description: 'Documentation, blog, changelog, and guides for Aureon One.',
};

const resources = [
  {
    icon: Book,
    title: 'Documentation',
    description: 'Technical guides and API reference for Aureon One.',
    href: '/docs',
  },
  {
    icon: FileText,
    title: 'Blog',
    description: 'Marketing insights, product updates, and GEO strategies.',
    href: '/blog',
  },
  {
    icon: History,
    title: 'Changelog',
    description: 'Latest releases, features, and improvements.',
    href: '/dev-status',
  },
  {
    icon: Globe,
    title: 'GEO Playbook',
    description: 'The complete guide to Generative Engine Optimisation.',
    href: '/geo-playbook',
  },
];

export default function ResourcesPage() {
  return (
    <main className="bg-[#0F172A] min-h-screen">
      {/* Hero */}
      <MarketingHero
        title="Resources"
        subtitle="Everything you need to get started and succeed with Aureon One."
        primaryCta={{ text: 'Read the docs', href: '/docs' }}
        secondaryCta={{ text: 'View blog', href: '/blog' }}
      />

      {/* Resources Grid */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {resources.map((resource, index) => (
              <Link
                key={index}
                href={resource.href}
                className="group bg-white/5 border border-white/10 rounded-xl p-8 hover:border-[#3B82F6]/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <resource.icon className="w-7 h-7 text-[#3B82F6]" />
                </div>

                <h3 className="text-xl font-semibold text-[#F1F5F9] mb-3">{resource.title}</h3>
                <p className="text-[#94A3B8] mb-4">{resource.description}</p>

                <span className="inline-flex items-center text-[#3B82F6] font-medium group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
