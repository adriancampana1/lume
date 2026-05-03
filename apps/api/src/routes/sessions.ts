import { randomUUID } from 'node:crypto';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import { db, uploadSessions } from '@lume/db';
import { env } from '../env.js';
import {
  ANON_COOKIE_MAX_AGE_SECONDS,
  ANON_COOKIE_NAME,
  signValue,
  verifyValue,
} from '../lib/cookie.js';
import { ensureSessionDir, removeSessionDir } from '../lib/tmp.js';
import { logger } from '../lib/logger.js';
import { requireAuth } from '../middleware/require-auth.js';
import type { Variables } from '../types.js';

export const sessionsRoute = new Hono<{ Variables: Variables }>();

sessionsRoute.post('/', async (c) => {
  const sessionId = randomUUID();
  const anonCookieId = randomUUID();
  const expiresAt = new Date(Date.now() + ANON_COOKIE_MAX_AGE_SECONDS * 1000);

  await db.insert(uploadSessions).values({
    id: sessionId,
    anonCookieId,
    fileCount: 0,
    totalBytes: 0,
    status: 'pending',
    expiresAt,
  });

  await ensureSessionDir(env.TMP_DIR, sessionId);

  const signed = signValue(`${sessionId}.${anonCookieId}`, env.AUTH_SECRET);
  setCookie(c, ANON_COOKIE_NAME, signed, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: ANON_COOKIE_MAX_AGE_SECONDS,
  });

  logger.info({ sessionId }, 'anon upload session created');
  return c.json({ sessionId, expiresAt: expiresAt.toISOString() }, 201);
});

sessionsRoute.post('/:id/claim', requireAuth, async (c) => {
  const sessionId = c.req.param('id');
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  const cookie = getCookie(c, ANON_COOKIE_NAME);
  if (!cookie) {
    return c.json({ error: 'no_anon_cookie' }, 400);
  }
  const verified = verifyValue(cookie, env.AUTH_SECRET);
  if (!verified) {
    return c.json({ error: 'invalid_cookie' }, 400);
  }
  const [verifiedSessionId, verifiedAnonCookieId] = verified.split('.');
  if (verifiedSessionId !== sessionId) {
    return c.json({ error: 'cookie_session_mismatch' }, 400);
  }

  const [row] = await db
    .select()
    .from(uploadSessions)
    .where(eq(uploadSessions.id, sessionId))
    .limit(1);

  if (!row) return c.json({ error: 'session_not_found' }, 404);
  if (row.anonCookieId !== verifiedAnonCookieId) {
    return c.json({ error: 'anon_cookie_mismatch' }, 400);
  }
  if (row.expiresAt.getTime() < Date.now()) {
    await removeSessionDir(env.TMP_DIR, sessionId);
    return c.json({ error: 'session_expired' }, 410);
  }
  if (row.userId && row.userId !== user.id) {
    return c.json({ error: 'session_already_claimed' }, 409);
  }

  await db
    .update(uploadSessions)
    .set({ userId: user.id })
    .where(eq(uploadSessions.id, sessionId));

  logger.info({ sessionId, userId: user.id }, 'anon upload session claimed');
  return c.json({ ok: true, sessionId });
});