import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

export const metadata: Metadata = {
  title: 'Documentation - Product Guides & Tutorials | Aureon One',
  description:
    'Browse product documentation for Aureon One. Learn how to build strategies, export deliverables, and integrate the platform into your workflow.',
  alternates: { canonical: '/docs' },
};

const SECTIONS = [
  {
    title: 'Documentation Structure',
    description:
      'We are reorganizing product docs to make it easier to find the answers you need in minutes. The new doc site will include:',
    items: [
      'Getting started walkthroughs for marketers, agencies, and admins',
      'Deep dives on AI strategy generation, scoring, and exports',
      'Integration guides for HubSpot, Salesforce, and custom CRMs',
      'Success checklists for onboarding stakeholders and clients',
    ],
  },
  {
    title: 'Request Early Access',
    description:
      'Want to preview draft guides or share feedback? We are looking for contributors to test new recipes and implementation checklists.',
    items: [
      'Share specific doc gaps slowing your team down',
      'Co-create best practices with the Aureon One product team',
      'Get a weekly digest of newly published recipes',
    ],
  },
];

export default function DocsPage() {
  return (
    <InfoPage
      badge="Docs refresh"
      title="Aureon One Documentation"
      description="A searchable knowledge base with walkthroughs, integration guides, and governance checklists designed for modern marketing teams."
      highlights={[
        { label: 'New articles', value: '50+', detail: 'Rolling out through Q1' },
        { label: 'Formats', value: 'Guides • Recipes • Videos' },
      ]}
      sections={SECTIONS}
      primaryCta={{ label: 'Share documentation feedback', href: '/contact' }}
      secondaryCta={{ label: 'Visit the help center', href: '/help', variant: 'secondary' }}
      footerNote="Existing documentation is still available within the platform. This refresh ensures parity in both light and dark themes."
    />
  );
}

