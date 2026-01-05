import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | Aureon One',
  description: 'Contact Aureon One for sales, support, partnerships, or questions. Reach us via email, phone, or contact form. Get responses within 24 hours on business days.',
  keywords: ['contact', 'contact us', 'support', 'sales', 'customer service', 'get in touch'],
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

