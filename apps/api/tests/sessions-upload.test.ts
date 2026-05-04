import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, uploadSessions } from '@lume/db';
import { app } from '../src/index.js';
import { env } from '../src/env.js';
import { sessionDirPath, sessionsRootPath } from '../src/lib/tmp.js';
import { resetDb } from './helpers/db.js';

beforeEach(async () => {
  await resetDb();
  rmSync(sessionsRootPath(env.TMP_DIR), { recursive: true, force: true });
  mkdirSync(env.TMP_DIR, { recursive: true });
});
afterEach(() => {
  rmSync(sessionsRootPath(env.TMP_DIR), { recursive: true, force: true });
});

async function createSession(): Promise<{ sessionId: string; cookie: string }> {
  const res = await app.request('/sessions', { method: 'POST' });
  const body = (await res.json()) as { sessionId: string };
  const cookie = res.headers.get('set-cookie')!.split(';')[0]!;
  return { sessionId: body.sessionId, cookie };
}

function makeFormData(files: { name: string; bytes: Uint8Array; type: string }[]): FormData {
  const fd = new FormData();
  for (const f of files) {
    fd.append('files', new Blob([f.bytes as unknown as Uint8Array<ArrayBuffer>], { type: f.type }), f.name);
  }
  return fd;
}

const PDF_HEADER = new TextEncoder().encode('%PDF-1.7\n');
const OFX_HEADER = new TextEncoder().encode('OFXHEADER:100\n');

describe('POST /sessions/upload', () => {
  it('accepts up to 6 PDF/OFX files, persists in /tmp, updates row', async () => {
    const { sessionId, cookie } = await createSession();
    const fd = makeFormData([
      { name: 'a.pdf', bytes: PDF_HEADER, type: 'application/pdf' },
      { name: 'b.ofx', bytes: OFX_HEADER, type: 'application/x-ofx' },
    ]);
    const res = await app.request('/sessions/upload', {
      method: 'POST',
      headers: { cookie },
      body: fd,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { fileCount: number; totalBytes: number };
    expect(body.fileCount).toBe(2);

    const dir = sessionDirPath(env.TMP_DIR, sessionId);
    expect(readdirSync(dir).sort()).toEqual(['a.pdf', 'b.ofx']);

    const [row] = await db.select().from(uploadSessions).where(eq(uploadSessions.id, sessionId));
    expect(row?.fileCount).toBe(2);
    expect(row?.totalBytes).toBeGreaterThan(0);
  });

  it('rejects more than 6 files', async () => {
    const { cookie } = await createSession();
    const files = Array.from({ length: 7 }, (_, i) => ({
      name: `f${i}.pdf`,
      bytes: PDF_HEADER,
      type: 'application/pdf',
    }));
    const res = await app.request('/sessions/upload', {
      method: 'POST',
      headers: { cookie },
      body: makeFormData(files),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('too_many_files');
  });

  it('rejects file > 10MB', async () => {
    const { cookie } = await createSession();
    const big = new Uint8Array(10 * 1024 * 1024 + 1).fill(0x25);
    const res = await app.request('/sessions/upload', {
      method: 'POST',
      headers: { cookie },
      body: makeFormData([{ name: 'big.pdf', bytes: big, type: 'application/pdf' }]),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('file_too_large');
  });

  it('rejects non PDF/OFX mime', async () => {
    const { cookie } = await createSession();
    const res = await app.request('/sessions/upload', {
      method: 'POST',
      headers: { cookie },
      body: makeFormData([
        { name: 'evil.exe', bytes: new Uint8Array([0x4d, 0x5a]), type: 'application/octet-stream' },
      ]),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('invalid_type');
  });

  it('rejects without anon session cookie', async () => {
    const res = await app.request('/sessions/upload', {
      method: 'POST',
      body: makeFormData([{ name: 'a.pdf', bytes: PDF_HEADER, type: 'application/pdf' }]),
    });
    expect(res.status).toBe(401);
  });
});
