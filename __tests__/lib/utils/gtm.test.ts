import {
  gtmEvent,
  gtmPageView,
  gtmTrackStrategyCreated,
  gtmTrackExport,
  gtmTrackRegistration,
  gtmTrackLogin,
  gtmTrackBlogView,
  gtmTrackFormSubmit,
  gtmTrackError,
  initGTM,
  GTM_ID,
} from '@/lib/utils/gtm';

describe('GTM Utilities', () => {
  beforeEach(() => {
    // Reset dataLayer before each test
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = [];
    }
  });

  describe('GTM_ID', () => {
    it('should have correct GTM container ID', () => {
      expect(GTM_ID).toBe('GTM-NQRV6DDM');
    });
  });

  describe('initGTM', () => {
    it('should initialize dataLayer if not exists', () => {
      delete (window as any).dataLayer;
      initGTM();
      expect(window.dataLayer).toBeDefined();
      expect(Array.isArray(window.dataLayer)).toBe(true);
    });

    it('should not override existing dataLayer', () => {
      (window as any).dataLayer = [{ test: 'data' }];
      initGTM();
      expect(window.dataLayer).toHaveLength(1);
      expect(window.dataLayer[0]).toEqual({ test: 'data' });
    });
  });

  describe('gtmEvent', () => {
    it('should push event to dataLayer', () => {
      gtmEvent('test_event', { key: 'value' });
      expect(window.dataLayer).toContainEqual({
        event: 'test_event',
        key: 'value',
      });
    });

    it('should push event without data', () => {
      gtmEvent('simple_event');
      expect(window.dataLayer).toContainEqual({
        event: 'simple_event',
      });
    });

    it('should handle undefined dataLayer gracefully', () => {
      delete (window as any).dataLayer;
      expect(() => gtmEvent('test_event')).not.toThrow();
    });
  });

  describe('gtmPageView', () => {
    it('should track page view with URL', () => {
      gtmPageView('/test-page');
      expect(window.dataLayer).toContainEqual({
        event: 'pageview',
        page: '/test-page',
      });
    });
  });

  describe('gtmTrackStrategyCreated', () => {
    it('should track strategy creation', () => {
      gtmTrackStrategyCreated('strategy_123', 'Technology');
      expect(window.dataLayer).toContainEqual({
        event: 'strategy_created',
        strategy_id: 'strategy_123',
        industry: 'Technology',
      });
    });
  });

  describe('gtmTrackExport', () => {
    it('should track export generation', () => {
      gtmTrackExport('PPTX', 'strategy_123');
      expect(window.dataLayer).toContainEqual({
        event: 'export_generated',
        export_format: 'PPTX',
        strategy_id: 'strategy_123',
      });
    });
  });

  describe('gtmTrackRegistration', () => {
    it('should track user registration with default method', () => {
      gtmTrackRegistration('user_123');
      expect(window.dataLayer).toContainEqual({
        event: 'sign_up',
        user_id: 'user_123',
        method: 'email',
      });
    });

    it('should track user registration with custom method', () => {
      gtmTrackRegistration('user_123', 'google');
      expect(window.dataLayer).toContainEqual({
        event: 'sign_up',
        user_id: 'user_123',
        method: 'google',
      });
    });
  });

  describe('gtmTrackLogin', () => {
    it('should track user login with default method', () => {
      gtmTrackLogin('user_123');
      expect(window.dataLayer).toContainEqual({
        event: 'login',
        user_id: 'user_123',
        method: 'email',
      });
    });

    it('should track user login with custom method', () => {
      gtmTrackLogin('user_123', 'oauth');
      expect(window.dataLayer).toContainEqual({
        event: 'login',
        user_id: 'user_123',
        method: 'oauth',
      });
    });
  });

  describe('gtmTrackBlogView', () => {
    it('should track blog post view', () => {
      gtmTrackBlogView('post_123', 'Test Post', 'Marketing');
      expect(window.dataLayer).toContainEqual({
        event: 'blog_view',
        post_id: 'post_123',
        post_title: 'Test Post',
        category: 'Marketing',
      });
    });
  });

  describe('gtmTrackFormSubmit', () => {
    it('should track successful form submission', () => {
      gtmTrackFormSubmit('contact_form', true);
      expect(window.dataLayer).toContainEqual({
        event: 'form_submit',
        form_name: 'contact_form',
        success: true,
      });
    });

    it('should track failed form submission', () => {
      gtmTrackFormSubmit('contact_form', false);
      expect(window.dataLayer).toContainEqual({
        event: 'form_submit',
        form_name: 'contact_form',
        success: false,
      });
    });
  });

  describe('gtmTrackError', () => {
    it('should track error events', () => {
      gtmTrackError('validation_error', 'Invalid email format');
      expect(window.dataLayer).toContainEqual({
        event: 'error',
        error_type: 'validation_error',
        error_message: 'Invalid email format',
      });
    });
  });

  describe('Multiple events', () => {
    it('should track multiple events in sequence', () => {
      gtmPageView('/home');
      gtmTrackLogin('user_123');
      gtmTrackStrategyCreated('strategy_456', 'E-commerce');

      expect(window.dataLayer).toHaveLength(3);
      expect(window.dataLayer[0]).toEqual({
        event: 'pageview',
        page: '/home',
      });
      expect(window.dataLayer[1]).toEqual({
        event: 'login',
        user_id: 'user_123',
        method: 'email',
      });
      expect(window.dataLayer[2]).toEqual({
        event: 'strategy_created',
        strategy_id: 'strategy_456',
        industry: 'E-commerce',
      });
    });
  });
});
