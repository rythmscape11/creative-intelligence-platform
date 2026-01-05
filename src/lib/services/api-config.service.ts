/**
 * API Configuration Service
 * Centralized service for managing API keys with database storage,
 * encryption, caching, and environment variable fallback.
 */

import { prisma } from '@/lib/prisma';
import { encrypt, decrypt, maskApiKey, isEncryptionConfigured } from './encryption.service';

// Cache configuration
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { value: string | null; timestamp: number }>();

// API key definitions with metadata
export interface ApiKeyDefinition {
    key: string;
    product: string;
    description: string;
    required: boolean;
    testEndpoint?: string;
    envFallback: string;
}

export const API_KEY_DEFINITIONS: ApiKeyDefinition[] = [
    // OpenAI - Used by multiple products
    {
        key: 'OPENAI_API_KEY',
        product: 'Strategy/Agency/Growth',
        description: 'OpenAI GPT models for AI features',
        required: true,
        testEndpoint: 'https://api.openai.com/v1/models',
        envFallback: 'OPENAI_API_KEY',
    },
    // Forge - Image Generation
    {
        key: 'FAL_API_KEY',
        product: 'Forge',
        description: 'Fal.ai image generation (Flux)',
        required: false,
        testEndpoint: 'https://fal.run/fal-ai/flux/schnell',
        envFallback: 'FAL_API_KEY',
    },
    {
        key: 'RUNWAY_API_KEY',
        product: 'Forge',
        description: 'Runway video generation (Gen-3)',
        required: false,
        envFallback: 'RUNWAY_API_KEY',
    },
    {
        key: 'KLING_API_KEY',
        product: 'Forge',
        description: 'Kling video generation',
        required: false,
        envFallback: 'KLING_API_KEY',
    },
    {
        key: 'GOOGLE_AI_API_KEY',
        product: 'Forge',
        description: 'Google Gemini AI',
        required: false,
        testEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        envFallback: 'GOOGLE_AI_API_KEY',
    },
    // Email Services
    {
        key: 'RESEND_API_KEY',
        product: 'Email',
        description: 'Resend email service',
        required: true,
        testEndpoint: 'https://api.resend.com/domains',
        envFallback: 'RESEND_API_KEY',
    },
    {
        key: 'SENDGRID_API_KEY',
        product: 'Email',
        description: 'SendGrid fallback email',
        required: false,
        envFallback: 'SENDGRID_API_KEY',
    },
    // Analytics
    {
        key: 'GOOGLE_PAGESPEED_API_KEY',
        product: 'Analytics',
        description: 'Google PageSpeed Insights',
        required: false,
        envFallback: 'GOOGLE_PAGESPEED_API_KEY',
    },
];

export interface ApiConfig {
    key: string;
    product: string;
    description: string;
    isConfigured: boolean;
    maskedValue?: string;
    source: 'database' | 'environment' | 'none';
    lastUpdated?: Date;
}

export interface TestResult {
    success: boolean;
    message: string;
    statusCode?: number;
}

/**
 * API Configuration Service
 */
export class ApiConfigService {
    /**
     * Get an API key by name
     * Priority: Database > Environment Variable
     */
    static async getApiKey(keyName: string): Promise<string | null> {
        // Check cache first
        const cached = cache.get(keyName);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return cached.value;
        }

        try {
            // Try database first
            const setting = await prisma.siteSettings.findUnique({
                where: { key: keyName },
            });

            if (setting && setting.category === 'API' && setting.value) {
                const decrypted = decrypt(setting.value);
                if (decrypted) {
                    cache.set(keyName, { value: decrypted, timestamp: Date.now() });
                    return decrypted;
                }
            }
        } catch (error) {
            console.error(`Error fetching API key ${keyName} from database:`, error);
        }

        // Fallback to environment variable
        const definition = API_KEY_DEFINITIONS.find(d => d.key === keyName);
        const envKey = definition?.envFallback || keyName;
        const envValue = process.env[envKey] || null;

        cache.set(keyName, { value: envValue, timestamp: Date.now() });
        return envValue;
    }

    /**
     * Set an API key (stores encrypted in database)
     */
    static async setApiKey(keyName: string, value: string): Promise<void> {
        if (!isEncryptionConfigured()) {
            throw new Error('Encryption is not configured. Set API_ENCRYPTION_KEY or NEXTAUTH_SECRET.');
        }

        const definition = API_KEY_DEFINITIONS.find(d => d.key === keyName);

        const encryptedValue = encrypt(value.trim());

        await prisma.siteSettings.upsert({
            where: { key: keyName },
            update: {
                value: encryptedValue,
                category: 'API',
                updatedAt: new Date(),
            },
            create: {
                key: keyName,
                value: encryptedValue,
                category: 'API',
                description: definition?.description || `API key for ${keyName}`,
            },
        });

        // Update cache
        cache.set(keyName, { value: value.trim(), timestamp: Date.now() });
    }

    /**
     * Delete an API key from database
     */
    static async deleteApiKey(keyName: string): Promise<void> {
        await prisma.siteSettings.deleteMany({
            where: {
                key: keyName,
                category: 'API',
            },
        });

        // Clear cache
        cache.delete(keyName);
    }

    /**
     * Get all API configurations with status
     */
    static async getAllApiConfigs(): Promise<ApiConfig[]> {
        const configs: ApiConfig[] = [];

        // Fetch all API settings from database
        const dbSettings = await prisma.siteSettings.findMany({
            where: { category: 'API' },
        });

        // Create map with proper typing
        type DbSetting = typeof dbSettings[number];
        const dbSettingsMap = new Map<string, DbSetting>(dbSettings.map(s => [s.key, s]));

        for (const definition of API_KEY_DEFINITIONS) {
            const dbSetting = dbSettingsMap.get(definition.key);
            const envValue = process.env[definition.envFallback];

            let isConfigured = false;
            let source: 'database' | 'environment' | 'none' = 'none';
            let maskedValue: string | undefined;
            let lastUpdated: Date | undefined;

            if (dbSetting && dbSetting.value) {
                const decrypted = decrypt(dbSetting.value);
                if (decrypted) {
                    isConfigured = true;
                    source = 'database';
                    maskedValue = maskApiKey(decrypted);
                    lastUpdated = dbSetting.updatedAt;
                }
            } else if (envValue) {
                isConfigured = true;
                source = 'environment';
                maskedValue = maskApiKey(envValue);
            }

            configs.push({
                key: definition.key,
                product: definition.product,
                description: definition.description,
                isConfigured,
                maskedValue,
                source,
                lastUpdated,
            });
        }

        return configs;
    }

    /**
     * Test an API key
     */
    static async testApiKey(keyName: string): Promise<TestResult> {
        const definition = API_KEY_DEFINITIONS.find(d => d.key === keyName);

        if (!definition) {
            return { success: false, message: 'Unknown API key' };
        }

        const apiKey = await this.getApiKey(keyName);

        if (!apiKey) {
            return { success: false, message: 'API key not configured' };
        }

        // If no test endpoint, just validate format
        if (!definition.testEndpoint) {
            // Basic format validation
            if (apiKey.length < 10) {
                return { success: false, message: 'API key appears too short' };
            }
            return { success: true, message: 'API key format looks valid (no test endpoint available)' };
        }

        try {
            // Test the API key
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Different auth methods for different APIs
            if (keyName.includes('OPENAI')) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            } else if (keyName === 'FAL_API_KEY') {
                headers['Authorization'] = `Key ${apiKey}`;
            } else if (keyName === 'RESEND_API_KEY') {
                headers['Authorization'] = `Bearer ${apiKey}`;
            } else if (keyName === 'GOOGLE_AI_API_KEY') {
                // Google AI uses query parameter instead
            } else {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            let testUrl = definition.testEndpoint;
            if (keyName === 'GOOGLE_AI_API_KEY') {
                testUrl = `${definition.testEndpoint}?key=${apiKey}`;
            }

            const response = await fetch(testUrl, {
                method: 'GET',
                headers,
            });

            if (response.ok) {
                return { success: true, message: 'API key is valid and working', statusCode: response.status };
            } else if (response.status === 401) {
                return { success: false, message: 'API key is invalid or expired', statusCode: 401 };
            } else if (response.status === 403) {
                return { success: false, message: 'API key lacks required permissions', statusCode: 403 };
            } else {
                return { success: false, message: `API returned status ${response.status}`, statusCode: response.status };
            }
        } catch (error) {
            return {
                success: false,
                message: `Failed to test API: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Clear the cache for a specific key or all keys
     */
    static clearCache(keyName?: string): void {
        if (keyName) {
            cache.delete(keyName);
        } else {
            cache.clear();
        }
    }

    /**
     * Check if a specific API key is configured (either in DB or env)
     */
    static async isConfigured(keyName: string): Promise<boolean> {
        const value = await this.getApiKey(keyName);
        return !!value;
    }
}

export default ApiConfigService;
