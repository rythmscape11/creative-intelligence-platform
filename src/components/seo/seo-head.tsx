import Head from 'next/head';
import { SEOMetadata } from '@/lib/services/seo-service';

interface SEOHeadProps {
  metadata: SEOMetadata;
}

export function SEOHead({ metadata }: SEOHeadProps) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && metadata.keywords.length > 0 && (
        <meta name="keywords" content={metadata.keywords.join(', ')} />
      )}
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metadata.ogTitle || metadata.title} />
      <meta property="og:description" content={metadata.ogDescription || metadata.description} />
      <meta property="og:type" content={metadata.ogType || 'website'} />
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      {metadata.canonical && <meta property="og:url" content={metadata.canonical} />}
      <meta property="og:site_name" content="MediaPlanPro" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={metadata.twitterCard || 'summary'} />
      <meta name="twitter:title" content={metadata.twitterTitle || metadata.title} />
      <meta name="twitter:description" content={metadata.twitterDescription || metadata.description} />
      {metadata.twitterImage && <meta name="twitter:image" content={metadata.twitterImage} />}
      <meta name="twitter:site" content="@mediaplanpro" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="MediaPlanPro" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Structured Data */}
      {metadata.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(metadata.structuredData),
          }}
        />
      )}

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}
