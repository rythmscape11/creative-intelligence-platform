/**
 * Cache Utility
 * 
 * Provides caching functionality with Redis fallback to in-memory cache
 */

import { logger } from './services/logger-service';

// In-memory cache fallback
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

// Redis client (lazy initialization)
let redisClient: any = null;
let redisAvailable = false;

/**
 * Initialize Redis client
 */
async function initRedis() {
  if (redisClient !== null) {
    return redisClient;
  }

  // Only try to initialize if REDIS_URL is set
  if (!process.env.REDIS_URL) {
    logger.info('Redis URL not configured, using in-memory cache');
    redisAvailable = false;
    return null;
  }

  try {
    // Dynamically import IORedis
    const Redis = (await import('ioredis')).default;

    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('Redis connection failed after 3 retries, falling back to memory cache');
          redisAvailable = false;
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      reconnectOnError(err) {
        logger.warn('Redis reconnect on error', err);
        return true;
      },
    });

    redisClient.on('error', (err: Error) => {
      logger.error('Redis client error', err);
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
      redisAvailable = true;
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
      redisAvailable = true;
    });

    redisAvailable = true;

    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis', error as Error);
    redisAvailable = false;
    redisClient = null;
    return null;
  }
}

/**
 * Get value from cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    // Try Redis first
    if (redisAvailable && redisClient) {
      const value = await redisClient.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
    }

    // Fallback to memory cache
    const cached = memoryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }

    // Clean up expired entry
    if (cached) {
      memoryCache.delete(key);
    }

    return null;
  } catch (error) {
    logger.error(`Cache get error for key: ${key}`, error as Error);
    return null;
  }
}

/**
 * Set value in cache
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300 // Default 5 minutes
): Promise<void> {
  try {
    const serialized = JSON.stringify(value);

    // Try Redis first
    if (redisAvailable && redisClient) {
      await redisClient.setex(key, ttlSeconds, serialized);
    }

    // Always set in memory cache as fallback
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  } catch (error) {
    logger.error(`Cache set error for key: ${key}`, error as Error);
  }
}

/**
 * Delete value from cache
 */
export async function deleteCached(key: string): Promise<void> {
  try {
    // Try Redis first
    if (redisAvailable && redisClient) {
      await redisClient.del(key);
    }

    // Delete from memory cache
    memoryCache.delete(key);
  } catch (error) {
    logger.error(`Cache delete error for key: ${key}`, error as Error);
  }
}

/**
 * Delete all keys matching a pattern
 */
export async function deleteCachedPattern(pattern: string): Promise<void> {
  try {
    // Try Redis first
    if (redisAvailable && redisClient) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }

    // Delete from memory cache
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  } catch (error) {
    logger.error(`Cache delete pattern error for pattern: ${pattern}`, error as Error);
  }
}

/**
 * Get or set cached value with a factory function
 */
export async function getOrSetCached<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Try to get from cache
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Generate new value
  const value = await factory();

  // Store in cache
  await setCached(key, value, ttlSeconds);

  return value;
}

/**
 * Clear all cache
 */
export async function clearCache(): Promise<void> {
  try {
    // Clear Redis
    if (redisAvailable && redisClient) {
      await redisClient.flushdb();
    }

    // Clear memory cache
    memoryCache.clear();

    logger.info('Cache cleared successfully');
  } catch (error) {
    logger.error('Cache clear error', error as Error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  type: 'redis' | 'memory';
  size: number;
  available: boolean;
}> {
  try {
    if (redisAvailable && redisClient) {
      const dbsize = await redisClient.dbsize();

      return {
        type: 'redis',
        size: dbsize,
        available: true,
      };
    }

    return {
      type: 'memory',
      size: memoryCache.size,
      available: true,
    };
  } catch (error) {
    logger.error('Cache stats error', error as Error);
    return {
      type: 'memory',
      size: memoryCache.size,
      available: false,
    };
  }
}

/**
 * Cleanup expired entries from memory cache
 */
function cleanupMemoryCache() {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt < now) {
      memoryCache.delete(key);
    }
  }
}

// Cleanup memory cache every 5 minutes
setInterval(cleanupMemoryCache, 5 * 60 * 1000);

// Initialize Redis on module load (non-blocking)
initRedis().catch((err) => {
  logger.warn('Redis initialization failed, using memory cache', err);
});

// Export cache key generators for consistency
export const CacheKeys = {
  dashboardStats: (userId: string, role: string) => `dashboard:stats:${role}:${userId}`,
  dashboardStatsGlobal: (role: string) => `dashboard:stats:${role}:global`,
  userProfile: (userId: string) => `user:profile:${userId}`,
  strategyList: (userId: string) => `strategy:list:${userId}`,
  blogPosts: (page: number, status?: string) => `blog:posts:${page}:${status || 'all'}`,
} as const;

