import type { Category, IncomeBracket } from '@lume/shared';
import type { Benchmark } from './types.js';
import data from './data/pof-ibge-2024.json' with { type: 'json' };

type Table = { reference: string; byBracket: Record<string, Record<Category, number>> };

const TABLE = data as Table;

export function lookupBenchmark(bracket: IncomeBracket): Benchmark | null {
  if (bracket === 'prefer_not_to_say') return null;
  const byCategoryPct = TABLE.byBracket[bracket];
  if (!byCategoryPct) return null;
  return {
    incomeBracket: bracket,
    reference: 'POF/IBGE 2024',
    byCategoryPct,
  };
}
