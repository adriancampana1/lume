import { describe, expect, it, beforeEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { db, auditLog } from '@lume/db';
import { app } from '../src/index.js';
import { resetDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';

beforeEach(() => resetDb());

describe('audit log', () => {
  it('records marketing opt-in toggle on PATCH /me', async () => {
    const user = await createTestUser();
    await app.request('/me', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: user.cookieHeader },
      body: JSON.stringify({ marketingOptIn: true }),
    });
    const rows = await db.select().from(auditLog).where(eq(auditLog.userId, user.id));
    expect(rows.find((r) => r.action === 'marketing_opt_in_changed')).toBeTruthy();
  });

  it('records profile_export on GET /me/data', async () => {
    const user = await createTestUser();
    await app.request('/me/data', {
      headers: { cookie: user.cookieHeader },
    });
    const rows = await db.select().from(auditLog).where(eq(auditLog.userId, user.id));
    expect(rows.find((r) => r.action === 'profile_export')).toBeTruthy();
  });

  it('records profile_delete on POST /me/delete', async () => {
    const user = await createTestUser();
    await app.request('/me/delete', {
      method: 'POST',
      headers: { cookie: user.cookieHeader },
    });
    const rows = await db.select().from(auditLog).where(eq(auditLog.userId, user.id));
    expect(rows.find((r) => r.action === 'profile_delete')).toBeTruthy();
  });
});
