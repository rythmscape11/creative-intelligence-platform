import { Metadata } from 'next';
import { InfoPage } from '@/components/marketing/InfoPage';

export const metadata: Metadata = {
  title: 'Community Hub - Events & Peer Support | Aureon One',
  description:
    'Join the Aureon One community to swap playbooks with growth leaders, attend live workshops, and get personalized advice on building better marketing plans.',
  alternates: { canonical: '/community' },
};

const SECTIONS = [
  {
    title: 'Ways to Participate',
    items: [
      'Private Slack community with weekly office hours',
      'Monthly live teardown of real marketing plans',
      'Quarterly benchmark reports for paid, lifecycle, and content channels',
      'Expert AMAs with CMOs, RevOps leaders, and AI specialists',
    ],
  },
  {
    title: 'Who You’ll Meet',
    description:
      'The community is designed for hands-on marketing operators who need actionable insight—not hype.',
    items: [
      'B2B and B2C marketing leaders scaling teams globally',
      'Agencies implementing Aureon One inside client retainers',
      'Growth PMs and RevOps teams aligning acquisition + lifecycle',
      'Analysts and performance marketers leveling up measurement rigor',
    ],
  },
];

export default function CommunityPage() {
  return (
    <InfoPage
      badge="Member-driven"
      title="Aureon One Community"
      description="A curated space for marketers and operators to share what’s working, compare benchmarks, and co-build the next generation of growth playbooks."
      highlights={[
        { label: 'Slack members', value: '1,200+', detail: 'Moderated, global community' },
        { label: 'Live sessions', value: '4x / month', detail: 'Workshops + AMAs' },
      ]}
      sections={SECTIONS}
      primaryCta={{ label: 'Request an invite', href: '/contact' }}
      secondaryCta={{ label: 'See help center', href: '/help', variant: 'secondary' }}
      footerNote="Invitations are reviewed weekly so we can keep the discussion constructive and spam-free."
    />
  );
}

