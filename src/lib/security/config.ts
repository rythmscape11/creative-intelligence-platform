/**
 * Security Configuration
 * Enterprise security settings and helpers
 */

export interface SecurityConfig {
    // 2FA settings
    twoFactorRequired: boolean;
    twoFactorMethods: ('totp' | 'sms' | 'email')[];

    // Session settings
    sessionTimeout: number; // minutes
    maxConcurrentSessions: number;

    // IP settings
    ipWhitelist: string[];
    ipBlacklist: string[];
    geoBlocking: boolean;
    blockedCountries: string[];

    // Rate limiting
    rateLimitPerMinute: number;
    rateLimitPerHour: number;

    // Password policy
    minPasswordLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiryDays: number;
    preventPasswordReuse: number;
}

// Plan-based security configurations
export const SECURITY_CONFIGS: Record<string, SecurityConfig> = {
    FREE: {
        twoFactorRequired: false,
        twoFactorMethods: ['email'],
        sessionTimeout: 60,
        maxConcurrentSessions: 1,
        ipWhitelist: [],
        ipBlacklist: [],
        geoBlocking: false,
        blockedCountries: [],
        rateLimitPerMinute: 30,
        rateLimitPerHour: 500,
        minPasswordLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        passwordExpiryDays: 0, // No expiry
        preventPasswordReuse: 0,
    },
    PRO: {
        twoFactorRequired: false,
        twoFactorMethods: ['email', 'totp'],
        sessionTimeout: 120,
        maxConcurrentSessions: 3,
        ipWhitelist: [],
        ipBlacklist: [],
        geoBlocking: false,
        blockedCountries: [],
        rateLimitPerMinute: 60,
        rateLimitPerHour: 1000,
        minPasswordLength: 10,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        passwordExpiryDays: 0,
        preventPasswordReuse: 3,
    },
    AGENCY: {
        twoFactorRequired: true, // Mandatory for agency
        twoFactorMethods: ['email', 'totp', 'sms'],
        sessionTimeout: 240,
        maxConcurrentSessions: 10,
        ipWhitelist: [],
        ipBlacklist: [],
        geoBlocking: true,
        blockedCountries: [],
        rateLimitPerMinute: 120,
        rateLimitPerHour: 5000,
        minPasswordLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiryDays: 90,
        preventPasswordReuse: 5,
    },
    ENTERPRISE: {
        twoFactorRequired: true, // Mandatory for enterprise
        twoFactorMethods: ['email', 'totp', 'sms'],
        sessionTimeout: 480,
        maxConcurrentSessions: -1, // Unlimited
        ipWhitelist: [],
        ipBlacklist: [],
        geoBlocking: true,
        blockedCountries: [],
        rateLimitPerMinute: 300,
        rateLimitPerHour: 10000,
        minPasswordLength: 14,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiryDays: 60,
        preventPasswordReuse: 10,
    },
};

/**
 * Validate password against policy
 */
export function validatePassword(password: string, config: SecurityConfig): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < config.minPasswordLength) {
        errors.push(`Password must be at least ${config.minPasswordLength} characters`);
    }

    if (config.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (config.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (config.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Check if IP is allowed
 */
export function isIPAllowed(ip: string, config: SecurityConfig): boolean {
    // Check blacklist first
    if (config.ipBlacklist.length > 0 && config.ipBlacklist.includes(ip)) {
        return false;
    }

    // If whitelist is set, IP must be in it
    if (config.ipWhitelist.length > 0) {
        return config.ipWhitelist.includes(ip);
    }

    return true;
}

/**
 * Generate TOTP secret for 2FA
 */
export function generateTOTPSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
        secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
}

/**
 * Get security configuration for a plan
 */
export function getSecurityConfig(plan: string): SecurityConfig {
    return SECURITY_CONFIGS[plan] || SECURITY_CONFIGS.FREE;
}

export default {
    SECURITY_CONFIGS,
    validatePassword,
    isIPAllowed,
    generateTOTPSecret,
    getSecurityConfig,
};
