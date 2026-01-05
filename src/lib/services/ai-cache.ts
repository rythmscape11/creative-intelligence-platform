import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface CacheConfig {
    ttlHours?: number;
    model: string;
}

interface CacheResult {
    hit: boolean;
    response: string | null;
    cacheKey: string;
}

/**
 * AI Response Caching Service
 * Reduces AI costs by caching responses for identical prompts
 */
export class AICacheService {
    /**
     * Generate a unique cache key from prompt and model
     */
    private static generateKey(prompt: string, model: string): string {
        // Normalize prompt for better cache hits
        const normalizedPrompt = prompt.trim().toLowerCase();
        return crypto.createHash('sha256')
            .update(`${model}:${normalizedPrompt}`)
            .digest('hex');
    }

    /**
     * Try to get a cached response
     */
    static async get(prompt: string, model: string): Promise<CacheResult> {
        const cacheKey = this.generateKey(prompt, model);

        try {
            const cached = await prisma.aiCache.findUnique({
                where: { key: cacheKey },
            });

            if (cached && cached.expiresAt > new Date()) {
                // Track cache hit for analytics
                await prisma.aiCache.update({
                    where: { key: cacheKey },
                    data: {
                        hitCount: { increment: 1 },
                        lastAccessedAt: new Date()
                    }
                }).catch(() => { }); // Non-blocking update

                return {
                    hit: true,
                    response: cached.response,
                    cacheKey
                };
            }

            // Cache miss or expired
            return {
                hit: false,
                response: null,
                cacheKey
            };

        } catch (error) {
            console.error('AI Cache get error:', error);
            return {
                hit: false,
                response: null,
                cacheKey
            };
        }
    }

    /**
     * Store a response in cache
     */
    static async set(
        prompt: string,
        model: string,
        response: string,
        config: CacheConfig = { model: 'gpt-4-turbo-preview', ttlHours: 24 }
    ): Promise<void> {
        const cacheKey = this.generateKey(prompt, model);
        const ttlHours = config.ttlHours || 24;
        const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

        try {
            await prisma.aiCache.upsert({
                where: { key: cacheKey },
                create: {
                    key: cacheKey,
                    prompt: prompt.substring(0, 1000), // Store first 1000 chars for debugging
                    model,
                    response,
                    expiresAt,
                    hitCount: 0,
                    createdAt: new Date(),
                    lastAccessedAt: new Date()
                },
                update: {
                    response,
                    expiresAt,
                    lastAccessedAt: new Date()
                }
            });
        } catch (error) {
            console.error('AI Cache set error:', error);
            // Non-fatal, continue without caching
        }
    }

    /**
     * Invalidate cache entries matching a pattern
     */
    static async invalidate(model?: string): Promise<number> {
        try {
            const result = await prisma.aiCache.deleteMany({
                where: model ? { model } : {}
            });
            return result.count;
        } catch (error) {
            console.error('AI Cache invalidate error:', error);
            return 0;
        }
    }

    /**
     * Clean up expired cache entries
     */
    static async cleanup(): Promise<number> {
        try {
            const result = await prisma.aiCache.deleteMany({
                where: {
                    expiresAt: { lt: new Date() }
                }
            });
            return result.count;
        } catch (error) {
            console.error('AI Cache cleanup error:', error);
            return 0;
        }
    }

    /**
     * Get cache statistics
     */
    static async getStats(): Promise<{
        totalEntries: number;
        totalHits: number;
        cacheSize: number;
        topModels: Array<{ model: string; count: number }>;
    }> {
        try {
            const [totalEntries, hitStats, modelStats] = await Promise.all([
                prisma.aiCache.count(),
                prisma.aiCache.aggregate({
                    _sum: { hitCount: true }
                }),
                prisma.aiCache.groupBy({
                    by: ['model'],
                    _count: { model: true },
                    orderBy: { _count: { model: 'desc' } },
                    take: 5
                })
            ]);

            return {
                totalEntries,
                totalHits: hitStats._sum.hitCount || 0,
                cacheSize: totalEntries, // Simplified - would need actual size calc
                topModels: modelStats.map(m => ({
                    model: m.model,
                    count: m._count.model
                }))
            };
        } catch (error) {
            console.error('AI Cache stats error:', error);
            return {
                totalEntries: 0,
                totalHits: 0,
                cacheSize: 0,
                topModels: []
            };
        }
    }
}

export default AICacheService;
