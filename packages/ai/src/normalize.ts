import type { Transaction } from './types.js';

function normalizeDescription(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toUpperCase();
}

export function normalize(transactions: Transaction[]): Transaction[] {
  const cleaned = transactions.map((t) => ({
    ...t,
    description: normalizeDescription(t.description),
  }));

  const seen = new Set<string>();
  const out: Transaction[] = [];
  for (const t of cleaned) {
    const key = `${t.date}|${t.description}|${t.amountCents}|${t.kind}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }

  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return out;
}
