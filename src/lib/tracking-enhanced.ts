/**
 * Enhanced Tracking Library for MediaPlanPro
 * Comprehensive GA4, GTM, and FB Pixel tracking with advanced features
 */

import { GA_TRACKING_ID, GTM_ID, FB_PIXEL_ID } from './tracking';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type EnhancedTrackingEvent =
  | 'strategy_created'
  | 'strategy_exported'
  | 'strategy_shared'
  | 'strategy_deleted'
  | 'blog_view'
  | 'blog_read_complete'
  | 'blog_share'
  | 'blog_comment'
  | 'user_registration'
  | 'user_login'
  | 'user_logout'
  | 'conversion'
  | 'form_submit'
  | 'form_abandon'
  | 'cta_click'
  | 'download'
  | 'video_play'
  | 'video_complete'
  | 'scroll_depth'
  | 'time_on_page'
  | 'search'
  | 'filter_applied'
  | 'error_occurred'
  | 'click'
  | 'file_download';

export interface EventParams {
  [key: string]: string | number | boolean | undefined | any;
}

export interface UserProperties {
  user_id?: string;
  user_role?: 'ADMIN' | 'EDITOR' | 'USER';
  subscription_tier?: 'FREE' | 'PRO' | 'ENTERPRISE';
  signup_date?: string;
  total_strategies?: number;
  total_exports?: number;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity: number;
}

export interface EcommerceTransaction {
  transaction_id: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: EcommerceItem[];
}

// ============================================================================
// CORE TRACKING FUNCTIONS
// ============================================================================

/**
 * Track custom event to GA4
 */
export function trackGA4Event(
  eventName: EnhancedTrackingEvent | string,
  params?: EventParams
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      send_to: GA_TRACKING_ID,
      timestamp: Date.now(),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4 Event]', eventName, params);
    }
  }
}

/**
 * Track custom event to GTM
 */
export function trackGTMEvent(
  eventName: EnhancedTrackingEvent | string,
  params?: EventParams
): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: Date.now(),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[GTM Event]', eventName, params);
    }
  }
}

/**
 * Track custom event to Facebook Pixel
 */
export function trackFBPixelEvent(
  eventName: string,
  params?: EventParams
): void {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', eventName, params);

    if (process.env.NODE_ENV === 'development') {
      console.log('[FB Pixel Event]', eventName, params);
    }
  }
}

/**
 * Combined tracking to all platforms
 */
export function trackEvent(
  eventName: EnhancedTrackingEvent,
  params?: EventParams
): void {
  // Track in GA4
  trackGA4Event(eventName, params);

  // Track in GTM
  trackGTMEvent(eventName, params);

  // Map to Facebook Pixel events
  const fbEventMap: Record<string, string> = {
    strategy_created: 'Lead',
    strategy_exported: 'CompleteRegistration',
    blog_view: 'ViewContent',
    user_registration: 'CompleteRegistration',
    user_login: 'Login',
    conversion: 'Purchase',
    form_submit: 'Lead',
    download: 'Download',
    cta_click: 'ClickButton',
  };

  const fbEventName = fbEventMap[eventName];
  if (fbEventName) {
    trackFBPixelEvent(fbEventName, params);
  }
}

// ============================================================================
// USER TRACKING
// ============================================================================

/**
 * Set user ID for cross-session tracking
 */
export function setUserId(userId: string): void {
  if (typeof window !== 'undefined') {
    // GA4
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        user_id: userId,
      });
    }

    // GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        user_id: userId,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[User ID Set]', userId);
    }
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: UserProperties): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);

    if (process.env.NODE_ENV === 'development') {
      console.log('[User Properties Set]', properties);
    }
  }
}

/**
 * Clear user data (on logout)
 */
export function clearUserData(): void {
  if (typeof window !== 'undefined') {
    // GA4
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        user_id: null,
      });
    }

    // GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        user_id: null,
        event: 'user_logout',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[User Data Cleared]');
    }
  }
}

// ============================================================================
// PAGE TRACKING
// ============================================================================

/**
 * Track page view with enhanced parameters
 */
export function trackPageView(
  url: string,
  title?: string,
  params?: EventParams
): void {
  if (typeof window !== 'undefined') {
    // GA4
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
        page_title: title || document.title,
        ...params,
      });
    }

    // GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page_path: url,
        page_title: title || document.title,
        ...params,
      });
    }

    // FB Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Page View]', url, title);
    }
  }
}

/**
 * Track virtual page view (for SPAs)
 */
export function trackVirtualPageView(
  virtualPath: string,
  title?: string
): void {
  trackPageView(virtualPath, title, {
    virtual_page: true,
  });
}

// ============================================================================
// ENGAGEMENT TRACKING
// ============================================================================

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number, page?: string): void {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage,
    page_path: page || window.location.pathname,
  });
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number, page?: string): void {
  trackEvent('time_on_page', {
    time_seconds: seconds,
    page_path: page || window.location.pathname,
  });
}

/**
 * Track CTA click
 */
export function trackCTAClick(
  ctaName: string,
  ctaLocation: string,
  ctaType?: string
): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_type: ctaType || 'button',
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  formType: string,
  success: boolean = true
): void {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
    success,
  });
}

/**
 * Track form abandonment
 */
export function trackFormAbandon(
  formName: string,
  fieldName: string,
  completionPercentage: number
): void {
  trackEvent('form_abandon', {
    form_name: formName,
    field_name: fieldName,
    completion_percentage: completionPercentage,
  });
}

/**
 * Track search
 */
export function trackSearch(
  searchTerm: string,
  resultsCount: number,
  searchType?: string
): void {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    search_type: searchType || 'site_search',
  });
}

/**
 * Track filter application
 */
export function trackFilterApplied(
  filterType: string,
  filterValue: string,
  resultsCount: number
): void {
  trackEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
    results_count: resultsCount,
  });
}

// ============================================================================
// CONTENT TRACKING
// ============================================================================

/**
 * Track download
 */
export function trackDownload(
  fileName: string,
  fileType: string,
  fileSize?: number
): void {
  trackEvent('download', {
    file_name: fileName,
    file_type: fileType,
    file_size: fileSize,
  });
}

/**
 * Track video play
 */
export function trackVideoPlay(
  videoTitle: string,
  videoId: string,
  videoDuration?: number
): void {
  trackEvent('video_play', {
    video_title: videoTitle,
    video_id: videoId,
    video_duration: videoDuration,
  });
}

/**
 * Track video completion
 */
export function trackVideoComplete(
  videoTitle: string,
  videoId: string,
  watchTime: number
): void {
  trackEvent('video_complete', {
    video_title: videoTitle,
    video_id: videoId,
    watch_time: watchTime,
  });
}

// ============================================================================
// E-COMMERCE TRACKING
// ============================================================================

/**
 * Track product view
 */
export function trackProductView(
  productId: string,
  productName: string,
  category?: string,
  price?: number
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: price || 0,
      items: [
        {
          item_id: productId,
          item_name: productName,
          item_category: category,
          price: price || 0,
        },
      ],
    });
  }

  trackGTMEvent('view_item', {
    product_id: productId,
    product_name: productName,
    category,
    price,
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price,
          quantity,
        },
      ],
    });
  }

  trackGTMEvent('add_to_cart', {
    product_id: productId,
    product_name: productName,
    price,
    quantity,
    value: price * quantity,
  });
}

/**
 * Track purchase/conversion
 */
export function trackPurchase(transaction: EcommerceTransaction): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transaction.transaction_id,
      value: transaction.value,
      currency: transaction.currency,
      tax: transaction.tax || 0,
      shipping: transaction.shipping || 0,
      items: transaction.items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.item_category,
        item_variant: item.item_variant,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  trackGTMEvent('purchase', {
    transaction_id: transaction.transaction_id,
    value: transaction.value,
    currency: transaction.currency,
    tax: transaction.tax,
    shipping: transaction.shipping,
    items: transaction.items,
  });

  // FB Pixel conversion
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'Purchase', {
      value: transaction.value,
      currency: transaction.currency,
    });
  }
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(
  value: number,
  currency: string = 'USD',
  items: EcommerceItem[]
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency,
      value,
      items: items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  trackGTMEvent('begin_checkout', {
    value,
    currency,
    items,
  });
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Track JavaScript errors
 */
export function trackError(
  errorMessage: string,
  errorStack?: string,
  errorType?: string,
  fatal: boolean = false
): void {
  trackEvent('error_occurred', {
    error_message: errorMessage,
    error_stack: errorStack,
    error_type: errorType || 'javascript_error',
    fatal,
    page_path: window.location.pathname,
  });

  // Also send to GA4 as exception
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal,
    });
  }
}

/**
 * Track API errors
 */
export function trackAPIError(
  endpoint: string,
  statusCode: number,
  errorMessage: string
): void {
  trackEvent('error_occurred', {
    error_type: 'api_error',
    endpoint,
    status_code: statusCode,
    error_message: errorMessage,
    page_path: window.location.pathname,
  });
}

/**
 * Track 404 errors
 */
export function track404Error(path: string, referrer?: string): void {
  trackEvent('error_occurred', {
    error_type: '404_error',
    page_path: path,
    referrer: referrer || document.referrer,
  });
}

// ============================================================================
// CUSTOM DIMENSIONS & METRICS
// ============================================================================

/**
 * Set custom dimension
 */
export function setCustomDimension(
  dimensionName: string,
  dimensionValue: string | number
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', {
      [dimensionName]: dimensionValue,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Custom Dimension]', dimensionName, dimensionValue);
    }
  }
}

/**
 * Set custom metric
 */
export function setCustomMetric(
  metricName: string,
  metricValue: number
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', {
      [metricName]: metricValue,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Custom Metric]', metricName, metricValue);
    }
  }
}

// ============================================================================
// ENHANCED MEASUREMENT
// ============================================================================

/**
 * Enable enhanced measurement features
 */
export function enableEnhancedMeasurement(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    // Enable enhanced measurement
    window.gtag('config', GA_TRACKING_ID, {
      send_page_view: true,
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true,
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Enhanced Measurement] Enabled');
    }
  }
}

/**
 * Track outbound link click
 */
export function trackOutboundClick(url: string, linkText?: string): void {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    link_text: linkText,
    link_url: url,
  });
}

/**
 * Track file download
 */
export function trackFileDownload(
  fileName: string,
  fileExtension: string,
  fileUrl: string
): void {
  trackEvent('file_download', {
    file_name: fileName,
    file_extension: fileExtension,
    file_url: fileUrl,
    link_url: fileUrl,
  });
}

// ============================================================================
// DEBUG MODE
// ============================================================================

/**
 * Enable GA4 debug mode
 */
export function enableDebugMode(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      debug_mode: true,
    });

    console.log('[GA4 Debug Mode] Enabled');
  }
}

/**
 * Disable GA4 debug mode
 */
export function disableDebugMode(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      debug_mode: false,
    });

    console.log('[GA4 Debug Mode] Disabled');
  }
}

// Type augmentation for window object
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

