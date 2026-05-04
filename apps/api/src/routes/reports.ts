import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, rateLimits, reports, uploadSessions, users } from '@lume/db';
import { runPipeline } from '@lume/ai';
import type { PipelineStage } from '@lume/ai';
import { renderReportToHtml, htmlToPdfBuffer, formatPeriod } from '@lume/pdf';
import { env } from '../env.js';
import { logger } from '../lib/logger.js';
import { requireAuth } from '../middleware/require-auth.js';
import { sendReportEmail } from '../lib/email.js';
import { getLlmClient } from '../lib/pipeline-bridge.js';
import { sessionDirPath, removeSessionDir } from '../lib/tmp.js';
import { sseStream } from '../lib/sse.js';
import type { Variables } from '../types.js';

const GenerateBody = z.object({ sessionId: z.string().uuid() });

const CAP_DAYS = 30;

export const reportsRoute = new Hono<{ Variables: Variables }>();

type ExecuteReportOpts = {
  user: { id: string; email: string };
  sessionId: string;
  rl?: { nextAvailableAt: Date | null; reportsCount30d: number } | undefined;
};

type ExecuteReportResult = {
  reportId: string;
  periodStart: string;
  periodEnd: string;
};

async function executeReport(
  opts: ExecuteReportOpts,
  onStage?: (s: PipelineStage) => void,
): Promise<ExecuteReportResult> {
  const { user, sessionId } = opts;

  // Session belongs to user
  const [session] = await db
    .select()
    .from(uploadSessions)
    .where(eq(uploadSessions.id, sessionId))
    .limit(1);
  if (!session) {
    const e = new Error('session_not_found') as Error & { code: string; status: number };
    e.code = 'session_not_found';
    e.status = 404;
    throw e;
  }
  if (session.userId !== user.id) {
    const e = new Error('forbidden') as Error & { code: string; status: number };
    e.code = 'forbidden';
    e.status = 403;
    throw e;
  }

  const dir = sessionDirPath(env.TMP_DIR, session.id);
  let inputs: { buffer: Buffer; filename: string }[] = [];
  try {
    const files = await readdir(dir);
    inputs = await Promise.all(
      files.map(async (f) => ({
        buffer: await readFile(join(dir, f)),
        filename: f,
      })),
    );
  } catch {
    const e = new Error('session_files_missing') as Error & { code: string; status: number };
    e.code = 'session_files_missing';
    e.status = 410;
    throw e;
  }
  if (inputs.length === 0) {
    const e = new Error('no_files') as Error & { code: string; status: number };
    e.code = 'no_files';
    e.status = 400;
    throw e;
  }

  // Load income_bracket from user
  const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const incomeBracket = userRow?.incomeBracket ?? 'prefer_not_to_say';

  // Pipeline
  const report = await runPipeline({
    llm: getLlmClient(),
    inputs,
    incomeBracket,
    onStage,
  });

  // Render PDF
  const html = renderReportToHtml(report);
  const pdf = await htmlToPdfBuffer(html);

  // Persist metadata
  const [reportRow] = await db
    .insert(reports)
    .values({
      userId: user.id,
      periodStart: new Date(report.periodStart),
      periodEnd: new Date(report.periodEnd),
      transactionsCount: report.transactionsCount,
      categoryCount: Object.values(report.categories).filter((v) => v > 0).length,
      pdfSizeBytes: pdf.byteLength,
    })
    .returning();
  if (!reportRow) {
    const e = new Error('persist_failed') as Error & { code: string; status: number };
    e.code = 'persist_failed';
    e.status = 500;
    throw e;
  }

  // Send email (non-fatal)
  try {
    await sendReportEmail({
      to: user.email,
      pdf,
      period: formatPeriod(report.periodStart, report.periodEnd),
      reportId: reportRow.id,
    });
  } catch (err) {
    logger.error({ err: (err as Error).message }, 'email send failed');
  }

  // Update rate limit (rolling 30-day cap)
  const next = new Date(Date.now() + CAP_DAYS * 24 * 60 * 60 * 1000);
  const rl = opts.rl;
  await db
    .insert(rateLimits)
    .values({
      userId: user.id,
      lastReportAt: new Date(),
      reportsCount30d: 1,
      nextAvailableAt: next,
    })
    .onConflictDoUpdate({
      target: rateLimits.userId,
      set: {
        lastReportAt: new Date(),
        reportsCount30d: (rl?.reportsCount30d ?? 0) + 1,
        nextAvailableAt: next,
        updatedAt: new Date(),
      },
    });

  // Mark session completed + zero retention
  await db
    .update(uploadSessions)
    .set({ status: 'completed' })
    .where(eq(uploadSessions.id, session.id));
  await removeSessionDir(env.TMP_DIR, session.id);

  return {
    reportId: reportRow.id,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
  };
}

reportsRoute.post('/generate', requireAuth, async (c) => {
  const user = c.get('user')!;
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  const parsed = GenerateBody.safeParse(body);
  if (!parsed.success) return c.json({ error: 'invalid_payload' }, 400);

  // 1) Cap check
  const [rl] = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.userId, user.id))
    .limit(1);
  if (rl?.nextAvailableAt && rl.nextAvailableAt.getTime() > Date.now()) {
    return c.json(
      {
        error: 'cap_reached',
        nextAvailableAt: rl.nextAvailableAt.toISOString(),
      },
      429,
    );
  }

  try {
    const result = await executeReport({ user, sessionId: parsed.data.sessionId, rl }, undefined);
    return c.json(result);
  } catch (err) {
    const e = err as Error & { code?: string; status?: number };
    const code = e.code ?? 'pipeline_failed';
    const status = (e.status as 400 | 403 | 404 | 410 | 500) ?? 500;
    if (code === 'session_not_found') return c.json({ error: code }, 404);
    if (code === 'forbidden') return c.json({ error: code }, 403);
    if (code === 'session_files_missing') return c.json({ error: code }, 410);
    if (code === 'no_files') return c.json({ error: code }, 400);
    if (code === 'persist_failed') return c.json({ error: code }, 500);
    logger.error({ err: e.message, sessionId: parsed.data.sessionId }, 'pipeline failed');
    return c.json({ error: 'pipeline_failed', message: e.message }, status);
  }
});

const PIPELINE_STAGES: PipelineStage[] = [
  'extracting',
  'anonymizing',
  'reconciling',
  'categorizing',
  'aggregating',
  'narrating',
];

reportsRoute.post('/generate/stream', requireAuth, async (c) => {
  const user = c.get('user')!;
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  const parsed = GenerateBody.safeParse(body);
  if (!parsed.success) return c.json({ error: 'invalid_payload' }, 400);

  // Cap check before starting stream so we can return 429
  const [rl] = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.userId, user.id))
    .limit(1);
  if (rl?.nextAvailableAt && rl.nextAvailableAt.getTime() > Date.now()) {
    return c.json(
      {
        error: 'cap_reached',
        nextAvailableAt: rl.nextAvailableAt.toISOString(),
      },
      429,
    );
  }

  return sseStream(c, async (send) => {
    let lastEmittedIndex = -1;
    const emit = (s: PipelineStage) => {
      const idx = PIPELINE_STAGES.indexOf(s);
      if (idx <= lastEmittedIndex) return;
      lastEmittedIndex = idx;
      send({ event: 'stage', data: { stage: s, index: idx, total: PIPELINE_STAGES.length } });
    };
    try {
      const result = await executeReport(
        { user, sessionId: parsed.data.sessionId, rl },
        emit,
      );
      send({ event: 'completed', data: { reportId: result.reportId } });
    } catch (err) {
      send({
        event: 'error',
        data: {
          code: (err as Error & { code?: string }).code ?? 'pipeline_failed',
          message: (err as Error).message,
        },
      });
    }
  });
});
