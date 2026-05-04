import { describe, expect, it, beforeEach } from 'vitest';
import { db, users } from '@lume/db';
import { resetDb } from './helpers/db.js';
import { hardDeletePass } from '../src/crons/hard-delete.js';

describe('hardDeletePass', () => {
  beforeEach(() => resetDb());

  it('removes users soft-deleted more than 30 days ago', async () => {
    const long = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
    const recent = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    await db.insert(users).values([
      { email: 'old@x', deletedAt: long },
      { email: 'recent@x', deletedAt: recent },
      { email: 'live@x' },
    ]);
    const { deleted } = await hardDeletePass();
    expect(deleted).toBe(1);
    const remaining = await db.select().from(users);
    expect(remaining.map((r) => r.email).sort()).toEqual(['live@x', 'recent@x']);
  });

  it('returns 0 when no eligible users', async () => {
    await db.insert(users).values([{ email: 'live@x' }]);
    const { deleted } = await hardDeletePass();
    expect(deleted).toBe(0);
  });
});
