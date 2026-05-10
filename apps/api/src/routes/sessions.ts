import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { db, uploadSessions } from '@lume/db';
import { env } from '../env.js';
import {
  ANON_COOKIE_MAX_AGE_SECONDS,
  ANON_COOKIE_NAME,
  signValue,
  verifyValue,
} from '../lib/cookie.js';
import { ensureSessionDir, removeSessionDir, sessionDirPath } from '../lib/tmp.js';
import { logger } from '../lib/logger.js';
import { requireAuth } from '../middleware/require-auth.js';
import type { Variables } from '../types.js';

const MAX_FILES = 6;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 60 * 1024 * 1024;
const ALLOWED_EXT = new Set(['.pdf', '.ofx']);
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/x-ofx',
  'application/vnd.intu.qfx',
  'text/plain',
  'application/octet-stream',
]);

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

sessionsRoute.post('/upload', async (c) => {
  if (env.MAINTENANCE_MODE) return c.json({ error: 'maintenance' }, 503);
  const cookie = getCookie(c, ANON_COOKIE_NAME);
  if (!cookie) return c.json({ error: 'no_anon_cookie' }, 401);
  const verified = verifyValue(cookie, env.AUTH_SECRET);
  if (!verified) return c.json({ error: 'invalid_cookie' }, 401);
  const [sessionId, anonCookieId] = verified.split('.');
  if (!sessionId || !anonCookieId) return c.json({ error: 'invalid_cookie' }, 401);

  const [row] = await db
    .select()
    .from(uploadSessions)
    .where(eq(uploadSessions.id, sessionId))
    .limit(1);
  if (!row) return c.json({ error: 'session_not_found' }, 404);
  if (row.anonCookieId !== anonCookieId) return c.json({ error: 'cookie_mismatch' }, 400);
  if (row.expiresAt.getTime() < Date.now()) return c.json({ error: 'session_expired' }, 410);

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: 'invalid_multipart' }, 400);
  }
  const files = form.getAll('files').filter((v): v is File => v instanceof File);
  if (files.length === 0) return c.json({ error: 'no_files' }, 400);
  if (files.length > MAX_FILES) return c.json({ error: 'too_many_files' }, 400);

  let totalBytes = 0;
  const accepted: { name: string; bytes: Uint8Array }[] = [];
  for (const f of files) {
    const ext = extname(f.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) return c.json({ error: 'invalid_type' }, 400);
    if (!ALLOWED_MIME.has(f.type) && f.type !== '')
      return c.json({ error: 'invalid_type' }, 400);
    if (f.size > MAX_FILE_BYTES) return c.json({ error: 'file_too_large' }, 400);
    totalBytes += f.size;
    if (totalBytes > MAX_TOTAL_BYTES) return c.json({ error: 'total_too_large' }, 400);
    const buf = new Uint8Array(await f.arrayBuffer());
    accepted.push({ name: sanitizeFilename(f.name, ext), bytes: buf });
  }

  const sanitizedNames = accepted.map((f) => f.name);
  if (new Set(sanitizedNames).size !== sanitizedNames.length) {
    return c.json({ error: 'duplicate_filename' }, 400);
  }

  await ensureSessionDir(env.TMP_DIR, sessionId);
  const dir = sessionDirPath(env.TMP_DIR, sessionId);
  for (const f of accepted) {
    await writeFile(join(dir, f.name), f.bytes, { mode: 0o600 });
  }

  await db
    .update(uploadSessions)
    .set({ fileCount: accepted.length, totalBytes })
    .where(eq(uploadSessions.id, sessionId));

  logger.info({ sessionId, fileCount: accepted.length }, 'files uploaded to session');
  return c.json({ fileCount: accepted.length, totalBytes });
});

function sanitizeFilename(name: string, ext: string): string {
  const base = name.slice(0, name.length - ext.length).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${base.slice(0, 80) || 'file'}${ext}`;
}

sessionsRoute.get('/active', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  // Try to claim anonymous session created before auth first
  const cookie = getCookie(c, ANON_COOKIE_NAME);
  if (cookie) {
    const verified = verifyValue(cookie, env.AUTH_SECRET);
    if (verified) {
      const [sessionId, anonCookieId] = verified.split('.');
      if (sessionId && anonCookieId) {
        const [anon] = await db
          .select()
          .from(uploadSessions)
          .where(and(eq(uploadSessions.id, sessionId), isNull(uploadSessions.userId)))
          .limit(1);
        if (
          anon &&
          anon.anonCookieId === anonCookieId &&
          anon.status === 'pending' &&
          anon.expiresAt.getTime() > Date.now()
        ) {
          await db
            .update(uploadSessions)
            .set({ userId: user.id })
            .where(and(eq(uploadSessions.id, sessionId), isNull(uploadSessions.userId)));
          logger.info({ sessionId, userId: user.id }, 'anon session auto-claimed');
          return c.json({ sessionId, hasOnboarded: user.hasOnboarded });
        }
      }
    }
  }

  // Fallback to latest pending session already claimed by the user
  const [claimed] = await db
    .select()
    .from(uploadSessions)
    .where(and(eq(uploadSessions.userId, user.id), eq(uploadSessions.status, 'pending')))
    .orderBy(desc(uploadSessions.createdAt))
    .limit(1);

  if (claimed) return c.json({ sessionId: claimed.id, hasOnboarded: user.hasOnboarded });

  return c.json({ error: 'no_session' }, 404);
});