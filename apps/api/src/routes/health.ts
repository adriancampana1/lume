import { sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { db } from '@lume/db';

export const healthRoute = new Hono();

healthRoute.get('/', async (c) => {
  const m = process.memoryUsage();
  let dbOk = false;
  try {
    await db.execute(sql`select 1`);
    dbOk = true;
  } catch {
    dbOk = false;
  }
  const status = dbOk ? 'ok' : 'degraded';
  return c.json(
    {
      status,
      timestamp: new Date().toISOString(),
      rss_mb: Math.round(m.rss / 1024 / 1024),
      heap_used_mb: Math.round(m.heapUsed / 1024 / 1024),
      db: dbOk,
    },
    dbOk ? 200 : 503,
  );
});
