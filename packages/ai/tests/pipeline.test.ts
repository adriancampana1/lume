import { describe, expect, it } from 'vitest';
import { runPipeline } from '../src/pipeline.js';
import { buildMock } from './helpers/mock-llm.js';
import {
  EXTRACT_SYSTEM,
  CATEGORIZE_SYSTEM,
  NARRATIVE_SYSTEM,
} from '../src/prompts.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturesDir = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');

const fakePdf = Buffer.from('%PDF-1.7 fake');

const extractedItau = JSON.stringify({
  bank: 'itau',
  periodStart: '2026-04-01',
  periodEnd: '2026-04-30',
  openingBalanceCents: 500000,
  closingBalanceCents: 467020,
  declaredTotalDebitsCents: 32980,
  declaredTotalCreditsCents: 0,
  transactions: [
    { date: '2026-04-05', description: 'NETFLIX', amountCents: -8990, kind: 'debit' },
    { date: '2026-04-12', description: 'PAO DE ACUCAR', amountCents: -14550, kind: 'debit' },
    { date: '2026-04-22', description: 'UBER VIAGEM', amountCents: -9440, kind: 'debit' },
  ],
});

const categories = ['1. assinaturas_e_servicos', '2. mercado', '3. transporte'].join('\n');

const narrative = JSON.stringify({
  summary: 'Mês com 3 transações. Você gastou R$ 330 no total.',
  whereTheMoneyWent: 'Mercado liderou com R$ 146.',
  trends: 'Apenas 1 mês — sem tendência ainda.',
  recurring: 'Identifiquei NETFLIX como recorrente.',
  benchmark: 'Comparativo indisponível.',
  recommendations: ['Avaliar Netflix', 'Mais 5 meses pra tendência', 'Voltar em 30 dias'],
  nextSteps: 'Volte em 30 dias.',
});

describe('runPipeline', () => {
  it('runs end-to-end with mocked LLM', async () => {
    const mock = buildMock()
      .on(EXTRACT_SYSTEM, () => extractedItau)
      .on(CATEGORIZE_SYSTEM, () => categories)
      .on(NARRATIVE_SYSTEM, () => narrative);

    const report = await runPipeline({
      llm: mock,
      inputs: [{ buffer: fakePdf, filename: 'extrato.pdf' }],
      incomeBracket: 'from_3k_to_6k',
    });

    expect(report.transactionsCount).toBe(3);
    expect(report.categories.assinaturas_e_servicos).toBe(8990);
    expect(report.categories.mercado).toBe(14550);
    expect(report.benchmark?.incomeBracket).toBe('from_3k_to_6k');
    expect(report.narrative.recommendations.length).toBeGreaterThanOrEqual(1);
  });

  it('uses native OFX parser without calling LLM for OFX inputs', async () => {
    const ofxBuf = readFileSync(join(fixturesDir, 'sample.ofx'));
    const mock = buildMock()
      .on(CATEGORIZE_SYSTEM, () =>
        ['1. assinaturas_e_servicos', '2. transferencias_e_outros', '3. mercado'].join('\n'),
      )
      .on(NARRATIVE_SYSTEM, () =>
        JSON.stringify({
          summary: 'Período coberto.',
          whereTheMoneyWent: 'Mercado destacou.',
          trends: 'Sem tendência.',
          recurring: 'Sem recorrente.',
          benchmark: 'OK.',
          recommendations: ['A', 'B', 'C'],
          nextSteps: 'Voltar.',
        }),
      );

    const report = await runPipeline({
      llm: mock,
      inputs: [{ buffer: ofxBuf, filename: 'sample.ofx' }],
      incomeBracket: 'prefer_not_to_say',
    });

    expect(report.benchmark).toBeNull();
    const extractCalls = mock.calls.filter((c) => c.system === EXTRACT_SYSTEM);
    expect(extractCalls.length).toBe(0);
  });

  it('aborts when reconciliation detects sign violation', async () => {
    const broken = JSON.stringify({
      ...JSON.parse(extractedItau),
      transactions: [
        { date: '2026-04-05', description: 'BUG', amountCents: 1000, kind: 'debit' },
      ],
    });
    const mock = buildMock().on(EXTRACT_SYSTEM, () => broken);

    await expect(
      runPipeline({
        llm: mock,
        inputs: [{ buffer: fakePdf, filename: 'extrato.pdf' }],
        incomeBracket: 'prefer_not_to_say',
      }),
    ).rejects.toThrow(/debit transaction has positive amount/i);
  });
});
