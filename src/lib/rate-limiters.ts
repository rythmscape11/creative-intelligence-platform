/**
 * Rate Limiter Configurations
 * 
 * Pre-configured rate limiters for different endpoints
 */

import RateLimiter from './rate-limit';

/**
 * Login Rate Limiter
 * Prevents brute force attacks on login endpoint
 * 5 attempts per 15 minutes per IP
 */
export const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 unique IPs tracked
  tokensPerInterval: 5, // 5 login attempts per interval
});

/**
 * Registration Rate Limiter
 * Prevents spam registrations
 * 3 attempts per hour per IP
 */
export const registrationRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  tokensPerInterval: 3, // 3 registration attempts per hour
});

/**
 * Password Reset Rate Limiter
 * Prevents password reset spam
 * 3 attempts per hour per email
 */
export const passwordResetRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 1000,
  tokensPerInterval: 3, // 3 reset attempts per hour
});

/**
 * API Rate Limiter (General)
 * For general API endpoints
 * 100 requests per minute per user/IP
 */
export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
  tokensPerInterval: 100, // 100 requests per minute
});

/**
 * Strategy Creation Rate Limiter
 * Prevents spam strategy creation
 * 10 strategies per hour per user
 */
export const strategyCreationRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  tokensPerInterval: 10, // 10 strategies per hour
});

/**
 * Export Rate Limiter
 * Prevents export spam (resource-intensive operation)
 * 5 exports per 5 minutes per user
 */
export const exportRateLimiter = new RateLimiter({
  interval: 5 * 60 * 1000, // 5 minutes
  uniqueTokenPerInterval: 500,
  tokensPerInterval: 5, // 5 exports per 5 minutes
});

/**
 * Admin API Rate Limiter
 * Higher limits for admin operations
 * 200 requests per minute per admin
 */
export const adminRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100,
  tokensPerInterval: 200, // 200 requests per minute
});

/**
 * Helper function to get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default (not ideal, but prevents errors)
  return 'unknown';
}

/**
 * Helper function to get user ID from session
 */
export async function getUserIdentifier(request: Request): Promise<string> {
  try {
    // This would need to be implemented based on your auth system
    // For now, fall back to IP
    return getClientIP(request);
  } catch {
    return getClientIP(request);
  }
}

