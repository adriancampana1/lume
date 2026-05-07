import { describe, expect, it } from 'vitest';
import { validateNarrative, buildAllowedNumbers } from '../src/validate-narrative.js';
import type { Aggregations } from '../src/aggregate.js';

const baseAggs: Aggregations = {
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  monthsCovered: 1,
  transactionsCount: 42,
  totalSpentCents: 350000,
  totalReceivedCents: 500000,
  categoryTotals: {
    moradia: 100000,
    mercado: 80000,
    restaurante: 0,
    transporte: 50000,
    saude: 0,
    educacao: 0,
    lazer_e_hobby: 0,
    compras: 0,
    assinaturas_e_servicos: 30000,
    transferencias_e_outros: 90000,
  },
  monthlyByCategory: [],
  recurring: [],
  trends: [],
  topMerchants: [],
  incomeSources: [],
  categoryDetails: {
    moradia: [],
    mercado: [],
    restaurante: [],
    transporte: [],
    saude: [],
    educacao: [],
    lazer_e_hobby: [],
    compras: [],
    assinaturas_e_servicos: [],
    transferencias_e_outros: [],
  },
};

describe('buildAllowedNumbers', () => {
  it('includes totals, category totals and integer percentages', () => {
    const allowed = buildAllowedNumbers(baseAggs);
    expect(allowed.has('3500')).toBe(true);
    expect(allowed.has('1000')).toBe(true);
    expect(allowed.has('42')).toBe(true);
    expect(allowed.has('100')).toBe(true);
  });
});

describe('validateNarrative', () => {
  it('passes when narrative only uses allowed numbers', () => {
    const result = validateNarrative({
      narrative: 'Você gastou R$ 3.500 no mês. Mercado liderou com R$ 800.',
      aggregations: baseAggs,
    });
    expect(result.ok).toBe(true);
  });

  it('fails when narrative cites a number not in allowed set', () => {
    const result = validateNarrative({
      narrative: 'Você gastou R$ 9.999 no mês.',
      aggregations: baseAggs,
    });
    expect(result.ok).toBe(false);
    expect(result.violations).toContain('9999');
  });

  it('ignores 4-digit year numbers', () => {
    const result = validateNarrative({
      narrative: 'Em abril de 2026, você gastou R$ 3.500.',
      aggregations: baseAggs,
    });
    expect(result.ok).toBe(true);
  });

  it('accepts integer percentages from 0 to 100', () => {
    const result = validateNarrative({
      narrative: 'Mercado representou 23% dos gastos.',
      aggregations: baseAggs,
    });
    expect(result.ok).toBe(true);
  });
});
