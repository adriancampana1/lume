import type { Statement } from './types.js';

export class ReconciliationError extends Error {
  constructor(message: string, public readonly details: Record<string, number>) {
    super(message);
    this.name = 'ReconciliationError';
  }
}

const BALANCE_TOLERANCE_CENTS = 100;
const TOTALS_TOLERANCE_PCT = 0.005;

export function reconcile(stmt: Statement): void {
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

  const sumDebits = stmt.transactions
    .filter((t) => t.kind === 'debit')
    .reduce((acc, t) => acc + Math.abs(t.amountCents), 0);
  const sumCredits = stmt.transactions
    .filter((t) => t.kind === 'credit')
    .reduce((acc, t) => acc + t.amountCents, 0);

  const debitsDiff = Math.abs(sumDebits - stmt.declaredTotalDebitsCents);
  const debitsAllowed = Math.max(stmt.declaredTotalDebitsCents * TOTALS_TOLERANCE_PCT, 100);
  if (debitsDiff > debitsAllowed) {
    throw new ReconciliationError('total debits mismatch beyond tolerance', {
      sum: sumDebits,
      declared: stmt.declaredTotalDebitsCents,
      diff: debitsDiff,
      allowed: debitsAllowed,
    });
  }

  const creditsDiff = Math.abs(sumCredits - stmt.declaredTotalCreditsCents);
  const creditsAllowed = Math.max(stmt.declaredTotalCreditsCents * TOTALS_TOLERANCE_PCT, 100);
  if (creditsDiff > creditsAllowed) {
    throw new ReconciliationError('total credits mismatch beyond tolerance', {
      sum: sumCredits,
      declared: stmt.declaredTotalCreditsCents,
      diff: creditsDiff,
      allowed: creditsAllowed,
    });
  }

  const expectedClosing = stmt.openingBalanceCents + sumCredits - sumDebits;
  const balanceDiff = Math.abs(expectedClosing - stmt.closingBalanceCents);
  if (balanceDiff > BALANCE_TOLERANCE_CENTS) {
    throw new ReconciliationError('closing balance does not reconcile', {
      expected: expectedClosing,
      actual: stmt.closingBalanceCents,
      diff: balanceDiff,
    });
  }
}
