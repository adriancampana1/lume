import { describe, expect, it } from 'vitest';
import { categorize } from '../src/categorize.js';
import { buildMock } from './helpers/mock-llm.js';
import { CATEGORIZE_SYSTEM } from '../src/prompts.js';

describe('categorize', () => {
  it('returns categorized transactions in same order', async () => {
    const mock = buildMock().on(CATEGORIZE_SYSTEM, () =>
      ['1. assinaturas_e_servicos', '2. mercado', '3. transporte'].join('\n'),
    );
    const out = await categorize({
      llm: mock,
      transactions: [
        { date: '2026-04-05', description: 'NETFLIX', amountCents: -8990, kind: 'debit' },
        { date: '2026-04-10', description: 'PAO DE ACUCAR', amountCents: -14550, kind: 'debit' },
        { date: '2026-04-12', description: 'UBER VIAGEM', amountCents: -2500, kind: 'debit' },
      ],
    });
    expect(out.map((t) => t.category)).toEqual([
      'assinaturas_e_servicos',
      'mercado',
      'transporte',
    ]);
  });

  it('falls back to transferencias_e_outros for invalid LLM categories', async () => {
    const mock = buildMock().on(CATEGORIZE_SYSTEM, () => '1. unicornio');
    const out = await categorize({
      llm: mock,
      transactions: [
        { date: '2026-04-05', description: 'X', amountCents: -100, kind: 'debit' },
      ],
    });
    expect(out[0]!.category).toBe('transferencias_e_outros');
  });

  it('throws when LLM returns wrong number of lines', async () => {
    const mock = buildMock().on(CATEGORIZE_SYSTEM, () => '1. mercado');
    await expect(
      categorize({
        llm: mock,
        transactions: [
          { date: '2026-04-05', description: 'A', amountCents: -100, kind: 'debit' },
          { date: '2026-04-06', description: 'B', amountCents: -200, kind: 'debit' },
        ],
      }),
    ).rejects.toThrow(/line count/i);
  });

  it('batches transactions when more than 100', async () => {
    const txs = Array.from({ length: 150 }, (_, i) => ({
      date: '2026-04-05',
      description: `TX ${i}`,
      amountCents: -100,
      kind: 'debit' as const,
    }));
    const mock = buildMock().on(CATEGORIZE_SYSTEM, (opts) => {
      const userText = opts.input.find((p) => p.kind === 'text')!;
      const numLines = (userText.kind === 'text' ? userText.text : '')
        .split('\n')
        .filter((l) => /^\d+\./.test(l)).length;
      return Array.from({ length: numLines }, (_, i) => `${i + 1}. mercado`).join('\n');
    });
    const out = await categorize({ llm: mock, transactions: txs });
    expect(out).toHaveLength(150);
    expect(mock.calls.length).toBe(2);
  });
});
