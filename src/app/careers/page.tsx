import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

export const metadata: Metadata = {
  title: 'Careers at Aureon One | Join the Team',
  description:
    'Help us build the future of AI-assisted marketing strategy. Explore open roles and learn about life at Aureon One.',
  alternates: { canonical: '/careers' },
};

const SECTIONS = [
  {
    title: 'What We Look For',
    items: [
      'Operators who understand the realities of marketing at scale',
      'Craft-focused engineers and designers shipping enterprise-ready UX',
      'Customer-obsessed success managers who partner with GTM leaders',
    ],
  },
  {
    title: 'Benefits & Culture',
    items: [
      'Remote-first with quarterly in-person summits',
      'Competitive compensation, equity, and wellness stipend',
      'Flexible PTO, comprehensive health coverage, and parental leave',
      'Annual learning budget and mentorship pairing',
    ],
  },
];

const OPENING_STATES = [
  { label: 'Product & Design', status: 'Hiring soon' },
  { label: 'Engineering & Data', status: 'Hiring' },
  { label: 'Customer Success', status: 'Hiring soon' },
  { label: 'Marketing & RevOps', status: 'Open now' },
];

export default function CareersPage() {
  return (
    <InfoPage
      badge="Careers"
      title="Build marketing software operators love."
      description="We are assembling a multidisciplinary team across product, AI, and go-to-market. If you obsess over helping marketers win, let’s talk."
      highlights={[
        { label: 'Team members', value: '35', detail: 'Product, GTM, CX' },
        { label: 'Working hubs', value: 'Remote • NYC • London • Singapore' },
      ]}
      sections={SECTIONS}
      primaryCta={{ label: 'Contact recruiting', href: 'mailto:hello@aureonone.in' }}
      secondaryCta={{ label: 'Learn about Aureon One', href: '/about', variant: 'secondary' }}
      footerNote="Don’t see the perfect role? Send your portfolio to hello@aureonone.in and we’ll reach out."
    >
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPENING_STATES.map((opening) => (
          <div
            key={opening.label}
            className="rounded-2xl border border-border-light-primary dark:border-border-primary bg-bg-light-secondary dark:bg-bg-tertiary p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-text-light-secondary dark:text-text-secondary">Track</p>
              <p className="text-lg font-semibold">{opening.label}</p>
            </div>
            <span className="text-sm font-medium text-text-light-tertiary dark:text-text-secondary">
              {opening.status}
            </span>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}

