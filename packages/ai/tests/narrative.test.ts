import { describe, expect, it } from 'vitest';
import { composeNarrative } from '../src/narrative.js';
import { buildMock } from './helpers/mock-llm.js';
import { NARRATIVE_SYSTEM } from '../src/prompts.js';
import type { Aggregations } from '../src/aggregate.js';

const aggs: Aggregations = {
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
};

const validNarrative = JSON.stringify({
  summary: 'Mês de abril com gastos de R$ 3.500.',
  whereTheMoneyWent: 'Moradia liderou com R$ 1.000.',
  trends: 'Sem tendências claras com 1 mês de dado.',
  recurring: 'Sem recorrências mapeadas.',
  benchmark: 'Faixa não informada.',
  recommendations: ['Revisar moradia', 'Acompanhar mercado', 'Avaliar serviços'],
  nextSteps: 'Voltar em 30 dias.',
});

describe('composeNarrative', () => {
  it('returns the narrative when LLM output validates', async () => {
    const mock = buildMock().on(NARRATIVE_SYSTEM, () => validNarrative);
    const out = await composeNarrative({ llm: mock, aggregations: aggs, benchmark: null });
    expect(out.summary).toContain('3.500');
  });

  it('retries once when first output has invalid numbers', async () => {
    let n = 0;
    const mock = buildMock().on(NARRATIVE_SYSTEM, () => {
      n++;
      return n === 1
        ? JSON.stringify({ ...JSON.parse(validNarrative), summary: 'Você gastou R$ 9.999.' })
        : validNarrative;
    });
    const out = await composeNarrative({ llm: mock, aggregations: aggs, benchmark: null });
    expect(out.summary).not.toContain('9.999');
    expect(mock.calls.length).toBe(2);
  });

  it('falls back to deterministic narrative when both attempts fail', async () => {
    const mock = buildMock().on(NARRATIVE_SYSTEM, () =>
      JSON.stringify({ ...JSON.parse(validNarrative), summary: 'R$ 9999 inventado' }),
    );
    const out = await composeNarrative({ llm: mock, aggregations: aggs, benchmark: null });
    expect(out.summary).toContain('R$');
    expect(mock.calls.length).toBe(2);
  });
});
