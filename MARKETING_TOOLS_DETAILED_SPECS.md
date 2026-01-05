# 📐 Marketing Tools - Detailed Specifications

## Email Marketing Tools (Continued)

### 22. Email Signature Generator
**Value:** $10/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface SignatureData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  logo?: File;
  photo?: File;
}

function generateSignature(data: SignatureData, template: string): string {
  // Templates: Professional, Modern, Minimal, Creative
  // Returns HTML email signature
}
```

**Features:**
- 4 professional templates
- Live preview
- Logo/photo upload (client-side processing)
- Social media icons
- Mobile-responsive HTML
- Copy HTML or download

**Inputs:** Form with personal/company details  
**Outputs:** HTML signature with live preview  
**Export:** Copy HTML, Download HTML file

---

### 23. Email Preview Tool
**Value:** $15/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface EmailPreview {
  subject: string;
  preheader: string;
  body: string; // HTML
}

function simulateEmailClients(email: EmailPreview) {
  return {
    gmail: renderGmailPreview(email),
    outlook: renderOutlookPreview(email),
    apple: renderAppleMailPreview(email),
    mobile: renderMobilePreview(email)
  };
}
```

**Features:**
- Simulates 4 email clients (Gmail, Outlook, Apple Mail, Mobile)
- Shows subject line truncation
- Preheader text preview
- Image blocking simulation
- Responsive design check
- Checklist (images, links, CTA, mobile-friendly)

**Inputs:** Subject, preheader, HTML body  
**Outputs:** 4 client previews + checklist  
**Export:** Screenshot (canvas to image)

---

### 24. Spam Score Checker
**Value:** $10/month  
**Processing:** Client-side

**Algorithm:**
```typescript
function calculateSpamScore(email: {
  subject: string;
  body: string;
  fromName: string;
  fromEmail: string;
}): {
  score: number; // 0-10 (0 = clean, 10 = spam)
  issues: string[];
  recommendations: string[];
} {
  let score = 0;
  const issues = [];
  
  // Spam words (FREE, URGENT, CLICK HERE, etc.)
  const spamWords = detectSpamWords(email.subject + email.body);
  score += spamWords.length * 0.5;
  
  // Excessive punctuation (!!!, ???)
  const punctuation = detectExcessivePunctuation(email.subject);
  score += punctuation * 1;
  
  // ALL CAPS
  const capsRatio = detectAllCaps(email.subject);
  score += capsRatio > 0.5 ? 2 : 0;
  
  // Image to text ratio
  const imageRatio = calculateImageRatio(email.body);
  score += imageRatio > 0.6 ? 1.5 : 0;
  
  // Missing unsubscribe link
  const hasUnsubscribe = detectUnsubscribeLink(email.body);
  score += !hasUnsubscribe ? 1 : 0;
  
  // Suspicious links
  const suspiciousLinks = detectSuspiciousLinks(email.body);
  score += suspiciousLinks.length * 0.5;
  
  return { score: Math.min(score, 10), issues, recommendations };
}
```

**Features:**
- Spam word detection (100+ words)
- Punctuation analysis
- Caps lock detection
- Image/text ratio
- Link analysis
- Unsubscribe link check
- Score: 0-10 (lower is better)

**Inputs:** Subject, body, from name, from email  
**Outputs:** Spam score, issues list, recommendations  
**Export:** Copy, PDF

---

### 25. List Segmentation Calculator
**Value:** $15/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface ListData {
  totalSubscribers: number;
  segments: {
    name: string;
    criteria: string;
    estimatedPercentage: number;
  }[];
}

function calculateSegmentation(data: ListData) {
  return data.segments.map(segment => ({
    name: segment.name,
    size: Math.round(data.totalSubscribers * segment.estimatedPercentage / 100),
    percentage: segment.estimatedPercentage,
    strategy: generateStrategy(segment.criteria)
  }));
}
```

**Features:**
- Calculate optimal segment sizes
- Segment strategy recommendations
- Engagement predictions
- A/B test group sizing
- Visual breakdown (pie chart)

**Inputs:** Total subscribers, segment criteria  
**Outputs:** Segment sizes, strategies, visualizations  
**Export:** Copy, CSV, PDF

---

## Advertising & ROI Tools (Continued)

### 26. Ad Copy Generator
**Value:** $20/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface AdCopyInput {
  product: string;
  benefit: string;
  targetAudience: string;
  cta: string;
  platform: 'google' | 'facebook' | 'linkedin' | 'instagram';
}

function generateAdCopy(input: AdCopyInput) {
  const frameworks = {
    AIDA: generateAIDA(input), // Attention, Interest, Desire, Action
    PAS: generatePAS(input),   // Problem, Agitate, Solution
    FAB: generateFAB(input),   // Features, Advantages, Benefits
    '4Ps': generate4Ps(input)  // Picture, Promise, Prove, Push
  };
  
  return Object.entries(frameworks).map(([name, copy]) => ({
    framework: name,
    headline: copy.headline,
    body: copy.body,
    cta: copy.cta,
    characterCount: calculateCharCount(copy, input.platform)
  }));
}
```

**Features:**
- 4 copywriting frameworks (AIDA, PAS, FAB, 4Ps)
- Platform-specific character limits
- Multiple variations per framework
- Headline + body + CTA
- Character count validation

**Inputs:** Product, benefit, audience, CTA, platform  
**Outputs:** 12-16 ad copy variations  
**Export:** Copy, CSV

---

### 27. ROI Calculator
**Value:** $25/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface ROIInput {
  investment: number;
  revenue: number;
  costs?: number;
  customers?: number;
  avgOrderValue?: number;
  customerLifetimeMonths?: number;
}

function calculateROI(input: ROIInput) {
  const roi = ((input.revenue - input.investment) / input.investment) * 100;
  const roas = input.revenue / input.investment;
  const cac = input.customers ? input.investment / input.customers : 0;
  const clv = input.avgOrderValue && input.customerLifetimeMonths
    ? input.avgOrderValue * input.customerLifetimeMonths
    : 0;
  const breakEven = input.investment / (input.revenue / 30); // days
  
  return {
    roi: roi.toFixed(2),
    roas: roas.toFixed(2),
    cac: cac.toFixed(2),
    clv: clv.toFixed(2),
    breakEven: Math.ceil(breakEven),
    profitMargin: ((input.revenue - input.investment) / input.revenue * 100).toFixed(2)
  };
}
```

**Features:**
- ROI calculation
- ROAS (Return on Ad Spend)
- CAC (Customer Acquisition Cost)
- CLV (Customer Lifetime Value)
- Break-even analysis
- Visual charts (Recharts)
- Profit margin

**Inputs:** Investment, revenue, costs, customers, AOV, lifetime  
**Outputs:** All metrics + charts  
**Export:** Copy, PDF with charts

---

### 28. Budget Allocator
**Value:** $20/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface BudgetInput {
  totalBudget: number;
  channels: {
    name: string;
    currentSpend?: number;
    currentROI?: number;
    priority?: 'high' | 'medium' | 'low';
  }[];
  allocationMode: 'equal' | 'performance' | 'custom';
}

function allocateBudget(input: BudgetInput) {
  if (input.allocationMode === 'equal') {
    const perChannel = input.totalBudget / input.channels.length;
    return input.channels.map(ch => ({ ...ch, allocated: perChannel }));
  }
  
  if (input.allocationMode === 'performance') {
    const totalROI = input.channels.reduce((sum, ch) => sum + (ch.currentROI || 0), 0);
    return input.channels.map(ch => ({
      ...ch,
      allocated: (ch.currentROI || 0) / totalROI * input.totalBudget
    }));
  }
  
  // Custom mode: user sets percentages
  return input.channels;
}
```

**Features:**
- 3 allocation modes (Equal, Performance-based, Custom)
- Channel comparison
- Visual breakdown (pie chart, bar chart)
- Recommendations
- What-if scenarios

**Inputs:** Total budget, channels, mode  
**Outputs:** Allocated budget per channel + charts  
**Export:** Copy, CSV, PDF

---

### 29. CPC/CPM Calculator
**Value:** $10/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface AdMetrics {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  cpc?: number;
  cpm?: number;
  cpa?: number;
  ctr?: number;
  conversionRate?: number;
}

function calculateAdMetrics(input: AdMetrics): AdMetrics {
  const result: AdMetrics = { ...input };
  
  // CPC = Spend / Clicks
  if (input.spend && input.clicks) {
    result.cpc = input.spend / input.clicks;
  }
  
  // CPM = (Spend / Impressions) * 1000
  if (input.spend && input.impressions) {
    result.cpm = (input.spend / input.impressions) * 1000;
  }
  
  // CPA = Spend / Conversions
  if (input.spend && input.conversions) {
    result.cpa = input.spend / input.conversions;
  }
  
  // CTR = (Clicks / Impressions) * 100
  if (input.clicks && input.impressions) {
    result.ctr = (input.clicks / input.impressions) * 100;
  }
  
  // Conversion Rate = (Conversions / Clicks) * 100
  if (input.conversions && input.clicks) {
    result.conversionRate = (input.conversions / input.clicks) * 100;
  }
  
  return result;
}
```

**Features:**
- Bidirectional conversion (enter any 2, get all)
- CPC, CPM, CPA, CTR, Conversion Rate
- Benchmark comparison
- Visual indicators (good/average/poor)

**Inputs:** Any 2 metrics  
**Outputs:** All calculated metrics + benchmarks  
**Export:** Copy, PDF

---

### 30. Landing Page Analyzer
**Value:** $30/month  
**Processing:** Client-side

**Algorithm:**
```typescript
interface LandingPageData {
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

function analyzeLandingPage(data: LandingPageData) {
  let score = 0;
  const checklist = [];
  
  // Headline (10 points)
  if (data.hasHeadline) {
    score += 10;
    checklist.push({ item: 'Headline', status: 'pass' });
  } else {
    checklist.push({ item: 'Headline', status: 'fail', fix: 'Add clear headline' });
  }
  
  // CTA (15 points)
  if (data.hasCTA && data.ctaCount >= 2) {
    score += 15;
    checklist.push({ item: 'CTA', status: 'pass' });
  } else {
    checklist.push({ item: 'CTA', status: 'fail', fix: 'Add at least 2 CTAs' });
  }
  
  // ... (30+ checks)
  
  return {
    score: score, // 0-100
    grade: getGrade(score),
    checklist: checklist,
    recommendations: generateRecommendations(checklist)
  };
}
```

**Features:**
- 30-point conversion optimization checklist
- Score: 0-100
- Grade: A-F
- Detailed recommendations
- Priority levels (Critical, High, Medium, Low)
- Best practices guide

**Inputs:** Landing page checklist (form)  
**Outputs:** Score, grade, checklist, recommendations  
**Export:** Copy, PDF

---

## Shared Components & Utilities

### Export Utilities
```typescript
// src/lib/tools/shared/exportUtils.ts

export function exportToPDF(data: any, title: string) {
  const doc = new jsPDF();
  // Format and export
}

export function exportToCSV(data: any[], filename: string) {
  const csv = convertToCSV(data);
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
```

### Usage Tracking
```typescript
// src/lib/utils/toolUsageTracker.ts

export async function trackToolUsage(
  toolId: string,
  toolName: string,
  category: string,
  metadata?: any
) {
  await fetch('/api/tools/track-usage', {
    method: 'POST',
    body: JSON.stringify({ toolId, toolName, category, metadata })
  });
}

export async function checkUsageLimit(toolId: string): Promise<{
  canUse: boolean;
  remaining: number;
  limit: number;
  isPro: boolean;
}> {
  const res = await fetch(`/api/tools/check-limit?toolId=${toolId}`);
  return res.json();
}
```

---

## Design System

### Colors
```typescript
const toolColors = {
  content: 'blue-600',      // Content Marketing
  seo: 'green-600',         // SEO & Analytics
  social: 'purple-600',     // Social Media
  email: 'orange-600',      // Email Marketing
  advertising: 'red-600'    // Advertising & ROI
};
```

### Tool Card Component
```tsx
<ToolCard
  title="Headline Analyzer"
  description="Score your headlines 0-100"
  category="content"
  icon={<SparklesIcon />}
  href="/tools/content/headline-analyzer"
  isPro={false}
/>
```

### Usage Limit Banner
```tsx
<UsageLimitBanner
  used={8}
  limit={10}
  toolName="Headline Analyzer"
  onUpgrade={() => router.push('/pricing')}
/>
```

---

**Status:** Specifications complete ✅  
**Next:** Begin Phase 1 implementation

