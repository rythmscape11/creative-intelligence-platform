# Tracking Implementation Guide
## MediaPlanPro - Complete Analytics Setup

**Version:** 2.0  
**Last Updated:** October 13, 2025  
**Status:** Production Ready

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Event Tracking Reference](#event-tracking-reference)
3. [Custom Dimensions & Metrics](#custom-dimensions--metrics)
4. [E-commerce Tracking](#e-commerce-tracking)
5. [User Tracking](#user-tracking)
6. [Error Tracking](#error-tracking)
7. [Testing & Debugging](#testing--debugging)
8. [Best Practices](#best-practices)

---

## 🚀 Quick Start

### **Installation**

The tracking library is already installed and configured. Import the functions you need:

```typescript
// Basic tracking
import { trackEvent, trackPageView } from '@/lib/tracking';

// Enhanced tracking
import {
  trackCTAClick,
  trackFormSubmit,
  trackScrollDepth,
  setUserId,
  setUserProperties,
} from '@/lib/tracking-enhanced';
```

### **Basic Usage**

```typescript
// Track a page view
trackPageView('/about', 'About Us');

// Track a custom event
trackEvent('strategy_created', {
  strategy_id: 'abc123',
  strategy_type: 'comprehensive',
});

// Track a CTA click
trackCTAClick('Get Started', 'Hero Section', 'button');
```

---

## 📊 Event Tracking Reference

### **Strategy Events**

#### **Strategy Created**
```typescript
import { trackStrategyCreation } from '@/lib/tracking';

trackStrategyCreation('strategy-123', 'comprehensive');
```

**Parameters:**
- `strategy_id` (string): Unique strategy identifier
- `strategy_type` (string): Type of strategy (comprehensive, quick, etc.)
- `value` (number): Always 1 for counting

**GA4 Event Name:** `strategy_created`

---

#### **Strategy Exported**
```typescript
import { trackStrategyExport } from '@/lib/tracking';

trackStrategyExport('strategy-123', 'pdf');
```

**Parameters:**
- `strategy_id` (string): Unique strategy identifier
- `export_format` (string): Export format (pdf, docx, pptx, etc.)
- `value` (number): Always 1 for counting

**GA4 Event Name:** `strategy_exported`

---

### **Blog Events**

#### **Blog Post View**
```typescript
import { trackBlogView } from '@/lib/tracking';

trackBlogView('post-123', 'How to Create a Marketing Strategy', 'Marketing');
```

**Parameters:**
- `post_id` (string): Unique post identifier
- `post_title` (string): Post title
- `category` (string): Post category

**GA4 Event Name:** `blog_view`

---

#### **Blog Read Complete**
```typescript
import { trackEvent } from '@/lib/tracking-enhanced';

trackEvent('blog_read_complete', {
  post_id: 'post-123',
  post_title: 'How to Create a Marketing Strategy',
  read_time_seconds: 180,
});
```

---

### **User Events**

#### **User Registration**
```typescript
import { trackUserRegistration } from '@/lib/tracking';

trackUserRegistration('user-123', 'email');
```

**Parameters:**
- `user_id` (string): Unique user identifier
- `registration_method` (string): Registration method (email, google, github, etc.)
- `value` (number): Always 1 for counting

**GA4 Event Name:** `user_registration`

---

#### **User Login**
```typescript
import { trackUserLogin } from '@/lib/tracking';

trackUserLogin('user-123', 'email');
```

**Parameters:**
- `user_id` (string): Unique user identifier
- `login_method` (string): Login method (email, google, github, etc.)

**GA4 Event Name:** `user_login`

---

### **Engagement Events**

#### **CTA Click**
```typescript
import { trackCTAClick } from '@/lib/tracking-enhanced';

trackCTAClick('Get Started', 'Hero Section', 'button');
```

**Parameters:**
- `cta_name` (string): Name of the CTA
- `cta_location` (string): Where the CTA is located
- `cta_type` (string): Type of CTA (button, link, banner, etc.)

---

#### **Form Submit**
```typescript
import { trackFormSubmit } from '@/lib/tracking-enhanced';

trackFormSubmit('Contact Form', 'contact', true);
```

**Parameters:**
- `form_name` (string): Name of the form
- `form_type` (string): Type of form (contact, signup, etc.)
- `success` (boolean): Whether submission was successful

---

#### **Scroll Depth**
```typescript
import { trackScrollDepth } from '@/lib/tracking-enhanced';

trackScrollDepth(75, '/blog/post-123');
```

**Parameters:**
- `percentage` (number): Scroll percentage (25, 50, 75, 100)
- `page` (string): Page path (optional, defaults to current page)

---

#### **Time on Page**
```typescript
import { trackTimeOnPage } from '@/lib/tracking-enhanced';

trackTimeOnPage(120, '/about');
```

**Parameters:**
- `seconds` (number): Time spent on page in seconds
- `page` (string): Page path (optional, defaults to current page)

---

### **Search & Filter Events**

#### **Search**
```typescript
import { trackSearch } from '@/lib/tracking-enhanced';

trackSearch('marketing strategy', 15, 'site_search');
```

**Parameters:**
- `searchTerm` (string): Search query
- `resultsCount` (number): Number of results
- `searchType` (string): Type of search (site_search, blog_search, etc.)

---

#### **Filter Applied**
```typescript
import { trackFilterApplied } from '@/lib/tracking-enhanced';

trackFilterApplied('category', 'Marketing', 12);
```

**Parameters:**
- `filterType` (string): Type of filter (category, tag, date, etc.)
- `filterValue` (string): Filter value
- `resultsCount` (number): Number of results after filtering

---

### **Content Events**

#### **Download**
```typescript
import { trackDownload } from '@/lib/tracking-enhanced';

trackDownload('marketing-strategy-template.pdf', 'pdf', 1024000);
```

**Parameters:**
- `fileName` (string): Name of the file
- `fileType` (string): File extension (pdf, docx, xlsx, etc.)
- `fileSize` (number): File size in bytes (optional)

---

#### **Video Play**
```typescript
import { trackVideoPlay } from '@/lib/tracking-enhanced';

trackVideoPlay('How to Use MediaPlanPro', 'video-123', 300);
```

**Parameters:**
- `videoTitle` (string): Video title
- `videoId` (string): Unique video identifier
- `videoDuration` (number): Video duration in seconds (optional)

---

#### **Video Complete**
```typescript
import { trackVideoComplete } from '@/lib/tracking-enhanced';

trackVideoComplete('How to Use MediaPlanPro', 'video-123', 285);
```

**Parameters:**
- `videoTitle` (string): Video title
- `videoId` (string): Unique video identifier
- `watchTime` (number): Time watched in seconds

---

## 🎯 Custom Dimensions & Metrics

### **Set User ID**

```typescript
import { setUserId } from '@/lib/tracking-enhanced';

// On user login
setUserId('user-123');
```

### **Set User Properties**

```typescript
import { setUserProperties } from '@/lib/tracking-enhanced';

setUserProperties({
  user_id: 'user-123',
  user_role: 'ADMIN',
  subscription_tier: 'PRO',
  signup_date: '2025-01-15',
  total_strategies: 25,
  total_exports: 50,
});
```

### **Clear User Data**

```typescript
import { clearUserData } from '@/lib/tracking-enhanced';

// On user logout
clearUserData();
```

### **Set Custom Dimension**

```typescript
import { setCustomDimension } from '@/lib/tracking-enhanced';

setCustomDimension('content_group', 'Blog');
setCustomDimension('user_segment', 'Power User');
```

### **Set Custom Metric**

```typescript
import { setCustomMetric } from '@/lib/tracking-enhanced';

setCustomMetric('strategies_created', 25);
setCustomMetric('exports_this_month', 10);
```

---

## 🛒 E-commerce Tracking

### **Product View**

```typescript
import { trackProductView } from '@/lib/tracking-enhanced';

trackProductView('pro-plan', 'Pro Plan', 'Subscription', 49.99);
```

### **Add to Cart**

```typescript
import { trackAddToCart } from '@/lib/tracking-enhanced';

trackAddToCart('pro-plan', 'Pro Plan', 49.99, 1);
```

### **Begin Checkout**

```typescript
import { trackBeginCheckout } from '@/lib/tracking-enhanced';

trackBeginCheckout(49.99, 'USD', [
  {
    item_id: 'pro-plan',
    item_name: 'Pro Plan',
    item_category: 'Subscription',
    price: 49.99,
    quantity: 1,
  },
]);
```

### **Purchase**

```typescript
import { trackPurchase } from '@/lib/tracking-enhanced';

trackPurchase({
  transaction_id: 'txn-123',
  value: 49.99,
  currency: 'USD',
  tax: 4.50,
  shipping: 0,
  items: [
    {
      item_id: 'pro-plan',
      item_name: 'Pro Plan',
      item_category: 'Subscription',
      price: 49.99,
      quantity: 1,
    },
  ],
});
```

---

## 👤 User Tracking

### **On User Login**

```typescript
import { setUserId, setUserProperties, trackUserLogin } from '@/lib/tracking-enhanced';

// Set user ID
setUserId(user.id);

// Set user properties
setUserProperties({
  user_id: user.id,
  user_role: user.role,
  subscription_tier: user.subscriptionTier,
  signup_date: user.createdAt,
});

// Track login event
trackUserLogin(user.id, 'email');
```

### **On User Logout**

```typescript
import { clearUserData } from '@/lib/tracking-enhanced';

clearUserData();
```

---

## ⚠️ Error Tracking

### **JavaScript Errors**

```typescript
import { trackError } from '@/lib/tracking-enhanced';

try {
  // Your code
} catch (error) {
  trackError(
    error.message,
    error.stack,
    'javascript_error',
    false // not fatal
  );
}
```

### **API Errors**

```typescript
import { trackAPIError } from '@/lib/tracking-enhanced';

fetch('/api/strategies')
  .then(res => {
    if (!res.ok) {
      trackAPIError('/api/strategies', res.status, 'Failed to fetch strategies');
    }
  });
```

### **404 Errors**

```typescript
import { track404Error } from '@/lib/tracking-enhanced';

// In 404 page
track404Error(window.location.pathname, document.referrer);
```

---

## 🧪 Testing & Debugging

### **Enable Debug Mode**

```typescript
import { enableDebugMode } from '@/lib/tracking-enhanced';

// In development or for testing
if (process.env.NODE_ENV === 'development') {
  enableDebugMode();
}
```

### **Test Events in Browser Console**

```javascript
// Test strategy creation
trackStrategyCreation('test-123', 'comprehensive');

// Test blog view
trackBlogView('post-123', 'Test Post', 'Marketing');

// Check dataLayer
console.log(window.dataLayer);

// Check if gtag is available
console.log(typeof window.gtag); // should be 'function'
```

### **Verify in GA4 Real-Time Reports**

1. Go to GA4 → Reports → Real-time
2. Trigger an event on your site
3. Check if event appears in real-time report (within 30 seconds)

---

## ✅ Best Practices

### **1. Consistent Naming**
- Use snake_case for event names
- Use descriptive, action-based names
- Keep names under 40 characters

### **2. Parameter Naming**
- Use snake_case for parameter names
- Be consistent across similar events
- Include relevant context

### **3. Event Tracking**
- Track user intent, not just clicks
- Include context (where, when, why)
- Don't over-track (focus on valuable events)

### **4. User Privacy**
- Don't track PII (personally identifiable information)
- Use anonymize_ip (already enabled)
- Respect user consent preferences

### **5. Performance**
- Use lazyOnload strategy for tracking scripts (already implemented)
- Batch events when possible
- Don't block user interactions

---

**For more information, see:**
- [COMPREHENSIVE_GA_AUDIT_REPORT.md](./COMPREHENSIVE_GA_AUDIT_REPORT.md)
- [PAGESPEED_OPTIMIZATION_REPORT.md](./PAGESPEED_OPTIMIZATION_REPORT.md)
- [GOOGLE_ANALYTICS_PAGESPEED_AUDIT.md](./GOOGLE_ANALYTICS_PAGESPEED_AUDIT.md)

