import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db, uploadSessions } from '@lume/db';
import { app } from '../src/index.js';
import { env } from '../src/env.js';
import { sessionDirPath, sessionsRootPath } from '../src/lib/tmp.js';
import { resetDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';
import { setLlmClientForTest } from '../src/lib/pipeline-bridge.js';
import { MockLlmClient } from '@lume/ai/dist/llm/mock.js';
import {
  EXTRACT_SYSTEM,
  CATEGORIZE_SYSTEM,
  NARRATIVE_SYSTEM,
} from '@lume/ai/dist/prompts.js';
import { signValue, ANON_COOKIE_NAME } from '../src/lib/cookie.js';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

const extracted = JSON.stringify({
  bank: 'itau',
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  openingBalanceCents: 500000,
  closingBalanceCents: 491010,
  declaredTotalDebitsCents: 8990,
  declaredTotalCreditsCents: 0,
  transactions: [
    { date: '2026-04-05', description: 'NETFLIX', amountCents: -8990, kind: 'debit' },
  ],
});
const cats = '1. assinaturas_e_servicos';
const narrative = JSON.stringify({
  summary: 'Você gastou R$ 89.',
  whereTheMoneyWent: 'Tudo em assinaturas.',
  trends: 'Sem dado.',
  recurring: 'NETFLIX recorrente.',
  benchmark: 'Faixa não informada.',
  recommendations: ['A', 'B', 'C'],
  nextSteps: 'Volte em 30 dias.',
});

beforeEach(async () => {
  await resetDb();
  rmSync(sessionsRootPath(env.TMP_DIR), { recursive: true, force: true });
  mkdirSync(env.TMP_DIR, { recursive: true });
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: 'mock-email' }, error: null });
  setLlmClientForTest(
    new MockLlmClient()
      .on(EXTRACT_SYSTEM, () => extracted)
      .on(CATEGORIZE_SYSTEM, () => cats)
      .on(NARRATIVE_SYSTEM, () => narrative),
  );
});
afterEach(() => setLlmClientForTest(null));

async function setupSession(userId: string) {
  const sessionId = randomUUID();
  const anonCookieId = randomUUID();
  await db.insert(uploadSessions).values({
    id: sessionId,
    anonCookieId,
    userId,
    fileCount: 1,
    totalBytes: 16,
    status: 'pending',
  });
  const dir = sessionDirPath(env.TMP_DIR, sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'a.pdf'), '%PDF-1.7 fake content');
  return {
    sessionId,
    cookie: `${ANON_COOKIE_NAME}=${signValue(`${sessionId}.${anonCookieId}`, env.AUTH_SECRET)}`,
  };
}

describe('POST /reports/generate/stream', () => {
  it('streams 6 progress events plus completed', async () => {
    const user = await createTestUser({ incomeBracket: 'from_3k_to_6k' });
    const { sessionId, cookie } = await setupSession(user.id);
    const res = await app.request('/reports/generate/stream', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `${cookie}; ${user.cookieHeader}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const text = await res.text();
    const events = text
      .split('\n\n')
      .filter(Boolean)
      .map((block) => {
        const ev = block.match(/^event: (.+)$/m)?.[1] ?? 'message';
        const data = JSON.parse(block.match(/^data: (.+)$/m)![1]!);
        return { ev, data };
      });
    const stages = events.filter((e) => e.ev === 'stage').map((e) => e.data.stage);
    expect(stages).toEqual([
      'extracting',
      'anonymizing',
      'reconciling',
      'categorizing',
      'aggregating',
      'narrating',
    ]);
    const completed = events.find((e) => e.ev === 'completed');
    expect(completed?.data.reportId).toMatch(/^[0-9a-f-]{36}$/);
  }, 60000);

  it('emits error event on failure', async () => {
    const user = await createTestUser();
    const { sessionId, cookie } = await setupSession(user.id);
    setLlmClientForTest(
      new MockLlmClient().on(EXTRACT_SYSTEM, () => {
        throw new Error('boom');
      }),
    );
    const res = await app.request('/reports/generate/stream', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `${cookie}; ${user.cookieHeader}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    const text = await res.text();
    expect(text).toContain('event: error');
  }, 60000);
});
