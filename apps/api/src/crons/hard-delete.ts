import { and, isNotNull, lt } from 'drizzle-orm';
import { db, users } from '@lume/db';
import { logger } from '../lib/logger.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function hardDeletePass(): Promise<{ deleted: number }> {
  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS);
  const rows = await db
    .delete(users)
    .where(and(isNotNull(users.deletedAt), lt(users.deletedAt, cutoff)))
    .returning({ id: users.id });
  if (rows.length > 0) logger.info({ count: rows.length }, 'hard-deleted users');
  return { deleted: rows.length };
}
