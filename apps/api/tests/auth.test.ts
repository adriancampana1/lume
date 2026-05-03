import { describe, expect, it, beforeEach } from 'vitest';
import { app } from '../src/index.js';
import { resetDb } from './helpers/db.js';

describe('Auth.js handler', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('exposes the providers list', async () => {
    const res = await app.request('/auth/providers');
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, { id: string }>;
    expect(body['google']?.id).toBe('google');
  });

  it('returns null session when no cookie', async () => {
    const res = await app.request('/auth/session');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({});
  });
});