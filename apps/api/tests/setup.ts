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
process.env['DATABASE_URL'] ??= 'postgres://test:test@localhost:5432/lume_test';
process.env['AUTH_SECRET'] ??= 'test-secret-at-least-32-characters-long!!';
process.env['AUTH_URL'] ??= 'http://localhost:3000';
process.env['GOOGLE_CLIENT_ID'] ??= 'test-google-client-id';
process.env['GOOGLE_CLIENT_SECRET'] ??= 'test-google-client-secret';