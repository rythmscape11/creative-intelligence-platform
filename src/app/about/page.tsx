import { Metadata } from 'next';
import Image from 'next/image';
import { MarketingHero, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
  title: 'About Aureon One',
  description:
    'Learn about Aureon One — the AI-powered marketing operating system built for the future of search and performance.',
};

const values = [
  {
    title: 'Clarity',
    description: 'We believe marketing should be understandable, measurable, and actionable.',
  },
  {
    title: 'Responsibility with AI',
    description: 'We use AI to augment human decision-making, not replace it.',
  },
  {
    title: 'Continuous improvement',
    description: 'We ship fast, learn faster, and iterate with our users.',
  },
];

const milestones = [
  { year: '2024', event: 'Aureon One founded' },
  { year: '2024', event: 'GEO Engine launched' },
  { year: '2025', event: 'Full product suite released' },
  { year: 'Next', event: 'Enterprise partnerships & API' },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0F172A] min-h-screen">
      {/* Hero */}
      <MarketingHero
        title="About Aureon One"
        subtitle="The AI-powered marketing operating system built for the future of search and performance."
        primaryCta={{ text: 'Join us', href: '/auth/signup' }}
        secondaryCta={{ text: 'Contact', href: '/contact' }}
      />

      {/* Story */}
      <section className="py-20 lg:py-28 bg-[#0F172A]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F1F5F9] mb-6">Why we built Aureon One</h2>
            <div className="prose prose-lg prose-invert">
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                Marketing teams today are drowning in data, scattered across dozens of platforms,
                with no single source of truth. At the same time, AI is transforming how people
                discover content — from traditional search to AI Overviews and chat-based
                interfaces.
              </p>
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                We built Aureon One to be the operating system that brings it all together:
                strategy, analysis, optimisation, and execution in one intelligent cloud. Our GEO
                Engine helps you prepare for the next wave of search, while our suite of modules
                keeps your team aligned and moving fast.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Aureon One is for agencies, brands, and growth leaders who want clarity in a world
                of complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-[#0F172A] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[#F1F5F9] text-center mb-12">Our values</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-[#3B82F6] mb-3">{value.title}</h3>
                <p className="text-[#94A3B8]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 lg:py-28 bg-[#0F172A] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[#F1F5F9] text-center mb-12">Milestones</h2>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6] to-[#A78BFA]" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-6 pl-12 relative">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-[#3B82F6]/20 border-2 border-[#3B82F6] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    </div>
                    <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                      <span className="text-[#3B82F6] font-medium mr-3">
                        {milestone.year}
                      </span>
                      <span className="text-[#F1F5F9]">{milestone.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <CtaBand
        title="Join the Aureon One community."
        primaryCta={{ text: 'Start free', href: '/auth/signup' }}
        secondaryCta={{ text: 'Talk to us', href: '/contact' }}
      />
    </main>
  );
}
