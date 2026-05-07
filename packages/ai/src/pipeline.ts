import type { IncomeBracket } from '@lume/shared';
import type { LlmClient } from './llm/client.js';
import type { Report, Statement, NormalizedStatement } from './types.js';
import { ReportSchema } from './types.js';
import { detectInputKind } from './route.js';
import { parseOfx } from './ofx-parser.js';
import { extractStatementFromPdf } from './extract.js';
import { reconcile, type ReconciliationWarning } from './reconcile.js';
import { normalize } from './normalize.js';
import { categorize } from './categorize.js';
import { aggregate } from './aggregate.js';
import { lookupBenchmark } from './benchmark.js';
import { composeNarrative } from './narrative.js';
import { anonymize } from './anonymize.js';

export type PipelineInput = { buffer: Buffer; filename: string };

export type PipelineOptions = {
  llm: LlmClient;
  inputs: PipelineInput[];
  incomeBracket: IncomeBracket;
  onStage?: (stage: PipelineStage) => void;
};

export type PipelineStage =
  | 'extracting'
  | 'anonymizing'
  | 'reconciling'
  | 'categorizing'
  | 'aggregating'
  | 'narrating';

async function ingestOne(
  llm: LlmClient,
  input: PipelineInput,
  onStage: (s: PipelineStage) => void,
): Promise<Statement> {
  const kind = detectInputKind(input.buffer, input.filename);
  if (kind === 'ofx') {
    onStage('anonymizing');
    const anonText = anonymize(input.buffer.toString('utf8'));
    return parseOfx(Buffer.from(anonText, 'utf8'));
  }
  onStage('extracting');
  const statement = await extractStatementFromPdf({ llm, pdf: input.buffer, filename: input.filename });
  onStage('anonymizing');
  return statement;
}

export async function runPipeline(opts: PipelineOptions): Promise<Report> {
  const stage = opts.onStage ?? (() => {});
  const statements: Statement[] = [];
  for (const input of opts.inputs) {
    statements.push(await ingestOne(opts.llm, input, stage));
  }

  stage('reconciling');
  const warnings: ReconciliationWarning[] = [];
  for (const s of statements) warnings.push(...reconcile(s));
  if (warnings.length > 0) {
    console.warn('[pipeline] reconciliation warnings (auto-healed)', { warnings });
  }

  stage('categorizing');
  const normalizedStatements: NormalizedStatement[] = [];
  for (const s of statements) {
    const normalizedTxs = normalize(s.transactions);
    const categorized = await categorize({ llm: opts.llm, transactions: normalizedTxs });
    normalizedStatements.push({ ...s, transactions: categorized });
  }

  stage('aggregating');
  const aggs = aggregate(normalizedStatements);
  const benchmark = lookupBenchmark(opts.incomeBracket);

  stage('narrating');
  const narrative = await composeNarrative({
    llm: opts.llm,
    aggregations: aggs,
    benchmark,
  });

  return ReportSchema.parse({
    periodStart: aggs.periodStart,
    periodEnd: aggs.periodEnd,
    transactionsCount: aggs.transactionsCount,
    totalSpentCents: aggs.totalSpentCents,
    totalReceivedCents: aggs.totalReceivedCents,
    categories: aggs.categoryTotals,
    recurring: aggs.recurring,
    trends: aggs.trends,
    topMerchants: aggs.topMerchants,
    incomeSources: aggs.incomeSources,
    categoryDetails: aggs.categoryDetails,
    benchmark,
    narrative,
  });
}
