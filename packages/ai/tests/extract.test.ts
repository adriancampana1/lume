import { describe, expect, it } from 'vitest';
import { extractStatementFromPdf } from '../src/extract.js';
import { buildMock } from './helpers/mock-llm.js';
import { EXTRACT_SYSTEM } from '../src/prompts.js';

describe('extractStatementFromPdf', () => {
  it('parses a valid JSON response from the LLM', async () => {
    const mock = buildMock().on(EXTRACT_SYSTEM, () =>
      JSON.stringify({
        bank: 'itau',
        periodStart: '2026-04-01',
        periodEnd: '2026-04-30',
        openingBalanceCents: 100000,
        closingBalanceCents: 80000,
        declaredTotalDebitsCents: 30000,
        declaredTotalCreditsCents: 10000,
        transactions: [
          { date: '2026-04-05', description: 'PIX RECEB', amountCents: 10000, kind: 'credit' },
          { date: '2026-04-12', description: 'NETFLIX', amountCents: -8990, kind: 'debit' },
          { date: '2026-04-20', description: 'PADARIA', amountCents: -21010, kind: 'debit' },
        ],
      }),
    );
    const stmt = await extractStatementFromPdf({
      llm: mock,
      pdf: Buffer.from('%PDF-1.7 fake'),
      filename: 'extrato.pdf',
    });
    expect(stmt.bank).toBe('itau');
    expect(stmt.transactions).toHaveLength(3);
  });

  it('throws on malformed JSON', async () => {
    const mock = buildMock().on(EXTRACT_SYSTEM, () => 'not json');
    await expect(
      extractStatementFromPdf({
        llm: mock,
        pdf: Buffer.from('%PDF'),
        filename: 'x.pdf',
      }),
    ).rejects.toThrow(/invalid JSON/i);
  });

  it('strips markdown code fences from the response', async () => {
    const mock = buildMock().on(EXTRACT_SYSTEM, () =>
      '```json\n' +
        JSON.stringify({
          bank: 'unknown',
          periodStart: '2026-04-01',
          periodEnd: '2026-04-30',
          openingBalanceCents: 0,
          closingBalanceCents: 0,
          declaredTotalDebitsCents: 0,
          declaredTotalCreditsCents: 0,
          transactions: [],
        }) +
        '\n```',
    );
    const stmt = await extractStatementFromPdf({
      llm: mock,
      pdf: Buffer.from('%PDF'),
      filename: 'x.pdf',
    });
    expect(stmt.transactions).toEqual([]);
  });

  it('rejects schema violations from LLM', async () => {
    const mock = buildMock().on(EXTRACT_SYSTEM, () =>
      JSON.stringify({ bank: 'unknown', transactions: 'oops' }),
    );
    await expect(
      extractStatementFromPdf({
        llm: mock,
        pdf: Buffer.from('%PDF'),
        filename: 'x.pdf',
      }),
    ).rejects.toThrow();
  });
});
