import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import '@/styles/design-system.css';
import '@/styles/blog-post.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { CurrencyProvider } from '@/contexts/currency-context';
import { SkipToContent } from '@/components/layout/skip-to-content';
import { Toaster as HotToaster } from 'react-hot-toast';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleTagManager } from '@/components/tracking/google-tag-manager';
import { FacebookPixel } from '@/components/tracking/facebook-pixel';
import { DynamicTrackingCodes } from '@/components/tracking/dynamic-tracking-codes';
import { ScrollToTop } from '@/components/layout/scroll-to-top';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Aureon One | AI Marketing OS',
    template: '%s | Aureon One',
  },
  description: 'Build professional marketing plans in minutes with AI. Export to PowerPoint, Word, or Excel. Free forever.',
  keywords: ['AI marketing', 'marketing plan builder', 'digital strategy generator', 'startup growth AI', 'Aureon One', 'marketing automation', 'free marketing tools', 'SEO tools', 'content marketing tools', 'social media tools'],
  authors: [{ name: 'Aureon One Team' }],
  creator: 'Aureon One',
  publisher: 'Aureon One',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Marketing OS – Aureon One',
    description: 'Plan smarter, grow faster with AI-powered marketing strategies.',
    siteName: 'Aureon One',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Marketing OS – Aureon One',
    description: 'Plan smarter, grow faster with AI-powered marketing strategies.',
    creator: '@aureonone',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'SSXN03xrfEmLcVb2T__zwbBBF9doy3yn6V5vkOtcbAw',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-64x64.png', type: 'image/png', sizes: '64x64' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Google Analytics - Standard Implementation */}
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
        )}

        {/* Prevent flash of unstyled content - Apply theme before render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SkipToContent />
        <CurrencyProvider>
          <Providers>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <ScrollToTop threshold={300} />
            <Toaster />
            <HotToaster position="top-right" />
          </Providers>
        </CurrencyProvider>
        {/* Tracking Scripts - Loaded at end of body for better performance */}
        <GoogleTagManager />
        <FacebookPixel />
        <DynamicTrackingCodes position="BODY_END" />
      </body>
    </html>
  );
}
