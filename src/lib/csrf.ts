/**
 * CSRF Protection Utility
 * 
 * Implements CSRF token generation and validation for forms
 */

import Tokens from 'csrf';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const tokens = new Tokens();

// Secret for CSRF tokens (in production, use environment variable)
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-change-in-production';

/**
 * Generate a CSRF token
 * @returns CSRF token string
 */
export async function generateCsrfToken(): Promise<string> {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);

  // Store secret in cookie (httpOnly for security)
  const cookieStore = await cookies();
  cookieStore.set('csrf-secret', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return token;
}

/**
 * Verify a CSRF token
 * @param token - CSRF token to verify
 * @returns true if valid, false otherwise
 */
export async function verifyCsrfToken(token: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const secret = cookieStore.get('csrf-secret')?.value;

    if (!secret) {
      return false;
    }

    return tokens.verify(secret, token);
  } catch (error) {
    return false;
  }
}

/**
 * Extract CSRF token from request
 * Checks both header and body
 */
export function getCsrfTokenFromRequest(request: NextRequest): string | null {
  // Check header first
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // For form submissions, token might be in body
  // This will be handled by the route handler
  return null;
}

/**
 * Middleware helper for CSRF protection
 */
export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  const method = request.method;
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return true;
  }

  // Get token from request
  const token = getCsrfTokenFromRequest(request);

  if (!token) {
    return false;
  }

  // Verify token
  return await verifyCsrfToken(token);
}

/**
 * React hook helper - get CSRF token for client-side use
 * This should be called from a server component and passed to client
 */
export async function getCsrfToken(): Promise<string> {
  return await generateCsrfToken();
}

/**
 * API route helper - validate CSRF token
 */
export async function requireCsrfToken(token: string | null): Promise<{ valid: boolean; error?: string }> {
  if (!token) {
    return {
      valid: false,
      error: 'CSRF token is required',
    };
  }

  const isValid = await verifyCsrfToken(token);

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid CSRF token',
    };
  }

  return { valid: true };
}
