import { MonitoringService } from './monitoring-service';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  error?: Error;
}

export class LoggerService {
  private static instance: LoggerService;
  private monitoring: MonitoringService;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
  }

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
    this.monitoring.captureMessage(message, 'warning');
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
    
    if (error) {
      this.monitoring.captureError(error, {
        extra: { message, ...context },
      });
    } else {
      this.monitoring.captureMessage(message, 'error');
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    };

    // Add to in-memory log buffer
    this.logs.push(entry);
    
    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.consoleLog(entry);

    // Send to external logging service if configured
    this.sendToExternalLogger(entry);
  }

  /**
   * Output to console with appropriate formatting
   */
  private consoleLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(message, entry.context || '');
        }
        break;
      case LogLevel.INFO:
        console.info(message, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(message, entry.context || '');
        break;
      case LogLevel.ERROR:
        console.error(message, entry.error || entry.context || '');
        if (entry.error?.stack) {
          console.error(entry.error.stack);
        }
        break;
    }
  }

  /**
   * Send log to external logging service
   */
  private async sendToExternalLogger(entry: LogEntry): Promise<void> {
    // Only send warnings and errors to external service
    if (entry.level !== LogLevel.WARN && entry.level !== LogLevel.ERROR) {
      return;
    }

    // Skip in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_EXTERNAL_LOGGING) {
      return;
    }

    try {
      // Send to external logging service (e.g., Datadog, CloudWatch, etc.)
      if (process.env.LOGGING_ENDPOINT) {
        await fetch(process.env.LOGGING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LOGGING_API_KEY}`,
          },
          body: JSON.stringify({
            level: entry.level,
            message: entry.message,
            timestamp: entry.timestamp.toISOString(),
            context: entry.context,
            error: entry.error ? {
              message: entry.error.message,
              stack: entry.error.stack,
              name: entry.error.name,
            } : undefined,
            environment: process.env.NODE_ENV,
            service: 'mediaplanpro',
          }),
        });
      }
    } catch (error) {
      // Don't throw errors from logging
      console.error('Failed to send log to external service:', error);
    }
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100, level?: LogLevel): LogEntry[] {
    let logs = this.logs;
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    return logs.slice(-count);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Create a child logger with context
   */
  createChildLogger(context: Record<string, any>): ChildLogger {
    return new ChildLogger(this, context);
  }

  /**
   * Log API request
   */
  logAPIRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId?: string
  ): void {
    const level = statusCode >= 500 ? LogLevel.ERROR : 
                  statusCode >= 400 ? LogLevel.WARN : 
                  LogLevel.INFO;

    this.log(level, `API ${method} ${url}`, {
      method,
      url,
      statusCode,
      duration,
      userId,
    });
  }

  /**
   * Log database query
   */
  logDatabaseQuery(
    query: string,
    duration: number,
    error?: Error
  ): void {
    if (error) {
      this.error(`Database query failed: ${query.substring(0, 100)}`, error, {
        query,
        duration,
      });
    } else if (duration > 1000) {
      // Log slow queries as warnings
      this.warn(`Slow database query: ${query.substring(0, 100)}`, {
        query,
        duration,
      });
    } else if (process.env.NODE_ENV === 'development') {
      this.debug(`Database query: ${query.substring(0, 100)}`, {
        query,
        duration,
      });
    }
  }

  /**
   * Log user action
   */
  logUserAction(
    userId: string,
    action: string,
    details?: Record<string, any>
  ): void {
    this.info(`User action: ${action}`, {
      userId,
      action,
      ...details,
    });

    this.monitoring.trackUserAction(action, userId, details);
  }

  /**
   * Log security event
   */
  logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details?: Record<string, any>
  ): void {
    const level = severity === 'critical' || severity === 'high' ? 
                  LogLevel.ERROR : 
                  severity === 'medium' ? LogLevel.WARN : LogLevel.INFO;

    this.log(level, `Security event: ${event}`, {
      event,
      severity,
      ...details,
    });

    // Always send security events to monitoring
    this.monitoring.logEvent(`security.${event}`, {
      severity,
      ...details,
    }, level === LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warning' : 'info');
  }
}

/**
 * Child logger with inherited context
 */
export class ChildLogger {
  constructor(
    private parent: LoggerService,
    private context: Record<string, any>
  ) {}

  debug(message: string, additionalContext?: Record<string, any>): void {
    this.parent.debug(message, { ...this.context, ...additionalContext });
  }

  info(message: string, additionalContext?: Record<string, any>): void {
    this.parent.info(message, { ...this.context, ...additionalContext });
  }

  warn(message: string, additionalContext?: Record<string, any>): void {
    this.parent.warn(message, { ...this.context, ...additionalContext });
  }

  error(message: string, error?: Error, additionalContext?: Record<string, any>): void {
    this.parent.error(message, error, { ...this.context, ...additionalContext });
  }
}

// Export singleton instance
export const logger = LoggerService.getInstance();
