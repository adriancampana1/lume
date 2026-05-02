import { serve } from '@hono/node-server';
import { pathToFileURL } from 'node:url';
import { Hono } from 'hono';
import { logger as appLogger } from './lib/logger.js';
import { healthRoute } from './routes/health.js';

export const app = new Hono();

app.route('/health', healthRoute);

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const port = Number(process.env['PORT'] ?? 3001);
  serve({ fetch: app.fetch, port }, (info) => {
    appLogger.info({ port: info.port }, 'api ready');
  });
}
