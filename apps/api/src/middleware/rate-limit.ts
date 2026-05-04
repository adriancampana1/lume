import type { MiddlewareHandler } from 'hono';
import { checkIpRate } from '../lib/rate-limit.js';
import { logger } from '../lib/logger.js';

export function rateLimit(limit: number, windowMs: number): MiddlewareHandler {
  return async (c, next) => {
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      c.req.header('x-real-ip') ??
      'unknown';
    if (!checkIpRate(ip, limit, windowMs)) {
      logger.warn({ ip, path: c.req.path }, 'rate limit hit');
      return c.json({ error: 'rate_limited' }, 429);
    }
    return next();
  };
}
