import { describe, expect, it } from 'vitest';
import {
  TransactionSchema,
  StatementSchema,
  NarrativeSchema,
  ReportSchema,
} from '../src/types.js';

describe('TransactionSchema', () => {
  it('accepts a valid raw transaction', () => {
    const ok = TransactionSchema.parse({
      date: '2026-04-12',
      description: 'PIX RECEB JOAO',
      amountCents: -12500,
      kind: 'debit',
    });
    expect(ok.amountCents).toBe(-12500);
  });

  it('rejects non-ISO date', () => {
    expect(() =>
      TransactionSchema.parse({
        date: '12/04/2026',
        description: 'x',
        amountCents: 1,
        kind: 'credit',
      }),
    ).toThrow();
  });

  it('rejects float amount', () => {
    expect(() =>
      TransactionSchema.parse({
        date: '2026-04-12',
        description: 'x',
        amountCents: 12.5,
        kind: 'debit',
      }),
    ).toThrow();
  });
});

describe('StatementSchema', () => {
  it('accepts a complete statement', () => {
    const ok = StatementSchema.parse({
      bank: 'itau',
      periodStart: '2026-04-01',
      periodEnd: '2026-04-30',
      openingBalanceCents: 100000,
      closingBalanceCents: 80000,
      declaredTotalDebitsCents: 30000,
      declaredTotalCreditsCents: 10000,
      transactions: [],
    });
    expect(ok.bank).toBe('itau');
  });
});

describe('NarrativeSchema', () => {
  it('accepts a complete narrative', () => {
    const ok = NarrativeSchema.parse({
      summary: 'Mês equilibrado.',
      whereTheMoneyWent: 'Mercado liderou os gastos.',
      trends: 'Educação cresceu 20%.',
      recurring: 'Identifiquei 3 assinaturas dormentes.',
      benchmark: 'Sua faixa gasta 12% menos com transporte.',
      recommendations: ['Cancelar X', 'Renegociar Y', 'Reduzir Z'],
      nextSteps: 'Revisar em 30 dias.',
    });
    expect(ok.recommendations).toHaveLength(3);
  });

  it('rejects more than 5 recommendations', () => {
    expect(() =>
      NarrativeSchema.parse({
        summary: 's',
        whereTheMoneyWent: 'w',
        trends: 't',
        recurring: 'r',
        benchmark: 'b',
        recommendations: Array(6).fill('x'),
        nextSteps: 'n',
      }),
    ).toThrow();
  });
});

describe('ReportSchema', () => {
  it('round-trips a minimal report', () => {
    const r = ReportSchema.parse({
      periodStart: '2026-04-01',
      periodEnd: '2026-04-30',
      transactionsCount: 0,
      totalSpentCents: 0,
      totalReceivedCents: 0,
      categories: {},
      recurring: [],
      trends: [],
      topMerchants: [],
      benchmark: null,
      narrative: {
        summary: 's',
        whereTheMoneyWent: 'w',
        trends: 't',
        recurring: 'r',
        benchmark: 'b',
        recommendations: ['a'],
        nextSteps: 'n',
      },
    });
    expect(r.categories).toEqual({});
  });
});
