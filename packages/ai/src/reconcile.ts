import type { Statement } from './types.js';

export class ReconciliationError extends Error {
  constructor(message: string, public readonly details: Record<string, number>) {
    super(message);
    this.name = 'ReconciliationError';
  }
}

export type ReconciliationWarning = {
  code: 'debits_mismatch' | 'credits_mismatch' | 'balance_mismatch';
  message: string;
  details: Record<string, number>;
};

const BALANCE_TOLERANCE_CENTS = 100;
const TOTALS_TOLERANCE_PCT = 0.005;

export function reconcile(stmt: Statement): ReconciliationWarning[] {
  for (const tx of stmt.transactions) {
    if (tx.kind === 'debit' && tx.amountCents > 0) {
      throw new ReconciliationError('debit transaction has positive amount', {
        amountCents: tx.amountCents,
      });
    }
    if (tx.kind === 'credit' && tx.amountCents < 0) {
      throw new ReconciliationError('credit transaction has negative amount', {
        amountCents: tx.amountCents,
      });
    }
  }

  const warnings: ReconciliationWarning[] = [];

  const sumDebits = stmt.transactions
    .filter((t) => t.kind === 'debit')
    .reduce((acc, t) => acc + Math.abs(t.amountCents), 0);
  const sumCredits = stmt.transactions
    .filter((t) => t.kind === 'credit')
    .reduce((acc, t) => acc + t.amountCents, 0);

  const debitsDiff = Math.abs(sumDebits - stmt.declaredTotalDebitsCents);
  const debitsAllowed = Math.max(stmt.declaredTotalDebitsCents * TOTALS_TOLERANCE_PCT, 100);
  if (debitsDiff > debitsAllowed) {
    warnings.push({
      code: 'debits_mismatch',
      message: 'total debits mismatch beyond tolerance — using computed sum',
      details: {
        sum: sumDebits,
        declared: stmt.declaredTotalDebitsCents,
        diff: debitsDiff,
        allowed: debitsAllowed,
      },
    });
    stmt.declaredTotalDebitsCents = sumDebits;
  }

  const creditsDiff = Math.abs(sumCredits - stmt.declaredTotalCreditsCents);
  const creditsAllowed = Math.max(stmt.declaredTotalCreditsCents * TOTALS_TOLERANCE_PCT, 100);
  if (creditsDiff > creditsAllowed) {
    warnings.push({
      code: 'credits_mismatch',
      message: 'total credits mismatch beyond tolerance — using computed sum',
      details: {
        sum: sumCredits,
        declared: stmt.declaredTotalCreditsCents,
        diff: creditsDiff,
        allowed: creditsAllowed,
      },
    });
    stmt.declaredTotalCreditsCents = sumCredits;
  }

  const expectedClosing = stmt.openingBalanceCents + sumCredits - sumDebits;
  const balanceDiff = Math.abs(expectedClosing - stmt.closingBalanceCents);
  if (balanceDiff > BALANCE_TOLERANCE_CENTS) {
    warnings.push({
      code: 'balance_mismatch',
      message: 'closing balance does not reconcile — using computed value',
      details: {
        expected: expectedClosing,
        actual: stmt.closingBalanceCents,
        diff: balanceDiff,
      },
    });
    stmt.closingBalanceCents = expectedClosing;
  }

  return warnings;
}
