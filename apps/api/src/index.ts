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
import { reportsRoute } from './routes/reports.js';
import { startCrons } from './crons/index.js';
import { rateLimit } from './middleware/rate-limit.js';
import { securityHeaders } from './middleware/security-headers.js';
import { serverTiming } from './middleware/server-timing.js';
import type { Variables } from './types.js';

export const app = new Hono<{ Variables: Variables }>();

app.use('*', securityHeaders());
app.use('*', serverTiming());
app.use('*', rateLimit(60, 60_000));
app.use('/reports/*', rateLimit(10, 60_000));
app.use('/sessions/upload', rateLimit(20, 60_000));

app.route('/health', healthRoute);
app.route('/db-check', dbCheckRoute);
app.route('/auth', authRoute);
app.route('/sessions', sessionsRoute);
app.route('/onboarding', onboardingRoute);
app.route('/me', meRoute);
app.route('/reports', reportsRoute);

if (import.meta.url === `file://${process.argv[1]}`) {
  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    appLogger.info({ port: info.port }, 'api ready');
    startCrons();
  });
}