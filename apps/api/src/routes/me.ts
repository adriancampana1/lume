import { Hono } from 'hono';
import { and, eq, isNull } from 'drizzle-orm';
import { db, reports, uploadSessions, users } from '@lume/db';
import { requireAuth } from '../middleware/require-auth.js';
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

meRoute.post('/delete', requireAuth, async (c) => {
  const user = c.get('user')!;
  await db
    .update(users)
    .set({ deletedAt: new Date(), email: `deleted-${user.id}@lume.invalid`, name: null, image: null })
    .where(and(eq(users.id, user.id), isNull(users.deletedAt)));
  return c.json({ ok: true });
});