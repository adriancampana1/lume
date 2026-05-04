import { and, eq, isNull, lt } from 'drizzle-orm';
import { db, users } from '@lume/db';
import { logger } from '../lib/logger.js';

const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

export async function inactivityPass(): Promise<{ scheduled: number }> {
  const cutoff = new Date(Date.now() - TWELVE_MONTHS_MS);
  const candidates = await db
    .select()
    .from(users)
    .where(and(isNull(users.deletedAt), lt(users.lastSeenAt, cutoff)));
  for (const u of candidates) {
    await db
      .update(users)
      .set({ deletedAt: new Date(), email: `deleted-${u.id}@lume.invalid`, name: null, image: null })
      .where(eq(users.id, u.id));
  }
  if (candidates.length > 0)
    logger.info({ count: candidates.length }, 'soft-deleted inactive users');
  return { scheduled: candidates.length };
}
