/**
 * Rate Limiting Utility
 * 
 * Implements token bucket algorithm for rate limiting API requests.
 * Uses in-memory storage (suitable for single-server deployments).
 * For multi-server deployments, use Redis or similar distributed cache.
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens (IPs/users)
  tokensPerInterval: number; // Max requests per interval
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private config: RateLimitConfig;
  private buckets: Map<string, TokenBucket>;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.buckets = new Map();

    // Clean up old entries periodically
    setInterval(() => this.cleanup(), this.config.interval);
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @returns Object with allowed status and remaining tokens
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    let bucket = this.buckets.get(identifier);

    // Create new bucket if doesn't exist
    if (!bucket) {
      // Check if we've exceeded unique token limit
      if (this.buckets.size >= this.config.uniqueTokenPerInterval) {
        // Remove oldest bucket
        const oldestKey = this.buckets.keys().next().value;
        if (oldestKey) {
          this.buckets.delete(oldestKey);
        }
      }

      bucket = {
        tokens: this.config.tokensPerInterval,
        lastRefill: now,
      };
      this.buckets.set(identifier, bucket);
    }

    // Refill tokens based on time elapsed
    const timeSinceLastRefill = now - bucket.lastRefill;
    if (timeSinceLastRefill >= this.config.interval) {
      bucket.tokens = this.config.tokensPerInterval;
      bucket.lastRefill = now;
    }

    // Check if request is allowed
    if (bucket.tokens > 0) {
      bucket.tokens--;
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt: bucket.lastRefill + this.config.interval,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.lastRefill + this.config.interval,
    };
  }

  /**
   * Clean up old buckets
   */
  private cleanup() {
    const now = Date.now();
    const entries = Array.from(this.buckets.entries());
    for (const [key, bucket] of entries) {
      if (now - bucket.lastRefill > this.config.interval * 2) {
        this.buckets.delete(key);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string) {
    this.buckets.delete(identifier);
  }

  /**
   * Get current status for an identifier
   */
  getStatus(identifier: string): { tokens: number; resetAt: number } | null {
    const bucket = this.buckets.get(identifier);
    if (!bucket) return null;

    return {
      tokens: bucket.tokens,
      resetAt: bucket.lastRefill + this.config.interval,
    };
  }
}

// Pre-configured rate limiters for different use cases

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per minute per IP
 */
export const authRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  tokensPerInterval: 5,
});

/**
 * Standard rate limiter for API endpoints
 * 100 requests per minute per user
 */
export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
  tokensPerInterval: 100,
});

/**
 * Lenient rate limiter for public endpoints
 * 300 requests per minute per IP
 */
export const publicRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 2000,
  tokensPerInterval: 300,
});

/**
 * Strict rate limiter for expensive operations (AI generation, etc.)
 * 10 requests per hour per user
 */
export const expensiveRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  tokensPerInterval: 10,
});

/**
 * Helper function to get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  return ip;
}

/**
 * Helper function to get user identifier from session
 */
export function getUserIdentifier(userId?: string, fallbackIp?: string): string {
  return userId || fallbackIp || 'anonymous';
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(resetAt: number) {
  const resetDate = new Date(resetAt);
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter,
      resetAt: resetDate.toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': resetDate.toISOString(),
      },
    }
  );
}

/**
 * Middleware helper for rate limiting
 */
export function withRateLimit(
  rateLimiter: RateLimiter,
  getIdentifier: (request: Request) => string | Promise<string>
) {
  return async (request: Request, handler: () => Promise<Response>) => {
    const identifier = await getIdentifier(request);
    const { allowed, remaining, resetAt } = rateLimiter.check(identifier);

    if (!allowed) {
      return rateLimitResponse(resetAt);
    }

    // Add rate limit headers to response
    const response = await handler();
    
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());

    return response;
  };
}

export default RateLimiter;

