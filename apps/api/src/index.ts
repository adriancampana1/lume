import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger as appLogger } from './lib/logger.js';
import { healthRoute } from './routes/health.js';

export const app = new Hono();

app.route('/health', healthRoute);

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env['PORT'] ?? 3001);
  serve({ fetch: app.fetch, port }, (info) => {
    appLogger.info({ port: info.port }, 'api ready');
  });
}
