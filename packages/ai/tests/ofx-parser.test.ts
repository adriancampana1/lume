import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseOfx } from '../src/ofx-parser.js';

const fixturesDir = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');

describe('parseOfx', () => {
  const buf = readFileSync(join(fixturesDir, 'sample.ofx'));

  it('extracts the period dates', () => {
    const stmt = parseOfx(buf);
    expect(stmt.periodStart).toBe('2026-04-01');
    expect(stmt.periodEnd).toBe('2026-04-30');
  });

  it('detects bank from BANKID 237 → bradesco', () => {
    const stmt = parseOfx(buf);
    expect(stmt.bank).toBe('bradesco');
  });

  it('parses transactions with amounts in cents', () => {
    const stmt = parseOfx(buf);
    expect(stmt.transactions).toHaveLength(3);
    expect(stmt.transactions[0]).toMatchObject({
      date: '2026-04-03',
      description: 'NETFLIX MENSALIDADE',
      amountCents: -8990,
      kind: 'debit',
    });
    expect(stmt.transactions[1]).toMatchObject({
      amountCents: 350000,
      kind: 'credit',
    });
  });

  it('infers declared totals from transactions', () => {
    const stmt = parseOfx(buf);
    expect(stmt.declaredTotalDebitsCents).toBe(8990 + 14550);
    expect(stmt.declaredTotalCreditsCents).toBe(350000);
  });

  it('reads closing balance', () => {
    const stmt = parseOfx(buf);
    expect(stmt.closingBalanceCents).toBe(326460);
  });
});
