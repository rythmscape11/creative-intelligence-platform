import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

export const metadata: Metadata = {
  title: 'Marketing Plan Templates | Aureon One',
  description:
    'Access ready-to-use marketing plan templates tailored for different industries, funnel stages, and regions. Export to decks, docs, or spreadsheets.',
  alternates: { canonical: '/templates' },
};

const SECTIONS = [
  {
    title: 'Template Library',
    description:
      'We are finalizing an interactive library you can filter by audience, funnel stage, and business model. The first wave of templates includes:',
    items: [
      'B2B enterprise ABM playbooks',
      'Consumer subscription lifecycle programs',
      'Marketplace acquisition + retention strategies',
      'Regional launch kits (NA, EMEA, APAC, LATAM)',
    ],
  },
  {
    title: 'Format Options',
    items: [
      'Editable PowerPoint + Google Slides decks for exec reviews',
      'Structured Word/Docs templates for narrative plans',
      'CSV/Excel exports for KPI and budget modeling',
      'Interactive Aureon One canvases for collaboration',
    ],
  },
];

export default function TemplatesPage() {
  return (
    <InfoPage
      title="Marketing Templates"
      description="Premium strategy templates curated by Aureon One strategists. Customize in minutes, export anywhere, and keep stakeholders aligned."
      highlights={[
        { label: 'Templates available', value: '25+' },
        { label: 'Formats', value: 'Slides • Docs • Spreadsheets' },
      ]}
      sections={SECTIONS}
      primaryCta={{ label: 'Get Started', href: '/auth/signup' }}
      secondaryCta={{ label: 'Generate a custom plan', href: '/auth/signup', variant: 'secondary' }}
      footerNote="Already using Aureon One? Templates will appear directly in your dashboard."
    />
  );
}
