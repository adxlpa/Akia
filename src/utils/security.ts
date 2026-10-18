/**
 * Security utilities for AKIA Administrative Access Control
 * Implements cryptographic hashing, constant-time comparison, session signatures,
 * input sanitization, and URL validation.
 */

// Constant cryptographic salt for password hashing
const DEFAULT_SALT = 'AKIA_BOTANICAL_SECURE_SALT_v1_2026';

/**
 * Constant-time string equality check to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Hashes a string using Web Crypto SHA-256 with salt
 */
export async function hashPassword(password: string, salt: string = DEFAULT_SALT): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies a plain text password against a stored SHA-256 hash using timingSafeEqual
 */
export async function verifyPassword(
  attempt: string,
  storedHash: string,
  salt: string = DEFAULT_SALT
): Promise<boolean> {
  const attemptHash = await hashPassword(attempt, salt);
  return timingSafeEqual(attemptHash, storedHash);
}

/**
 * Generates a cryptographically strong session token
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes an HMAC-like cryptographic signature for an Admin Session to prevent LocalStorage tampering.
 */
export async function computeSessionSignature(
  token: string,
  username: string,
  expiresAt: number,
  secretHash: string
): Promise<string> {
  return hashPassword(`${token}:${username}:${expiresAt}`, secretHash);
}

/**
 * Verifies that an Admin Session was signed with the valid secret hash and has not been forged in LocalStorage.
 */
export async function verifySessionSignature(
  session: { token: string; username: string; expiresAt: number; signature?: string },
  secretHash: string
): Promise<boolean> {
  if (!session.signature || !session.token || !session.username || !session.expiresAt) {
    return false;
  }
  const expectedSignature = await computeSessionSignature(
    session.token,
    session.username,
    session.expiresAt,
    secretHash
  );
  return timingSafeEqual(session.signature, expectedSignature);
}

/**
 * Sanitizes user inputs to prevent script injection and XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>'"&]/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return match;
      }
    });
}

/**
 * Validates and sanitizes URLs to ensure they only use http, https, relative paths, or safe data images.
 * Prevents javascript: or vbscript: script execution in links and images.
 */
export function sanitizeUrl(url: string, fallback: string = ''): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Allow relative paths (e.g. /images/products/...)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Allow safe inline image data URLs
  if (trimmed.startsWith('data:image/jpeg;') ||
      trimmed.startsWith('data:image/png;') ||
      trimmed.startsWith('data:image/webp;') ||
      trimmed.startsWith('data:image/gif;')) {
    return trimmed;
  }

  // Validate absolute URLs
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Enforces strong password policy
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter (a-z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number (0-9)');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must include at least one special symbol (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
