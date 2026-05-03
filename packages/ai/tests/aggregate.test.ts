import { describe, expect, it } from 'vitest';
import { aggregate } from '../src/aggregate.js';
import type { NormalizedStatement } from '../src/types.js';

function stmt(period: string, txs: Array<[string, string, number, string]>): NormalizedStatement {
  return {
    bank: 'itau',
    periodStart: `2026-${period}-01`,
    periodEnd: `2026-${period}-30`,
    openingBalanceCents: 100000,
    closingBalanceCents: 100000,
    declaredTotalDebitsCents: 0,
    declaredTotalCreditsCents: 0,
    transactions: txs.map(([date, description, amountCents, category]) => ({
      date,
      description,
      amountCents,
      kind: amountCents < 0 ? 'debit' : 'credit',
      category: category as never,
    })),
  };
}

describe('aggregate', () => {
  it('sums totals across months', () => {
    const out = aggregate([
      stmt('03', [
        ['2026-03-05', 'PAO DE ACUCAR', -10000, 'mercado'],
        ['2026-03-12', 'NETFLIX', -8990, 'assinaturas_e_servicos'],
      ]),
      stmt('04', [
        ['2026-04-05', 'PAO DE ACUCAR', -12000, 'mercado'],
        ['2026-04-12', 'NETFLIX', -8990, 'assinaturas_e_servicos'],
      ]),
    ]);
    expect(out.totalSpentCents).toBe(10000 + 8990 + 12000 + 8990);
    expect(out.categoryTotals.mercado).toBe(22000);
    expect(out.categoryTotals.assinaturas_e_servicos).toBe(8990 * 2);
  });

  it('detects active recurring (3 months in a row, similar amount)', () => {
    const out = aggregate([
      stmt('02', [['2026-02-05', 'NETFLIX', -8990, 'assinaturas_e_servicos']]),
      stmt('03', [['2026-03-05', 'NETFLIX', -8990, 'assinaturas_e_servicos']]),
      stmt('04', [['2026-04-05', 'NETFLIX', -8990, 'assinaturas_e_servicos']]),
    ]);
    expect(out.recurring).toHaveLength(1);
    expect(out.recurring[0]!.description).toBe('NETFLIX');
    expect(out.recurring[0]!.status).toBe('active');
  });

  it('detects increasing recurring (last month > first by 15%+)', () => {
    const out = aggregate([
      stmt('02', [['2026-02-05', 'GYM', -10000, 'lazer_e_hobby']]),
      stmt('03', [['2026-03-05', 'GYM', -10000, 'lazer_e_hobby']]),
      stmt('04', [['2026-04-05', 'GYM', -13000, 'lazer_e_hobby']]),
    ]);
    expect(out.recurring[0]!.status).toBe('increasing');
  });

  it('detects dormant (seen 2+ months ago but not in last 30d)', () => {
    const out = aggregate([
      stmt('01', [['2026-01-05', 'OLDSUB', -1990, 'assinaturas_e_servicos']]),
      stmt('02', [['2026-02-05', 'OLDSUB', -1990, 'assinaturas_e_servicos']]),
      stmt('03', [['2026-03-15', 'NEWX', -100, 'assinaturas_e_servicos']]),
      stmt('04', [['2026-04-15', 'NEWX', -100, 'assinaturas_e_servicos']]),
    ]);
    const oldsub = out.recurring.find((r) => r.description === 'OLDSUB');
    expect(oldsub?.status).toBe('dormant');
  });

  it('computes top merchants (top 10 by spend)', () => {
    const out = aggregate([
      stmt('04', [
        ['2026-04-01', 'IFOOD', -5000, 'restaurante'],
        ['2026-04-02', 'IFOOD', -7000, 'restaurante'],
        ['2026-04-03', 'PAO DE ACUCAR', -20000, 'mercado'],
        ['2026-04-04', 'UBER VIAGEM', -1500, 'transporte'],
      ]),
    ]);
    expect(out.topMerchants[0]!.description).toBe('PAO DE ACUCAR');
    expect(out.topMerchants[1]!.description).toBe('IFOOD');
    expect(out.topMerchants[1]!.totalCents).toBe(12000);
  });

  it('computes per-category trends (first vs last month)', () => {
    const out = aggregate([
      stmt('02', [['2026-02-05', 'X', -10000, 'mercado']]),
      stmt('03', [['2026-03-05', 'X', -11000, 'mercado']]),
      stmt('04', [['2026-04-05', 'X', -15000, 'mercado']]),
    ]);
    const mercado = out.trends.find((t) => t.category === 'mercado')!;
    expect(mercado.direction).toBe('up');
    expect(mercado.changePct).toBeCloseTo(0.5, 1);
  });
});
