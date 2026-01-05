import * as Sentry from '@sentry/nextjs';

export interface ErrorContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  request?: {
    url: string;
    method: string;
    headers?: Record<string, string>;
  };
  extra?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  tags?: Record<string, string>;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private isInitialized: boolean = false;

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize monitoring service
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Sentry is initialized in sentry.client.config.ts and sentry.server.config.ts
    // This method can be used for additional initialization if needed

    this.isInitialized = true;
    console.log('Monitoring service initialized');
  }

  /**
   * Capture an error with context
   */
  captureError(error: Error, context?: ErrorContext): void {
    if (context?.user) {
      Sentry.setUser({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role,
      });
    }

    if (context?.request) {
      Sentry.setContext('request', context.request);
    }

    if (context?.extra) {
      Sentry.setContext('extra', context.extra);
    }

    Sentry.captureException(error);
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    Sentry.captureMessage(message, level);
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Metric] ${metric.name}: ${metric.value}${metric.unit}`, metric.tags);
    }

    // Add breadcrumb for Sentry tracking
    Sentry.addBreadcrumb({
      message: `Metric: ${metric.name}`,
      category: 'performance',
      data: {
        value: metric.value,
        unit: metric.unit,
        ...metric.tags,
      },
      level: 'info',
    });
  }

  /**
   * Start a performance span (modern Sentry API)
   * Returns a span-like object for compatibility
   */
  startTransaction(name: string, operation: string): { setStatus: (s: string) => void; finish: () => void } {
    // Use a simple wrapper that doesn't rely on deprecated APIs
    const startTime = Date.now();
    return {
      setStatus: (status: string) => {
        // Log status for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Transaction ${name}] Status: ${status}`);
        }
      },
      finish: () => {
        const duration = Date.now() - startTime;
        // Record as a metric instead
        this.recordMetric({
          name: 'transaction.duration',
          value: duration,
          unit: 'ms',
          tags: { name, operation },
        });
      },
    };
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email: string; role: string } | null): void {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } else {
      Sentry.setUser(null);
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }

  /**
   * Track API call performance
   */
  async trackAPICall<T>(
    endpoint: string,
    method: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const transaction = this.startTransaction(`API ${method} ${endpoint}`, 'http.server');
    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.recordMetric({
        name: 'api.request.duration',
        value: duration,
        unit: 'ms',
        tags: {
          endpoint,
          method,
          status: 'success',
        },
      });

      transaction.setStatus('ok');
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        name: 'api.request.duration',
        value: duration,
        unit: 'ms',
        tags: {
          endpoint,
          method,
          status: 'error',
        },
      });

      transaction.setStatus('internal_error');
      this.captureError(error as Error, {
        request: { url: endpoint, method },
      });

      throw error;
    } finally {
      transaction.finish();
    }
  }

  /**
   * Track database query performance
   */
  async trackDatabaseQuery<T>(
    query: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const transaction = this.startTransaction(`DB Query: ${query}`, 'db.query');
    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.recordMetric({
        name: 'db.query.duration',
        value: duration,
        unit: 'ms',
        tags: {
          query: query.substring(0, 50), // Truncate long queries
          status: 'success',
        },
      });

      transaction.setStatus('ok');
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        name: 'db.query.duration',
        value: duration,
        unit: 'ms',
        tags: {
          query: query.substring(0, 50),
          status: 'error',
        },
      });

      transaction.setStatus('internal_error');
      this.captureError(error as Error, {
        extra: { query },
      });

      throw error;
    } finally {
      transaction.finish();
    }
  }

  /**
   * Track external API call performance
   */
  async trackExternalAPI<T>(
    service: string,
    endpoint: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const transaction = this.startTransaction(
      `External API: ${service}`,
      'http.client'
    );
    const startTime = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.recordMetric({
        name: 'external.api.duration',
        value: duration,
        unit: 'ms',
        tags: {
          service,
          endpoint,
          status: 'success',
        },
      });

      transaction.setStatus('ok');
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.recordMetric({
        name: 'external.api.duration',
        value: duration,
        unit: 'ms',
        tags: {
          service,
          endpoint,
          status: 'error',
        },
      });

      transaction.setStatus('internal_error');
      this.captureError(error as Error, {
        extra: { service, endpoint },
      });

      throw error;
    } finally {
      transaction.finish();
    }
  }

  /**
   * Log application event
   */
  logEvent(
    event: string,
    data?: Record<string, any>,
    level: 'info' | 'warning' | 'error' = 'info'
  ): void {
    this.addBreadcrumb(event, 'app.event', data);

    if (level === 'error') {
      this.captureMessage(`Event: ${event}`, 'error');
    }

    // Also log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event] ${event}:`, data);
    }
  }

  /**
   * Track user action
   */
  trackUserAction(action: string, userId: string, data?: Record<string, any>): void {
    this.addBreadcrumb(action, 'user.action', {
      userId,
      ...data,
    });

    this.recordMetric({
      name: 'user.action',
      value: 1,
      unit: 'count',
      tags: {
        action,
        userId,
      },
    });
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage(): void {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();

      this.recordMetric({
        name: 'memory.heap.used',
        value: usage.heapUsed,
        unit: 'bytes',
      });

      this.recordMetric({
        name: 'memory.heap.total',
        value: usage.heapTotal,
        unit: 'bytes',
      });

      this.recordMetric({
        name: 'memory.rss',
        value: usage.rss,
        unit: 'bytes',
      });
    }
  }

  /**
   * Check system health
   */
  async checkHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
  }> {
    const checks: Record<string, boolean> = {};

    // Check database connection
    try {
      // This would be a real database ping in production
      checks.database = true;
    } catch (error) {
      checks.database = false;
      this.captureError(error as Error, {
        extra: { check: 'database' },
      });
    }

    // Check Redis connection (if applicable)
    try {
      // This would be a real Redis ping in production
      checks.redis = true;
    } catch (error) {
      checks.redis = false;
      this.captureError(error as Error, {
        extra: { check: 'redis' },
      });
    }

    // Check external services
    try {
      // This would check external API availability
      checks.externalAPIs = true;
    } catch (error) {
      checks.externalAPIs = false;
      this.captureError(error as Error, {
        extra: { check: 'externalAPIs' },
      });
    }

    // Determine overall status
    const allHealthy = Object.values(checks).every(check => check);
    const someHealthy = Object.values(checks).some(check => check);

    const status = allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'unhealthy';

    return { status, checks };
  }
}
