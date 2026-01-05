export type AdFramework = 'AIDA' | 'PAS' | 'FAB' | '4Ps';
export type AdPlatform = 'google' | 'facebook' | 'linkedin' | 'twitter';

export interface AdCopyResult {
  headline: string;
  description: string;
  cta: string;
  framework: AdFramework;
  characterCount: { headline: number; description: number };
}

const CTA_OPTIONS = [
  'Shop Now', 'Learn More', 'Get Started', 'Sign Up Free', 'Try Now',
  'Download', 'Book Now', 'Get Quote', 'Join Today', 'Claim Offer'
];

export function generateAdCopy(
  product: string,
  benefit: string,
  framework: AdFramework,
  platform: AdPlatform
): AdCopyResult[] {
  const limits = getPlatformLimits(platform);
  const results: AdCopyResult[] = [];
  
  switch (framework) {
    case 'AIDA':
      results.push(...generateAIDA(product, benefit, limits));
      break;
    case 'PAS':
      results.push(...generatePAS(product, benefit, limits));
      break;
    case 'FAB':
      results.push(...generateFAB(product, benefit, limits));
      break;
    case '4Ps':
      results.push(...generate4Ps(product, benefit, limits));
      break;
  }
  
  return results;
}

function getPlatformLimits(platform: AdPlatform): { headline: number; description: number } {
  switch (platform) {
    case 'google':
      return { headline: 30, description: 90 };
    case 'facebook':
      return { headline: 40, description: 125 };
    case 'linkedin':
      return { headline: 70, description: 150 };
    case 'twitter':
      return { headline: 50, description: 280 };
    default:
      return { headline: 30, description: 90 };
  }
}

function generateAIDA(product: string, benefit: string, limits: any): AdCopyResult[] {
  // Attention, Interest, Desire, Action
  return [
    {
      headline: `Discover ${product}`,
      description: `${benefit}. Transform your results today with our proven solution.`,
      cta: CTA_OPTIONS[0],
      framework: 'AIDA' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `${product} - Game Changer`,
      description: `Tired of mediocre results? ${benefit}. Join thousands of satisfied customers.`,
      cta: CTA_OPTIONS[2],
      framework: 'AIDA' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `Why ${product} Works`,
      description: `${benefit}. See the difference in just days. Limited time offer!`,
      cta: CTA_OPTIONS[4],
      framework: 'AIDA' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    }
  ].map(ad => ({
    ...ad,
    characterCount: {
      headline: ad.headline.length,
      description: ad.description.length
    }
  }));
}

function generatePAS(product: string, benefit: string, limits: any): AdCopyResult[] {
  // Problem, Agitate, Solution
  return [
    {
      headline: `Struggling with Results?`,
      description: `Stop wasting time and money. ${product} delivers ${benefit}. Get started now.`,
      cta: CTA_OPTIONS[2],
      framework: 'PAS' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `The Solution You Need`,
      description: `Frustrated by slow progress? ${product} helps you ${benefit}. Try it risk-free.`,
      cta: CTA_OPTIONS[4],
      framework: 'PAS' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `End Your Frustration`,
      description: `${product} solves your biggest challenge. ${benefit}. Join us today!`,
      cta: CTA_OPTIONS[8],
      framework: 'PAS' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    }
  ].map(ad => ({
    ...ad,
    characterCount: {
      headline: ad.headline.length,
      description: ad.description.length
    }
  }));
}

function generateFAB(product: string, benefit: string, limits: any): AdCopyResult[] {
  // Features, Advantages, Benefits
  return [
    {
      headline: `${product} Features`,
      description: `Advanced technology that ${benefit}. Experience the advantage today.`,
      cta: CTA_OPTIONS[1],
      framework: 'FAB' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `Powered by Innovation`,
      description: `${product} combines cutting-edge features to ${benefit}. See it in action.`,
      cta: CTA_OPTIONS[4],
      framework: 'FAB' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `Built for Success`,
      description: `${product} delivers ${benefit} through proven technology. Start winning.`,
      cta: CTA_OPTIONS[2],
      framework: 'FAB' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    }
  ].map(ad => ({
    ...ad,
    characterCount: {
      headline: ad.headline.length,
      description: ad.description.length
    }
  }));
}

function generate4Ps(product: string, benefit: string, limits: any): AdCopyResult[] {
  // Picture, Promise, Prove, Push
  return [
    {
      headline: `Imagine ${benefit}`,
      description: `${product} makes it possible. Proven by thousands. Get started in minutes.`,
      cta: CTA_OPTIONS[2],
      framework: '4Ps' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `Your Success Awaits`,
      description: `We promise ${benefit} with ${product}. Backed by results. Try it now.`,
      cta: CTA_OPTIONS[4],
      framework: '4Ps' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    },
    {
      headline: `Transform Your Results`,
      description: `${product} guarantees ${benefit}. Trusted by industry leaders. Join today.`,
      cta: CTA_OPTIONS[8],
      framework: '4Ps' as AdFramework,
      characterCount: { headline: 0, description: 0 }
    }
  ].map(ad => ({
    ...ad,
    characterCount: {
      headline: ad.headline.length,
      description: ad.description.length
    }
  }));
}

