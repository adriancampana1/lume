import { mkdtempSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ensureSessionDir,
  listSessionDirs,
  removeSessionDir,
  sessionDirPath,
} from '../src/lib/tmp.js';

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'lume-tmp-test-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('tmp helpers', () => {
  it('builds a session dir under the configured root', () => {
    const p = sessionDirPath(root, 'abc-123');
    expect(p).toBe(join(root, 'sessions', 'abc-123'));
  });

  it('ensureSessionDir creates the directory with mode 700', async () => {
    const p = await ensureSessionDir(root, 'abc-123');
    const st = statSync(p);
    expect(st.isDirectory()).toBe(true);
    if (process.platform !== 'win32') {
      expect((st.mode & 0o777).toString(8)).toBe('700');
    }
  });

  it('listSessionDirs returns existing session ids', async () => {
    await ensureSessionDir(root, 'one');
    await ensureSessionDir(root, 'two');
    const ids = await listSessionDirs(root);
    expect(ids.sort()).toEqual(['one', 'two']);
  });

  it('removeSessionDir wipes the directory and contents', async () => {
    const p = await ensureSessionDir(root, 'gone');
    writeFileSync(join(p, 'a.pdf'), 'x');
    await removeSessionDir(root, 'gone');
    const ids = await listSessionDirs(root);
    expect(ids).not.toContain('gone');
  });
});