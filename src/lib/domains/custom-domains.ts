/**
 * Custom Domains with SSL Module
 * Manages custom domain configuration and SSL certificate provisioning
 */

export type DomainStatus = 'pending' | 'verifying' | 'active' | 'failed' | 'expired';
export type SSLStatus = 'pending' | 'provisioning' | 'active' | 'failed' | 'expired';

export interface CustomDomain {
    id: string;
    agencyId: string;
    domain: string;
    status: DomainStatus;
    sslStatus: SSLStatus;
    verificationToken: string;
    verificationMethod: 'cname' | 'txt';
    verifiedAt?: Date;
    sslProvisionedAt?: Date;
    sslExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DNSRecord {
    type: 'CNAME' | 'TXT' | 'A';
    name: string;
    value: string;
    ttl: number;
    priority?: number;
}

export interface DomainVerification {
    verified: boolean;
    method: 'cname' | 'txt';
    expectedValue: string;
    foundValue?: string;
    lastChecked: Date;
}

/**
 * Generate DNS records for custom domain
 */
export function generateDNSRecords(domain: string, verificationToken: string): DNSRecord[] {
    const baseDomain = process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '') || 'aureonone.in';

    return [
        {
            type: 'CNAME',
            name: domain,
            value: `proxy.${baseDomain}`,
            ttl: 3600
        },
        {
            type: 'TXT',
            name: `_mediaplanpro-verification.${domain}`,
            value: verificationToken,
            ttl: 3600
        }
    ];
}

/**
 * Generate verification token
 */
export function generateVerificationToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'mpp-verify-';
    for (let i = 0; i < 32; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

/**
 * Validate domain format
 */
export function validateDomain(domain: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Remove protocol if present
    const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .toLowerCase();

    // Check format
    const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
        errors.push('Invalid domain format');
    }

    // Check for restricted domains
    const restricted = ['aureonone.in', 'mediaplanpro.com', 'vercel.app', 'netlify.app', 'herokuapp.com'];
    if (restricted.some(r => cleanDomain.endsWith(r))) {
        errors.push('This domain is not allowed');
    }

    // Check length
    if (cleanDomain.length > 253) {
        errors.push('Domain name is too long');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Parse domain to extract subdomain and root
 */
export function parseDomain(domain: string): {
    subdomain: string | null;
    rootDomain: string;
    fullDomain: string;
} {
    const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .toLowerCase();

    const parts = cleanDomain.split('.');

    if (parts.length <= 2) {
        return {
            subdomain: null,
            rootDomain: cleanDomain,
            fullDomain: cleanDomain
        };
    }

    return {
        subdomain: parts.slice(0, -2).join('.'),
        rootDomain: parts.slice(-2).join('.'),
        fullDomain: cleanDomain
    };
}

/**
 * SSL Certificate information
 */
export interface SSLCertificate {
    domain: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
    daysUntilExpiry: number;
    autoRenew: boolean;
}

/**
 * Calculate days until SSL expiry
 */
export function getDaysUntilExpiry(expiresAt: Date): number {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if SSL needs renewal (within 30 days of expiry)
 */
export function needsRenewal(expiresAt: Date): boolean {
    return getDaysUntilExpiry(expiresAt) <= 30;
}

/**
 * Domain setup instructions
 */
export const DOMAIN_SETUP_GUIDE = {
    steps: [
        {
            step: 1,
            title: 'Add Your Domain',
            description: 'Enter your custom domain (e.g., agency.yourdomain.com)',
            icon: '🌐'
        },
        {
            step: 2,
            title: 'Configure DNS',
            description: 'Add the provided DNS records to your domain registrar',
            icon: '⚙️'
        },
        {
            step: 3,
            title: 'Verify Ownership',
            description: 'We\'ll automatically verify your DNS configuration',
            icon: '✅'
        },
        {
            step: 4,
            title: 'SSL Provisioning',
            description: 'SSL certificate will be automatically provisioned via Let\'s Encrypt',
            icon: '🔒'
        },
        {
            step: 5,
            title: 'Go Live',
            description: 'Your custom domain is now active and secure',
            icon: '🚀'
        }
    ],
    faq: [
        {
            question: 'How long does DNS propagation take?',
            answer: 'DNS changes can take up to 48 hours to propagate, but typically complete within 1-2 hours.'
        },
        {
            question: 'Do I need to purchase an SSL certificate?',
            answer: 'No, we automatically provision free SSL certificates via Let\'s Encrypt.'
        },
        {
            question: 'Can I use a subdomain?',
            answer: 'Yes, you can use subdomains like portal.youragency.com or clients.youragency.com.'
        },
        {
            question: 'What happens if verification fails?',
            answer: 'Check your DNS settings and ensure the records match exactly. Retry verification after making changes.'
        }
    ]
};

/**
 * Check domain availability (DNS resolution)
 */
export async function checkDomainAvailable(domain: string): Promise<boolean> {
    // In production, this would use DNS lookup
    // For now, return true if domain is valid
    const { valid } = validateDomain(domain);
    return valid;
}

export default {
    generateDNSRecords,
    generateVerificationToken,
    validateDomain,
    parseDomain,
    getDaysUntilExpiry,
    needsRenewal,
    checkDomainAvailable,
    DOMAIN_SETUP_GUIDE
};
