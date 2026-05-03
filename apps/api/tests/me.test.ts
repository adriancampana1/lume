import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';
import { db, users, reports } from '@lume/db';
import { app } from '../src/index.js';
import { resetDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';

describe('GET /me', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('returns the current user profile', async () => {
    const user = await createTestUser({ incomeBracket: 'from_3k_to_6k' });
    const res = await app.request('/me', {
      headers: { cookie: user.cookieHeader },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      id: string;
      email: string;
      hasOnboarded: boolean;
    };
    expect(body.id).toBe(user.id);
    expect(body.email).toBe(user.email);
    expect(body.hasOnboarded).toBe(true);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await app.request('/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 when user is soft-deleted', async () => {
    const user = await createTestUser();
    await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, user.id));
    const res = await app.request('/me', { headers: { cookie: user.cookieHeader } });
    expect(res.status).toBe(401);
  });
});

describe('GET /me/data', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('exports user profile + reports + upload sessions as JSON', async () => {
    const user = await createTestUser({ incomeBracket: 'above_25k' });
    await db.insert(reports).values({
      userId: user.id,
      periodStart: new Date('2026-04-01'),
      periodEnd: new Date('2026-04-30'),
      transactionsCount: 120,
      categoryCount: 8,
      pdfSizeBytes: 102400,
    });

    const res = await app.request('/me/data', {
      headers: { cookie: user.cookieHeader },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      user: { email: string };
      reports: Array<{ transactionsCount: number }>;
      exportedAt: string;
    };
    expect(body.user.email).toBe(user.email);
    expect(body.reports).toHaveLength(1);
    expect(body.reports[0]?.transactionsCount).toBe(120);
    expect(new Date(body.exportedAt).getTime()).toBeGreaterThan(0);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await app.request('/me/data');
    expect(res.status).toBe(401);
  });
});

describe('POST /me/delete', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('soft-deletes the user (sets deletedAt, scrambles email)', async () => {
    const user = await createTestUser();
    const res = await app.request('/me/delete', {
      method: 'POST',
      headers: { cookie: user.cookieHeader },
    });
    expect(res.status).toBe(200);

    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    expect(row?.deletedAt).not.toBeNull();
    expect(row?.email).toBe(`deleted-${user.id}@lume.invalid`);
    expect(row?.name).toBeNull();
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await app.request('/me/delete', { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('subsequent requests with same cookie return 401', async () => {
    const user = await createTestUser();
    await app.request('/me/delete', {
      method: 'POST',
      headers: { cookie: user.cookieHeader },
    });
    const res = await app.request('/me', {
      headers: { cookie: user.cookieHeader },
    });
    expect(res.status).toBe(401);
  });
});