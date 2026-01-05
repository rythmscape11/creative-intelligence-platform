import crypto from 'crypto';

// Encryption key from environment variable
// Must be 32 bytes (64 hex characters) for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-please-change-in-production-32bytes';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Ensure encryption key is 32 bytes
 */
function getEncryptionKey(): Buffer {
  const key = ENCRYPTION_KEY;
  if (key.length === 64) {
    // Hex string
    return Buffer.from(key, 'hex');
  }
  // Pad or truncate to 32 bytes
  return Buffer.from(key.padEnd(32, '0').substring(0, 32));
}

/**
 * Encrypt a string value
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt an encrypted string
 */
export function decrypt(text: string): string {
  if (!text) return '';
  
  try {
    const parts = text.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash a value (one-way, for verification)
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

