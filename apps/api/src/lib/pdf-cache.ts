import { logger } from './logger.js';

const TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { buf: Buffer; expiresAt: number; userId: string }>();

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (v.expiresAt < now) cache.delete(k);
  }
}, 60 * 1000).unref?.();

export function putPdf(reportId: string, buf: Buffer, userId: string) {
  cache.set(reportId, { buf, expiresAt: Date.now() + TTL_MS, userId });
  logger.info({ reportId }, 'pdf cached for 5min');
}

export function getPdf(reportId: string, userId: string): Buffer | null {
  const v = cache.get(reportId);
  if (!v) return null;
  if (v.expiresAt < Date.now()) {
    cache.delete(reportId);
    return null;
  }
  if (v.userId !== userId) return null;
  return v.buf;
}
