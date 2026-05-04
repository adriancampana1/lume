import { Hono } from 'hono';
import { and, eq, isNull } from 'drizzle-orm';
import { db, rateLimits, reports, uploadSessions, users } from '@lume/db';
import { requireAuth } from '../middleware/require-auth.js';
import { audit } from '../lib/audit.js';
import type { Variables } from '../types.js';

export const meRoute = new Hono<{ Variables: Variables }>();

meRoute.get('/', requireAuth, async (c) => {
  const user = c.get('user')!;
  return c.json(user);
});

meRoute.get('/data', requireAuth, async (c) => {
  const user = c.get('user')!;

  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!row) return c.json({ error: 'not_found' }, 404);

  const userReports = await db.select().from(reports).where(eq(reports.userId, user.id));
  const userSessions = await db
    .select()
    .from(uploadSessions)
    .where(eq(uploadSessions.userId, user.id));

  await audit(c, user.id, 'profile_export');
  return c.json({
    user: {
      id: row.id,
      email: row.email,
      name: row.name,
      image: row.image,
      incomeBracket: row.incomeBracket,
      marketingOptIn: row.marketingOptIn,
      createdAt: row.createdAt.toISOString(),
      lastSeenAt: row.lastSeenAt.toISOString(),
    },
    reports: userReports.map((r) => ({
      id: r.id,
      periodStart: r.periodStart.toISOString(),
      periodEnd: r.periodEnd.toISOString(),
      transactionsCount: r.transactionsCount,
      categoryCount: r.categoryCount,
      generatedAt: r.generatedAt.toISOString(),
    })),
    uploadSessions: userSessions.map((s) => ({
      id: s.id,
      fileCount: s.fileCount,
      totalBytes: s.totalBytes,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
    })),
    exportedAt: new Date().toISOString(),
  });
});

meRoute.patch('/', requireAuth, async (c) => {
  const user = c.get('user')!;
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  const { marketingOptIn } = body as { marketingOptIn?: boolean };
  if (typeof marketingOptIn === 'boolean') {
    const [before] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    await db.update(users).set({ marketingOptIn }).where(eq(users.id, user.id));
    if (before?.marketingOptIn !== marketingOptIn) {
      await audit(c, user.id, 'marketing_opt_in_changed', { value: marketingOptIn });
    }
  }
  return c.json({ ok: true });
});

meRoute.get('/cap', requireAuth, async (c) => {
  const user = c.get('user')!;
  const [row] = await db.select().from(rateLimits).where(eq(rateLimits.userId, user.id)).limit(1);
  if (!row?.nextAvailableAt) return c.json({ daysLeft: 0 });
  const ms = row.nextAvailableAt.getTime() - Date.now();
  return c.json({ daysLeft: Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000))) });
});

meRoute.post('/delete', requireAuth, async (c) => {
  const user = c.get('user')!;
  await audit(c, user.id, 'profile_delete');
  await db
    .update(users)
    .set({ deletedAt: new Date(), email: `deleted-${user.id}@lume.invalid`, name: null, image: null })
    .where(and(eq(users.id, user.id), isNull(users.deletedAt)));
  return c.json({ ok: true });
});