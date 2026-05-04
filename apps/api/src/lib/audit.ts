import type { Context } from 'hono';
import { db, auditLog } from '@lume/db';

export type AuditAction =
  | 'profile_export'
  | 'profile_delete'
  | 'marketing_opt_in_changed'
  | 'income_changed'
  | 'sign_in'
  | 'sign_out';

export async function audit(
  c: Context,
  userId: string | null,
  action: AuditAction,
  detail: Record<string, unknown> = {},
): Promise<void> {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    c.req.header('x-real-ip') ??
    null;
  const ua = c.req.header('user-agent') ?? null;
  await db.insert(auditLog).values({ userId, action, detail, ip, userAgent: ua });
}
