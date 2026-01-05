import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MonitoringService } from '../../src/lib/services/monitoring-service';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  setContext: vi.fn(),
  addBreadcrumb: vi.fn(),
  startTransaction: vi.fn(() => ({
    setStatus: vi.fn(),
    finish: vi.fn(),
  })),
  metrics: {
    gauge: vi.fn(),
  },
}));

describe('MonitoringService', () => {
  let monitoringService: MonitoringService;
  let mockSentry: any;

  beforeEach(() => {
    monitoringService = MonitoringService.getInstance();
    mockSentry = require('@sentry/nextjs');
    vi.clearAllMocks();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = MonitoringService.getInstance();
      const instance2 = MonitoringService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('captureError', () => {
    it('should capture error with Sentry', () => {
      const error = new Error('Test error');
      
      monitoringService.captureError(error);
      
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should set user context when provided', () => {
      const error = new Error('Test error');
      const context = {
        user: {
          id: 'user1',
          email: 'test@example.com',
          role: 'USER',
        },
      };
      
      monitoringService.captureError(error, context);
      
      expect(mockSentry.setUser).toHaveBeenCalledWith({
        id: 'user1',
        email: 'test@example.com',
        role: 'USER',
      });
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should set request context when provided', () => {
      const error = new Error('Test error');
      const context = {
        request: {
          url: '/api/test',
          method: 'POST',
        },
      };
      
      monitoringService.captureError(error, context);
      
      expect(mockSentry.setContext).toHaveBeenCalledWith('request', context.request);
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });
  });

  describe('captureMessage', () => {
    it('should capture info message', () => {
      monitoringService.captureMessage('Test message', 'info');
      
      expect(mockSentry.captureMessage).toHaveBeenCalledWith('Test message', 'info');
    });

    it('should capture warning message', () => {
      monitoringService.captureMessage('Warning message', 'warning');
      
      expect(mockSentry.captureMessage).toHaveBeenCalledWith('Warning message', 'warning');
    });

    it('should capture error message', () => {
      monitoringService.captureMessage('Error message', 'error');
      
      expect(mockSentry.captureMessage).toHaveBeenCalledWith('Error message', 'error');
    });
  });

  describe('recordMetric', () => {
    it('should record metric with Sentry', () => {
      const metric = {
        name: 'api.request.duration',
        value: 150,
        unit: 'ms' as const,
        tags: {
          endpoint: '/api/test',
          method: 'GET',
        },
      };
      
      monitoringService.recordMetric(metric);
      
      expect(mockSentry.metrics.gauge).toHaveBeenCalledWith(
        'api.request.duration',
        150,
        {
          unit: 'ms',
          tags: {
            endpoint: '/api/test',
            method: 'GET',
          },
        }
      );
    });
  });

  describe('setUser', () => {
    it('should set user context', () => {
      const user = {
        id: 'user1',
        email: 'test@example.com',
        role: 'USER',
      };
      
      monitoringService.setUser(user);
      
      expect(mockSentry.setUser).toHaveBeenCalledWith(user);
    });

    it('should clear user context when null', () => {
      monitoringService.setUser(null);
      
      expect(mockSentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  describe('addBreadcrumb', () => {
    it('should add breadcrumb', () => {
      monitoringService.addBreadcrumb('User clicked button', 'ui.click', {
        buttonId: 'submit',
      });
      
      expect(mockSentry.addBreadcrumb).toHaveBeenCalledWith({
        message: 'User clicked button',
        category: 'ui.click',
        data: {
          buttonId: 'submit',
        },
        level: 'info',
      });
    });
  });

  describe('trackAPICall', () => {
    it('should track successful API call', async () => {
      const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
      
      const result = await monitoringService.trackAPICall(
        '/api/test',
        'GET',
        mockFn
      );
      
      expect(result).toEqual({ data: 'test' });
      expect(mockSentry.startTransaction).toHaveBeenCalledWith({
        name: 'API GET /api/test',
        op: 'http.server',
      });
      expect(mockSentry.metrics.gauge).toHaveBeenCalled();
    });

    it('should track failed API call', async () => {
      const error = new Error('API error');
      const mockFn = vi.fn().mockRejectedValue(error);
      
      await expect(
        monitoringService.trackAPICall('/api/test', 'POST', mockFn)
      ).rejects.toThrow('API error');
      
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });
  });

  describe('trackDatabaseQuery', () => {
    it('should track successful database query', async () => {
      const mockFn = vi.fn().mockResolvedValue([{ id: 1 }]);
      
      const result = await monitoringService.trackDatabaseQuery(
        'SELECT * FROM users',
        mockFn
      );
      
      expect(result).toEqual([{ id: 1 }]);
      expect(mockSentry.startTransaction).toHaveBeenCalled();
    });

    it('should track failed database query', async () => {
      const error = new Error('Database error');
      const mockFn = vi.fn().mockRejectedValue(error);
      
      await expect(
        monitoringService.trackDatabaseQuery('SELECT * FROM users', mockFn)
      ).rejects.toThrow('Database error');
      
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });
  });

  describe('trackExternalAPI', () => {
    it('should track successful external API call', async () => {
      const mockFn = vi.fn().mockResolvedValue({ data: 'external' });
      
      const result = await monitoringService.trackExternalAPI(
        'OpenAI',
        '/v1/completions',
        mockFn
      );
      
      expect(result).toEqual({ data: 'external' });
      expect(mockSentry.startTransaction).toHaveBeenCalledWith({
        name: 'External API: OpenAI',
        op: 'http.client',
      });
    });

    it('should track failed external API call', async () => {
      const error = new Error('External API error');
      const mockFn = vi.fn().mockRejectedValue(error);
      
      await expect(
        monitoringService.trackExternalAPI('OpenAI', '/v1/completions', mockFn)
      ).rejects.toThrow('External API error');
      
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });
  });

  describe('logEvent', () => {
    it('should log info event', () => {
      monitoringService.logEvent('user.login', { userId: 'user1' }, 'info');
      
      expect(mockSentry.addBreadcrumb).toHaveBeenCalledWith({
        message: 'user.login',
        category: 'app.event',
        data: { userId: 'user1' },
        level: 'info',
      });
    });

    it('should log error event', () => {
      monitoringService.logEvent('payment.failed', { amount: 100 }, 'error');
      
      expect(mockSentry.addBreadcrumb).toHaveBeenCalled();
      expect(mockSentry.captureMessage).toHaveBeenCalledWith('Event: payment.failed', 'error');
    });
  });

  describe('trackUserAction', () => {
    it('should track user action', () => {
      monitoringService.trackUserAction('button.click', 'user1', {
        buttonId: 'submit',
      });
      
      expect(mockSentry.addBreadcrumb).toHaveBeenCalledWith({
        message: 'button.click',
        category: 'user.action',
        data: {
          userId: 'user1',
          buttonId: 'submit',
        },
        level: 'info',
      });
      
      expect(mockSentry.metrics.gauge).toHaveBeenCalledWith(
        'user.action',
        1,
        {
          unit: 'count',
          tags: {
            action: 'button.click',
            userId: 'user1',
          },
        }
      );
    });
  });

  describe('checkHealth', () => {
    it('should return health status', async () => {
      const health = await monitoringService.checkHealth();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('checks');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
    });
  });
});
