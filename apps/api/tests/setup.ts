import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

if (!process.env['TMP_DIR'] || process.env['TMP_DIR'] === '/tmp/lume') {
  process.env['TMP_DIR'] = mkdtempSync(join(tmpdir(), 'lume-test-'));
}