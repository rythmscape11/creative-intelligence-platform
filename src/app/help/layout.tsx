import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center - Support & Resources | Aureon One',
  description: 'Get help with Aureon One. Find answers to FAQs, browse video tutorials, read guides, and contact support. Access our comprehensive knowledge base 24/7.',
  keywords: ['help center', 'support', 'FAQ', 'tutorials', 'knowledge base', 'customer support'],
  alternates: {
    canonical: '/help',
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

