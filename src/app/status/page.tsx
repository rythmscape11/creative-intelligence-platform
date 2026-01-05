import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

const SERVICES = [
  { name: 'Web Application', description: 'Dashboard + marketing tools', status: 'Operational' },
  { name: 'Strategy AI Engine', description: 'LLM-driven plan creation', status: 'Operational' },
  { name: 'API & Integrations', description: 'Webhooks + CRM sync', status: 'Operational' },
  { name: 'Authentication', description: 'NextAuth + SSO', status: 'Operational' },
  { name: 'Billing & Usage', description: 'Subscriptions + limits', status: 'Operational' },
];

export const metadata: Metadata = {
  title: 'Platform Status & Uptime | Aureon One',
  description:
    'Real-time view of Aureon One service health, uptime metrics, and incident history.',
  alternates: { canonical: '/status' },
};

export default function StatusPage() {
  return (
    <InfoPage
      badge="Updated automatically"
      title="System Status"
      description="Track the health of Aureon One services. Subscribe to alerts to receive proactive maintenance notifications."
      highlights={[
        { label: '30-day uptime', value: '99.9%' },
        { label: 'Past incidents', value: '0', detail: 'Last 30 days' },
      ]}
      sections={[
        {
          title: 'Incident Process',
          description:
            'We publish incident summaries within 15 minutes of detection and provide hourly updates until resolution.',
          items: [
            'Automated monitoring across regions and providers',
            'Escalation runbooks for AI, auth, and billing services',
            'Customer communications via in-app banner + email',
          ],
        },
      ]}
      secondaryCta={{ label: 'View developer roadmap', href: '/dev-status', variant: 'secondary' }}
      footerNote="Need historical uptime or compliance documentation? Email hello@aureonone.in for a full report."
    >
      <div className="space-y-4">
        {SERVICES.map((service) => (
          <div
            key={service.name}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-border-light-primary dark:border-border-primary bg-bg-light-secondary dark:bg-bg-tertiary p-4"
          >
            <div>
              <p className="text-lg font-semibold">{service.name}</p>
              <p className="text-sm text-text-light-secondary dark:text-text-secondary">{service.description}</p>
            </div>
            <span className="inline-flex items-center rounded-full border border-green-400/40 bg-green-500/10 px-4 py-1 text-sm font-medium text-green-500">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-green-400" aria-hidden />
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </InfoPage>
  );
}

