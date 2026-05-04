import cron from 'node-cron';
import { logger } from '../lib/logger.js';
import { hardDeletePass } from './hard-delete.js';
import { inactivityPass } from './inactivity.js';
import { flushQueueOnce } from './queue-flush.js';
import { sweepOnce } from '../jobs/sweeper.js';
import { env } from '../env.js';

export function startCrons() {
  cron.schedule('*/5 * * * *', () => {
    void sweepOnce({ rootDir: env.TMP_DIR, maxAgeMs: 30 * 60 * 1000 }).catch((err) =>
      logger.error({ err }, 'sweeper failed'),
    );
  });

  cron.schedule('15 3 * * *', () => {
    void hardDeletePass().catch((err) => logger.error({ err }, 'hard-delete failed'));
  });

  cron.schedule('30 3 * * *', () => {
    void inactivityPass().catch((err) => logger.error({ err }, 'inactivity failed'));
  });

  cron.schedule('*/10 * * * *', () => {
    void flushQueueOnce().catch((err) => logger.error({ err }, 'queue flush failed'));
  });

  logger.info('crons scheduled');
}
