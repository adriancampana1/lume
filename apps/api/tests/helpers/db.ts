import { sql } from 'drizzle-orm';
import { db } from '@lume/db';

export async function resetDb(): Promise<void> {
  await db.execute(sql`
    truncate table
      metrics_events,
      rate_limits,
      reports,
      upload_sessions,
      sessions,
      accounts,
      verification_tokens,
      users
    restart identity cascade;
  `);
}