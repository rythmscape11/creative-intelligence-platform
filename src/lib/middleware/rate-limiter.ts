/**
 * Rate Limiting Middleware
 * 
 * Implements token bucket algorithm for rate limiting
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit a request based on IP address
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 60 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Admin endpoints - stricter limits
  ADMIN_READ: { windowMs: 60000, maxRequests: 100 }, // 100 requests per minute
  ADMIN_WRITE: { windowMs: 60000, maxRequests: 30 }, // 30 requests per minute
  ADMIN_DELETE: { windowMs: 60000, maxRequests: 10 }, // 10 requests per minute
  
  // Auth endpoints
  AUTH_LOGIN: { windowMs: 900000, maxRequests: 5 }, // 5 requests per 15 minutes
  AUTH_REGISTER: { windowMs: 3600000, maxRequests: 3 }, // 3 requests per hour
  AUTH_PASSWORD_RESET: { windowMs: 3600000, maxRequests: 3 }, // 3 requests per hour
  
  // API endpoints
  API_READ: { windowMs: 60000, maxRequests: 200 }, // 200 requests per minute
  API_WRITE: { windowMs: 60000, maxRequests: 60 }, // 60 requests per minute
  
  // Strategy generation
  STRATEGY_GENERATE: { windowMs: 3600000, maxRequests: 10 }, // 10 requests per hour
};

/**
 * Apply rate limiting to a request handler
 */
export function withRateLimit(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const ip = getClientIp(request);
    const identifier = `${ip}:${request.url}`;
    
    const { allowed, remaining, resetTime } = rateLimit(identifier, config);
    
    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }
    
    const response = await handler(request, ...args);
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());
    
    return response;
  };
}

