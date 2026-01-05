import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

const HELP_CATEGORIES = [
  {
    title: 'Getting Started',
    description: 'Create your workspace, invite teammates, and launch your first AI strategy.',
    resources: ['Workspace setup checklist', 'Role-based permissions', 'Sample kickoff agenda'],
  },
  {
    title: 'Strategy Builder',
    description: 'Deep dive into inputs, AI prompts, exports, and collaboration workflows.',
    resources: ['Input best practices', 'Using templates + variations', 'Export configuration'],
  },
  {
    title: 'Analytics & Reporting',
    description: 'Connect data sources, track KPIs, and monitor plan performance.',
    resources: ['Attribution + CRM sync', 'Custom dashboards', 'Executive summaries'],
  },
  {
    title: 'Billing & Security',
    description: 'Manage invoices, limits, and compliance documentation.',
    resources: ['Usage limits + alerts', 'SAML + SSO setup', 'Data protection FAQ'],
  },
];

export const metadata: Metadata = {
  title: 'Help Center & Support | Aureon One',
  description:
    'Find tutorials, troubleshoot issues, and contact the Aureon One support team. Available worldwide with < 1 business day response times.',
  alternates: { canonical: '/help' },
};

export default function HelpPage() {
  return (
    <InfoPage
      badge="Support"
      title="Help Center"
      description="Self-serve guides plus real humans when you need them. Our team covers US, EMEA, and APAC time zones."
      highlights={[
        { label: 'Avg. response time', value: '< 4 hrs' },
        { label: 'Coverage', value: '6 days/week' },
      ]}
      sections={[
        {
          title: 'How to Reach Us',
          items: [
            'Submit a ticket inside the app or email hello@aureonone.in',
            'Chat with us weekdays 8am–6pm ET via the dashboard messenger',
            'Join weekly onboarding clinics for live Q&A',
          ],
        },
      ]}
      primaryCta={{ label: 'Contact support', href: '/contact' }}
      secondaryCta={{ label: 'Visit documentation', href: '/docs', variant: 'secondary' }}
      footerNote="Need priority support or an SLA? Let us know so we can add your workspace to the enterprise queue."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HELP_CATEGORIES.map((category) => (
          <div
            key={category.title}
            className="rounded-2xl border border-border-light-primary dark:border-border-primary bg-bg-light-secondary dark:bg-bg-tertiary p-6"
          >
            <h3 className="text-xl font-semibold">{category.title}</h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary mt-2">
              {category.description}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-text-light-secondary dark:text-text-secondary">
              {category.resources.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-highlight dark:bg-accent-secondary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}

