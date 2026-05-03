import { describe, expect, it } from 'vitest';
import { lookupBenchmark } from '../src/benchmark.js';

describe('lookupBenchmark', () => {
  it('returns null for prefer_not_to_say', () => {
    expect(lookupBenchmark('prefer_not_to_say')).toBeNull();
  });

  it('returns the percentage record for from_3k_to_6k', () => {
    const b = lookupBenchmark('from_3k_to_6k');
    expect(b?.byCategoryPct.moradia).toBeCloseTo(0.30);
    expect(b?.reference).toBe('POF/IBGE 2024');
  });

  it('returns the percentage record for above_25k', () => {
    const b = lookupBenchmark('above_25k');
    expect(b?.byCategoryPct.educacao).toBeCloseTo(0.13);
  });
});
