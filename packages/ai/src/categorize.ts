import { CategorySchema, type Category } from '@lume/shared';
import type { LlmClient } from './llm/client.js';
import type { CategorizedTransaction, Transaction } from './types.js';
import { CATEGORIZE_SYSTEM } from './prompts.js';

const BATCH_SIZE = 100;
const FALLBACK: Category = 'transferencias_e_outros';

export type CategorizeInput = {
  llm: LlmClient;
  transactions: Transaction[];
};

function parseCategory(raw: string): Category {
  const cleaned = raw.trim().toLowerCase();
  const result = CategorySchema.safeParse(cleaned);
  return result.success ? result.data : FALLBACK;
}

async function categorizeBatch(llm: LlmClient, batch: Transaction[]): Promise<Category[]> {
  const numbered = batch.map((t, i) => `${i + 1}. ${t.description}`).join('\n');

  const result = await llm.call({
    model: 'claude-haiku-4-5-20251001',
    system: CATEGORIZE_SYSTEM,
    maxTokens: 2000,
    temperature: 0,
    input: [{ kind: 'text', text: numbered }],
  });

  const lines = result.text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^\d+\.\s+/.test(l));

  if (lines.length !== batch.length) {
    throw new Error(
      `categorize: line count mismatch (got ${lines.length}, expected ${batch.length})`,
    );
  }

  return lines.map((line) => {
    const m = /^\d+\.\s+(.+)$/.exec(line);
    return m && m[1] ? parseCategory(m[1]) : FALLBACK;
  });
}

export async function categorize(input: CategorizeInput): Promise<CategorizedTransaction[]> {
  const out: CategorizedTransaction[] = [];
  for (let i = 0; i < input.transactions.length; i += BATCH_SIZE) {
    const batch = input.transactions.slice(i, i + BATCH_SIZE);
    const cats = await categorizeBatch(input.llm, batch);
    for (let j = 0; j < batch.length; j++) {
      out.push({ ...batch[j]!, category: cats[j]! });
    }
  }
  return out;
}
