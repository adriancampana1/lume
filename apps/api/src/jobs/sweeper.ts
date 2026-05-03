import { logger } from '../lib/logger.js';
import { listSessionDirs, removeSessionDir, sessionDirAgeMs } from '../lib/tmp.js';

export type SweepOptions = { rootDir: string; maxAgeMs: number };
export type SweepResult = { removed: string[]; kept: string[] };

export async function sweepOnce(opts: SweepOptions): Promise<SweepResult> {
  const ids = await listSessionDirs(opts.rootDir);
  const removed: string[] = [];
  const kept: string[] = [];

  for (const id of ids) {
    const age = await sessionDirAgeMs(opts.rootDir, id);
    if (age === null) continue;
    if (age > opts.maxAgeMs) {
      try {
        await removeSessionDir(opts.rootDir, id);
        removed.push(id);
      } catch (err) {
        logger.warn({ id, err: (err as Error).message }, 'sweeper: failed to remove dir');
      }
    } else {
      kept.push(id);
    }
  }
  return { removed, kept };
}

export function startSweeper(opts: SweepOptions & { intervalMs: number }): NodeJS.Timeout {
  logger.info(
    { rootDir: opts.rootDir, intervalMs: opts.intervalMs, maxAgeMs: opts.maxAgeMs },
    'sweeper started',
  );
  const tick = () => {
    sweepOnce(opts)
      .then((res) => {
        if (res.removed.length > 0) {
          logger.info({ removed: res.removed.length }, 'sweeper: removed orphan sessions');
        }
      })
      .catch((err) => logger.error({ err: (err as Error).message }, 'sweeper: tick failed'));
  };
  const handle: NodeJS.Timeout = setTimeout(() => {
    tick();
    handle.refresh();
  }, opts.intervalMs);
  return handle;
}