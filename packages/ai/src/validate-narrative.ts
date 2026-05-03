import type { Aggregations } from './aggregate.js';

export type ValidateInput = {
  narrative: string;
  aggregations: Aggregations;
};

export type ValidateResult = { ok: true } | { ok: false; violations: string[] };

function centsToRealsRounded(cents: number): string[] {
  const reais = Math.round(cents / 100);
  return [String(reais), String(cents)];
}

export function buildAllowedNumbers(aggs: Aggregations): Set<string> {
  const set = new Set<string>();

  for (const v of centsToRealsRounded(aggs.totalSpentCents)) set.add(v);
  for (const v of centsToRealsRounded(aggs.totalReceivedCents)) set.add(v);
  set.add(String(aggs.transactionsCount));
  set.add(String(aggs.monthsCovered));

  for (const total of Object.values(aggs.categoryTotals)) {
    for (const v of centsToRealsRounded(total as number)) set.add(v);
  }

  for (const m of aggs.monthlyByCategory) {
    for (const total of Object.values(m.byCategory)) {
      for (const v of centsToRealsRounded(total as number)) set.add(v);
    }
  }

  for (const r of aggs.recurring) {
    for (const v of centsToRealsRounded(r.averageAmountCents)) set.add(v);
    set.add(String(r.monthsSeen));
  }

  for (const t of aggs.topMerchants) {
    for (const v of centsToRealsRounded(t.totalCents)) set.add(v);
    set.add(String(t.occurrences));
  }

  for (let i = 0; i <= 100; i++) set.add(String(i));

  return set;
}

const NUMBER_RE = /\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\b|\b\d{4,}\b/g;
const YEAR_RE = /^(?:19|20)\d{2}$/;

function normalizeNumberToken(raw: string): string {
  const cleaned = raw.replace(/[.,]/g, '');
  if (/[.,]\d{2}$/.test(raw)) {
    const asNum = Number(cleaned);
    return String(Math.round(asNum / 100));
  }
  return String(Number(cleaned));
}

export function validateNarrative(input: ValidateInput): ValidateResult {
  const allowed = buildAllowedNumbers(input.aggregations);
  const violations: string[] = [];

  const matches = input.narrative.match(NUMBER_RE) ?? [];
  for (const raw of matches) {
    if (YEAR_RE.test(raw)) continue;
    const token = normalizeNumberToken(raw);
    if (!allowed.has(token)) violations.push(token);
  }

  if (violations.length === 0) return { ok: true };
  return { ok: false, violations };
}
