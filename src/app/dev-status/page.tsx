import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

export const metadata: Metadata = {
  title: 'Platform Roadmap & Dev Status | Aureon One',
  description:
    'Track the Aureon One roadmap. See what shipped recently, what is in progress, and how to request priority for features your team needs.',
  alternates: { canonical: '/dev-status' },
};

const ROADMAP_SECTIONS = [
  {
    title: 'Currently Shipping',
    items: [
      'Enterprise-grade strategy template builder',
      'Multi-region governance + budget planning',
      'Team workspaces with granular RBAC controls',
      'Deep HubSpot and Salesforce CRM sync',
    ],
  },
  {
    title: 'Near-Term Roadmap',
    items: [
      'Open API + developer sandbox',
      'Scenario planner for global growth teams',
      'Attribution + data warehouse connectors',
      'Content calendar with publishing integrations',
    ],
  },
  {
    title: 'How to Prioritize Features',
    description:
      'We review roadmap requests weekly. Share details about the business impact so we can reach out for a working session.',
    items: [
      'Email hello@mediaplanpro.com with subject “Roadmap Request”',
      'Include the teams impacted and target timeframe',
      'We will reply within two business days with next steps',
    ],
  },
];

export default function DevStatusPage() {
  return (
    <InfoPage
      badge="Roadmap"
      title="Development Status"
      description="Everything we are building to make Aureon One enterprise-ready—from RBAC, auditing, and SLAs to new automation APIs."
      highlights={[
        { label: 'Last updated', value: new Date().toLocaleDateString() },
        { label: 'Active initiatives', value: '8', detail: 'Across product + platform' },
      ]}
      sections={ROADMAP_SECTIONS}
      primaryCta={{ label: 'Submit a feature request', href: '/contact' }}
      secondaryCta={{ label: 'Check system status', href: '/status', variant: 'secondary' }}
      footerNote="Need a signed enterprise roadmap or SLA documentation? Contact hello@aureonone.in."
    />
  );
}
