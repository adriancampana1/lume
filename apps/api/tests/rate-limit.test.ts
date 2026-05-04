import { describe, expect, it, beforeEach } from 'vitest';
import { app } from '../src/index.js';
import { _resetForTests } from '../src/lib/rate-limit.js';

beforeEach(() => _resetForTests());

describe('rate-limit middleware', () => {
  it('returns 429 when exceeding limit on /sessions/upload', async () => {
    const headers = { 'x-forwarded-for': '1.2.3.4' };
    let last = 200;
    for (let i = 0; i < 25; i++) {
      const res = await app.request('/sessions/upload', { method: 'POST', headers });
      last = res.status;
    }
    expect(last).toBe(429);
  });
});
