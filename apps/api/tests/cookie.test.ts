import { describe, expect, it } from 'vitest';
import { signValue, verifyValue } from '../src/lib/cookie.js';

const SECRET = 'a'.repeat(48);

describe('signValue / verifyValue', () => {
  it('round-trips a value', () => {
    const signed = signValue('session-abc', SECRET);
    expect(verifyValue(signed, SECRET)).toBe('session-abc');
  });

  it('returns null for tampered signature', () => {
    const signed = signValue('session-abc', SECRET);
    const tampered = signed.slice(0, -2) + 'XX';
    expect(verifyValue(tampered, SECRET)).toBeNull();
  });

  it('returns null for wrong secret', () => {
    const signed = signValue('session-abc', SECRET);
    expect(verifyValue(signed, 'b'.repeat(48))).toBeNull();
  });

  it('returns null for malformed input', () => {
    expect(verifyValue('no-dot-here', SECRET)).toBeNull();
    expect(verifyValue('', SECRET)).toBeNull();
  });
});