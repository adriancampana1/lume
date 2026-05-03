import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';
import { db, users } from '@lume/db';
import { app } from '../src/index.js';
import { resetDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';

describe('POST /onboarding', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('saves income bracket and marketing opt-in', async () => {
    const user = await createTestUser();
    const res = await app.request('/onboarding', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: user.cookieHeader },
      body: JSON.stringify({ incomeBracket: 'from_3k_to_6k', marketingOptIn: true }),
    });
    expect(res.status).toBe(200);

    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    expect(row?.incomeBracket).toBe('from_3k_to_6k');
    expect(row?.marketingOptIn).toBe(true);
  });

  it('rejects unauthenticated requests', async () => {
    const res = await app.request('/onboarding', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ incomeBracket: 'from_3k_to_6k' }),
    });
    expect(res.status).toBe(401);
  });

  it('rejects invalid income bracket (400)', async () => {
    const user = await createTestUser();
    const res = await app.request('/onboarding', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: user.cookieHeader },
      body: JSON.stringify({ incomeBracket: 'rich' }),
    });
    expect(res.status).toBe(400);
  });

  it('defaults marketingOptIn to false when omitted', async () => {
    const user = await createTestUser();
    const res = await app.request('/onboarding', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: user.cookieHeader },
      body: JSON.stringify({ incomeBracket: 'prefer_not_to_say' }),
    });
    expect(res.status).toBe(200);
    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    expect(row?.marketingOptIn).toBe(false);
  });
});