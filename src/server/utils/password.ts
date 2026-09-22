import crypto from 'crypto';

const SALT = 'jmf_mobility_salt_2026';
const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

/**
 * Hash a plain password using PBKDF2 with salt
 */
export function hashPassword(plainText: string, salt: string = SALT): string {
  return crypto.pbkdf2Sync(plainText, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
}

/**
 * Compare plain password against hash
 */
export function comparePassword(plainText: string, hash: string, salt: string = SALT): boolean {
  return hashPassword(plainText, salt) === hash;
}

/**
 * Generate a strong temporary password for invitations
 */
export function generateTemporaryPassword(length: number = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}
