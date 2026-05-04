import { describe, expect, it, beforeEach } from 'vitest';
import { db, users } from '@lume/db';
import { resetDb } from './helpers/db.js';
import { inactivityPass } from '../src/crons/inactivity.js';

describe('inactivityPass', () => {
  beforeEach(() => resetDb());

  it('soft-deletes users inactive > 12 months', async () => {
    const old = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    const recent = new Date();
    await db.insert(users).values([
      { email: 'a@x', lastSeenAt: old },
      { email: 'b@x', lastSeenAt: recent },
    ]);
    const { scheduled } = await inactivityPass();
    expect(scheduled).toBe(1);
    const all = await db.select().from(users);
    const inactive = all.find((u) => u.email !== 'b@x');
    expect(inactive?.deletedAt).toBeTruthy();
    expect(inactive?.email).toMatch(/^deleted-/);
  });

  it('ignores already soft-deleted users', async () => {
    const old = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    await db.insert(users).values([{ email: 'a@x', lastSeenAt: old, deletedAt: new Date() }]);
    const { scheduled } = await inactivityPass();
    expect(scheduled).toBe(0);
  });
});
