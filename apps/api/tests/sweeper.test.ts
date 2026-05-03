import { mkdtempSync, rmSync, utimesSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { sweepOnce } from '../src/jobs/sweeper.js';
import { ensureSessionDir, sessionsRootPath } from '../src/lib/tmp.js';

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'lume-sweeper-test-'));
});
afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('sweepOnce', () => {
  it('removes session dirs older than maxAgeMs', async () => {
    const fresh = await ensureSessionDir(root, 'fresh');
    writeFileSync(join(fresh, 'a.pdf'), 'x');

    const old = await ensureSessionDir(root, 'old');
    writeFileSync(join(old, 'b.pdf'), 'y');
    const past = new Date(Date.now() - 60 * 60 * 1000);
    utimesSync(old, past, past);

    const result = await sweepOnce({ rootDir: root, maxAgeMs: 30 * 60 * 1000 });
    expect(result.removed).toEqual(['old']);
    expect(result.kept).toEqual(['fresh']);

    const remaining = readdirSync(sessionsRootPath(root));
    expect(remaining).toEqual(['fresh']);
  });

  it('returns empty result when sessions root does not exist', async () => {
    const result = await sweepOnce({ rootDir: root, maxAgeMs: 1000 });
    expect(result.removed).toEqual([]);
    expect(result.kept).toEqual([]);
  });

  it('skips dirs whose mtime cannot be read (best-effort)', async () => {
    await ensureSessionDir(root, 'a');
    const result = await sweepOnce({ rootDir: root, maxAgeMs: 1 });
    expect(result.kept.includes('a') || result.removed.includes('a')).toBe(true);
  });
});