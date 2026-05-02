import { sql } from 'drizzle-orm';
import { db } from '@lume/db';
import { Hono } from 'hono';

export const dbCheckRoute = new Hono();

dbCheckRoute.get('/', async (c) => {
  try {
    await db.execute(sql`select 1`);
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ ok: false, error: (err as Error).message }, 503);
  }
});
