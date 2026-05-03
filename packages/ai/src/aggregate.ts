import type { Category } from '@lume/shared';
import type {
  NormalizedStatement,
  Recurring,
  Trend,
  TopMerchant,
  CategorizedTransaction,
} from './types.js';

export type Aggregations = {
  periodStart: string;
  periodEnd: string;
  monthsCovered: number;
  transactionsCount: number;
  totalSpentCents: number;
  totalReceivedCents: number;
  categoryTotals: Record<Category, number>;
  monthlyByCategory: Array<{ month: string; byCategory: Record<Category, number> }>;
  recurring: Recurring[];
  trends: Trend[];
  topMerchants: TopMerchant[];
};

const ALL_CATS: Category[] = [
  'moradia',
  'mercado',
  'restaurante',
  'transporte',
  'saude',
  'educacao',
  'lazer_e_hobby',
  'compras',
  'assinaturas_e_servicos',
  'transferencias_e_outros',
];

function emptyCatRecord(): Record<Category, number> {
  return Object.fromEntries(ALL_CATS.map((c) => [c, 0])) as Record<Category, number>;
}

function monthOf(iso: string): string {
  return iso.slice(0, 7);
}

export function aggregate(statements: NormalizedStatement[]): Aggregations {
  const allTx: CategorizedTransaction[] = statements.flatMap((s) => s.transactions);
  const byMonth = new Map<string, CategorizedTransaction[]>();
  for (const t of allTx) {
    const k = monthOf(t.date);
    if (!byMonth.has(k)) byMonth.set(k, []);
    byMonth.get(k)!.push(t);
  }
  const months = [...byMonth.keys()].sort();

  const categoryTotals = emptyCatRecord();
  let totalSpentCents = 0;
  let totalReceivedCents = 0;
  for (const t of allTx) {
    if (t.kind === 'debit') {
      totalSpentCents += Math.abs(t.amountCents);
      categoryTotals[t.category] += Math.abs(t.amountCents);
    } else {
      totalReceivedCents += t.amountCents;
    }
  }

  const monthlyByCategory = months.map((month) => {
    const rec = emptyCatRecord();
    for (const t of byMonth.get(month)!) {
      if (t.kind === 'debit') rec[t.category] += Math.abs(t.amountCents);
    }
    return { month, byCategory: rec };
  });

  const byDesc = new Map<string, CategorizedTransaction[]>();
  for (const t of allTx) {
    if (t.kind !== 'debit') continue;
    const k = t.description;
    if (!byDesc.has(k)) byDesc.set(k, []);
    byDesc.get(k)!.push(t);
  }

  const today = statements
    .map((s) => s.periodEnd)
    .sort()
    .slice(-1)[0]!;

  const recurring: Recurring[] = [];
  for (const [desc, txs] of byDesc) {
    const monthsSeenSet = new Set(txs.map((t) => monthOf(t.date)));
    if (monthsSeenSet.size < 2) continue;
    const sortedByDate = [...txs].sort((a, b) => (a.date < b.date ? -1 : 1));
    const first = sortedByDate[0]!;
    const last = sortedByDate[sortedByDate.length - 1]!;
    const avg = txs.reduce((acc, t) => acc + Math.abs(t.amountCents), 0) / txs.length;

    const firstAvg = Math.abs(first.amountCents);
    const lastAvg = Math.abs(last.amountCents);
    const growth = (lastAvg - firstAvg) / firstAvg;

    const lastSeen = last.date;
    const dayMs = 24 * 60 * 60 * 1000;
    const ageDays = (new Date(today).getTime() - new Date(lastSeen).getTime()) / dayMs;

    let status: Recurring['status'] = 'active';
    if (ageDays > 30) status = 'dormant';
    else if (growth >= 0.15) status = 'increasing';

    recurring.push({
      description: desc,
      category: first.category,
      averageAmountCents: Math.round(avg),
      occurrencesPerMonth: txs.length / monthsSeenSet.size,
      monthsSeen: monthsSeenSet.size,
      status,
      lastSeenDate: lastSeen,
    });
  }

  const trends: Trend[] = [];
  if (months.length >= 2) {
    const firstM = monthlyByCategory[0]!;
    const lastM = monthlyByCategory[monthlyByCategory.length - 1]!;
    for (const cat of ALL_CATS) {
      const a = firstM.byCategory[cat];
      const b = lastM.byCategory[cat];
      if (a === 0 && b === 0) continue;
      const changePct = a === 0 ? 1 : (b - a) / a;
      const direction: Trend['direction'] =
        changePct > 0.1 ? 'up' : changePct < -0.1 ? 'down' : 'flat';
      trends.push({ category: cat, changePct, direction });
    }
  }

  const merchTotals = new Map<string, { totalCents: number; count: number; cat: Category }>();
  for (const t of allTx) {
    if (t.kind !== 'debit') continue;
    const cur = merchTotals.get(t.description) ?? {
      totalCents: 0,
      count: 0,
      cat: t.category,
    };
    cur.totalCents += Math.abs(t.amountCents);
    cur.count += 1;
    merchTotals.set(t.description, cur);
  }
  const topMerchants: TopMerchant[] = [...merchTotals.entries()]
    .map(([description, v]) => ({
      description,
      totalCents: v.totalCents,
      occurrences: v.count,
      category: v.cat,
    }))
    .sort((a, b) => b.totalCents - a.totalCents)
    .slice(0, 10);

  return {
    periodStart: statements.map((s) => s.periodStart).sort()[0]!,
    periodEnd: today,
    monthsCovered: months.length,
    transactionsCount: allTx.length,
    totalSpentCents,
    totalReceivedCents,
    categoryTotals,
    monthlyByCategory,
    recurring,
    trends,
    topMerchants,
  };
}
