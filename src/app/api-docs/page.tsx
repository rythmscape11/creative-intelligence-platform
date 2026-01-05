import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

export const metadata: Metadata = {
  title: 'API Documentation - Developer Platform | Aureon One',
  description:
    'Explore the Aureon One API roadmap. Learn about authentication, available endpoints, and delivery timelines for automating strategy creation.',
  alternates: { canonical: '/api-docs' },
};

const SECTIONS = [
  {
    title: 'What to Expect at Launch',
    description:
      'Our public API is in active development. The first release focuses on strategy generation, reporting, and usage analytics so you can embed Aureon One intelligence inside your workflow.',
    items: [
      'OAuth 2.0 + API key authentication flows',
      'Strategy creation, retrieval, and export endpoints',
      'Usage metering + account-level limits',
      'Webhook notifications for completed plans',
      'SDK starters for TypeScript and Python',
    ],
  },
  {
    title: 'Development Timeline',
    items: [
      'Q1 2025: Private beta with selected agency partners',
      'Q2 2025: Expanded beta + sandbox dashboard',
      'Q3 2025: Public release with self-serve onboarding',
      'Continuous: Endpoint expansion and ecosystem integrations',
    ],
  },
  {
    title: 'How to Get Involved',
    description:
      'We are curating an initial group of developers. Tell us about your use case so we can prioritize features and notify you when access opens.',
    items: [
      'Agencies automating client strategy creation',
      'Product teams embedding growth recommendations',
      'Analytics groups enriching marketing data warehouses',
      'Education partners building curriculum or training tools',
    ],
  },
];

export default function APIDocsPage() {
  return (
    <InfoPage
      badge="Developer Preview"
      title="Aureon One API"
      description="Programmatically generate marketing strategies, export deliverables, and monitor usage with a secure API designed for enterprise workflows."
      highlights={[
        { label: 'Current Status', value: 'Private beta', detail: 'Invite-only access' },
        { label: 'Authentication', value: 'OAuth 2.0 + API keys' },
      ]}
      sections={SECTIONS}
      primaryCta={{ label: 'Request early access', href: '/contact' }}
      secondaryCta={{ label: 'View platform status', href: '/status', variant: 'secondary' }}
      footerNote="Questions about the roadmap? Email hello@aureonone.in and we’ll reach out within one business day."
    />
  );
}

