/**
 * Encryption Service
 * Secure encryption/decryption for sensitive data like API keys
 */

import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * Get encryption key from environment
 * Falls back to a derived key from NEXTAUTH_SECRET if API_ENCRYPTION_KEY not set
 */
function getEncryptionKey(): Buffer {
    const envKey = process.env.API_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;

    if (!envKey) {
        throw new Error('No encryption key available. Set API_ENCRYPTION_KEY or NEXTAUTH_SECRET environment variable.');
    }

    // Derive a 32-byte key using PBKDF2
    return crypto.pbkdf2Sync(envKey, 'api-config-salt', 100000, 32, 'sha256');
}

/**
 * Encrypt a string value
 * @param plaintext The value to encrypt
 * @returns Encrypted string in format: iv:authTag:ciphertext (all base64)
 */
export function encrypt(plaintext: string): string {
    if (!plaintext) return '';

    try {
        const key = getEncryptionKey();
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
        ciphertext += cipher.final('base64');

        const authTag = cipher.getAuthTag();

        // Combine IV, auth tag, and ciphertext
        return `${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt value');
    }
}

/**
 * Decrypt an encrypted string
 * @param encrypted Encrypted string in format: iv:authTag:ciphertext
 * @returns Decrypted plaintext
 */
export function decrypt(encrypted: string): string {
    if (!encrypted) return '';

    try {
        const [ivBase64, authTagBase64, ciphertext] = encrypted.split(':');

        if (!ivBase64 || !authTagBase64 || !ciphertext) {
            // Value might be unencrypted (legacy), return as-is
            console.warn('Value appears to be unencrypted, returning as-is');
            return encrypted;
        }

        const key = getEncryptionKey();
        const iv = Buffer.from(ivBase64, 'base64');
        const authTag = Buffer.from(authTagBase64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
        plaintext += decipher.final('utf8');

        return plaintext;
    } catch (error) {
        console.error('Decryption error:', error);
        // Return empty string on decryption failure (key might have changed)
        return '';
    }
}

/**
 * Check if encryption is properly configured
 */
export function isEncryptionConfigured(): boolean {
    return !!(process.env.API_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET);
}

/**
 * Mask an API key for display (show first 4 and last 4 characters)
 */
export function maskApiKey(key: string): string {
    if (!key || key.length < 12) {
        return '••••••••';
    }
    return `${key.slice(0, 4)}${'•'.repeat(Math.min(key.length - 8, 20))}${key.slice(-4)}`;
}
