const normalizeUrl = (value) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const normalized = new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    return normalized.origin.replace(/\/$/, '');
  } catch (error) {
    console.warn(`Invalid URL provided in environment configuration: "${value}".`, error);
    return undefined;
  }
};

const defaultLocalUrl = 'http://localhost:3000';
const canonicalAppUrl = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
const explicitNextAuthUrl = normalizeUrl(process.env.NEXTAUTH_URL);
const vercelDetectedUrl = normalizeUrl(
  process.env.VERCEL_URL
    ? process.env.VERCEL_URL.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`
    : undefined
);

const resolvedNextAuthUrl =
  (process.env.NEXT_PUBLIC_APP_URL?.trim()) ||
  (process.env.NEXTAUTH_URL?.trim()) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultLocalUrl);

process.env.NEXTAUTH_URL = resolvedNextAuthUrl;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification for faster builds

  // Empty turbopack config to silence Next.js 16 Turbopack/Webpack conflict error
  turbopack: {},

  serverExternalPackages: ['@prisma/client'],
  experimental: {
    // Enable optimized package imports for commonly used libraries
    optimizePackageImports: ['lucide-react', 'react-hot-toast', '@heroicons/react'],
    // Enable optimized server components
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'mediaplanpro.com' },
      { protocol: 'https', hostname: 'www.mediaplanpro.com' },
      { protocol: 'https', hostname: 'cdn.mediaplanpro.com' },
      { protocol: 'https', hostname: 'mediaplanpro.s3.amazonaws.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: 'mediaplanpro-files.s3.us-east-1.amazonaws.com' },
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      // External image providers used for featured images and avatars
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable lazy loading by default
    loader: 'default',
    // Optimize image loading
    unoptimized: false,
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // Remove React properties in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mediaplanpro.com',
          },
        ],
        destination: 'https://www.mediaplanpro.com/:path*',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: '/api/graphql',
      },
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Add custom webpack rules
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Output configuration
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  // TypeScript configuration - ignore errors to prevent Vercel build hang
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration - ignore during builds to prevent Vercel hang
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance budgets
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Compression
  compress: true,

  // Generate ETags for pages
  generateEtags: true,

  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Powered by header
  poweredByHeader: false,

  // Production browser source maps
  productionBrowserSourceMaps: false,

  // Trailing slash
  trailingSlash: false,
};

// Export with Sentry only if configured
if (process.env.SENTRY_DSN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT) {
  const { withSentryConfig } = require('@sentry/nextjs');
  const sentryWebpackPluginOptions = {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  };
  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
} else {
  module.exports = nextConfig;
}
