// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

export interface AuthSession {
  user: User;
  token: string;
  expires: Date;
}

// Strategy Builder Types
export interface StrategyInput {
  businessName: string;
  industry: string;
  targetAudience: string;
  budget: number;
  objectives: string[];
  timeframe: string;
  currentChallenges: string;
  competitorInfo?: string;
  existingMarketing?: string;
}

export interface MarketingStrategy {
  id: string;
  userId: string;
  input: StrategyInput;
  output: StrategyOutput;
  generatedBy: 'AI' | 'FALLBACK';
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyOutput {
  executiveSummary: string;
  targetAudience: AudienceSegment[];
  marketingChannels: MarketingChannel[];
  contentStrategy: ContentStrategy;
  timeline: TimelineItem[];
  budget: BudgetBreakdown;
  kpis: KPI[];
  recommendations: string[];
  enterprisePlan?: EnterpriseStrategyPlan;
}

export interface AudienceSegment {
  name: string;
  demographics: string;
  psychographics: string;
  painPoints: string[];
  preferredChannels: string[];
}

export interface MarketingChannel {
  name: string;
  description: string;
  budgetAllocation: number;
  expectedROI: string;
  tactics: string[];
  timeline: string;
}

export interface ContentStrategy {
  themes: string[];
  contentTypes: ContentType[];
  frequency: string;
  distribution: string[];
}

export interface ContentType {
  type: string;
  description: string;
  frequency: string;
  platforms: string[];
}

export interface TimelineItem {
  phase: string;
  duration: string;
  activities: string[];
  deliverables: string[];
}

export interface BudgetBreakdown {
  total: number;
  channels: ChannelBudget[];
  contingency: number;
}

export interface ChannelBudget {
  channel: string;
  amount: number;
  percentage: number;
}

export interface KPI {
  metric: string;
  target: string;
  measurement: string;
  frequency: string;
}

// Enterprise strategy structure used by the LLM-powered Strategy Maker
export interface EnterpriseStrategyPlan {
  executiveSummary: {
    overview: string;
    globalPriorities: string[];
    investmentRationale: string[];
    expectedImpact: string[];
    globalRisks: string[];
  };
  marketOverview: {
    globalSnapshot: string;
    keyTrends: string[];
    regions: RegionOverview[];
  };
  segmentationAndUseCases: {
    globalSegments: SegmentProfile[];
    regionalAdaptations: Array<{
      region: string;
      adaptations: string[];
    }>;
    useCases: Array<{
      segment: string;
      scenarios: string[];
    }>;
  };
  objectivesAndKPIs: Array<{
    businessGoal: string;
    marketingObjective: string;
    primaryKPIs: string[];
    secondaryKPIs: string[];
    leadingIndicators: string[];
    laggingIndicators: string[];
  }>;
  governanceModel: {
    executiveSponsors: string[];
    globalMarketingLeads: string[];
    regionalLeads: string[];
    crossFunctionalPartners: string[];
    decisionFramework: string;
    reviewCadence: string[];
  };
  resourcingAndBudget: {
    headcountPlan: Array<{ function: string; notes: string }>;
    partnerStrategy: string[];
    budgetModel: {
      summary: string;
      regionalAllocations: Array<{ region: string; percentage: number; notes: string }>;
      channelAllocations: Array<{ channel: string; percentage: number; notes: string }>;
      innovationReserve: string;
    };
  };
  technologyDataCompliance: {
    martechStack: Array<{ category: string; recommendation: string; purpose: string }>;
    dataFlow: string[];
    complianceChecklist: string[];
  };
  integratedChannelStrategy: {
    lifecycleNarrative: string;
    channels: Array<{
      channel: string;
      role: string;
      globalTactics: string[];
      regionalAdaptations: string[];
      keyMetrics: string[];
      timeToImpact: string;
      signalReuse: string[];
    }>;
  };
  regionalPlaybooks: Array<{
    region: string;
    prioritySegments: string[];
    propositions: string[];
    localizedTactics: string[];
    budgetGuidance: string;
    leadingKPIs: string[];
  }>;
  measurementAndOptimization: {
    globalDashboard: string[];
    regionalDashboardGuidelines: string[];
    testAndLearnFramework: string[];
    reviewCadence: {
      monthly: string[];
      quarterly: string[];
    };
    reallocationGuidelines: string[];
  };
  roadmap90To180: {
    quickWins90Days: string[];
    initiatives90To180: string[];
    dependencies: string[];
  };
}

export interface RegionOverview {
  region: string;
  marketMaturity: string;
  competitiveIntensity: string;
  customerBehavior: string;
  opportunities: string[];
  risks: string[];
}

export interface SegmentProfile {
  name: string;
  description: string;
  regionalNotes: string[];
  preferredChannels: string[];
}

// Blog and CMS Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  tags: Tag[];
  status: PostStatus;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Export and File Types
export interface ExportJob {
  id: string;
  userId: string;
  strategyId: string;
  format: ExportFormat;
  status: JobStatus;
  fileUrl?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export enum ExportFormat {
  PPTX = 'PPTX',
  DOCX = 'DOCX',
  XLSX = 'XLSX',
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'number' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
}

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}
