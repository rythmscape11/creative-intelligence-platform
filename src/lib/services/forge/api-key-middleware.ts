/**
 * Public API Key Middleware
 * Validates API keys for public endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { ForgeApiKeyService } from '@/lib/services/forge';

export interface AuthenticatedRequest extends NextRequest {
    apiKey?: {
        id: string;
        orgId: string;
        scopes: string[];
        environmentId: string;
    };
}

export async function validateApiKey(
    request: NextRequest,
    requiredScopes?: string[]
): Promise<{ valid: boolean; key?: AuthenticatedRequest['apiKey']; error?: string }> {
    // Get authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return { valid: false, error: 'Missing Authorization header' };
    }

    // Parse Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return { valid: false, error: 'Invalid Authorization header format. Use: Bearer <api_key>' };
    }

    const plainTextKey = parts[1];

    // Validate key format
    if (!plainTextKey.startsWith('frg_')) {
        return { valid: false, error: 'Invalid API key format' };
    }

    // Validate key against database
    try {
        const apiKey = await ForgeApiKeyService.validate(plainTextKey);

        if (!apiKey) {
            return { valid: false, error: 'Invalid or revoked API key' };
        }

        // Check required scopes
        if (requiredScopes && requiredScopes.length > 0) {
            const hasAllScopes = requiredScopes.every(scope => apiKey.scopes.includes(scope));
            if (!hasAllScopes) {
                return { valid: false, error: `Missing required scopes: ${requiredScopes.join(', ')}` };
            }
        }

        return {
            valid: true,
            key: {
                id: apiKey.id,
                orgId: apiKey.orgId,
                scopes: apiKey.scopes,
                environmentId: apiKey.environmentId,
            },
        };
    } catch (error) {
        console.error('API key validation error:', error);
        return { valid: false, error: 'Failed to validate API key' };
    }
}

/**
 * Middleware wrapper for protected routes
 */
export function withApiKeyAuth(
    handler: (req: NextRequest, context: { apiKey: AuthenticatedRequest['apiKey'] }) => Promise<NextResponse>,
    requiredScopes?: string[]
) {
    return async (request: NextRequest) => {
        const validation = await validateApiKey(request, requiredScopes);

        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error, code: 'unauthorized' },
                { status: 401 }
            );
        }

        return handler(request, { apiKey: validation.key });
    };
}
