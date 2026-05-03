import { createHmac, timingSafeEqual } from 'node:crypto';

function hmac(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function signValue(value: string, secret: string): string {
  return `${value}.${hmac(value, secret)}`;
}

export function verifyValue(signed: string, secret: string): string | null {
  const idx = signed.lastIndexOf('.');
  if (idx <= 0 || idx === signed.length - 1) return null;
  const value = signed.slice(0, idx);
  const provided = signed.slice(idx + 1);
  const expected = hmac(value, secret);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? value : null;
}

export const ANON_COOKIE_NAME = 'lume_anon_session';
export const ANON_COOKIE_MAX_AGE_SECONDS = 60 * 30; // 30 min