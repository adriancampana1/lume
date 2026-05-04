import { gte } from 'drizzle-orm';
import { db, reports } from '@lume/db';
import { env } from '../env.js';

export async function todayReportCount(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const rows = await db
    .select({ id: reports.id })
    .from(reports)
    .where(gte(reports.generatedAt, startOfDay));
  return rows.length;
}

export async function isGlobalCapReached(): Promise<boolean> {
  const max = env.MAX_REPORTS_PER_DAY;
  if (!max || max <= 0) return false;
  const c = await todayReportCount();
  return c >= max;
}
