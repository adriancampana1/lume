import type { MiddlewareHandler } from 'hono';
import { logger } from '../lib/logger.js';

export function serverTiming(): MiddlewareHandler {
  return async (c, next) => {
    const start = performance.now();
    await next();
    const dur = Math.round((performance.now() - start) * 100) / 100;
    c.header('Server-Timing', `app;dur=${dur}`);
    if (dur > 200) {
      logger.warn({ path: c.req.path, dur }, 'slow request (TTFB > 200ms target)');
    }
  };
}
