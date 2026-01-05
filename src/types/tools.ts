export type ToolCategory = 'content' | 'seo' | 'social' | 'email' | 'advertising';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  href: string;
  isPro: boolean;
  value: number; // Monthly value in USD
}

export interface ToolUsageLimit {
  canUse: boolean;
  remaining: number;
  limit: number;
  isPro: boolean;
  usedToday: number;
  isAuthenticated?: boolean;
  message?: string;
}

export interface ExportOptions {
  copy?: boolean;
  pdf?: boolean;
  csv?: boolean;
  json?: boolean;
}

// ROI Calculator Types
export interface ROIInput {
  investment: number;
  revenue: number;
  costs?: number;
  customers?: number;
  avgOrderValue?: number;
  customerLifetimeMonths?: number;
}

export interface ROIOutput {
  roi: string;
  roas: string;
  cac: string;
  clv: string;
  breakEven: number;
  profitMargin: string;
  netProfit: string;
  // Enhanced metrics
  ltvCacRatio?: string;
  paybackPeriod?: number;
  grossProfit?: string;
  mer?: string;
  revenuePerCustomer?: string;
  acquisitionEfficiency?: string;
  insights?: string[];
  recommendations?: string[];
}

// CPC/CPM Calculator Types
export interface AdMetrics {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  cpc?: number;
  cpm?: number;
  cpa?: number;
  ctr?: number;
  conversionRate?: number;
  platform?: string;
  // Enhanced fields
  insights?: string[];
  recommendations?: string[];
}

// Engagement Calculator Types
export interface EngagementInput {
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  posts?: number;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
}

export interface EngagementOutput {
  engagementRate: string;
  rating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  benchmark: string;
  totalEngagements: number;
  // Enhanced metrics
  avgEngagementsPerPost?: string;
  commentToLikeRatio?: string;
  shareRate?: string;
  viralityScore?: string;
  insights?: string[];
  recommendations?: string[];
}

// SERP Preview Types
export interface SERPInput {
  title: string;
  description: string;
  url: string;
}

// UTM Builder Types
export interface UTMInput {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

// Headline Analyzer Types
export interface HeadlineAnalysis {
  score: number;
  wordCount: number;
  characterCount: number;
  emotionWords: string[];
  powerWords: string[];
  hasNumber: boolean;
  sentiment: 'positive' | 'negative' | 'neutral' | 'curiosity';
  suggestions: string[];
}

// Readability Types
export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smog: number;
  colemanLiau: number;
  averageGrade: number;
  readingLevel: string;
}

// Keyword Density Types
export interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
  isOverused: boolean;
}

// Schema Generator Types
export type SchemaType = 'Article' | 'Product' | 'FAQ' | 'Recipe' | 'Event' | 'Organization';

// Email Subject Tester Types
export interface EmailSubjectAnalysis {
  score: number;
  length: number;
  lengthRating: string;
  wordCount: number;
  hasPersonalization: boolean;
  hasUrgency: boolean;
  hasCuriosity: boolean;
  hasNumbers: boolean;
  hasQuestion: boolean;
  hasSpamWords: string[];
  spamRisk: 'low' | 'medium' | 'high';
  hasEmoji: boolean;
  emojiCount: number;
  hasAllCaps: boolean;
  hasExcessivePunctuation: boolean;
  powerWords: string[];
  predictedOpenRate: number;
  predictedOpenRateRange: string;
  openRateLabel: string;
  mobilePreview: string;
  desktopPreview: string;
  suggestions: string[];
  insights: string[];
}

// Landing Page Analyzer Types
export interface LandingPageData {
  hasHeadline: boolean;
  hasSubheadline: boolean;
  hasCTA: boolean;
  ctaCount: number;
  hasHeroImage: boolean;
  hasSocialProof: boolean;
  hasValueProposition: boolean;
  hasBenefitsList: boolean;
  hasContactForm: boolean;
  formFieldCount: number;
  hasPrivacyPolicy: boolean;
  loadTime: number;
  isMobileFriendly: boolean;
}

export interface LandingPageAnalysis {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checklist: {
    item: string;
    status: 'pass' | 'fail';
    fix?: string;
  }[];
  recommendations: string[];
}
