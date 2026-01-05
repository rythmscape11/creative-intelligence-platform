/**
 * Google Tag Manager Utilities
 * Helper functions for tracking events and page views with GTM
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const GTM_ID = 'GTM-NQRV6DDM';

/**
 * Push event to GTM dataLayer
 */
export const gtmEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    });
  }
};

/**
 * Track page view
 */
export const gtmPageView = (url: string) => {
  gtmEvent('pageview', {
    page: url,
  });
};

/**
 * Track strategy creation
 */
export const gtmTrackStrategyCreated = (strategyId: string, industry: string) => {
  gtmEvent('strategy_created', {
    strategy_id: strategyId,
    industry,
  });
};

/**
 * Track export generation
 */
export const gtmTrackExport = (format: string, strategyId: string) => {
  gtmEvent('export_generated', {
    export_format: format,
    strategy_id: strategyId,
  });
};

/**
 * Track user registration
 */
export const gtmTrackRegistration = (userId: string, method: string = 'email') => {
  gtmEvent('sign_up', {
    user_id: userId,
    method,
  });
};

/**
 * Track user login
 */
export const gtmTrackLogin = (userId: string, method: string = 'email') => {
  gtmEvent('login', {
    user_id: userId,
    method,
  });
};

/**
 * Track blog post view
 */
export const gtmTrackBlogView = (postId: string, postTitle: string, category: string) => {
  gtmEvent('blog_view', {
    post_id: postId,
    post_title: postTitle,
    category,
  });
};

/**
 * Track form submission
 */
export const gtmTrackFormSubmit = (formName: string, success: boolean) => {
  gtmEvent('form_submit', {
    form_name: formName,
    success,
  });
};

/**
 * Track error
 */
export const gtmTrackError = (errorType: string, errorMessage: string) => {
  gtmEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
  });
};

/**
 * Initialize GTM dataLayer
 */
export const initGTM = () => {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
  }
};
