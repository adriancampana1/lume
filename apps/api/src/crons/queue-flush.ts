import { eq } from 'drizzle-orm';
import { db, reportQueue, users } from '@lume/db';
import { logger } from '../lib/logger.js';
import { isGlobalCapReached } from '../lib/global-cap.js';
import { executeReport } from '../routes/reports.js';

export async function flushQueueOnce(): Promise<{ processed: number }> {
  let processed = 0;
  while (true) {
    if (await isGlobalCapReached()) break;
    const [next] = await db
      .select()
      .from(reportQueue)
      .where(eq(reportQueue.status, 'queued'))
      .orderBy(reportQueue.queuedAt)
      .limit(1);
    if (!next) break;
    await db.update(reportQueue).set({ status: 'processing' }).where(eq(reportQueue.id, next['id']));
    try {
      const [user] = await db.select().from(users).where(eq(users.id, next['userId'])).limit(1);
      if (!user) throw new Error('user_not_found');
      await executeReport({ user, sessionId: next['sessionId'] }, () => {});
      await db
        .update(reportQueue)
        .set({ status: 'sent', processedAt: new Date() })
        .where(eq(reportQueue.id, next['id']));
      processed++;
    } catch (err) {
      logger.error({ err, queueId: next['id'] }, 'queue flush failed for entry');
      await db
        .update(reportQueue)
        .set({ status: 'failed', failureReason: (err as Error).message, processedAt: new Date() })
        .where(eq(reportQueue.id, next['id']));
    }
  }
  return { processed };
}
