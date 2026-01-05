/**
 * SSO Integration Module
 * Enterprise Single Sign-On configuration for Okta, Azure AD, and Google Workspace
 */

export type SSOProvider = 'okta' | 'azure_ad' | 'google' | 'saml';

export interface SSOConfig {
    provider: SSOProvider;
    enabled: boolean;
    clientId: string;
    clientSecret?: string;
    issuer?: string;
    domain?: string;
    tenant?: string;
    // SAML specific
    entryPoint?: string;
    cert?: string;
    // Metadata
    displayName: string;
    iconUrl?: string;
    // Callback URLs
    callbackUrl: string;
    logoutUrl?: string;
}

export interface SSOProviderConfig {
    id: SSOProvider;
    name: string;
    description: string;
    icon: string;
    requiredFields: string[];
    optionalFields: string[];
    documentation: string;
    setupGuide: string[];
}

// Provider configurations
export const SSO_PROVIDERS: Record<SSOProvider, SSOProviderConfig> = {
    okta: {
        id: 'okta',
        name: 'Okta',
        description: 'Enterprise identity management with Okta',
        icon: '/icons/sso/okta.svg',
        requiredFields: ['domain', 'clientId', 'clientSecret'],
        optionalFields: ['issuer'],
        documentation: 'https://developer.okta.com/docs/guides/implement-oauth-for-okta/',
        setupGuide: [
            '1. Log in to your Okta Admin Console',
            '2. Go to Applications > Create App Integration',
            '3. Select "OIDC - OpenID Connect" and "Web Application"',
            '4. Configure redirect URIs with your MediaPlanPro callback URL',
            '5. Copy the Client ID and Client Secret',
            '6. Enter your Okta domain (e.g., your-org.okta.com)'
        ]
    },
    azure_ad: {
        id: 'azure_ad',
        name: 'Microsoft Azure AD',
        description: 'Single sign-on with Microsoft Azure Active Directory',
        icon: '/icons/sso/azure.svg',
        requiredFields: ['tenant', 'clientId', 'clientSecret'],
        optionalFields: [],
        documentation: 'https://docs.microsoft.com/en-us/azure/active-directory/develop/',
        setupGuide: [
            '1. Go to Azure Portal > Azure Active Directory',
            '2. Navigate to App registrations > New registration',
            '3. Enter application name and select account type',
            '4. Add redirect URI for web application',
            '5. Create a client secret under Certificates & secrets',
            '6. Copy Application (client) ID, Directory (tenant) ID, and client secret'
        ]
    },
    google: {
        id: 'google',
        name: 'Google Workspace',
        description: 'Sign in with Google Workspace accounts',
        icon: '/icons/sso/google.svg',
        requiredFields: ['clientId', 'clientSecret'],
        optionalFields: ['domain'],
        documentation: 'https://developers.google.com/identity/protocols/oauth2',
        setupGuide: [
            '1. Go to Google Cloud Console',
            '2. Create or select a project',
            '3. Navigate to APIs & Services > Credentials',
            '4. Create OAuth 2.0 Client ID',
            '5. Add authorized redirect URIs',
            '6. Copy Client ID and Client Secret',
            '7. Optionally restrict to your Google Workspace domain'
        ]
    },
    saml: {
        id: 'saml',
        name: 'SAML 2.0',
        description: 'Generic SAML 2.0 identity provider integration',
        icon: '/icons/sso/saml.svg',
        requiredFields: ['entryPoint', 'cert', 'issuer'],
        optionalFields: ['logoutUrl'],
        documentation: 'https://en.wikipedia.org/wiki/SAML_2.0',
        setupGuide: [
            '1. Configure your SAML IdP with MediaPlanPro as a Service Provider',
            '2. Download or copy the IdP metadata/certificate',
            '3. Enter the SSO Entry Point URL',
            '4. Paste the X.509 Certificate',
            '5. Configure the Issuer/Entity ID',
            '6. Set up attribute mappings for email and name'
        ]
    }
};

/**
 * Generate callback URL for SSO provider
 */
export function getSSOCallbackUrl(provider: SSOProvider): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in';
    return `${baseUrl}/api/auth/sso/${provider}/callback`;
}

/**
 * Get SSO metadata for provider
 */
export function getSSOMetadata(provider: SSOProvider): {
    entityId: string;
    assertionConsumerService: string;
    singleLogoutService: string;
} {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in';
    return {
        entityId: `${baseUrl}/api/auth/sso/${provider}/metadata`,
        assertionConsumerService: `${baseUrl}/api/auth/sso/${provider}/callback`,
        singleLogoutService: `${baseUrl}/api/auth/sso/${provider}/logout`
    };
}

/**
 * Validate SSO configuration
 */
export function validateSSOConfig(config: Partial<SSOConfig>): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!config.provider) {
        errors.push('Provider is required');
        return { valid: false, errors };
    }

    const providerConfig = SSO_PROVIDERS[config.provider];
    if (!providerConfig) {
        errors.push('Invalid provider');
        return { valid: false, errors };
    }

    for (const field of providerConfig.requiredFields) {
        if (!config[field as keyof SSOConfig]) {
            errors.push(`${field} is required for ${providerConfig.name}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Generate SSO login URL
 */
export function getSSOLoginUrl(provider: SSOProvider, state?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in';
    const url = new URL(`${baseUrl}/api/auth/sso/${provider}/authorize`);
    if (state) {
        url.searchParams.set('state', state);
    }
    return url.toString();
}

/**
 * SSO error codes
 */
export const SSO_ERROR_CODES = {
    INVALID_PROVIDER: 'invalid_provider',
    CONFIGURATION_ERROR: 'configuration_error',
    AUTHENTICATION_FAILED: 'authentication_failed',
    USER_NOT_FOUND: 'user_not_found',
    DOMAIN_NOT_ALLOWED: 'domain_not_allowed',
    SESSION_EXPIRED: 'session_expired',
    INVALID_CALLBACK: 'invalid_callback'
};

export default {
    SSO_PROVIDERS,
    getSSOCallbackUrl,
    getSSOMetadata,
    validateSSOConfig,
    getSSOLoginUrl,
    SSO_ERROR_CODES
};
