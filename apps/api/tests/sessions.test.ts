import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/index.js';
import { env } from '../src/env.js';
import { sessionDirPath, sessionsRootPath } from '../src/lib/tmp.js';
import { signValue, ANON_COOKIE_NAME } from '../src/lib/cookie.js';
import { resetDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';
import { db, uploadSessions } from '@lume/db';
import { eq } from 'drizzle-orm';

beforeEach(async () => {
  await resetDb();
  rmSync(sessionsRootPath(env.TMP_DIR), { recursive: true, force: true });
  mkdirSync(env.TMP_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(sessionsRootPath(env.TMP_DIR), { recursive: true, force: true });
});

describe('POST /sessions', () => {
  it('creates an anonymous upload session, sets cookie, makes /tmp dir', async () => {
    const res = await app.request('/sessions', { method: 'POST' });
    expect(res.status).toBe(201);

    const body = (await res.json()) as { sessionId: string; expiresAt: string };
    expect(body.sessionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(body.expiresAt).getTime()).toBeGreaterThan(Date.now());

    const cookie = res.headers.get('set-cookie');
    expect(cookie).toContain('lume_anon_session=');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');

    expect(existsSync(sessionDirPath(env.TMP_DIR, body.sessionId))).toBe(true);
  });
});

const SECRET = process.env['AUTH_SECRET']!;

describe('POST /sessions/:id/claim', () => {
  it('binds anon session to authenticated user', async () => {
    const createRes = await app.request('/sessions', { method: 'POST' });
    const { sessionId } = (await createRes.json()) as { sessionId: string };
    const setCookieHeader = createRes.headers.get('set-cookie')!;
    const anonCookie = setCookieHeader.split(';')[0]!;

    const user = await createTestUser();

    const res = await app.request(`/sessions/${sessionId}/claim`, {
      method: 'POST',
      headers: {
        cookie: `${anonCookie}; ${user.cookieHeader}`,
      },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; sessionId: string };
    expect(body.ok).toBe(true);

    const [row] = await db
      .select()
      .from(uploadSessions)
      .where(eq(uploadSessions.id, sessionId))
      .limit(1);
    expect(row?.userId).toBe(user.id);
  });

  it('rejects claim without auth (401)', async () => {
    const createRes = await app.request('/sessions', { method: 'POST' });
    const { sessionId } = (await createRes.json()) as { sessionId: string };
    const res = await app.request(`/sessions/${sessionId}/claim`, { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('rejects claim with mismatched anon cookie (400)', async () => {
    const user = await createTestUser();
    const otherSessionId = randomUUID();
    const fakeCookie = `${ANON_COOKIE_NAME}=${signValue(`${otherSessionId}.${randomUUID()}`, SECRET)}`;
    const res = await app.request(`/sessions/${randomUUID()}/claim`, {
      method: 'POST',
      headers: { cookie: `${fakeCookie}; ${user.cookieHeader}` },
    });
    expect(res.status).toBe(400);
  });
});