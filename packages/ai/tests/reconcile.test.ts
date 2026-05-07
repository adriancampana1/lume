import { describe, expect, it } from 'vitest';
import { reconcile, ReconciliationError } from '../src/reconcile.js';
import type { Statement } from '../src/types.js';

const baseStmt: Statement = {
  bank: 'itau',
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  openingBalanceCents: 100000,
  closingBalanceCents: 80000,
  declaredTotalDebitsCents: 30000,
  declaredTotalCreditsCents: 10000,
  transactions: [
    { date: '2026-04-05', description: 'X', amountCents: 10000, kind: 'credit' },
    { date: '2026-04-10', description: 'Y', amountCents: -8990, kind: 'debit' },
    { date: '2026-04-20', description: 'Z', amountCents: -21010, kind: 'debit' },
  ],
};

describe('reconcile', () => {
  it('returns no warnings when totals match exactly', () => {
    expect(reconcile({ ...baseStmt })).toEqual([]);
  });

  it('returns no warnings with debit total within 0.5% tolerance', () => {
    const stmt = { ...baseStmt, declaredTotalDebitsCents: 30150 };
    expect(reconcile(stmt)).toEqual([]);
  });

  it('warns and heals when debit total off by more than 0.5%', () => {
    const stmt = { ...baseStmt, declaredTotalDebitsCents: 31000 };
    const warnings = reconcile(stmt);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]!.code).toBe('debits_mismatch');
    expect(stmt.declaredTotalDebitsCents).toBe(30000);
  });

  it('returns no warnings when closing balance off by ≤ R$1 (100 cents)', () => {
    const stmt = { ...baseStmt, closingBalanceCents: 80050 };
    expect(reconcile(stmt)).toEqual([]);
  });

  it('warns and heals when closing balance off by > R$1', () => {
    const stmt = { ...baseStmt, closingBalanceCents: 80250 };
    const warnings = reconcile(stmt);
    expect(warnings.some((w) => w.code === 'balance_mismatch')).toBe(true);
    expect(stmt.closingBalanceCents).toBe(80000);
  });

  it('throws if a debit transaction has positive amount', () => {
    const stmt = {
      ...baseStmt,
      transactions: [{ ...baseStmt.transactions[0]!, kind: 'debit' as const, amountCents: 100 }],
    };
    expect(() => reconcile(stmt)).toThrow(ReconciliationError);
  });
});
