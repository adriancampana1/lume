import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './env.js';
import { logger as appLogger } from './lib/logger.js';
import { authRoute } from './routes/auth.js';
import { healthRoute } from './routes/health.js';
import { dbCheckRoute } from './routes/db-check.js';
import { sessionsRoute } from './routes/sessions.js';
import { onboardingRoute } from './routes/onboarding.js';
import { meRoute } from './routes/me.js';
import { startSweeper } from './jobs/sweeper.js';
import type { Variables } from './types.js';

export const app = new Hono<{ Variables: Variables }>();

app.route('/health', healthRoute);
app.route('/db-check', dbCheckRoute);
app.route('/auth', authRoute);
app.route('/sessions', sessionsRoute);
app.route('/onboarding', onboardingRoute);
app.route('/me', meRoute);

if (import.meta.url === `file://${process.argv[1]}`) {
  startSweeper({
    rootDir: env.TMP_DIR,
    maxAgeMs: 30 * 60 * 1000,
    intervalMs: 5 * 60 * 1000,
  });
  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    appLogger.info({ port: info.port }, 'api ready');
  });
}