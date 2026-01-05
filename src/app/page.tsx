import { Metadata } from 'next';
import { Hero } from '@/components/aureon/Hero';
import { ProductSuite } from '@/components/aureon/ProductSuite';
import { HowItWorks } from '@/components/aureon/HowItWorks';
import { GeoHighlight } from '@/components/aureon/GeoHighlight';
import { AudienceStrip } from '@/components/aureon/AudienceStrip';
import { PricingPreview } from '@/components/aureon/PricingPreview';
import { FinalCtaBand } from '@/components/aureon/FinalCtaBand';

export const metadata: Metadata = {
  title: 'Aureon One — Illuminate Your Marketing | AI Marketing OS',
  description: 'The AI-powered operating system for agencies and brands. Unifying strategy, GEO, analytics, optimisation, and execution in one intelligent cloud. Start free today.',
  keywords: ['AI marketing platform', 'marketing operating system', 'GEO engine', 'agency software', 'marketing automation', 'AI search optimisation'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Aureon One — Illuminate Your Marketing',
    description: 'The AI-powered operating system for agencies and brands. Strategy, GEO, analytics, and execution in one cloud.',
    type: 'website',
    url: 'https://aureonone.com',
    siteName: 'Aureon One',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aureon One — Illuminate Your Marketing',
    description: 'AI marketing OS. Strategy. GEO. Analytics. Execution. One cloud.',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Aureon One',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '499',
    offerCount: '3',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '500',
  },
  description: 'The AI-powered marketing operating system for agencies and brands. Unifying strategy, GEO, analytics, optimisation, and execution.',
  featureList: [
    'Agency OS - Projects & Client Management',
    'The Optimiser - AI Campaign Optimisation',
    'The Analyser - SEO & Competitor Intelligence',
    'GEO Engine - AI Search Optimisation',
    'The Strategiser - Strategy Builder',
    'Aureon Forge - Visual Automation & AI Content Generation',
  ],
  url: 'https://aureonone.com',
  author: {
    '@type': 'Organization',
    name: 'Aureon One',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <main id="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Product Suite - 5 Modules */}
        <ProductSuite />

        {/* How It Works - 3 Steps */}
        <HowItWorks />

        {/* GEO Engine Highlight */}
        <GeoHighlight />

        {/* Who It's For */}
        <AudienceStrip />

        {/* Pricing Preview */}
        <PricingPreview />

        {/* Final CTA */}
        <FinalCtaBand />
      </main>
    </div>
  );
}
