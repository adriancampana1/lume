import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, rateLimits, reports, uploadSessions, users } from '@lume/db';
import { runPipeline } from '@lume/ai';
import { renderReportToHtml, htmlToPdfBuffer, formatPeriod } from '@lume/pdf';
import { env } from '../env.js';
import { logger } from '../lib/logger.js';
import { requireAuth } from '../middleware/require-auth.js';
import { sendReportEmail } from '../lib/email.js';
import { getLlmClient } from '../lib/pipeline-bridge.js';
import { sessionDirPath, removeSessionDir } from '../lib/tmp.js';
import type { Variables } from '../types.js';

const GenerateBody = z.object({ sessionId: z.string().uuid() });

const CAP_DAYS = 30;

export const reportsRoute = new Hono<{ Variables: Variables }>();

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

  // 2) Session belongs to user
  const [session] = await db
    .select()
    .from(uploadSessions)
    .where(eq(uploadSessions.id, parsed.data.sessionId))
    .limit(1);
  if (!session) return c.json({ error: 'session_not_found' }, 404);
  if (session.userId !== user.id) return c.json({ error: 'forbidden' }, 403);

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
    return c.json({ error: 'session_files_missing' }, 410);
  }
  if (inputs.length === 0) return c.json({ error: 'no_files' }, 400);

  // 3) Load income_bracket from user
  const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const incomeBracket = userRow?.incomeBracket ?? 'prefer_not_to_say';

  // 4) Pipeline
  let report;
  try {
    report = await runPipeline({
      llm: getLlmClient(),
      inputs,
      incomeBracket,
    });
  } catch (err) {
    logger.error({ err: (err as Error).message, sessionId: session.id }, 'pipeline failed');
    return c.json({ error: 'pipeline_failed', message: (err as Error).message }, 500);
  }

  // 5) Render PDF
  const html = renderReportToHtml(report);
  const pdf = await htmlToPdfBuffer(html);

  // 6) Persist metadata
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
  if (!reportRow) return c.json({ error: 'persist_failed' }, 500);

  // 7) Send email (non-fatal)
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

  // 8) Update rate limit (rolling 30-day cap)
  const next = new Date(Date.now() + CAP_DAYS * 24 * 60 * 60 * 1000);
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

  // 9) Mark session completed + zero retention
  await db
    .update(uploadSessions)
    .set({ status: 'completed' })
    .where(eq(uploadSessions.id, session.id));
  await removeSessionDir(env.TMP_DIR, session.id);

  return c.json({
    reportId: reportRow.id,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
  });
});
