// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || '';

// Google Tag Manager
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

// Facebook Pixel
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

// Type definitions for tracking events
export type TrackingEvent = 
  | 'strategy_created'
  | 'strategy_exported'
  | 'blog_view'
  | 'user_registration'
  | 'user_login'
  | 'conversion'
  | 'share_created'
  | 'comment_added';

interface EventParams {
  [key: string]: string | number | boolean;
}

// Google Analytics 4 tracking
export const trackGA4Event = (eventName: TrackingEvent, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      send_to: GA_TRACKING_ID,
    });
  }
};

// Google Tag Manager tracking
export const trackGTMEvent = (eventName: TrackingEvent, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};

// Facebook Pixel tracking
export const trackFBPixelEvent = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

// Combined tracking function
export const trackEvent = (eventName: TrackingEvent, params?: EventParams) => {
  // Track in Google Analytics 4
  trackGA4Event(eventName, params);
  
  // Track in Google Tag Manager
  trackGTMEvent(eventName, params);
  
  // Track in Facebook Pixel (map event names)
  const fbEventMap: Record<TrackingEvent, string> = {
    strategy_created: 'Lead',
    strategy_exported: 'CompleteRegistration',
    blog_view: 'ViewContent',
    user_registration: 'CompleteRegistration',
    user_login: 'Login',
    conversion: 'Purchase',
    share_created: 'Share',
    comment_added: 'AddToWishlist',
  };
  
  const fbEventName = fbEventMap[eventName];
  if (fbEventName) {
    trackFBPixelEvent(fbEventName, params);
  }
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
    
    // Google Tag Manager
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: url,
      });
    }
    
    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }
};

// Strategy creation tracking
export const trackStrategyCreation = (strategyId: string, strategyType: string) => {
  trackEvent('strategy_created', {
    strategy_id: strategyId,
    strategy_type: strategyType,
    value: 1,
  });
};

// Strategy export tracking
export const trackStrategyExport = (strategyId: string, format: string) => {
  trackEvent('strategy_exported', {
    strategy_id: strategyId,
    export_format: format,
    value: 1,
  });
};

// Blog view tracking
export const trackBlogView = (postId: string, postTitle: string, category: string) => {
  trackEvent('blog_view', {
    post_id: postId,
    post_title: postTitle,
    category,
  });
};

// User registration tracking
export const trackUserRegistration = (userId: string, method: string) => {
  trackEvent('user_registration', {
    user_id: userId,
    registration_method: method,
    value: 1,
  });
};

// User login tracking
export const trackUserLogin = (userId: string, method: string) => {
  trackEvent('user_login', {
    user_id: userId,
    login_method: method,
  });
};

// Conversion tracking
export const trackConversion = (value: number, currency: string = 'USD') => {
  trackEvent('conversion', {
    value,
    currency,
  });
};

// Share tracking
export const trackShare = (entityType: string, entityId: string, shareType: string) => {
  trackEvent('share_created', {
    entity_type: entityType,
    entity_id: entityId,
    share_type: shareType,
  });
};

// Comment tracking
export const trackComment = (entityType: string, entityId: string) => {
  trackEvent('comment_added', {
    entity_type: entityType,
    entity_id: entityId,
  });
};

// Type augmentation for window object
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}

