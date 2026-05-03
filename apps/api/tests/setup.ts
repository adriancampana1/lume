import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

if (!process.env['TMP_DIR'] || process.env['TMP_DIR'] === '/tmp/lume') {
  process.env['TMP_DIR'] = mkdtempSync(join(tmpdir(), 'lume-test-'));
}
process.env['ANTHROPIC_API_KEY'] ??= 'sk-ant-test';
process.env['RESEND_API_KEY'] ??= 're_test';
process.env['EMAIL_FROM'] ??= 'noreply@lume.test';
process.env['PUBLIC_BASE_URL'] ??= 'http://localhost:3000';