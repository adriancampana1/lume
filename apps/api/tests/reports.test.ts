import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db, rateLimits, reports, uploadSessions } from '@lume/db';
import { MockLlmClient, EXTRACT_SYSTEM, CATEGORIZE_SYSTEM, NARRATIVE_SYSTEM } from '@lume/ai';
import { app } from '../src/index.js';
import { env } from '../src/env.js';
import { resetDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';
import { setLlmClientForTest } from '../src/lib/pipeline-bridge.js';
import { sessionDirPath, sessionsRootPath } from '../src/lib/tmp.js';
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
  closingBalanceCents: 467020,
  declaredTotalDebitsCents: 32980,
  declaredTotalCreditsCents: 0,
  transactions: [
    { date: '2026-04-05', description: 'NETFLIX', amountCents: -8990, kind: 'debit' },
    { date: '2026-04-12', description: 'PAO DE ACUCAR', amountCents: -14550, kind: 'debit' },
    { date: '2026-04-22', description: 'UBER', amountCents: -9440, kind: 'debit' },
  ],
});

const cats = ['1. assinaturas_e_servicos', '2. mercado', '3. transporte'].join('\n');
const narrative = JSON.stringify({
  summary: 'Você gastou R$ 330.',
  whereTheMoneyWent: 'Mercado liderou com R$ 146.',
  trends: 'Sem tendência ainda.',
  recurring: 'NETFLIX recorrente.',
  benchmark: 'Faixa não informada.',
  recommendations: ['A', 'B', 'C'],
  nextSteps: 'Volte.',
});

async function createSessionWithFile(
  userId: string,
): Promise<{ sessionId: string; cookie: string }> {
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
  writeFileSync(`${dir}/a.pdf`, '%PDF-1.7 fake content');
  const cookie = `${ANON_COOKIE_NAME}=${signValue(`${sessionId}.${anonCookieId}`, env.AUTH_SECRET)}`;
  return { sessionId, cookie };
}

beforeEach(async () => {
  await resetDb();
  rmSync(sessionsRootPath(env.TMP_DIR), { recursive: true, force: true });
  mkdirSync(env.TMP_DIR, { recursive: true });
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: 'mock-email' }, error: null });

  const mock = new MockLlmClient()
    .on(EXTRACT_SYSTEM, () => extracted)
    .on(CATEGORIZE_SYSTEM, () => cats)
    .on(NARRATIVE_SYSTEM, () => narrative);
  setLlmClientForTest(mock);
});

afterEach(() => {
  setLlmClientForTest(null);
});

describe('POST /reports/generate', () => {
  it('runs the pipeline, sends email, persists report metadata', async () => {
    const user = await createTestUser({ incomeBracket: 'from_3k_to_6k' });
    const { sessionId, cookie } = await createSessionWithFile(user.id);

    const res = await app.request('/reports/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `${cookie}; ${user.cookieHeader}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as { reportId: string };
    expect(body.reportId).toMatch(/^[0-9a-f-]{36}$/);

    const [row] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, body.reportId))
      .limit(1);
    expect(row?.userId).toBe(user.id);
    expect(row?.transactionsCount).toBe(3);

    expect(sendMock).toHaveBeenCalledOnce();
  }, 60000);

  it('respects the 30-day cap and returns 429', async () => {
    const user = await createTestUser({ incomeBracket: 'prefer_not_to_say' });
    await db.insert(rateLimits).values({
      userId: user.id,
      lastReportAt: new Date(),
      reportsCount30d: 1,
      nextAvailableAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    });
    const { sessionId, cookie } = await createSessionWithFile(user.id);

    const res = await app.request('/reports/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `${cookie}; ${user.cookieHeader}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    expect(res.status).toBe(429);
    const body = (await res.json()) as { error: string; nextAvailableAt: string };
    expect(body.error).toBe('cap_reached');
    expect(new Date(body.nextAvailableAt).getTime()).toBeGreaterThan(Date.now());
  });

  it('rejects unauthenticated', async () => {
    const res = await app.request('/reports/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId: randomUUID() }),
    });
    expect(res.status).toBe(401);
  });

  it('rejects when session does not belong to user', async () => {
    const owner = await createTestUser({ email: 'owner@test.lume' });
    const intruder = await createTestUser({ email: 'intruder@test.lume' });
    const { sessionId, cookie } = await createSessionWithFile(owner.id);
    const res = await app.request('/reports/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `${cookie}; ${intruder.cookieHeader}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    expect(res.status).toBe(403);
  });
});
