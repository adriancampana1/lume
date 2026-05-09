import { StatementSchema, type Statement } from './types.js';
import type { LlmClient } from './llm/client.js';
import { EXTRACT_SYSTEM, EXTRACT_USER } from './prompts.js';

export type ExtractInput = {
  llm: LlmClient;
  pdf: Buffer;
  filename: string;
  economyMode?: boolean;
};

function stripFences(s: string): string {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

export async function extractStatementFromPdf(input: ExtractInput): Promise<Statement> {
  const economy = input.economyMode ?? false;
  const result = await input.llm.call({
    model: economy ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
    system: EXTRACT_SYSTEM,
    maxTokens: economy ? 4000 : 8000,
    temperature: 0,
    input: [
      { kind: 'pdf', data: input.pdf, filename: input.filename },
      { kind: 'text', text: EXTRACT_USER },
    ],
  });

  const cleaned = stripFences(result.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`extract: invalid JSON from LLM: ${(err as Error).message}`);
  }
  return StatementSchema.parse(parsed);
}
