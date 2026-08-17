import crypto from 'crypto';

/**
 * Reddit OAuth session, stored in an encrypted httpOnly cookie.
 *
 * Single-account assumption: one connected Reddit account per browser session.
 * For multi-tenant use, replace seal/unseal with a DB row keyed by your own
 * user id — the rest of this module stays the same.
 */
export interface RedditSession {
  username: string;
  accessToken: string;
  refreshToken: string;
  /** epoch ms */
  expiresAt: number;
}

export const COOKIE_NAME = 'snoorise_reddit';

export const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

const ALG = 'aes-256-gcm';

function key(): Buffer {
  const raw = process.env.SESSION_SECRET;
  if (!raw) {
    throw new Error('SESSION_SECRET is not set. Generate one with: openssl rand -hex 32');
  }
  const buf = Buffer.from(raw, 'hex');
  if (buf.length !== 32) {
    throw new Error('SESSION_SECRET must be 64 hex characters (32 bytes)');
  }
  return buf;
}

export function seal(session: RedditSession): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, key(), iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(session), 'utf8'),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

export function unseal(value: string | undefined): RedditSession | null {
  if (!value) return null;
  try {
    const raw = Buffer.from(value, 'base64url');
    const decipher = crypto.createDecipheriv(ALG, key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([
      decipher.update(raw.subarray(28)),
      decipher.final(),
    ]).toString('utf8');
    return JSON.parse(json) as RedditSession;
  } catch {
    // Tampered, corrupt, or encrypted under a rotated secret — treat as logged out.
    return null;
  }
}
