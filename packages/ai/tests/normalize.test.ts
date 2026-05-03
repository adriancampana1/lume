import { describe, expect, it } from 'vitest';
import { normalize } from '../src/normalize.js';
import type { Transaction } from '../src/types.js';

describe('normalize', () => {
  const tx = (date: string, description: string, amountCents: number): Transaction => ({
    date,
    description,
    amountCents,
    kind: amountCents < 0 ? 'debit' : 'credit',
  });

  it('sorts transactions ascending by date', () => {
    const out = normalize([
      tx('2026-04-20', 'B', -100),
      tx('2026-04-05', 'A', -200),
      tx('2026-04-10', 'C', -300),
    ]);
    expect(out.map((t) => t.date)).toEqual(['2026-04-05', '2026-04-10', '2026-04-20']);
  });

  it('trims whitespace and uppercases description', () => {
    const out = normalize([tx('2026-04-05', '  netflix  ', -8990)]);
    expect(out[0]!.description).toBe('NETFLIX');
  });

  it('deduplicates exact same-day duplicates', () => {
    const out = normalize([
      tx('2026-04-05', 'NETFLIX', -8990),
      tx('2026-04-05', 'NETFLIX', -8990),
    ]);
    expect(out).toHaveLength(1);
  });

  it('does NOT deduplicate when amount differs', () => {
    const out = normalize([
      tx('2026-04-05', 'UBER', -1500),
      tx('2026-04-05', 'UBER', -2000),
    ]);
    expect(out).toHaveLength(2);
  });

  it('does NOT deduplicate when description differs', () => {
    const out = normalize([
      tx('2026-04-05', 'UBER VIAGEM A', -1500),
      tx('2026-04-05', 'UBER VIAGEM B', -1500),
    ]);
    expect(out).toHaveLength(2);
  });
});
