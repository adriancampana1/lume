import { z } from 'zod';
import { CategorySchema } from '@lume/shared';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const BankSchema = z.enum([
  'itau',
  'nubank',
  'inter',
  'bb',
  'bradesco',
  'santander',
  'caixa',
  'unknown',
]);
export type Bank = z.infer<typeof BankSchema>;

export const TransactionKindSchema = z.enum(['debit', 'credit']);
export type TransactionKind = z.infer<typeof TransactionKindSchema>;

export const TransactionSchema = z.object({
  date: z.string().regex(ISO_DATE, 'date must be ISO YYYY-MM-DD'),
  description: z.string().min(1).max(280),
  amountCents: z.number().int(),
  kind: TransactionKindSchema,
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const StatementSchema = z.object({
  bank: BankSchema,
  periodStart: z.string().regex(ISO_DATE),
  periodEnd: z.string().regex(ISO_DATE),
  openingBalanceCents: z.number().int(),
  closingBalanceCents: z.number().int(),
  declaredTotalDebitsCents: z.number().int().nonnegative(),
  declaredTotalCreditsCents: z.number().int().nonnegative(),
  transactions: z.array(TransactionSchema),
});
export type Statement = z.infer<typeof StatementSchema>;

export const CategorizedTransactionSchema = TransactionSchema.extend({
  category: CategorySchema,
});
export type CategorizedTransaction = z.infer<typeof CategorizedTransactionSchema>;

export const NormalizedStatementSchema = StatementSchema.extend({
  transactions: z.array(CategorizedTransactionSchema),
});
export type NormalizedStatement = z.infer<typeof NormalizedStatementSchema>;

export const RecurringSchema = z.object({
  description: z.string(),
  category: CategorySchema,
  averageAmountCents: z.number().int(),
  occurrencesPerMonth: z.number(),
  monthsSeen: z.number().int(),
  status: z.enum(['active', 'dormant', 'increasing']),
  lastSeenDate: z.string().regex(ISO_DATE),
});
export type Recurring = z.infer<typeof RecurringSchema>;

export const TrendSchema = z.object({
  category: CategorySchema,
  changePct: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
});
export type Trend = z.infer<typeof TrendSchema>;

export const TopMerchantSchema = z.object({
  description: z.string(),
  category: CategorySchema,
  totalCents: z.number().int(),
  occurrences: z.number().int(),
});
export type TopMerchant = z.infer<typeof TopMerchantSchema>;

export const BenchmarkSchema = z.object({
  incomeBracket: z.string(),
  reference: z.literal('POF/IBGE 2024'),
  byCategoryPct: z.record(CategorySchema, z.number()),
});
export type Benchmark = z.infer<typeof BenchmarkSchema>;

export const NarrativeSchema = z.object({
  summary: z.string().min(1),
  whereTheMoneyWent: z.string().min(1),
  trends: z.string().min(1),
  recurring: z.string().min(1),
  benchmark: z.string().min(1),
  recommendations: z.array(z.string().min(1)).min(1).max(5),
  nextSteps: z.string().min(1),
});
export type Narrative = z.infer<typeof NarrativeSchema>;

export const AggregationsSchema = z.object({
  periodStart: z.string().regex(ISO_DATE),
  periodEnd: z.string().regex(ISO_DATE),
  monthsCovered: z.number().int(),
  transactionsCount: z.number().int(),
  totalSpentCents: z.number().int(),
  totalReceivedCents: z.number().int(),
  categoryTotals: z.record(CategorySchema, z.number()),
  monthlyByCategory: z.array(z.object({ month: z.string(), byCategory: z.record(CategorySchema, z.number()) })),
  recurring: z.array(RecurringSchema),
  trends: z.array(TrendSchema),
  topMerchants: z.array(TopMerchantSchema),
});

export const ReportSchema = z.object({
  periodStart: z.string().regex(ISO_DATE),
  periodEnd: z.string().regex(ISO_DATE),
  transactionsCount: z.number().int().nonnegative(),
  totalSpentCents: z.number().int().nonnegative(),
  totalReceivedCents: z.number().int().nonnegative(),
  categories: z.record(CategorySchema, z.number().int().nonnegative()),
  recurring: z.array(RecurringSchema),
  trends: z.array(TrendSchema),
  topMerchants: z.array(TopMerchantSchema),
  benchmark: BenchmarkSchema.nullable(),
  narrative: NarrativeSchema,
});
export type Report = z.infer<typeof ReportSchema>;
